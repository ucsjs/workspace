# Introduction

UCS (UCS.js) or Universal Component System is a tool that brings together several programming concepts in a graphical structure that manages and generates codes through an interface that simplifies the construction of systems, pages, applications or even codes giving the freedom for anyone to create complex systems without the need for programming knowledge.

The project is divided into two distinct parts, the first part called the Workspace which consists of all the backend functionality, then every file manager, parsers, code generators, integrations, plugins, even interactions with tools such as databases, cloud server, among others, is your responsibility, this part of the project is registered in Typescript (https://www.typescriptlang.org/) + Node.js (https://nodejs.org/).The second part of the project called Editor is the graphic part of the development responsible for interacting with users at the frontend level, using Vue 3 (https://vuejs.org/) + Tailwind CSS (https://tailwindcss.com/).

However, regardless of the application's base structure, UCS can generate codes in any language or framework using official or community-developed plugins, the Editor has native support for several languages using the VSCode's native Monaco (https://microsoft.github.io/monaco-editor/) editor, so it is possible to write plugins in any language and parsers for export as all metadata is stored in JSON.

At first, the application format may seem strange because it brings together a series of concepts from different areas such as games, the concept of Blueprints is to create flows without using code in a graphic form existing in Unreal Engine (https://www.unrealengine.com) and Unity (https://unity.com/) applied to the scenario of web applications, format of componetization as usual in Delphi in the 2000s with the objective of breaking a little of the paradigm of how we develop websites, web systems, applications, landing pages, even email templates, who knows even in the future, development of native games with WebGL and Canvas who knows?

This project brings together concepts from more than 20 years of experience in different areas and languages, and the biggest references of the project are Delphi, Unity, C#, Javascript, Node, Typescript, VSCode, Photoshop.

I hope you enjoy this work that took almost 10 years to finally come true

André Ferreira (CEO)

# Installation

I recommend using Node.js 16+ (LTS) preferably using the latest available LTS version, and using YARN (https://www.npmjs.com/package/yarn) for dependency management

```bash
$ git clone https://github.com/ucsjs/workspace
$ cd workspace
$ yarn || npm install
$ yarn dev || npm run dev
```

Currently the workspace does not require an authentication configuration as the project is under development and does not have a stable version, however access control is provided through an SSH certificate as the Workspace has full access to the host machine, including the possibility of sending terminal commands.

Open your browser and navigate to http://localhost:3050/ 