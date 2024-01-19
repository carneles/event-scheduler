import { UserController } from "./controllers/user.js";
import { connect, disconnect } from "mongoose";
import { env } from "./env.js"
import { UserService } from "./services/user.js";


const connectToDb = async () => {
    try {
        let dbUri = `mongodb://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
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

    return {
        connectToDb,
        disconnectFromDb,
        userController
    };
}