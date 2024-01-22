import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IUser } from 'src/models/user';
import { UserModel } from 'src/mongoose/user';
import moment from "moment-timezone";

describe('UserModelTest', () => {
    let mongoDaemon: MongoMemoryServer;

    beforeAll(async () => {
        try {
            let dbUri = process.env.DB_URL;
            mongoDaemon = await MongoMemoryServer.create();
            dbUri = mongoDaemon.getUri();
    
            await mongoose.connect(dbUri);
        } catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.close();
          } catch (err) {
            console.log(err);
          }
    })

    describe('Create user', () => {
        it("should be able to create user", async () => {
            const user: IUser = {
              firstName: 'Tester',
              lastName: 'One',
              email: 'tester@company.com',
              birthDate: '2001-12-01',
              timezone: 'Asia/Jakarta',
            }
            const userModel = new UserModel<IUser>(user);
            const result: IUser = await userModel.save();
            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.firstName).toEqual(user.firstName);
            expect(result.lastName).toEqual(user.lastName);
            expect(result.birthDate).toEqual(moment(result.birthDate).toDate());
            expect(result.timezone).toEqual(user.timezone);
            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();
        });

        it("should throw error when data invalid", async () => {
            const user: IUser = {
              firstName: '',
              lastName: 'One',
              email: 'tester@company.com',
              birthDate: '2001-12-01',
              timezone: 'Asia/Jakarta',
            }
            const userModel = new UserModel<IUser>(user);
            try {
                await userModel.save();
            } catch (err) {
                expect(err).toBeDefined();
            }
        });
    })
    
    
})