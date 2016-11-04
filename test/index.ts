import { expect } from 'chai';
import { action } from '../src/';

describe('action', () => {
  it('should create typeless action', () => {
    const increment = action('INCREMENT');
    const act = increment();
    expect(increment.type).to.eq('INCREMENT');
    expect(act).to.deep.eq({
      type: 'INCREMENT',
      payload: undefined,
      error: false
    });
  });

  it('should create typeless errored action', () => {
    const increment = action('INCREMENT').error();
    const act = increment();
    expect(increment.type).to.eq('INCREMENT_FAILED');
    expect(act).to.deep.eq({
      type: 'INCREMENT',
      payload: undefined,
      error: true
    });
  });

  it('should create typed action', () => {
    const increment = action<number>('INCREMENT');
    expect(increment.type).to.eq('INCREMENT');
    const act = increment(2);
    expect(act).to.deep.eq({
      type: 'INCREMENT',
      payload: 2,
      error: false
    });
  });

  it('should create typed errored action', () => {
    const increment = action<number>('INCREMENT').error();
    expect(increment.type).to.eq('INCREMENT_FAILED');
    const act = increment(2);
    expect(act).to.deep.eq({
      type: 'INCREMENT',
      payload: 2,
      error: true
    });
  });
});
