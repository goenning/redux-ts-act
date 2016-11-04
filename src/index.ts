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
  started: BasicActionCreator<P>;
  done: SuccessAsyncActionCreator<P, S>;
  failed: FailureAsyncActionCreator<P, F>;
  finished: BasicActionCreator<P>;
}

export interface ActionCreatorFactory {
  <T>(type: string): BasicActionCreator<T>;
  async<P, S, F>(type: string): AsyncActionCreatorFactory<P, S, F>;
}

export interface ActionCreator {
  type: string;
}

export interface BasicActionCreator<T> {
  type: string;
  error(): BasicActionCreator<T>;
  (payload?: T): Action<T>;
}

export interface SuccessAsyncActionCreator<P, S> extends ActionCreator {
  type: string;
  (result?: S, params?: P): Action<Success<P, S>>;
}

export interface FailureAsyncActionCreator<P, F> extends ActionCreator {
  type: string;
  (error?: F, params?: P): Action<Failure<P, F>>;
}

const successFactory: any = <S, P>(type: string) => {
  const creator: any = (result?: S, params?: P): Action<Success<P, S>> => {
    return { type, payload: { result, params }, error: false };
  };
  creator.type = type;
  return creator;
};

const failureFactory: any = <F, P>(type: string) => {
  const creator: any = (error?: F, params?: P): Action<Failure<P, F>> => {
    return { type, payload: { error, params }, error: true };
  };
  creator.type = type;
  return creator;
};

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

  const done = successFactory(`${type}_DONE`);
  const failed = failureFactory(`${type}_FAILED`);

  return { started, failed, done, finished };
};

export const action = factory as ActionCreatorFactory;
