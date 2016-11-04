import { expect } from 'chai';
import { action, createReducer, on } from '../src/';

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

const handleSearchDone = (state: State, payload: SearchBooksResponse): State => {
  return {
    books: payload.books
  };
};

const handleSearchFailed = (state: State, payload: Error): State => {
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

  it('should assign books from returned list', () => {
    const newState = reducer(undefined!, search.done({ books }));
    expect(newState).to.deep.eq({ books });
  });

  it('should clear books after failure list', () => {
    const newState = reducer({ books }, search.failed(new Error('Failure!')));
    expect(newState).to.deep.eq({ books: [] });
  });
});
