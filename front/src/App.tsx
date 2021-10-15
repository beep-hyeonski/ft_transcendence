import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
  useHistory,
  Redirect,
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
import ServerError from './components/ServerError';

function App(): JSX.Element {
  document.body.style.backgroundColor = '#F4F3FF';
  const authState = useSelector((state: RootState) => state.authModule);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    checkToken(dispatch, history);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch>
      {!authState.isLoginChecked && (
        <Route path="/" render={() => <div>loading...</div>} />
      )}
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/twofa" component={EmailVerifyPage} />
      <Route exact path="/notfound" component={NotFoundPage} />
      <Route exact path="/server_error" component={ServerError} />
      <Route exact path="/auth" component={AuthControl} />
      <Route path="/">
        {authState.isLoggedIn ? (
          <>
            <Route path="/" component={SideMenu} />
            <Route path="/" exact component={MainUI} />
            <Route path="/chat" exact component={ChatUI} />
            <Route path="/profile" exact component={ProfileUI} />
            <Route path="/setting" exact component={Setting} />
            <Route path="/game" exact component={PongGame} />
            <Route path="/admin" exact component={Admin} />
            <Route path="/dm/:username" exact component={DMRoom} />
            <GameManager />
            <GameSpeedDialog />
          </>
        ) : (
          <>
            <Route path="/" exact component={LoginPage} />
            <Route render={() => <Redirect to="/" />} />
          </>
        )}
      </Route>
    </Switch>
  );
}

export default withRouter(App);
