import { Dispatch } from 'redux';
import { logout } from '../modules/auth';
import { deleteUser } from '../modules/profile';
import { deleteSideData } from '../modules/sidebar';

export function bannedUserHandler(dispatch: Dispatch): void {
  localStorage.removeItem('p_auth');
  dispatch(logout());
  dispatch(deleteUser());
  dispatch(deleteSideData());
  alert('접근 권한이 유효하지 않습니다. 다시 로그인 해주세요');
  window.location.href = '/';
}

export function tokenErrorHandler(dispatch: Dispatch): void {
  localStorage.removeItem('p_auth');
  dispatch(logout());
  dispatch(deleteUser());
  dispatch(deleteSideData());
  alert('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요');
  window.location.href = '/';
}
