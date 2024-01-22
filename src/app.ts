
import compression from "compression";
import { init } from './init';
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { scheduleJob } from 'node-schedule';
import { JobService } from "./services/job";

const createApp = async (): Promise<Application> => {
  const { userController, eventController } = await init();
  const app = express()
  app.use(compression())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(helmet())
  app.use(morgan("dev"))

  app.use('/user', userController.getRouter());
  app.use('/event', eventController.getRouter());

  return app
}

const createJob = async () => {
  const jobService = new JobService();
  //const job = scheduleJob('0 */1 * * *', async function () {
  const job = scheduleJob('*/10 * * * *', async function () {
    console.log('scheduled job running');
    await jobService.findAndSendGreetings();
    console.log('scheduled done');
  })
  return job
}

export { createApp, createJob }