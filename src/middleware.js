import {arrayOf as a, Schema as S, normalize} from 'normalizr';
import {camelizeKeys} from 'humps';

export const arrayOf = a;
export const Schema = S;
export const NORMALIZE = Symbol('NORMALIZE');
export default store => next => action => {
    const {[NORMALIZE]: options, ...tail} = action;

    // copy symbols that aren't copied with rest operator
    const symbols = Object.getOwnPropertySymbols(action)
        .filter(symbol => symbol !== NORMALIZE);
    symbols.forEach(symbol => tail[symbol] = action[symbol]);

    if (typeof options !== 'object' || options === null) {
        return next(tail);
    }

    let {
        schema,
        attribute = 'payload'
    } = options;

    if (typeof attribute !== 'string') {
        throw new Error('[NORMALIZE].attribute must be a string');
    }
    if (!schema) {
        throw new Error('[NORMALIZE].schema must be a normalizr schema');
    }

    if (!tail[attribute]) {
        return next(tail);
    }
    const camelizedJson = camelizeKeys(tail[attribute]);
    tail[attribute] = normalize(camelizedJson, schema);
    return next(tail);
};
