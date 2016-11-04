import { expect } from 'chai';
import { action } from '../src/';

describe('action.async', () => {
  it('should create async typeless started action', () => {
    const login = action.async('LOGIN');
    expect(login.started.type).to.eq('LOGIN_STARTED');

    expect(login.started()).to.deep.eq({
      type: 'LOGIN_STARTED',
      payload: undefined,
      error: false
    });

    expect(login.started({user: 'admin', password: '123'})).to.deep.eq({
      type: 'LOGIN_STARTED',
      payload: {
        user: 'admin',
        password: '123'
      },
      error: false
    });
  });

  it('should create async typeless done action', () => {
    const login = action.async('LOGIN');
    expect(login.done.type).to.eq('LOGIN_DONE');

    expect(login.done()).to.deep.eq({
      type: 'LOGIN_DONE',
      payload: undefined,
      error: false
    });

    const payload = {
      result: { token: 'H@KJASN*$#*&*SBNN' },
      params: { user: 'admin', password: '123'}
    };

    expect(login.done(payload)).to.deep.eq({
      type: 'LOGIN_DONE',
      payload: {
        params: {
          user: 'admin',
          password: '123'
        },
        result: {
          token: 'H@KJASN*$#*&*SBNN'
        }
      },
      error: false
    });
  });

  it('should create async typeless failed action', () => {
    const login = action.async('LOGIN');
    expect(login.failed.type).to.eq('LOGIN_FAILED');

    expect(login.failed()).to.deep.eq({
      type: 'LOGIN_FAILED',
      payload: undefined,
      error: true
    });

    const payload = {
      error: new Error('something went wrong.'),
      params: { user: 'admin', password: '123'}
    };

    expect(login.failed(payload)).to.deep.eq({
      type: 'LOGIN_FAILED',
      payload: {
        params: {
          user: 'admin',
          password: '123'
        },
        error: new Error('something went wrong.')
      },
      error: true
    });
  });
});
