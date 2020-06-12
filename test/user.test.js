const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { setUpDbBeforeTest, userOne } = require('./fixtures/db')


beforeEach(setUpDbBeforeTest)

test('should signup new user', async() => {
    const response = await request(app).post('/user').send({
        userName:"bichik",
        email:"saschak@example.com",
        passwd: "bichik1234567"
}).expect(200)
    expect(response.body.userName).toBe('bichik')
})

test('should authenticate user', async() => {
    await request(app).get('/user/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
