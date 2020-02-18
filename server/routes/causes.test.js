const request = require('supertest');
const app = require('../app');

test('getting all causes works',async ()=>{
    const response = await request(app).get("/causes");
    expect(response.statusCode).toBe(200);
})
test('getting cause with wrong id format returns corresponding error response',async ()=>{
    const response = await request(app).get("/causes/dsf");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("ID specified is in wrong format");
})
