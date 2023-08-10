# First steps

In these articles you will be introduced to the fundamental concepts of UCS.js and its functioning understand that this tool is not a framework for casual use and many codes will seem confusing in comparison to others, however the way it was built was not to work at the level of code is visually through the editor, therefore what was once simple and trivial, through the UCS requires a series of compensations for the full functioning of the blueprints, and as the editor automatically generates controllers, managers and flow from metadata files , creating a code from scratch for the UCS plugin will not be a simple task as it would be to implement directly, but think that the application was not developed for programmers, but to provide a way for users without technical knowledge to create applications, websites, apps and system of fully visual and assisted by artificial intelligence.

At the end of reading this documentation, it will be possible to understand the entire workflow of the blueprints, how to create new blueprints, interconnect transformers, controllers, with pre-existing blueprints, and even contribute to the project's public repositories, or create complete applications that can be sold on the marketplace or distributed free of charge to the community.

## Language

The entire project was built using Typescript(https://www.typescriptlang.org/), using Node.js (https://nodejs.org/) as a platform so it is possible to create components and blueprints using Typescript and Javascript, the application editor was built using Vue 3 (https://vuejs.org/) and Typescript to maintain the maximum possible standardization between the parts of the application, Many concepts and part of the application's core code come from the Nestjs (https://nestjs.com/) framework, but not all packages were implemented, not even the implementation of the server and controller management, since the base principle of Nestjs has differences in applicability while Nestjs is a Typescript framework for developers who use SOLID, Angular and React concepts in order to provide a robust framework for scalability, testing and maintainability solutions, UCS.js is premised on implementing blueprint solutions used in game engines such as Unreal Engine to simplify development to non-technical users.

## Prerequisites

To run UCS.js it will be necessary to have `Node.js (version >= 16.14)` installed in your operating system.

## Setup

Currently UCS.js does not have any CI system, so to install the project you will need to download directly from the public repository on github.

```bash
$ git clone https://github.com/ucsjs/workspace
$ cd workspace
$ yarn || npm install
$ yarn dev || npm run dev
```

in the future, all packages of the complete project will be made available as modules in NPM that can be used separately, but at the moment, to gain access, it will be necessary to download all the complete repository.

## Structure

By default, the project uses the Express (https://expressjs.com) web server to control HTTP routes coupled to a Websocket (https://www.npmjs.com/package/ws), which can be coupled to terminal adapters using Node-Pty (https://www.npmjs.com/package/node-pty) and Visual Code Language Server (https://learn.microsoft.com/en-us/visualstudio/extensibility/language-server-protocol?view=vs-2022) for integration with Monaco (https://microsoft.github.io/monaco-editor/), all adapters are optional and configurable , the project brings controllers for managing blueprints through the editor, documentation, LLM integrations, file management, and data tokenization.

Every application flow starts in the `src/index.ts` file which is responsible for starting the HTTP server and its adapters.

```typescript
import { Application, WsAdapter } from "@ucsjs/common";
import { CacheModule, GlobalModules, GlobalRegistry } from "@ucsjs/core";
import { GlobalProto } from "@ucsjs/protobuf";
import { GlobalUIComponents } from "@ucsjs/uibuilder";
import { EditorModule } from "@ucsjs/editor";
import { WSInterceptor } from "./interceptors/ws.interceptor";

(async () => {
    await Promise.all([
        GlobalRegistry.load(),
        GlobalProto.load(),
        GlobalUIComponents.load()
    ]);

    GlobalModules.register(CacheModule, {
        //store: ioRedisStore,
        settings: {
            ttl: 60
        }
    });

    const app = await Application.create(async () => {
        return await GlobalModules.dynamicModule({
            controllers: ["./**/*.controller.ts"],
            imports: [EditorModule]
        });
    });

    app.useWebSocketAdapter(new WsAdapter(app), WSInterceptor.intercept);
    app.listen(process.env.PORT || 3050);
})();
```

It is possible to perform configurations through the .env file without having to change the application source code, even in the future we will provide other HTTP server modules.

GlobalRegistry performs the loading of blueprint classes for dynamic instantiation in a static way, being accessible in any part of the code, it also has functions for creating a flow with multiple Blueprints and interconnections between them, transformer configurations and plugins.

The default directories that come with the project are the following:
```
.
└── src/
    ├── blueprints/
    ├── controllers/
    ├── interfaces/
    ├── modules/
    ├── services/
    └── index.ts
```

I believe it is self-explanatory, but it is always good to reinforce, the blueprints directory is stored in `.blueprint.ts` files that contain blueprints created in visual mode and downloaded from the marketplace and can be organized by subdirectories, this directory is automatically loaded by `GlobalRegistry` when loading the application and can be dynamically updated by the editor.

The controllers directory stores files with the `.controller.ts` extension and has route controllers for HTTP requests. For more information about controllers, access the menu on the side. Dto and interfaces stores files that contain data definitions either for creating subclasses or moving customized data as in the case of POST and PUT requests, or information trafficked through queue services, in the case of schemas for databases I recommend the creation of a separate directory.

The module directory contains functionality organization classes, that is, it is possible to fragment the application into smaller parts that may or may not be loaded by the main application through the `main.module.ts` file. Finally, the services directory contains support classes for controllers and adapters containing the business logic of operation, normally they are self-instantiated injectable classes.

It is important to remember that the files in the /src directory will be built for the production application, so any code that is essential for the application to work must be inside this directory.

### Static files

The recommendation regarding static files is to always use the CDN integration features available in the editor, as whenever the application is built all static files will be automatically uploaded and updated on the CDN, however if you want to maintain the availability of the files being served by the application, the system is configured to map a directory /public, if this directory exists in the export and deployment of the application, its files will be copied automatically, becoming available for public access without access control.

## Editor

The visual editor is written in Vue3 in Typescript complemented by plugins being stored all files in `/editor/src`, static CSS files, favicons, images and Javascript bundles in `/editor/assets`.

```
.
└── src/
    ├── components/
    ├── interfaces/
    ├── lib/
    ├── stores/
    ├── App.vue
    └── main.ts
```

The main file of the module that will be loaded will be `/src/main.ts`, this file is responsible for starting the application, loading necessary plugins. The editor primarily makes HTTP requests to the server to manage files, blueprints, etc., but in specific cases such as Language Server, Hot reload, realtime execution of blueprints, event buffering, this communication takes place via Websocket.

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import UUID from "vue3-uuid";
import Draggable from "vue3-draggable";
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import App from './App.vue';

const app = createApp(App);
app.use(UUID);
app.use(PerfectScrollbar);
app.use(Draggable);
app.use(createPinia());
app.mount('#app');
```

## Dev mode

To start the application in development mode you can use the following command. 

```bash
$ yarn dev || npm run dev
```

In this way, the initial application watches in parallel with the nodemon that checks for changes in the files and automatically reloads in case of changes, the server that provides the API will be loaded following the pure Typescript settings, the editor will be compiled for Javascript with Webpack, generating a file bundle containing all the files necessary for the editor to work, finally Tailwindcss generates a bundle of Javscript and CSS for use by the editor.

The generated files are stored in `/editor/assets`, and should not be changed since every time development mode is started or an application build is generated, these files will be regenerated.

## Docs

To generate the documentation I created a simple form of organization through directories and `.md` files that are processed through the command below.

```bash
$ yarn generate:docs
```

When executing this command, the html files are created based on the `.md` files and are managed by the `docs.controller.ts` controller for public access, in the production version the export of the documentation is optional, in addition it is possible to define automatic documentation of the classes using docoradores that will export the documentation through Swagger (https://www.npmjs.com/package/swagger), obviously only being useful in the case of public APIs that require documentation, to document the blueprints a consistent model has not yet been defined.

## Linting and formatting

Like most public web applications that use Typescript, I use eslint and prettier to format and organize the code, making it possible to perform checks and corrections using the commands below

```bash
# Lint with eslint
$ yarn lint

# Format with prettier
$ yarn format
```