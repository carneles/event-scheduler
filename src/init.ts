import { UserController } from "./controllers/user";
import { connect, disconnect } from "mongoose";
import { env } from "./env"
import { UserService } from "./services/user";
import { EventController } from "./controllers/event";
import { EventService } from "./services/event";

const connectToDb = async () => {
    try {
        let userInfo = `${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@`;
        if (userInfo === ':@') {
            userInfo = '';
        }
        const dbUri = `mongodb://${userInfo}${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
        await connect(dbUri);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

const disconnectFromDb = async () => {
    try {
        await disconnect();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export async function init() {
    await connectToDb();
    // setup services, controller, etc

    const userService = new UserService();
    const userController = new UserController(userService);

    const eventService = new EventService();
    const eventController = new EventController(eventService);

    return {
        connectToDb,
        disconnectFromDb,
        userController,
        eventController
    };
}