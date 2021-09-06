import { Server as SocketServer } from 'socket.io';
import http, { IncomingMessage, ServerResponse } from 'http';
import ServeStatic from 'serve-static';
import { readFile } from 'fs';
import { IConfig } from '../../types';
import { RedisClient } from './redis-client';

const assetsDir = `${__dirname}/../../assets`;

export function MonitorServer(config?: IConfig) {
    if (!config) {
        throw new Error('Configuration object is required.');
    }
    if (typeof config !== 'object') {
        throw new Error('Invalid argument type');
    }
    if (!config.monitor || !config.monitor.enabled) {
        throw new Error('RedisSMQ monitor is not enabled. Exiting...');
    }
    const { host = '0.0.0.0', port = 7210, socketOpts = {} } = config.monitor;
    return {
        /**
         *
         * @param {function} cb
         */
        listen(cb?: Function) {
            const fallback = (req: IncomingMessage, res: ServerResponse) => {
                return () => {
                    readFile(`${assetsDir}/index.html`, (err, content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content);
                    });
                };
            };
            const serve = ServeStatic(assetsDir, {
                index: 'index.html',
                dotfiles: 'deny'
            });
            const server = http.createServer((req: any, res: any) => {
                serve(req, res, fallback(req, res));
            });
            const io = new SocketServer(server, {
                ...socketOpts,
                cors: {
                    origin: '*'
                }
            });

            console.log('Connecting to Redis server...');
            RedisClient(config, (err, client) => {
                if (err) {
                    console.log('An error occurred while trying to connect to Redis server.');
                    throw err;
                }
                console.log('Successfully connected to Redis server.');
                client.subscribe('stats');
                client.on('message', (channel, message) => {
                    const json = JSON.parse(message);
                    io.emit('stats', json);
                });
                server.listen(port, host, () => {
                    console.log(`Listening for HTTP connections on ${host}:${port}...`);
                    cb && cb();
                });
            });
        }
    };
}
