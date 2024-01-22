import sinon, { SinonStubbedInstance } from 'sinon';
import { Response, Request } from 'express';
import { StandardError } from 'src/utils/standard_error';
import { IEventResponse } from 'src/models/event';
import { EventService } from 'src/services/event';
import { EventController } from 'src/controllers/event';

describe("EventControllerTest", () => {
  const res = { status: undefined, json: undefined, end: undefined } as unknown as Response;
  let req: Request;
  let eventService: SinonStubbedInstance<EventService>;
  let eventController: EventController;

  beforeEach(async () => {
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);

    eventService = sinon.createStubInstance(EventService);

    eventController = new EventController(eventService);
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe('Create', () => {
    it('should return 200 OK when request data valid', async () => {
      const eventServiceResponse: IEventResponse = {
        data: {
          id: 'id1',
          name: 'BIRTHDAY',
          message: 'Happy birthday to you!',
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-01-01 00:00:00'
        }
      };
      eventService.create.resolves(eventServiceResponse);

      req = {
        body: {
            name: 'BIRTHDAY',
            message: 'Happy birthday to you!',
        }
      } as unknown as Request;

      await eventController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(eventServiceResponse);
    });

    it('should return 400 OK when data created with invalid req data', async () => {
      const eventServiceResponse: IEventResponse = {
        error: {
          name: 'ERR_INVALID_REQUEST',
          code: 'ERR_INVALID_REQUEST',
          message: 'Invalid request data.'
        }
      };
      eventService.create.throws(new StandardError('ERR_INVALID_REQUEST', 'Invalid request data.'));

      req = {
        body: {
            name: 'BIRTHDAY',
            message: 'Happy birthday to you!',
        }
      } as unknown as Request;

      await eventController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(eventServiceResponse);
    });

    it('should return 500 OK when service throws err', async () => {
      eventService.create.throws(new Error('some err'));

      req = {
        body: {
            name: 'BIRTHDAY',
            message: 'Happy birthday to you!',
        }
      } as unknown as Request;

      await eventController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error'});
    });
  });
});