import sinon from 'sinon';
import {
    traktHistoryToCsv,
    __RewireAPI__ as RewireAPI,
} from '../../main';
import {
    expect,
    it,
    beforeEach,
    afterEach,
} from './helpers';

describe('index.js', () => {
    beforeEach((t) => {
        t.sandbox = sinon.createSandbox();
    });
    afterEach((t) => {
        t.sandbox.restore();
    });
    describe('traktHistoryToCsv()', () => {
        beforeEach((t) => {
            t.pipe = t.sandbox.stub();
            t.stream = t.sandbox.stub();
            t.data = ['foo', 'bar'];
            t.getData = t.sandbox.stub().resolves(t.data);
            t.fs = {
                createWriteStream: t.sandbox.stub().returns(t.stream),
            };
            t.builder = {
                createReadStream: t.sandbox.stub().returns({ pipe: t.pipe }),
            };
            t.props = {
                userName: 'foo',
                fileName: 'bar',
            };
            RewireAPI.__set__('getData', t.getData);
            RewireAPI.__set__('stream', t.stream);
            RewireAPI.__set__('fs', t.fs);
            RewireAPI.__set__('builder', t.builder);
        });
        afterEach((t) => {
            RewireAPI.__ResetDependency__('getData');
            RewireAPI.__ResetDependency__('stream');
            RewireAPI.__ResetDependency__('fs');
            RewireAPI.__ResetDependency__('builder');
        });
        it('awaits the getData function after passing it the userName', async (t) => {
            await (traktHistoryToCsv(t.props));
            expect(t.getData.called).to.be.true;
            expect(t.getData.args[0][0]).to.be.equal(t.props.userName);
        });
        it('passes fileName to createWriteStream', async (t) => {
            await (traktHistoryToCsv({ userName: 'foo', fileName: 'bar.csv' }));
            expect(t.fs.createWriteStream.called).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('bar.csv');
        });
        it('ensures fileName has a .csv extension and passes it to createWriteStream', async (t) => {
            await (traktHistoryToCsv(t.props));
            expect(t.fs.createWriteStream.called).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('bar.csv');
        });
        it('calls builder.createReadStream with the response from getData', async (t) => {
            await (traktHistoryToCsv(t.props));
            expect(t.builder.createReadStream.called).to.be.true;
            expect(t.builder.createReadStream.args[0][0]).to.deep.equal(t.data);
        });
        it('pipes the output of builder.createReadStream to stream', async (t) => {
            await (traktHistoryToCsv(t.props));
            expect(t.pipe.called).to.be.true;
            expect(t.pipe.args[0][0]).to.deep.equal(t.stream);
        });
        it('logs an error message if something throws', async (t) => {
            const errorStub = t.sandbox.stub(console, 'error');
            RewireAPI.__ResetDependency__('getData');
            const err = new Error('foo');
            const getData = t.sandbox.stub().rejects(err);
            RewireAPI.__set__('getData', getData);
            await (traktHistoryToCsv(t.props));
            expect(errorStub.called).to.be.true;
            expect(errorStub.args[0][0]).to.be.equal('Bang!');
            expect(errorStub.args[0][1]).to.be.equal(err.message);
            expect(errorStub.args[0][2]).to.be.equal(err);
        });
    });
});
