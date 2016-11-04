import { expect } from 'chai';
import { action, createReducer, on, Success, Failure } from '../src/';

interface SearchBooksRequest {
  query: string;
}

interface Book {
  title: string;
  pages: number;
}

interface SearchBooksResponse {
  books: Book[];
}

const search = action.async<SearchBooksRequest, SearchBooksResponse, Error>('SEARCH_BOOKS');

interface State {
  books: Book[];
}

const handleSearchDone = (state: State, payload: Success<SearchBooksRequest, SearchBooksResponse>): State => {
  return {
    books: payload!.result!.books
  };
};

const handleSearchFailed = (state: State, payload: Failure<SearchBooksRequest, Error>): State => {
  return {
    books: [ ]
  };
};

const reducer = createReducer<State>(
  { books: [] },
  on(search.done, handleSearchDone),
  on(search.failed, handleSearchFailed)
);

describe('reducer async', () => {
  const noop = { type: 'NOOP' };
  const books: Book[] = [
    { title: 'Harry Potter and the Philosopher\'s Stone', pages: 345 },
    { title: 'Harry Potter and the Chamber of Secrets', pages: 562 }
  ];

  it('should initialize empty', () => {
    const newState = reducer(undefined!, noop);
    expect(newState).to.deep.eq({ books: [] });
  });

  it('should do nothing with started handler', () => {
    const newState = reducer(undefined!, search.started({ query: 'harry potter' }));
    expect(newState).to.deep.eq({ books: [] });
  });

  it('should do nothing with finished handler', () => {
    const newState = reducer(undefined!, search.finished({ query: 'harry potter' }));
    expect(newState).to.deep.eq({ books: [] });
  });

  it('should assign books from returned list', () => {
    const payload = {
      params: { query: 'harry potter' },
      result: { books }
    };

    const newState = reducer(undefined!, search.done(payload));
    expect(newState).to.deep.eq({ books });
  });

  it('should clear books after failure list', () => {

    const payload = {
      params: { query: 'harry potter' },
      error: new Error('Failure!')
    };

    const newState = reducer({ books }, search.failed(payload));
    expect(newState).to.deep.eq({ books: [] });
  });
});
