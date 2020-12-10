import sinon from 'sinon';
import { traktHistoryToCsv, __RewireAPI__ as RewireAPI } from '../../main';
import {
    expect, it, beforeEach, afterEach,
} from './helpers';
import letterboxdData from '../mocks/letterboxdData';
import traktData from '../mocks/traktData';

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
            t.wlPipe = t.sandbox.stub();
            t.stream = t.sandbox.stub();
            t.wlstream = t.sandbox.stub();
            t.traktData = traktData;
            t.data = letterboxdData;
            t.getData = t.sandbox.stub().resolves(t.data);
            t.mapper = t.sandbox.stub().returns(t.data);
            t.fs = {
                createWriteStream: t.sandbox
                    .stub()
                    .onCall(0)
                    .returns(t.stream)
                    .onCall(1)
                    .returns(t.wlStream),
            };
            t.builder = {
                createReadStream: t.sandbox
                    .stub()
                    .onCall(0)
                    .returns({ pipe: t.pipe })
                    .onCall(1)
                    .returns({ pipe: t.wlPipe }),
            };
            t.props = {
                userName: 'foo',
                fileName: 'bar',
            };
            RewireAPI.__set__('getData', t.getData);
            RewireAPI.__set__('stream', t.stream);
            RewireAPI.__set__('mapper', t.mapper);
            RewireAPI.__set__('fs', t.fs);
            RewireAPI.__set__('builder', t.builder);
        });
        afterEach((t) => {
            RewireAPI.__ResetDependency__('getData');
            RewireAPI.__ResetDependency__('stream');
            RewireAPI.__ResetDependency__('fs');
            RewireAPI.__ResetDependency__('builder');
        });

        it('will use default filenames if none are given', async (t) => {
            delete t.props.fileName;
            delete t.props.watchListFileName;
            await traktHistoryToCsv(t.props);
            expect(t.getData.called).to.be.true;
            expect(t.getData.args[0][0]).to.be.equal(t.props.userName);
            expect(t.getData.args[1][0]).to.be.equal(t.props.userName);
            expect(t.getData.args[1][1]).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('history.csv');
            expect(t.fs.createWriteStream.args[1][0]).to.be.equal('watchlist.csv');
        });
        it('only generates watchlist of only a watchlist file is given', async (t) => {
            t.props.watchListFileName = 'baz';
            delete t.props.fileName;
            t.fs = {
                createWriteStream: t.sandbox.stub().returns(t.wlStream),
            };
            t.builder = {
                createReadStream: t.sandbox.stub().returns({ pipe: t.wlPipe }),
            };
            await traktHistoryToCsv(t.props);
            expect(t.getData.called).to.be.true;
            expect(t.getData.args[0][0]).to.be.equal(t.props.userName);
            expect(t.getData.args[0][1]).to.be.true;
        });
        it('awaits the getData function after passing it the userName', async (t) => {
            await traktHistoryToCsv(t.props);
            expect(t.getData.called).to.be.true;
            expect(t.getData.args[0][0]).to.be.equal(t.props.userName);
        });
        it('awaits the getData function after passing it the userName for a watchlist', async (t) => {
            t.props.watchListFileName = 'baz';
            await traktHistoryToCsv(t.props);
            expect(t.getData.called).to.be.true;
            expect(t.getData.args[0][0]).to.be.equal(t.props.userName);
            expect(t.getData.args[1][0]).to.be.equal(t.props.userName);
            expect(t.getData.args[1][1]).to.be.true;
        });
        it('passes fileName to createWriteStream', async (t) => {
            await traktHistoryToCsv({ userName: 'foo', fileName: 'bar.csv' });
            expect(t.fs.createWriteStream.called).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('bar.csv');
        });
        it('passes watchListFileName to createWriteStream', async (t) => {
            await traktHistoryToCsv({
                userName: 'foo',
                fileName: 'bar.csv',
                watchListFileName: 'baz.csv',
            });
            expect(t.fs.createWriteStream.called).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('bar.csv');
            expect(t.fs.createWriteStream.args[1][0]).to.be.equal('baz.csv');
        });
        it('ensures fileName has a .csv extension and passes it to createWriteStream', async (t) => {
            await traktHistoryToCsv(t.props);
            expect(t.fs.createWriteStream.called).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('bar.csv');
        });
        it('ensures watchListFileName has a .csv extension and passes it to createWriteStream', async (t) => {
            t.props.watchListFileName = 'baz';
            await traktHistoryToCsv(t.props);
            expect(t.fs.createWriteStream.called).to.be.true;
            expect(t.fs.createWriteStream.args[0][0]).to.be.equal('bar.csv');
            expect(t.fs.createWriteStream.args[1][0]).to.be.equal('baz.csv');
        });
        it('calls builder.createReadStream with the response from getData', async (t) => {
            await traktHistoryToCsv(t.props);
            expect(t.builder.createReadStream.called).to.be.true;
            expect(t.builder.createReadStream.args[0][0]).to.deep.equal(t.data);
        });
        it('calls builder.createReadStream with the response from getData for a watchlist', async (t) => {
            t.props.watchListFileName = 'baz';
            await traktHistoryToCsv(t.props);
            expect(t.builder.createReadStream.called).to.be.true;
            expect(t.builder.createReadStream.args[0][0]).to.deep.equal(t.data);
            expect(t.builder.createReadStream.args[1][0]).to.deep.equal(t.data);
        });
        it('pipes the output of builder.createReadStream to stream', async (t) => {
            await traktHistoryToCsv(t.props);
            expect(t.pipe.called).to.be.true;
            expect(t.pipe.args[0][0]).to.deep.equal(t.stream);
        });
        it('pipes the output of builder.createReadStream to stream for a watchlist', async (t) => {
            t.props.watchListFileName = 'baz';
            await traktHistoryToCsv(t.props);
            expect(t.pipe.called).to.be.true;
            expect(t.wlPipe.called).to.be.true;
            expect(t.pipe.args[0][0]).to.deep.equal(t.stream);
            expect(t.wlPipe.args[0][0]).to.deep.equal(t.wlStream);
        });
        it('logs an error message if something throws', async (t) => {
            const errorStub = t.sandbox.stub(console, 'error');
            RewireAPI.__ResetDependency__('getData');
            const err = new Error('foo');
            const getData = t.sandbox.stub().rejects(err);
            RewireAPI.__set__('getData', getData);
            await traktHistoryToCsv(t.props);
            expect(errorStub.called).to.be.true;
            expect(errorStub.args[0][0]).to.be.equal('Bang!');
            expect(errorStub.args[0][1]).to.be.equal(err.message);
            expect(errorStub.args[0][2]).to.be.equal(err);
        });
    });
});
