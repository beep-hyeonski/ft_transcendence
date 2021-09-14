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

function App(): JSX.Element {
  document.body.style.backgroundColor = '#F4F3FF';
  const { isLoginChecked } = useSelector(
    (state: RootState) => state.authModule,
  );
  const userState = useSelector((state: RootState) => state.userModule);
  const dispatch = useDispatch();

  useEffect(() => {
    checkToken(dispatch).then(() => {});
  }, [userState.isLoggedIn, dispatch]);

  return (
    <Switch>
      {!isLoginChecked && (
        <Route path="/" render={() => <div>loading...</div>} />
      )}
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/twofa" component={EmailVerifyPage} />
      <Route exact path="/notfound" component={NotFoundPage} />
      <Route exact path="/auth" component={AuthControl} />
      <Route path="/">
        {userState.isLoggedIn ? (
          <>
            <Route path="/" component={SideMenu} />
            <Route path="/" exact component={MainUI} />
            <Route path="/chat" exact component={ChatUI} />
            <Route path="/profile" exact>
              <Redirect to={`/profile/${userState.nickname}`} />
            </Route>
            <Route path="/profile/:id" exact component={ProfileUI} />
            <Route path="/setting" exact component={Setting} />
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
