import { expect } from 'chai';
import 'mocha';

import { HOST_METADATA, PATH_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { Controller } from '../../decorators';

describe('Controller', () => {
  it('should set the correct metadata when called without arguments', () => {
    @Controller()
    class TestController {}

    const pathMetadata = Reflect.getMetadata(PATH_METADATA, TestController);
    const hostMetadata = Reflect.getMetadata(HOST_METADATA, TestController);
    const scopeOptionsMetadata = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestController);

    expect(pathMetadata).to.equal('/');
    expect(hostMetadata).to.be.undefined;
    expect(scopeOptionsMetadata).to.be.undefined;
  });

  it('should set the correct metadata when called with a prefix string', () => {
    @Controller('/api')
    class TestController {}

    const pathMetadata = Reflect.getMetadata(PATH_METADATA, TestController);
    const hostMetadata = Reflect.getMetadata(HOST_METADATA, TestController);
    const scopeOptionsMetadata = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestController);

    expect(pathMetadata).to.equal('/api');
    expect(hostMetadata).to.be.undefined;
    expect(scopeOptionsMetadata).to.be.undefined;
  });

  it('should set the correct metadata when called with an options object', () => {
    @Controller('/api')
    class TestController {}

    const pathMetadata = Reflect.getMetadata(PATH_METADATA, TestController);
    const scopeOptionsMetadata = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestController);

    expect(pathMetadata).to.equal('/api');
    expect(scopeOptionsMetadata).to.deep.equal({ scope: 'request', durable: true });
  });
});
