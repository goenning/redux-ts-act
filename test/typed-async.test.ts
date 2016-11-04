import { expect } from 'chai';
import { action } from '../src/';

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

describe('action.async<T>', () => {
  it('should create async typed started action', () => {
    const searchBooks = action.async<SearchBooksRequest, SearchBooksResponse, Error>('SEARCH_BOOKS');
    expect(searchBooks.started.type).to.eq('SEARCH_BOOKS_STARTED');

    expect(searchBooks.started()).to.deep.eq({
      type: 'SEARCH_BOOKS_STARTED',
      payload: undefined,
      error: false
    });

    expect(searchBooks.started({ query: 'harry potter' })).to.deep.eq({
      type: 'SEARCH_BOOKS_STARTED',
      payload: {
        query: 'harry potter'
      },
      error: false
    });
  });

  it('should create async typed done action', () => {
    const searchBooks = action.async<SearchBooksRequest, SearchBooksResponse, Error>('SEARCH_BOOKS');
    expect(searchBooks.done.type).to.eq('SEARCH_BOOKS_DONE');

    const books: Book[] = [
      { title: 'Harry Potter and the Philosopher\'s Stone', pages: 345 },
      { title: 'Harry Potter and the Chamber of Secrets', pages: 562 }
    ];

    expect(searchBooks.done()).to.deep.eq({
      type: 'SEARCH_BOOKS_DONE',
      payload: {
        params: undefined,
        result: undefined
      },
      error: false
    });

    expect(searchBooks.done({ books }, { query: 'harry potter' })).to.deep.eq({
      type: 'SEARCH_BOOKS_DONE',
      payload: {
        params: {
          query: 'harry potter'
        },
        result: {
          books
        }
      },
      error: false
    });
  });

  it('should create async typed failed action', () => {
    const searchBooks = action.async<SearchBooksRequest, SearchBooksResponse, Error>('SEARCH_BOOKS');
    expect(searchBooks.failed.type).to.eq('SEARCH_BOOKS_FAILED');

    expect(searchBooks.failed()).to.deep.eq({
      type: 'SEARCH_BOOKS_FAILED',
      payload: {
        params: undefined,
        error: undefined
      },
      error: true
    });

    expect(searchBooks.failed(new Error('database is corrupted.'), { query: 'harry potter' })).to.deep.eq({
      type: 'SEARCH_BOOKS_FAILED',
      payload: {
        params: {
          query: 'harry potter'
        },
        error: new Error('database is corrupted.')
      },
      error: true
    });
  });

  it('should create async typed finished action', () => {
    const searchBooks = action.async<SearchBooksRequest, SearchBooksResponse, Error>('SEARCH_BOOKS');
    expect(searchBooks.finished.type).to.eq('SEARCH_BOOKS_FINISHED');

    expect(searchBooks.finished()).to.deep.eq({
      type: 'SEARCH_BOOKS_FINISHED',
      payload: undefined,
      error: false
    });

    expect(searchBooks.finished({ query: 'harry potter' })).to.deep.eq({
      type: 'SEARCH_BOOKS_FINISHED',
      payload: {
        query: 'harry potter'
      },
      error: false
    });
  });
});
