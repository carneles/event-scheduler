
import compression from "compression"
import { init } from './init.js'
import express, { Application } from "express"
import helmet from "helmet"
import morgan from "morgan"

const createApp = async (): Promise<Application> => {
  const { userController } = await init();
  const app = express()
  app.use(compression())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(helmet())
  app.use(morgan("dev"))

  app.use('/user', userController.getRouter());

  return app
}

export { createApp }