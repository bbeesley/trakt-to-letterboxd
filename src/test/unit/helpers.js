const chai = require('chai');
chai.use(require('sinon-chai'));

const { expect } = chai;

export {
    it, before, after, beforeEach, afterEach,
} from 'arrow-mocha/es5';
export { expect };
