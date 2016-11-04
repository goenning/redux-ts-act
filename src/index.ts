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
  finished: ActionCreator<P>;
}

export interface ActionCreatorFactory {
  <T>(type: string): ActionCreator<T>;
  async<P, S, F>(type: string): AsyncActionCreatorFactory<P, S, F>;
}

export interface ActionCreator<T> {
  type: string;
  error(): ActionCreator<T>;
  (payload?: T): Action<T>;
}

const factory: any = <T>(type: string) => {
  const creator: any = (payload: T): Action<T> => {
    return { type, payload, error: false };
  };
  creator.type = type;
  creator.error = () => {
    const errored: any =  (payload: T): Action<T> => {
      return { type: `${type}_FAILED`, payload, error: true };
    };
    errored.type = `${type}_FAILED`;
    return errored;
  };

  return creator;
};

factory.async = <P, S, F>(type: string): AsyncActionCreatorFactory<P, S, F> => {
  const started = factory(`${type}_STARTED`);
  const finished = factory(`${type}_FINISHED`);

  const done = factory(`${type}_DONE`);
  const failed = factory(type).error();

  return { started, failed, done, finished };
};

export const action = factory as ActionCreatorFactory;
