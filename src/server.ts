import { env } from "./env"
import { createApp, createJob } from "./app"
import gracefulShutdown from 'http-graceful-shutdown'

(async () => {
    try {
        await createJob();
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
