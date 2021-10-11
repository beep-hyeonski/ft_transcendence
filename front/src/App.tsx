import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import ProfileUI from './components/ProfileUI';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MainUI from './components/MainUI';
import EmailVerifyPage from './components/EmailVerifyPage';
import ChatUI from './components/ChatUI';
import NotFoundPage from './components/NotFoundPage';
import AuthControl from './components/AuthControl';
import Setting from './components/Setting';
import SideMenu from './components/SideMenu';
import { RootState } from './modules';
import checkToken from './utils/checkToken';
import GameManager from './components/GameManager';
import PongGame from './components/PongGame';
import GameSpeedDialog from './components/GameSpeedDialog';
import Admin from './components/Admin';
import DMRoom from './components/DMRoom';

function App(): JSX.Element {
  document.body.style.backgroundColor = '#F4F3FF';
  const authState = useSelector((state: RootState) => state.authModule);
  const userState = useSelector((state: RootState) => state.userModule);
  const { socket } = useSelector((state: RootState) => state.socketModule);
  const dispatch = useDispatch();

  useEffect(() => {
    checkToken(dispatch);
  }, [dispatch]);

  return (
    <Switch>
      {!authState.isLoginChecked && (
        <Route path="/" render={() => <div>loading...</div>} />
      )}
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/twofa" component={EmailVerifyPage} />
      <Route exact path="/notfound" component={NotFoundPage} />
      <Route exact path="/auth" component={AuthControl} />
      <Route path="/">
        {authState.isLoggedIn ? (
          <>
            <Route path="/" component={SideMenu} />
            <Route path="/" exact component={MainUI} />
            <Route path="/chat" exact component={ChatUI} />
            <Route path="/profile" exact>
              <Redirect to={`/profile/${userState.nickname}`} />
            </Route>
            <Route path="/profile/:id" exact component={ProfileUI} />
            <Route path="/setting" exact component={Setting} />
            <Route path="/game" exact component={PongGame} />
            <Route path="/admin" exact component={Admin} />
            <Route path="/dm/:nickname" exact component={DMRoom} />
            <GameManager />
            <GameSpeedDialog />
          </>
        ) : (
          <LoginPage />
        )}
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default withRouter(App);
