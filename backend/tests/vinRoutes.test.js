// backend/tests/vinRoutes.test.js

// Mock vinController (decodeVin, getVehicleImage)
jest.mock('../controllers/vinController', () => ({
    decodeVin: (req, res) => {
      const { vin } = req.body;
      if (!vin || vin.length !== 17) {
        return res
          .status(400)
          .json({ error: 'Invalid VIN. A VIN must be 17 characters long.' });
      }
      return res.status(200).json({ success: true, data: 'MOCK-URL' });
    },
    getVehicleImage: (req, res) => {
      const { vin } = req.body;
      if (!vin || vin.length !== 17) {
        return res
          .status(400)
          .json({ error: 'Invalid VIN. A VIN must be 17 characters long.' });
      }
      return res.status(200).json({ success: true, data: 'MOCK-IMAGE-URL' });
    }
  }));
  
  // Mock listingController (searchVehiclesGoogle)
  jest.mock('../controllers/listingController', () => ({
    searchVehiclesGoogle: (req, res) => {
      const { vin } = req.body;
      if (!vin) {
        return res.status(400).json({ error: 'VIN is required' });
      }
      const results = [
        { title: 'Title1', link: 'Link1' },
        { title: 'Title2', link: 'Link2' }
      ];
      return res.status(200).json({ success: true, data: results });
    }
  }));
  

  const request  = require('supertest');
  const mongoose = require('mongoose');
  const app      = require('../server');  // your Express app
  

  describe('VIN API Endpoints', () => {
  
    // decode endpoint
    describe('POST /api/vin/decode', () => {
      it('200 & returns success + data for a valid 17-char VIN', async () => {
        const validVIN = 'ABCDEFGHIJKLMNOPQ';  // 17 chars
        const res = await request(app)
          .post('/api/vin/decode')
          .send({ vin: validVIN })
          .set('Accept', 'application/json');
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true, data: 'MOCK-URL' });
      });
  
      it('400 & returns error for an invalid VIN length', async () => {
        const res = await request(app)
          .post('/api/vin/decode')
          .send({ vin: 'SHORT' })
          .set('Accept', 'application/json');
  
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
      });
    });
  
    // getVehicleImage endpoint
    describe('POST /api/vin/vehicle/image', () => {
      it('200 & returns image URL for a valid 17-char VIN', async () => {
        const validVIN = 'ABCDEFGHIJKLMNOPQ';
        const res = await request(app)
          .post('/api/vin/vehicle/image')
          .send({ vin: validVIN })
          .set('Accept', 'application/json');
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true, data: 'MOCK-IMAGE-URL' });
      });
  
      it('400 & returns error for an invalid VIN length', async () => {
        const res = await request(app)
          .post('/api/vin/vehicle/image')
          .send({ vin: 'TOO_SHORT' })
          .set('Accept', 'application/json');
  
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
      });
    });
  
    // searchVehiclesGoogle endpoint
    describe('POST /api/vin/vehicle/listings', () => {
      it('200 & returns listings array for a valid VIN', async () => {
        const validVIN = 'ABCDEFGHIJKLMNOPQ';
        const res = await request(app)
          .post('/api/vin/vehicle/listings')
          .send({ vin: validVIN })
          .set('Accept', 'application/json');
  
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data[0]).toHaveProperty('title', 'Title1');
        expect(res.body.data[0]).toHaveProperty('link', 'Link1');
      });
  
      it('400 & returns error when VIN is missing', async () => {
        const res = await request(app)
          .post('/api/vin/vehicle/listings')
          .send({})  // no vin in body
          .set('Accept', 'application/json');
  
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'VIN is required');
      });
    });
  
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  