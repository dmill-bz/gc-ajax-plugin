import Client from '../src/AjaxClient';

describe('GraphSONTextClient', () => {
    describe('.construct()', () => {
        it('should create a client with default options', () => {
            const client = new Client("localhost", 8182, {});

            client.constructor.name.should.equal('AjaxClient');
            should.exist(client._options);

            client._options.url.should.equal("localhost:8182/");
            client._options.type.should.equal("POST");
            client._options.dataType.should.equal("text");
            expect(client._options.data).to.eql({});
        });

        it('should allow setting the `port` option', () => {
            const client = new Client("localhost", 8183, {});
            client._options.url.should.equal("localhost:8183/");
        });

        it('should allow setting the `host` option', () => {
            const client = new Client("otherhost", 8182, {});
            client._options.url.should.equal("otherhost:8182/");
        });

        it('should allow setting the `path` option', () => {
            const client = new Client("otherhost", 8182, {path:"/some/path"});
            client._options.url.should.equal("otherhost:8182/some/path");
        });

        it('should allow setting the driver options', () => {
            const client = new Client("localhost", 8182, {type:'GET'});
            client._options.url.should.equal("localhost:8182/");
            client._options.type.should.equal("GET");
        });
    });

    describe('.execute()', () => {
        it('should execute correctly with: query + callback', (done) => {
            const client = new Client("http://localhost", 9999, {path:"/fiveplusfive"});
            client.execute("5+5", (parser) => {
                expect(parser._rawResults).to.eql([10]);
                done()
            });
        });

        it('should execute correctly with: query + bindings + callback', () => {
            const client = new Client("http://localhost", 9999, {path:"/fiveplusfive"});
            client.execute("5+variable", {variable:5}, () => {});
        });

        it('callback should receive Result object', (done) => {
            const client = new Client("http://localhost", 9999, {path:"/fiveplusfive"});
            client.execute("5+5", (result) => {
                result.constructor.name.should.equal('Parser');
                expect(result._rawResults).to.eql([10]);
                done();
            });
        });

        it('callback should receive Error', (done) => {
            const client = new Client("http://localhost", 9999, {path:"/fiveplusfive"});
            client.execute("5+doesnotexist", (result) => {
                result.constructor.name.should.equal('Parser');
                result._rawError.message.should.eql("No such property: doesnotexist for class: Script (Error 597)");
                expect(result._rawResults).to.eql(undefined);
                done();
            });
        });

        it('should throw a catchable error', (done) => {
            const client = new Client("http://nohost", 9999, {path:"/fiveplusfive"});
            client.onError((err)=>{
                done();
            });
            client.execute("5+5", (result) => {});
        });

        it('should return the right data with bindings', (done) => {
            const client = new Client("http://localhost", 9999, {path:"/fiveplusfive"});
            client.execute("5+variable", {variable:5}, (result) => {
                expect(result._rawResults).to.eql([10]);
                done();
            });
        });
    });
});
