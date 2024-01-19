import { env } from "./env.js"
import { createApp } from "./app.js"
import gracefulShutdown from 'http-graceful-shutdown'

(async () => {
    try {
        const app = await createApp();
        const server = app.listen(env.PORT, () => {
            console.log("Server Running on Port " + env.PORT)
        });
        server.keepAliveTimeout = 101 * 1000;
        gracefulShutdown(server);
    } catch (err) {
        console.log('Error: ', err)
    }
})();
