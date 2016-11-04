import { Action, ActionCreator } from './index';
import { Reducer } from 'redux';

export interface ReducerBinder<S> {
  type: string;
  reducer: Reducer<S>;
}

export interface StateInitializer<S> {
  (): S;
}

export function createReducer<S>(initializer: S | StateInitializer<S>, ...binders: ReducerBinder<S>[]): Reducer<S> {
  const map: { [key: string]: Reducer<S> } = { };
  binders.forEach((binder) => {
    map[binder.type] =  binder.reducer;
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

export function on<S, T>(creator: ActionCreator, reducer: Reducer<S>): ReducerBinder<S> {
  return {
    type: creator.type,
    reducer
  };
};
