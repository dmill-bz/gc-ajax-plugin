import Client from './AjaxClient';

/**
 * Client that handles ajax calls rather than websocket.
 *
 * @author Dylan Millikin <dylan.millikin@gmail.com>
 */
class AjaxPlugin {

    /**
     * This method loads all the required features for this plugin
     *
     * @param  {Console} main the console object
     * @return {Void}
     */
    load(main) {
        //create a custom client
        const client = new Client(main.options.host, main.options.port, main.options.driverOptions, main.parser);
        //change the main's client to the custom one.
        main.client = client;
    }
}

export default AjaxPlugin;
