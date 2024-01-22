import { UserModel } from './../../src/mongoose/user';
import { IUserCreateRequest, IUserResponse } from 'src/models/user';
import { EventModel } from 'src/mongoose/event';
import { UserEventModel } from 'src/mongoose/user_event';
import { UserService } from 'src/services/user';
import { StandardError } from 'src/utils/standard_error';

describe("UserServiceTest", () => {
    let userService: UserService;

    describe('GetById', () => {
        it('should return the data when exists', async () => {
            const expectedResponse: IUserResponse = {
                data: {
                    id: '507f191e810c19729de860ea',
                    firstName: 'Tester',
                    lastName: 'One',
                    email: 'tester@company.com',
                    birthDate: '2001-12-01',
                    timezone: 'Asia/Jakarta',
                    createdAt: '2024-01-01 00:00:00',
                    updatedAt: '2024-01-01 00:00:00'
                }
            }

            UserModel.findById = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860ea',
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            });

            userService = new UserService();

            const res = await userService.getById('507f191e810c19729de860ea');

            expect(res).toEqual(expectedResponse)

        });

        it('should throw user not found err when find result is undefined', async () => {
            UserModel.findById = jest.fn().mockRejectedValue(new StandardError('ERR_USER_NOT_FOUND', 'User not found.'));

            userService = new UserService();

            try {
                await userService.getById('507f191e810c19729de860ea');
            } catch (err) {
                expect(err).toBeDefined()
            }
        });
    });

    describe('Create', () => {
        it('should return data when parameter is correct', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }
            const expectedResponse: IUserResponse = {
                data: {
                    id: '507f191e810c19729de860ea',
                    firstName: 'Tester',
                    lastName: 'One',
                    email: 'tester@company.com',
                    birthDate: '2001-12-01',
                    timezone: 'Asia/Jakarta',
                    createdAt: '2024-01-01 00:00:00',
                    updatedAt: '2024-01-01 00:00:00'
                }
            }

            UserModel.create = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860ea',
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            });
            EventModel.findOne = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860eb',
                name: 'BIRTHDAY',
                message: 'Happy birthday bro!',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            })
            UserEventModel.create = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860ec',
                userId: '507f191e810c19729de860ea',
                eventId: '507f191e810c19729de860eb',
                date: '2001-01-01 00:00:00',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            })

            userService = new UserService();

            const res = await userService.create(request);

            expect(res).toEqual(expectedResponse)
        });

        it('should still be able to save user if the BIRTHDAY event is not available', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }
            const expectedResponse: IUserResponse = {
                data: {
                    id: '507f191e810c19729de860ea',
                    firstName: 'Tester',
                    lastName: 'One',
                    email: 'tester@company.com',
                    birthDate: '2001-12-01',
                    timezone: 'Asia/Jakarta',
                    createdAt: '2024-01-01 00:00:00',
                    updatedAt: '2024-01-01 00:00:00'
                }
            }

            UserModel.create = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860ea',
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            });
            EventModel.findOne = jest.fn().mockReturnValue(undefined)

            userService = new UserService();

            const res = await userService.create(request);

            expect(res).toEqual(expectedResponse)
        });

        it('should throw invalid request data when firstname does not available', async () => {
            const request: IUserCreateRequest = {
                lastName: 'One',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }
            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new StandardError('ERR_INVALID_REQUEST', 'Firstname cannot empty.'))
            }
        });

        it('should throw invalid request data when lastName does not available', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }
            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new StandardError('ERR_INVALID_REQUEST', 'Lastname cannot empty.'))
            }
        });

        it('should throw invalid request data when birth date does not available', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                timezone: 'Asia/Jakarta',
            }
            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new StandardError('ERR_INVALID_REQUEST', 'Birthdate cannot empty.'))
            }
        });

        it('should throw invalid request data when time zone does not available', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                birthDate: '2001-12-01',
            }
            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new StandardError('ERR_INVALID_REQUEST', 'Timezone cannot empty.'))
            }
        });

        it('should throw when create user throw err', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }
            UserModel.create = jest.fn().mockRejectedValue(new Error('some error'));

            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new Error('some error'))
            }
        });

        it('should throw when find event throw err', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }

            UserModel.create = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860ea',
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            });
            EventModel.findOne = jest.fn().mockRejectedValue(new Error('some error'));

            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new Error('some error'))
            }
        });

        it('should throw when find event throw err', async () => {
            const request: IUserCreateRequest = {
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
            }

            UserModel.create = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860ea',
                firstName: 'Tester',
                lastName: 'One',
                email: 'tester@company.com',
                birthDate: '2001-12-01',
                timezone: 'Asia/Jakarta',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            });
            EventModel.findOne = jest.fn().mockReturnValue({
                id: '507f191e810c19729de860eb',
                name: 'BIRTHDAY',
                message: 'Happy birthday bro!',
                createdAt: '2024-01-01 00:00:00',
                updatedAt: '2024-01-01 00:00:00'
            })
            UserEventModel.create = jest.fn().mockRejectedValue(new Error('some error'));

            userService = new UserService();

            try {
                await userService.create(request);
            } catch (err) {
                expect(err).toBeDefined()
                expect(err).toEqual(new Error('some error'))
            }
        });
    });
});