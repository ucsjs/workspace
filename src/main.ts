import * as compression from 'compression';
import * as express from "express";
import * as cookieParser from 'cookie-parser';
import * as csurf from 'express-csrf-double-submit-cookie';
import * as path from "path";
import * as fg from "fast-glob";

import { NestFactory, LazyModuleLoader, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/modules/app.module';

import { WsAdapter } from "src/adapters/ws-adapter";
import { Terminal } from "src/adapters/terminal";
import { VSCodeLS } from "src/adapters/vscode";

require('dotenv').config();

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  	//app.useGlobalFilters(new AllExceptionsFilter());

	app.use(express.static(path.resolve(__dirname, '../dist/workspace/pages')));

	const lazyModuleLoader = app.get(LazyModuleLoader);
	
	const files = await fg([
		"./src/workspace/**/*.blueprint.ts",
		"./src/workspace/**/*.page.ts"
	], { dot: true, onlyFiles: true });

	for(let file of files){
		try{
			const filename = "." + path.resolve(file.replace(".ts", "")
				.replace("./", "")
				.replace("src/", ""))
				.replace(process.cwd(), "");

			const { LazyModule } = await import(filename);
			await lazyModuleLoader.load(() => LazyModule);
		}
		catch(err){
			//console.log(err);
		}
	}

	app.use(compression());
	app.useStaticAssets(path.join(__dirname, '..', 'public'));
	app.setBaseViewsDir('views');
	app.setViewEngine('ejs');

	app.useWebSocketAdapter(new WsAdapter(app));
	app.enableCors();
	app.use(express.static("node_modules"));
	app.use(express.static("public"));	
	app.use(cookieParser());
	app.use(csurf());
	app.use(express.json({ limit: '50mb' }));
  	app.use(express.urlencoded({ extended: true, limit: '50mb' }));

	await app.listen(process.env.PORT || 5001);

	//Terminal
	if(process.env.ALLOW_TERMINAL !== "false"){
		new Terminal({
			shell: (process.platform === "win32") ? "cmd.exe" : "bash",
			port: parseInt(process.env.PORT) + 1 || 5002
		});
	}
	
	/*new VSCodeLS({
		port: parseInt(process.env.PORT) + 2 || 5003
	});*/
}

bootstrap();
