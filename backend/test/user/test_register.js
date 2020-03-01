var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);

const uname = process.env.TEST_USERNAME + '-' + process.version;
const pword = process.env.TEST_PASSWORD;
const mail = process.env.TEST_EMAIL;

console.log(uname)

const secondary_uname = 'unit-test-2';

const ROUTE = '/user/register'

describe('Test Register', () => {

    after((done) => {
        User.deleteMany({ username: { $in: [uname, secondary_uname] }}).then(() => {
            console.log("Test " + ROUTE + " completed.");
            done();
        });
    })

    describe('Register without password', () => {
        let req = {
            username: uname,
            password: "",
            email: mail
        }
        it('Should return 400', (done) => {
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

    describe('Register without username', () => {
        let req = {
            username: "",
            password: pword,
            email: mail
        }
        it('Should return 400', (done) => {
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

    describe('Register without email', () => {
        let req = {
            username: uname,
            password: pword,
            email: ""
        }
        it('Should return 400', (done) => {
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

    describe('Register with invalid email', () => {
        let req = {
            username: uname,
            password: pword,
            email: "invalid email"
        }
        it('Should return 400', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Invalid email');
                    done();
                });
        })
    })

describe('Register with short username', () => {
        let req = {
            username: "short",
            password: pword,
            email: mail
        }
        it('Should return 400', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Username must be at least 6 character long');
                    done();
                });
        })
    })

describe('Register with short password', () => {
        let req = {
            username: uname,
            password: "short",
            email: mail
        }
        it('Should return 400', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'Password must be at least 8 character long');
                    done();
                });
        })
    })

    describe('Register with correct info', () => {
        var req = {
            username: uname,
            password: pword,
            email: mail
        }
        it('Should return 200', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('_id')
                    res.body.should.have.property('username')
                    res.body.should.have.property('email')
                    done();
                });
        })
    })

    describe('Register duplicate username', () => {
        let req = {
            username: uname,
            password: pword,
            email: "abc@123.com"
        }
        it('Should return 400', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'User already exists');
                    done();
                });
        })
    })

describe('Register duplicate email', () => {
        let req = {
            username: secondary_uname,
            password: pword,
            email: mail
        }
        it('Should return 400', (done) => {
            chai.request(server)
                .post(ROUTE)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(req)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message', 'User already exists');
                    done();
                });
        })
    })
})