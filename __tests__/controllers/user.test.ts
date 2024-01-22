import sinon, { SinonStubbedInstance } from 'sinon';
import { Response, Request } from 'express';
import { UserService } from './../../src/services/user';
import { UserController } from './../../src/controllers/user';
import { IUserResponse } from 'src/models/user';
import { StandardError } from 'src/utils/standard_error';

describe("UserControllerTest", () => {
  const res = { status: undefined, json: undefined, end: undefined } as unknown as Response;
  let req: Request;
  let userService: SinonStubbedInstance<UserService>;
  let userController: UserController;

  beforeEach(async () => {
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);

    userService = sinon.createStubInstance(UserService);

    userController = new UserController(userService);
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe('GetById', () => {
    it('should return 200 OK when data exists', async () => {
      const userServiceResponse: IUserResponse = {
        data: {
          id: 'id1',
          firstName: 'Tester',
          lastName: 'One',
          email: 'tester@company.com',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-01-01 00:00:00'
        }
      };
      userService.getById.resolves(userServiceResponse);

      req = {
        params: {
          'id': 1
        }
      } as unknown as Request;

      await userController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userServiceResponse);
    });

    it('should return 400 OK when data does not exists', async () => {
      const userServiceResponse: IUserResponse = {
        error: {
          name: 'ERR_USER_NOT_FOUND',
          code: 'ERR_USER_NOT_FOUND',
          message: 'User not found.'
        }
      };
      userService.getById.throws(new StandardError('ERR_USER_NOT_FOUND', 'User not found.'));

      req = {
        params: {
          'id': 1
        }
      } as unknown as Request;

      await userController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(userServiceResponse);
    });

    it('should return 500 OK when service throws err', async () => {
      userService.getById.throws(new Error('some err'));

      req = {
        params: {
          'id': 1
        }
      } as unknown as Request;

      await userController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error'});
    });
  });

  describe('Create', () => {
    it('should return 200 OK when request data valid', async () => {
      const userServiceResponse: IUserResponse = {
        data: {
          id: 'id1',
          firstName: 'Tester',
          lastName: 'One',
          email: 'tester@company.com',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-01-01 00:00:00'
        }
      };
      userService.create.resolves(userServiceResponse);

      req = {
        body: {
          firstName: 'Tester',
          lastName: 'One',
          email: 'tester@company.com',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
        }
      } as unknown as Request;

      await userController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(userServiceResponse);
    });

    it('should return 400 OK when data created with invalid req data', async () => {
      const userServiceResponse: IUserResponse = {
        error: {
          name: 'ERR_INVALID_REQUEST',
          code: 'ERR_INVALID_REQUEST',
          message: 'Invalid request data.'
        }
      };
      userService.create.throws(new StandardError('ERR_INVALID_REQUEST', 'Invalid request data.'));

      req = {
        body: {
          firstName: 'Tester',
          lastName: 'One',
          email: 'tester@company.com',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
        }
      } as unknown as Request;

      await userController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(userServiceResponse);
    });

    it('should return 500 OK when service throws err', async () => {
      userService.create.throws(new Error('some err'));

      req = {
        body: {
          firstName: 'Tester',
          lastName: 'One',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
        }
      } as unknown as Request;

      await userController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error'});
    });
  });
/*
  describe('Update', () => {
    it('should return 200 OK when request data valid', async () => {
      const userServiceResponse: IUserResponse = {
        data: {
          id: 'id1',
          firstName: 'Tester',
          lastName: 'One',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-01-01 00:00:00'
        }
      };
      userService.update.resolves(userServiceResponse);

      req = {
        params: {
          id: 'id1'
        },
        body: {
          firstName: 'Tester',
          lastName: 'One',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
        }
      } as unknown as Request;

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userServiceResponse);
    });

    it('should return 400 OK when user data does not exist', async () => {
      const userServiceResponse: IUserResponse = {
        error: {
          name: 'ERR_USER_NOT_FOUND',
          code: 'ERR_USER_NOT_FOUND',
          message: 'User not found.'
        }
      };
      userService.update.throws(new StandardError('ERR_USER_NOT_FOUND', 'User not found.'));

      req = {
        params: {
          id: 'id1'
        },
        body: {
          firstName: 'Tester',
          lastName: 'One',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
        }
      } as unknown as Request;

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(userServiceResponse);
    });

    it('should return 500 OK when service throws err', async () => {
      userService.update.throws(new Error('some err'));

      req = {
        params: {
          id: 'id1'
        },
        body: {
          firstName: 'Tester',
          lastName: 'One',
          birthDate: '2001-12-01',
          timezone: 'Asia/Jakarta',
        }
      } as unknown as Request;

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error'});
    });
  });*/
});