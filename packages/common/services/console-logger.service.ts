//@see https://github.com/ucsjs/ucsjs/blob/main/packages/common/services/console-logger.service.ts

import { ILoggerService } from "../interfaces";
import { Singleton } from "../abstracts";
import { LogLevel } from "./logger.service";
import { clc, isLogLevelEnabled, isPlainObject, isString, yellow } from '../utils';

export interface ConsoleLoggerOptions {
    logLevels?: LogLevel[];
    timestamp?: boolean;
}

const DEFAULT_LOG_LEVELS: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
];

export class ConsoleLogger extends Singleton implements ILoggerService {
    protected context?: string;
    protected options: ConsoleLoggerOptions = { logLevels: DEFAULT_LOG_LEVELS };
    private static lastTimestampAt?: number;
    private originalContext?: string;

    constructor();
    constructor(context: string);
    constructor(context: string, options: ConsoleLoggerOptions);
    constructor(context?: string, options: ConsoleLoggerOptions = {}) {
        super();

        if (!options.logLevels) 
            options.logLevels = DEFAULT_LOG_LEVELS;
        
        if (context) 
            this.originalContext = context;        
    }

    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: [...any, string?]): void;
    log(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('log')) 
            return;
        
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        
        this.printMessages(messages, context, 'log');
    }

    error(message: any, stack?: string, context?: string): void;
    error(message: any, ...optionalParams: [...any, string?, string?]): void;
    error(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('error')) 
            return;
        
        const { messages, context, stack } =
        this.getContextAndStackAndMessagesToPrint([message, ...optionalParams]);

        this.printMessages(messages, context, 'error', 'stderr');
        this.printStackTrace(stack);
    }

    warn(message: any, context?: string): void;
    warn(message: any, ...optionalParams: [...any, string?]): void;
    warn(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('warn')) 
            return;
        
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        
        this.printMessages(messages, context, 'warn');
    }

    debug(message: any, context?: string): void;
    debug(message: any, ...optionalParams: [...any, string?]): void;
    debug(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('debug')) 
            return;
        
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);

        this.printMessages(messages, context, 'debug');
    }

    verbose(message: any, context?: string): void;
    verbose(message: any, ...optionalParams: [...any, string?]): void;
    verbose(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('verbose')) 
            return;
        
        const { messages, context } = this.getContextAndMessagesToPrint([
        message,
        ...optionalParams,
        ]);

        this.printMessages(messages, context, 'verbose');
    }

    setLogLevels(levels: LogLevel[]) {
        if (!this.options) 
          this.options = {};
        
        this.options.logLevels = levels;
    }

    isLevelEnabled(level: LogLevel): boolean {
        const logLevels = this.options?.logLevels;
        return isLogLevelEnabled(level, logLevels);
    }

    private getContextAndMessagesToPrint(args: unknown[]) {
        if (args?.length <= 1) 
          return { messages: args, context: this.context };
        
        const lastElement = args[args.length - 1];
        const isContext = isString(lastElement);

        if (!isContext) 
          return { messages: args, context: this.context };
        
        return {
          context: lastElement as string,
          messages: args.slice(0, args.length - 1),
        };
    }

    protected printMessages(
        messages: unknown[],
        context = '',
        logLevel: LogLevel = 'log',
        writeStreamType?: 'stdout' | 'stderr',
      ) {
        messages.forEach(message => {
            const pidMessage = this.formatPid(process.pid);
            const contextMessage = context ? yellow(`[${context}] `) : '';
            const timestampDiff = this.updateAndGetTimestampDiff();
            const formattedLogLevel = logLevel.toUpperCase().padStart(7, ' ');
            const formatedMessage = this.formatMessage(
            logLevel,
            message,
            pidMessage,
            formattedLogLevel,
            contextMessage,
            timestampDiff,
            );

            process[writeStreamType ?? 'stdout'].write(formatedMessage);
        });
    }

    private updateAndGetTimestampDiff(): string {
        const includeTimestamp = ConsoleLogger.lastTimestampAt && this.options?.timestamp;

        const result = includeTimestamp
          ? yellow(` +${Date.now() - ConsoleLogger.lastTimestampAt}ms`)
          : '';

        ConsoleLogger.lastTimestampAt = Date.now();

        return result;
    }

    protected formatPid(pid: number) {
        return `[UCS] ${pid}  - `;
    }

    private getContextAndStackAndMessagesToPrint(args: unknown[]) {
        const { messages, context } = this.getContextAndMessagesToPrint(args);

        if (messages?.length <= 1) 
          return { messages, context };
        
        const lastElement = messages[messages.length - 1];
        const isStack = isString(lastElement);

        if (!isStack) 
          return { messages, context };
        
        return {
          stack: lastElement as string,
          messages: messages.slice(0, messages.length - 1),
          context,
        };
    }

    private getColorByLogLevel(level: LogLevel) {
        switch (level) {
          case 'debug': return clc.magentaBright;
          case 'warn': return clc.yellow;
          case 'error': return clc.red;
          case 'verbose': return clc.cyanBright;
          default: return clc.green;
        }
    }

    protected formatMessage(
        logLevel: LogLevel,
        message: unknown,
        pidMessage: string,
        formattedLogLevel: string,
        contextMessage: string,
        timestampDiff: string,
    ) {
        const output = this.stringifyMessage(message, logLevel);
        pidMessage = this.colorize(pidMessage, logLevel);
        formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
        return `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
    }

    protected stringifyMessage(message: unknown, logLevel: LogLevel) {
        return isPlainObject(message)
            ? `${this.colorize('Object:', logLevel)}\n${JSON.stringify(
                message,
                (key, value) =>
                typeof value === 'bigint' ? value.toString() : value,
                2,
            )}\n`
            : this.colorize(message as string, logLevel);
    }

    protected colorize(message: string, logLevel: LogLevel) {
        const color = this.getColorByLogLevel(logLevel);
        return color(message);
    }

    protected getTimestamp(): string {
        const localeStringOptions = {
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          day: '2-digit',
          month: '2-digit',
        };

        return new Date(Date.now()).toLocaleString(
            undefined,
            localeStringOptions as Intl.DateTimeFormatOptions,
        );
    }

    protected printStackTrace(stack: string) {
        if (!stack) 
          return;
        
        process.stderr.write(`${stack}\n`);
    }
}