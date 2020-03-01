var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);


const uname = process.env.TEST_USERNAME;
const pass = process.env.TEST_PASSWORD;
const mail = process.env.TEST_EMAIL;
const ROUTE = '/user/change-email';
var token;

describe('Test Change Email', () => {

    before((done) => {
        var info = {
            username: uname,
            password: pass,
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
                        token = res.header.token
                        console.log(token)
                        done()
                    })
            })
    })

    after((done) => {
        User.deleteOne({ username: uname }).then(() => {
            console.log("Test " + ROUTE + " completed.");
            done();
        })
    })

    describe('Change email without email', () => {
        it('Should return 400', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send()
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })

    })

    describe('Change email with invalid email', () => {
        it('Should return 400', (done) => {
            var info = {
                email: 'invalid email'
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        });
    })

    describe('Change email with invalid auth', () => {
        it('Should return 401', (done) => {
            var info = {
                email: mail
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', 'bad auth')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        });
    })

    describe('Change email with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                email: mail
            }
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.body.should.have.property('message','User email successfully updated');
                    res.should.have.status(200)
                    done()
                })
        })
    })

})