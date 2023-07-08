# Global Registry

The Global Registry is the global controller for loading and managing blueprints in the system, to avoid the need to manually import each class and even instantiate or create flows, as well as perform blueprint configuration.

Inside the index.ts file, the previous loading of the blueprints will be carried out by calling the load function, the load function by default will look for existing blueprints in the project within the `packages` and `src` directory, in case of application in production, the paths will be `node_modules/@ucsjs` and `dist`, all blueprints must have the extension `.blueprint.ts` and in case of production files, `.blueprint.js`, all classes will be imported through the function `require` of the Node, and stored without being instantiated, when using the `retrieve` function, the class will be instantiated and the blueprint will be configured.

