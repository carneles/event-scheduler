To run it:
- download all modules: ```npm install```
- run docker to turn on MongoDb: ```docker compose up -d```
- run the app in dev mode: ```npm run dev```

To run test:
- download all modules: ```NODE_ENV=development npm install```
- run Jest test: ```npm run test```

Note:
- I haven't finished to complete all the test. There are things to do in the limited given time.
    - Previously plan to create: unit test for all modules, integration test
- On run, will run 2 services: 
    - Cron job that will be triggered each hour: will collect user event and send it to job scheduler for sending it
    - Rest service


Available endpoints:
- Create User endpoint: ```POST /user```
    - will create a new user as well as BIRTHDAY event for that user
- Get user endpoint: ```GET /user/:id```
- Create Event endpoint: ```POST /event```
    - to create new event.
    - event name is unique. event with name 'BIRTHDAY' will be created along with user creation.
    - in order to register a new event for user, should use ```POST /user/:id/event``` (not created yet)
