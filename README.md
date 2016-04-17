Install
=======
`npm install --save redux-normalize-middleware`

Usage
=====
Creating actions
```javascript
import {NORMALIZE} from 'redux-normalize-middleware';
import {Schema, arrayOf} from 'normalizr';

// See normalizr lib for documentation
const SOME_ENTITY_SCHEMA = new Schema('someEntities', {
    idAttribute: 'id'
})
const SOME_ENTITIES_SCHEMA = arrayOf(SOME_ENTITY_SCHEMA);

export const SOME_ENTITIES = 'SOME_ENTITIES';
export function fetchSomeEntities() {
    return {
        type   : SOME_ENTITIES,
        // simple mode - just a promise needed
        payload: [{id: 1, foo: 'bar'}],
        [NORMALIZE]: {
            schema: SOME_ENTITIES_SCHEMA,
            attribute: 'payload'
        }

    };
}

export const SOME_ENTITY = 'SOME_ENTITY';
export function fetchSomeEntity(id) {
    return {
        type   : SOME_ENTITY,
        // specify options
        payload: {id: 1, foo: 'bar'},
        [NORMALIZE]: {
            schema: SOME_ENTITY_SCHEMA,
            attribute: 'payload'
        }
    };
}
```
Apply middleware to store
```javascript
import {middleware} from 'redux-normalize-middleware';
import {createStore, applyMiddleware} from 'redux';

const initialState = {};
const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(middleware)
);
```

API
===
## middleware
#### NORMALIZE
Type: `Symbol`

A constant which is used as an attribute of dispatched actions to signal middleware.

## middleware action
```
action[NORMALIZE]: options
```

#### schema (Required)
Type: `Schema`

The schema to apply with normalizr.

#### attribute
Type: `string`  
Default: `'payload'`

The attribute of the action holding the data to be normalized. The data will be normalized in place.

LICENSE
=======
MIT © [Arosii A/S](http://www.arosii.com/)
