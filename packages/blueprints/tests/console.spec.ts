import "mocha";
import * as sinon from "sinon";
import { expect } from 'chai';
import Console from '../blueprints/Common/Console.blueprint';
import { Types } from "@ucsjs/core";

describe('Console Blueprint', () => {
  let consoleBlueprint: Console;

  beforeEach(() => {
    consoleBlueprint = new Console();
  });

  it('should have correct header properties', () => {
    expect(consoleBlueprint.header).to.deep.equal({
      useInEditor: true,
      version: 1,
      namespace: 'Console',
      group: 'Common',
      helpLink: 'https://www.w3schools.com/jsref/met_console_log.asp',
      inputs: [
        {
          name: '_default',
          alias: 'value',
          type: Types.Any,
        },
      ],
      events: [
        {
          name: '_default',
        },
      ],
    });
  });
});
