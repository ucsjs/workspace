//@see https://github.com/nestjs/nest/blob/master/packages/core/application-config.ts

import {
    PipeTransform,
    VersioningOptions,
    WebSocketAdapter,
} from './index';

import { ExcludeRouteMetadata, GlobalPrefixOptions } from './interfaces';
  
export class ApplicationConfig {
    private globalPrefix = '';
    private globalPrefixOptions: GlobalPrefixOptions<ExcludeRouteMetadata> = {};
    private globalPipes: Array<PipeTransform> = [];
    private versioningOptions: VersioningOptions;
  
    constructor(private ioAdapter: WebSocketAdapter | null = null) {}
  
    public setGlobalPrefix(prefix: string) {
        this.globalPrefix = prefix;
    }
  
    public getGlobalPrefix() {
        return this.globalPrefix;
    }
  
    public setGlobalPrefixOptions(
        options: GlobalPrefixOptions<ExcludeRouteMetadata>,
    ) {
        this.globalPrefixOptions = options;
    }
  
    public getGlobalPrefixOptions(): GlobalPrefixOptions<ExcludeRouteMetadata> {
        return this.globalPrefixOptions;
    }
  
    public setIoAdapter(ioAdapter: WebSocketAdapter) {
        this.ioAdapter = ioAdapter;
    }
  
    public getIoAdapter(): WebSocketAdapter {
        return this.ioAdapter;
    }
  
    public addGlobalPipe(pipe: PipeTransform<any>) {
        this.globalPipes.push(pipe);
    }
  
    public useGlobalPipes(...pipes: PipeTransform<any>[]) {
        this.globalPipes = this.globalPipes.concat(pipes);
    }
    
    public getGlobalPipes(): PipeTransform<any>[] {
        return this.globalPipes;
    }
       
    public enableVersioning(options: VersioningOptions): void {
      if (Array.isArray(options.defaultVersion)) 
        options.defaultVersion = Array.from(new Set(options.defaultVersion));
        
      this.versioningOptions = options;
    }
  
    public getVersioning(): VersioningOptions | undefined {
        return this.versioningOptions;
    }
}