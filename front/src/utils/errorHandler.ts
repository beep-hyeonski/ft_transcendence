import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../modules/auth";
import { deleteUser } from "../modules/profile";
import { deleteSideData } from "../modules/sidebar";

export function BannedUserHandler() {
	const history = useHistory();
	const dispatch = useDispatch();

	alert('접근 권한이 유효하지 않습니다. 다시 로그인 해주세요');
	localStorage.removeItem('p_auth');
	dispatch(logout());
	dispatch(deleteUser());
	dispatch(deleteSideData());
	history.push("/");
}
