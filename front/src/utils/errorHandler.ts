import { useHistory } from "react-router-dom";

export function BannedUserHandler() {
	const history = useHistory();
	alert('접근 권한이 유효하지 않습니다');
	history.push("/");
}
