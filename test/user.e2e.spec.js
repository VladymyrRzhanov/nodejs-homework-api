const request = require('supertest')
const fs = require('fs/promises')

require('dotenv').config()

const db = require('../config/db')
const app = require('../app')

const User = require('../model/user')

const { newUserForRouteUser } = require('./data/data')
const { HttpCodeRes } = require('../config/constants');

describe('Test route users', () => {
    let token
    beforeAll(async () => {
        await db
        await User.deleteOne({ email: newUserForRouteUser.email })
    });

    afterAll(async () => {
        const mongo = await db
        await User.deleteOne({ email: newUserForRouteUser.email })
        await mongo.disconnect()
    });

    test('signup user', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send(newUserForRouteUser)
            .set('Accept', 'application/json')

        expect(response.status).toEqual(HttpCodeRes.SUCCESS_CREATE)
        expect(response.body).toBeDefined()
    });

    test('User exist return status 409', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send(newUserForRouteUser)
            .set('Accept', 'application/json')

        expect(response.status).toEqual(HttpCodeRes.CONFLICT)
        expect(response.body).toBeDefined()
    });

    test('signin user', async () => {
        const response = await request(app)
            .post('/api/users/signin')
            .send(newUserForRouteUser)
            .set('Accept', 'application/json')

        expect(response.status).toEqual(HttpCodeRes.SUCCESS)
        expect(response.body).toBeDefined()
        token = response.body.token;
    });

    test('Upload avatar for user', async () => {
        const buffer = await fs.readFile('./test/data/test-avatar.jpg')
        const response = await request(app)
            .patch(`/api/users/avatars`)
            .set('Authorization', `Bearer ${token}`)
            .attach('avatar', buffer, 'test-avatar.jpg')

        expect(response.status).toEqual(HttpCodeRes.SUCCESS)
        expect(response.body).toBeDefined()
        expect(response.body.user.avatarUrl).toBeDefined()
    });
});