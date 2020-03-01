var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);


const uname = process.env.TEST_USERNAME + '_' + process.version;
const pword = process.env.TEST_PASSWORD;
const mail = process.env.TEST_EMAIL;
const ROUTE = '/user/forgot-password';

describe('Test Forgot Password', () => {

    before((done) => {
        var info = {
            username: uname,
            password: pword,
            email: mail,
        }
        chai.request(server)
            .post('/user/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(info).then(() => {
                chai.request(server)
                    .post('/user/login')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .then((res) => {
                        done();
                    })
            })
    })

    after((done) => {
        User.deleteOne({ username: uname }).then(() => {
            console.log("Test " + ROUTE + " completed.");
            done();
        });
    })

    describe('Forgot password without email', () => {
        it('Should return 400', (done) => {

            var info = {
                email: mail
            }

            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send()
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Reset information is incomplete');
                    done();
                });
        })
    })

    describe('Forgot password with invalid email', () => {
        it('Should return 400', (done) => {
            var info = {
                email: 'invalid email'
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Invalid email');
                    done();
                });
        })
    })

    describe('Forgot password with wrong email', () => {
        it('Should return 400', (done) => {
            var info = {
                email: 'wrongemail@wrongemail.com'
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Email does not exist in our records.');
                    done();
                });
        })
    })

    describe('Forgot password with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                email: mail
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message', "Password has successfully been reset.");
                    done();
                });
        })
    })
})