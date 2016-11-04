import { ActionCreator } from './';
import { Reducer, Action } from 'redux';

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

  return (state: S, action: Action): S => {
    if (!state) {
      state = (initializer instanceof Function) ? initializer() : initializer;
    }

    if (map.hasOwnProperty(action.type)) {
      return map[action.type](state, action);
    }

    return state;
  };
};

export function of<S, T>(creator: ActionCreator<T>, reducer: Reducer<S>): ReducerBinder<S> {
  return {
    type: creator.type,
    reducer
  };
};
