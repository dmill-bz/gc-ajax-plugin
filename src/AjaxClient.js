import $ from 'jquery';
import Parser from 'gremlin-console/lib/Parser';

/**
 * Client that communicates via ajax
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 */
class AjaxClient {

    /**
     * @type {Parser} a Parser object used to parse the data
     */
    parser;

    /**
     * @type {Object} an object containing all the configuration for the ajax call
     */
    _options;

    /**
     * Create the client
     *
     * @param  {String}  host    the host name / ip
     * @param  {Integer} port    the port number for the client to connect to
     * @param  {Object}  options the driver options as per defined in the driver documentation
     * @return void
     */
    constructor(host, port, options, parser) {
        if(typeof parser === "undefined") {
            this.parser = new Parser();
        } else {
            this.parser = parser;
        }

        let path = options.path || "";
        delete options.path;

        this._options = {
            type: "POST",
            dataType: "text",
            url: host + ':' + port + '/' + path.replace(/^(\/)/,""),
            data: {
                session: this._createUUID()
            },
            error: (err)=>{console.log(err)},
            ...options
        };
    }

    /**
     * Run a query with various params.
     * Bellow are the three expected params. optionals can be ommitted and interchanged
     *
     * @param  {String}   query    mandatory: the gremlin query to run
     * @param  {Object}   bindings optional: the bindings associated to this query
     * @param  {Function} callback optional: function that executes once the results are received.
     * @return {Void}
     */
    execute(query, bindings, callback) {
        if(typeof bindings === 'function') {
            callback = bindings;
            bindings = {};
        }

        //customize the callback params to use Parser
        this._options.success = (data) => {
            data = JSON.parse(data);
            callback(this.parser.create(data.err, data.results));
        };

        this._options.data.gremlin = query;
        this._options.data.bindings = bindings;

        $.ajax(this._options);
    }

    /**
     * Register a callback on error
     * It's rare to need this but sometimes you'll want to register a sepcific behavior against the client's error management
     *
     * @param  {Function} callback the method to run on client error.
     * @return {Void}
     */
    onError(callback) {
        const customCallback = (j, s, e) => {
            callback({status: s, message: e});
        };
        this._options.error = customCallback;
    }

    /**
     * Register a callback on open
     *
     * @param  {Function} callback the method to run on client error.
     * @return {Void}
     */
    onOpen(callback) {
        callback();
    }

    /**
     * Generates a UUID
     *
     * return {String} the UUID for this client
     */
    _createUUID() {
        let d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
}

export default AjaxClient;
