import sinon from 'sinon';
import fetchMovies, { __RewireAPI__ as RewireAPI }
    from '../../main/fetcher';
import config from '../../main/config';
import {
    expect,
    it,
    beforeEach,
    afterEach,
} from './helpers';

describe('fetcher.js', () => {
    beforeEach((t) => {
        t.sandbox = sinon.createSandbox();
    });
    afterEach((t) => {
        t.sandbox.restore();
    });
    describe('fetchMovies()', () => {
        beforeEach((t) => {
            t.data = ['foo', 'bar'];
            t.res = t.sandbox.stub().resolves(t.data);
            t.fetch = t.sandbox.stub().resolves({ json: t.res });
            RewireAPI.__set__('fetch', t.fetch);
        });
        afterEach((t) => {
            RewireAPI.__ResetDependency__('fetch');
        });
        it('calls fetch with the correct url and options', async (t) => {
            await fetchMovies('test');
            const url = 'https://api.trakt.tv/users/test/watched/movies';
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': config.clientId,
                },
            };
            expect(t.fetch.called).to.be.true;
            expect(t.fetch.args[0][0]).to.be.equal(url);
            expect(t.fetch.args[0][1]).to.deep.equal(options);
        });
        it('calls the json() method on the response', async (t) => {
            await fetchMovies('test');
            expect(t.res.called).to.be.true;
        });
        it('returns the data it got from the url', async (t) => {
            const res = await fetchMovies('test');
            expect(res).to.deep.equal(t.data);
        });
        it('logs an error if there is one', async (t) => {
            const errorStub = t.sandbox.stub(console, 'error');
            RewireAPI.__ResetDependency__('fetch');
            const err = new Error('foo');
            const fetch = t.sandbox.stub().rejects(err);
            RewireAPI.__set__('fetch', fetch);
            await fetchMovies('test');
            expect(errorStub.called).to.be.true;
            expect(errorStub.args[0][0]).to.deep.equal(err.message);
            expect(errorStub.args[0][1]).to.deep.equal(err);
        });
        it('sets an error message if there isn\'t one', async (t) => {
            const errorStub = t.sandbox.stub(console, 'error');
            RewireAPI.__ResetDependency__('fetch');
            const err = new Error();
            const fetch = t.sandbox.stub().rejects(err);
            RewireAPI.__set__('fetch', fetch);
            await fetchMovies('test');
            expect(errorStub.called).to.be.true;
            expect(errorStub.args[0][0]).to.be.equal('Unknown error');
            expect(errorStub.args[0][1]).to.deep.equal(err);
        });
        it('returns an empty array if it cant fetch data', async (t) => {
            const errorStub = t.sandbox.stub(console, 'error');
            RewireAPI.__ResetDependency__('fetch');
            const err = new Error('foo');
            const fetch = t.sandbox.stub().rejects(err);
            RewireAPI.__set__('fetch', fetch);
            const res = await fetchMovies('test');
            expect(res).to.deep.equal([]);
        });
    });
});
