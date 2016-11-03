import { expect } from 'chai';
import { action } from '../src/';

describe('action', () => {
  it('should create typeless action', () => {
    const increment = action('INCREMENT');
    const act = increment();
    expect(act).to.deep.eq({
      type: 'INCREMENT',
      payload: undefined,
      error: false
    });
  });

  it('should create typed action', () => {
    const increment = action<number>('INCREMENT');
    const act = increment(2);
    expect(act).to.deep.eq({
      type: 'INCREMENT',
      payload: 2,
      error: false
    });
  });
});
