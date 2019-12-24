const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const { expect } = chai

const server = require('../../../server/app')
const { User } = require('../../../server/models/user')

chai.use(chaiHttp)

let token

describe('Users route', () => {
    const USER_PATH = '/api/v1/users'
    const SIGNUP = '/signup'

    const ADMIN = '/admin'
    const ADMIN_DIRECTABLE = '/admin-directable'
    const ADMIN_PARAM_MODIFICABLE = '/admin-params-modificable'

    const SIGNIN_SQL_INJECTABLE = '/signin-sql-injectable'
    const SIGNIN = '/signin'
    const preSave = { username: 'hoango7604', password: faker.internet.password() }

    before(done => {
        chai.request(server)
            .post(`${USER_PATH}${SIGNUP}`)
            .send(preSave)
            .end((_, res) => {
                token = res.body.token
                done()
            })
    })

    after(async () => {
        await User.query().truncate()
    })

    describe(`test route ${USER_PATH}${ADMIN_DIRECTABLE}`, () => {
        it('should return status 401 if being directly accessed', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN_DIRECTABLE}`)
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 401 if parameters are modified', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN_DIRECTABLE}`)
                .query({ authenticated: 'yes' })
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 200 if token are provided', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN_DIRECTABLE}`)
                .set('Authorization', token)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done()
                })
        })
    })

    describe(`test route ${USER_PATH}${ADMIN_PARAM_MODIFICABLE}`, () => {
        it('should return status 401 if being directly accessed', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN_PARAM_MODIFICABLE}`)
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 401 if parameters are modified', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN_PARAM_MODIFICABLE}`)
                .query({ authenticated: 'yes' })
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 200 if token are provided', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN_PARAM_MODIFICABLE}`)
                .set('Authorization', token)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done()
                })
        })
    })

    describe(`test route ${USER_PATH}${ADMIN}`, () => {
        it('should return status 401 if being directly accessed', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN}`)
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 401 if parameters are modified', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN}`)
                .query({ authenticated: 'yes' })
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 200 if token are provided', done => {
            chai.request(server)
                .get(`${USER_PATH}${ADMIN}`)
                .set('Authorization', token)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done()
                })
        })
    })

    describe(`test route ${USER_PATH}${SIGNIN_SQL_INJECTABLE}`, () => {
        it('should return status 401 if being SQL injected', done => {
            chai.request(server)
                .post(`${USER_PATH}${SIGNIN_SQL_INJECTABLE}`)
                .send({
                    username: preSave.username,
                    password: `' OR '1' = '1`
                })
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 200 if valid username and password are provided', done => {
            chai.request(server)
                .post(`${USER_PATH}${SIGNIN_SQL_INJECTABLE}`)
                .send(preSave)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done()
                })
        })
    })

    describe(`test route ${USER_PATH}${SIGNIN}`, () => {
        it('should return status 401 if being SQL injected', done => {
            chai.request(server)
                .post(`${USER_PATH}${SIGNIN}`)
                .send({
                    username: preSave.username,
                    password: `' OR '1' = '1`
                })
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    done()
                })
        })

        it('should return status 200 if valid username and password are provided', done => {
            chai.request(server)
                .post(`${USER_PATH}${SIGNIN}`)
                .send(preSave)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    done()
                })
        })
    })
})