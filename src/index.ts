export { createReducer, on } from './reducer';

export interface Action<T> {
  type: string;
  payload?: T;
  error: boolean;
}

export interface AsyncActionCreatorFactory<P, S, F> {
  started: ActionCreator<P>;
  done: ActionCreator<S>;
  failed: ActionCreator<F>;
}

export interface ActionCreatorFactory {
  <T>(type: string): ActionCreator<T>;
  async<P, S, F>(type: string): AsyncActionCreatorFactory<P, S, F>;
}

export interface ActionCreator<T> {
  type: string;
  failed(): ActionCreator<T>;
  (payload?: T): Action<T>;
}

const factory: any = <T>(type: string, error: boolean = false) => {
  const creator: any = (payload: T): Action<T> => {
    return { type, payload, error };
  };
  creator.type = type;
  return creator;
};

factory.async = <P, S, F>(type: string): AsyncActionCreatorFactory<P, S, F> => {
  const started = factory(`${type}_STARTED`);
  const done = factory(`${type}_DONE`);
  const failed = factory(`${type}_FAILED`, true);

  return { started, failed, done };
};

export const action = factory as ActionCreatorFactory;
