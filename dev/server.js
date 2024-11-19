const http = require('http');
const SERVER_PORT = 8008;

class ServerExample {
    constructor({ port, fieldName }) {
        this.fieldName = fieldName;
        this.server = http.createServer().listen(port);

        this.server.on('listening', () => {
            console.log('Server is listening ' + port + '...');
        });

        this.server.on('error', (error) => {
            console.log('Failed to run server', error);
        });
    }
}

new ServerExample({
    port: SERVER_PORT,
});