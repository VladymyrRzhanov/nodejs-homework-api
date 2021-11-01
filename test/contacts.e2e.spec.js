const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/db');
const app = require('../app');
const { HttpCodeRes } = require('../config/constants');
const Contact = require('../model/contact');
const User = require('../model/user');
const { newContact, newUserForRouteContact } = require('./data/data');

describe('Test route contacts', () => {
    let user, token;

    beforeAll(async () => {
        await db
        await User.deleteOne({ email: newUserForRouteContact.email })
        user = await User.create(newUserForRouteContact);
        const SECRET_KEY = process.env.JWT_SECRET_KEY;
        const issueToken = (payload, secret) => jwt.sign(payload, secret);
        token = issueToken({ id: user._id }, SECRET_KEY);
        await User.updateOne({ _id: user._id }, { token })
    });

    afterAll(async () => {
        const mongo = await db;
        await User.deleteOne({ email: newUserForRouteContact.email })
        await mongo.disconnect();
    });

    beforeEach(async () => {
        await Contact.deleteMany();
    });

    describe('GET request', () => {
        test('Should return status 200 get contacts', async () => {
            const response = await request(app)
                .get('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(HttpCodeRes.SUCCESS)
            expect(response.body).toBeDefined()
            expect(response.body.data.contacts).toBeInstanceOf(Array)
        });

        test('Should return status 200 get contacts by id', async () => {
            const contact = await Contact.create({ ...newContact, owner: user._id });
            const response = await request(app)
                .get(`/api/contacts/${contact._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(HttpCodeRes.SUCCESS)
            expect(response.body).toBeDefined()
            expect(response.body.payload.contact).toBeDefined()
            expect(response.body.payload.contact).toHaveProperty('id');
            expect(response.body.payload.contact).toHaveProperty('name');
            expect(response.body.payload.contact).toHaveProperty('email');
            expect(response.body.payload.contact).toHaveProperty('phone');
        });

        test('Should return status 404 if contact not found', async () => {
            const contact = await Contact.create({ ...newContact, owner: user._id });
            const response = await request(app)
                .get(`/api/contacts/${user._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(HttpCodeRes.NOT_FOUND);
            expect(response.body).toBeDefined();
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('code');
        });
    });

    describe('POST request', () => {
        test('Should return status 201 create contacts', async () => {
            const response = await request(app)
                .post('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
                .send(newContact)
                .set('Accept', 'application/json')
            expect(response.status).toEqual(HttpCodeRes.SUCCESS_CREATE)
            expect(response.body).toBeDefined()
        });
    })
})