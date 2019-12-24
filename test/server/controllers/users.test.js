const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSpies = require('chai-spies')
const faker = require('faker')
const { expect } = chai

const UserController = require('../../../server/controllers/users')

chai.use(chaiHttp)
chai.use(chaiSpies)

describe('Users controller', () => {
    let req = {
        user: { id: faker.random.number() },
        value: {
            body: {
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        }
    }

    let res = {
        json: function() {
            return this
        },

        status: function() {
            return this
        }
    }

    describe('signIn', () => {
        it('should return token when signIn called', () => {
            chai.spy.on(res, 'status', function(statusCode) {
                expect(statusCode).to.equal(200)
                return this
            })
            chai.spy.on(res, 'json', function(resBody) {
                expect(resBody).to.be.an('object')
                expect(resBody).to.have.property('token')
                return this
            })

            UserController.signIn(req, res)
            expect(res.status).is.spy
            expect(res.status).is.called.once
            expect(res.json).is.spy
            expect(res.json).is.called
        })
    })
})