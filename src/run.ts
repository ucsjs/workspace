const { stdout } = require('node:process');
const argv = require('argv');
const path = require('path');

const args = argv.option({
    name: 'blueprint',
    short: 'b',
    type: 'string',
    description: 'The blueprint to run',
    example: "'run --blueprint=blueprintname' or 'run -b blueprintname'"
}).run();

const Blueprint = require(path.resolve(args.options.blueprint)).default;
Blueprint.execute();