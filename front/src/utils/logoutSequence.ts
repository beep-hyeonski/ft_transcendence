import { Dispatch } from 'redux';
import { logout } from '../modules/auth';
import { deleteUser } from '../modules/profile';
import { deleteSideData } from '../modules/sidebar';
import { deleteSocket } from '../modules/socket';

export function logoutSequence(dispatch: Dispatch): void {
    localStorage.removeItem('p_auth');
    dispatch(deleteSocket());
    dispatch(logout());
    dispatch(deleteUser());
    dispatch(deleteSideData());
}