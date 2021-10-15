import { Dispatch } from 'redux';
import { logoutSequence } from './logoutSequence';

export function bannedUserHandler(dispatch: Dispatch): void {
  logoutSequence(dispatch);
  alert('접근 권한이 유효하지 않습니다. 다시 로그인 해주세요');
  window.location.href = '/';
}

export function tokenErrorHandler(dispatch: Dispatch): void {
  logoutSequence(dispatch);
  alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
  window.location.href = '/';
}
