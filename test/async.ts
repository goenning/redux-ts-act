import { expect } from 'chai';
import { action } from '../src/';

describe('action.async', () => {
  it('should create async typeless started action', () => {
    const login = action.async('LOGIN');

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

    expect(login.done()).to.deep.eq({
      type: 'LOGIN_DONE',
      payload: {
        params: undefined,
        result: undefined
      },
      error: false
    });

    const act = login.done({ token: 'H@KJASN*$#*&*SBNN' }, { user: 'admin', password: '123'});

    expect(act).to.deep.eq({
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

    expect(login.failed()).to.deep.eq({
      type: 'LOGIN_FAILED',
      payload: {
        params: undefined,
        error: undefined
      },
      error: true
    });

    const act = login.failed(new Error('something went wrong.'), { user: 'admin', password: '123'});

    expect(act).to.deep.eq({
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

  it('should create async typeless finished action', () => {
    const login = action.async('LOGIN');

    expect(login.finished()).to.deep.eq({
      type: 'LOGIN_FINISHED',
      payload: undefined,
      error: false
    });

    expect(login.finished({user: 'admin', password: '123'})).to.deep.eq({
      type: 'LOGIN_FINISHED',
      payload: {
        user: 'admin',
        password: '123'
      },
      error: false
    });
  });
});
