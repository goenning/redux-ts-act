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

export interface AsyncActionCreator<P, S, F> {
  started: (params?: P) => Action<P>;
  done: (result?: S, params?: P) => Action<Success<P, S>>;
  failed: (error?: F, params?: P) => Action<Failure<P, F>>;
  finished: (params?: P) => Action<P>;
}

export interface ActionCreator {
  <T>(type: string): (payload?: T) => T;
  async<P, S, F>(type: string): AsyncActionCreator<P, S, F>;
}

const creator: any = <T>(type: string) => {
  return (payload: T): Action<T> => {
    return {
      type,
      payload,
      error: false
    };
  };
};

creator.async = <P, S, F>(type: string): AsyncActionCreator<P, S, F> => {
  const started = (params?: P): Action<P> => {
    return {
      type: `${type}_STARTED`,
      payload: params,
      error: false
    };
  };

  // const started = action<P>(`${type}_STARTED`);

  const done = (result?: S, params?: P): Action<Success<P, S>> => {
    return {
      type: `${type}_DONE`,
      payload: {
        result,
        params
      },
      error: false
    };
  };

  const failed = (error?: F, params?: P): Action<Failure<P, F>> => {
    return {
      type: `${type}_FAILED`,
      payload: {
        params,
        error
      },
      error: true
    };
  };

  const finished = (params?: P): Action<P> => {
    return {
      type: `${type}_FINISHED`,
      payload: params,
      error: false
    };
  };

  return { started, failed, done, finished };
};

export const action = creator as ActionCreator;
