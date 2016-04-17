"use strict";

const middleware = require('../lib/middleware.js');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const normalizr = require('normalizr');
const Schema = normalizr.Schema;
const arrayOf = normalizr.arrayOf;

const testEntitySchema = new Schema('testEntities', {
    idAttribute: 'id'
});

describe('Middleware', () => {

    it('should call next in chain with normalized data', () => {
        const spy = sinon.spy();

        middleware.default()(spy)({
            payload               : {
                id : 'test-id',
                foo: 'bar'
            },
            [middleware.NORMALIZE]: {
                schema: testEntitySchema
            }
        });
        expect(spy).to.have.been.calledOnce;
        expect(spy).calledWith({
            payload: {
                entities: {
                    testEntities: {
                        'test-id': {
                            id : 'test-id',
                            foo: 'bar'
                        }
                    }
                },
                result: "test-id"
            }
        });
    });

    it('should call next in chain with normalized array data', () => {
        const spy = sinon.spy();

        middleware.default()(spy)({
            payload               : [{
                id : 'test-id',
                foo: 'bar'
            }, {
                id : 'test-id-2',
                bar: 'foo'
            }],
            [middleware.NORMALIZE]: {
                schema: arrayOf(testEntitySchema)
            }
        });
        expect(spy).to.have.been.calledOnce;
        expect(spy).calledWith({
            payload: {
                entities: {
                    testEntities: {
                        'test-id': {
                            id : 'test-id',
                            foo: 'bar'
                        },
                        'test-id-2': {
                            id : 'test-id-2',
                            bar: 'foo'
                        }
                    }
                },
                result: ["test-id", "test-id-2"]
            }
        });

    });

    it('should call next in chain with unchanged action', () => {
        const spy = sinon.spy();
        const SYMBOL = Symbol('SYMBOL');
        middleware.default()(spy)({
            data                  : {
                id : 'test-id',
                foo: 'bar'
            },
            [SYMBOL]              : 'bar',
            [middleware.NORMALIZE]: {
                schema: testEntitySchema
            }
        });
        expect(spy).to.have.been.calledOnce;
        expect(spy).calledWith({
            data    : {
                id : 'test-id',
                foo: 'bar'
            },
            [SYMBOL]: 'bar'
        });

        // Check that symbols are passed properly, is not checked with calledWith
        expect(spy).calledWithMatch(action => {
            return !action[middleware.NORMALIZE] && action[SYMBOL]
        });
    });

});