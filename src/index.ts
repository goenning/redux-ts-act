export { createReducer, on } from './reducer';

export interface Action<T> {
  type: string;
  payload?: T;
  error: boolean;
}

export interface Success<P, S> {
  params?: P;
  result?: S;
}

export interface Failure<P, F> {
  params?: P;
  error?: F;
}

export interface AsyncActionCreatorFactory<P, S, F> {
  started: ActionCreator<P>;
  done: ActionCreator<Success<P, S>>;
  failed: ActionCreator<Failure<P, F>>;
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

const factory: any = <T>(type: string) => {
  const creator: any = (payload: T): Action<T> => {
    return { type, payload, error: false };
  };
  creator.type = type;
  creator.failed = () => {
    const failed: any =  (payload: T): Action<T> => {
      return { type: `${type}_FAILED`, payload, error: true };
    };
    failed.type = `${type}_FAILED`;
    return failed;
  };

  return creator;
};

factory.async = <P, S, F>(type: string): AsyncActionCreatorFactory<P, S, F> => {
  const started = factory(`${type}_STARTED`);

  const done = factory(`${type}_DONE`);
  const failed = factory(type).failed();

  return { started, failed, done };
};

export const action = factory as ActionCreatorFactory;
