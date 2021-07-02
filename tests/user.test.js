const request = require('supertest');
const app = require('../src/app')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "mike",
    email: "pmjoshi2706@gmail.com",
    password: "mike123@!!",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach( async ()=>{
    await User.deleteMany();
    await new User(userOne).save();
})

test('sign up new user', async ()=>{
    const response = await request(app).post('/users').send({
        name: 'prashant',
        email: 'pmjoshi.pj276@gmail.com',
        password: 'MyPass1234!!',
    }).expect(200)
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'prashant',
            email: 'pmjoshi.pj276@gmail.com'
        },
        token: user.tokens[0].token
    })
});

test('login of existing user test', async()=>{
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login non existing user', async ()=>{
    await request(app).post('/user/login').send({
        eamil: userOne.email,
        password:'adjkfajd'
    }).expect(404)
})

test('should get user profile', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get user profile for unauthenticated user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('delete account authenticated user', async()=>{
    await request(app)
    .delete('/user/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('deleter an authenticated user', async()=>{
    await request(app)
    .delete('/user/me')
    .send()
    .expect(401)
})