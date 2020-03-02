var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);

const uname = process.env.TEST_USERNAME + '-' + process.version;
const pword = process.env.TEST_PASSWORD;
const mail = process.version + '-' + process.env.TEST_EMAIL;
const ROUTE = '/user/login';

describe('Test Login', () => {

    before((done) => {
        let req = {
            username: uname,
            password: pword,
            email: mail,
        }
        chai.request(server)
            .post('/user/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(req)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    })

    after((done) => {
        User.deleteOne({ username: uname }).then(() => {
            console.log("Test " + ROUTE + " completed.");
            done();
        });
    })

    describe('Login without password', () => {
        it('Should return 400', (done) => {
            let req = {
                username: uname,
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'User data is incomplete');
                    done();
                });
        })
    })

    describe('Login without username', () => {
        it('Should return 400', (done) => {
            let req = {
                password: pword,
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'User data is incomplete');
                    done();
                });
        })
    })

    describe('Login with username that doesnt exist', () => {
        it('Should return 400', (done) => {
            let req = {
                username: 'Nonexistant user',
                password: pword
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Error: User does not exist, register before logging in');
                    done();
                });
        })
    })

    describe('Login with incorrect password', () => {
        it('Should return 400', (done) => {
            let req = {
                username: uname,
                password: 'Incorrect password'
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Error: Password is incorrect');
                    done();
                });
        })
    })

    describe('Login with correct info', () => {
        it('Should return 200', (done) => {
            let req = {
                username: uname,
                password: pword
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.header.should.have.property('token');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('email');
                    done();
                })
        })
    })
});