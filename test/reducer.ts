import { expect } from 'chai';
import { action, Action, createReducer, of } from '../src/';

const increment = action<number>('INCREMENT');
const decrement = action<number>('DECREMENT');

interface CounterState {
  counter: number;
  operations: number;
}

const handleIncrement = (state: CounterState, action: Action<number>): CounterState => {
  return {
    counter: state.counter + action.payload!,
    operations: state.operations + 1
  };
};

const handleDecrement = (state: CounterState, action: Action<number>): CounterState => {
  return {
    counter: state.counter - action.payload!,
    operations: state.operations + 1
  };
};

const reducer = createReducer(
  { counter: 0, operations: 0 },
  of(increment, handleIncrement),
  of(decrement, handleDecrement)
);

describe('reducer', () => {
  const noop = { type: 'NOOP' };
  const inc1 = increment(1);
  const dec2 = decrement(2);

  it('should initialize empty', () => {
    const newState = reducer(undefined!, noop);
    expect(newState).to.deep.eq({ counter: 0, operations: 0 });
  });

  it('should increment one', () => {
    const newState = reducer(undefined!, inc1);
    expect(newState).to.deep.eq({ counter: 1, operations: 1 });
  });

  it('should increment one + decrement two', () => {
    const firstState = reducer(undefined!, inc1);
    const secondState = reducer(firstState!, dec2);
    expect(secondState).to.deep.eq({ counter: -1, operations: 2 });
  });

  it('initializer can also be a function', () => {
    const otherReducer = createReducer(
      () => { return { counter: 100, operations: 0 } },
      of(increment, handleIncrement),
      of(decrement, handleDecrement)
    );
    const newState = otherReducer(undefined!, noop);
    expect(newState).to.deep.eq({ counter: 100, operations: 0 });
  });
});
