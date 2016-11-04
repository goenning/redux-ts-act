import { Action, ActionCreator } from './index';
import { Reducer } from 'redux';

export interface ReducerBinder<S, T> {
  type: string;
  handler: Handler<S, T>;
}

export interface StateInitializer<S> {
  (): S;
}

export interface Handler<S, T> {
  (state: S, payload: T): S;
};

export function createReducer<S>(initializer: S | StateInitializer<S>, ...binders: any[]): Reducer<S> {
  const map: { [key: string]: any } = { };
  binders.forEach((binder) => {
    map[binder.type] =  binder.handler;
  });

  return (state: S, action: Action<any>): S => {
    if (!state) {
      state = (initializer instanceof Function) ? initializer() : initializer;
    }

    if (map.hasOwnProperty(action.type)) {
      return map[action.type](state, action.payload);
    }

    return state;
  };
};

export function on<S, T>(creator: ActionCreator<T>, handler: Handler<S, T>): ReducerBinder<S, T> {
  return {
    type: creator.type,
    handler
  };
};
