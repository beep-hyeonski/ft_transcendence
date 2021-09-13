import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
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
import CheckToken from './CheckToken';
import { RootState } from './modules';

function App(): JSX.Element {
  document.body.style.backgroundColor = '#F4F3FF';
  const isLoggedIn = useSelector((state: RootState) => state.loginModule.isLoggedIn);

  if (location.pathname !== '/auth' && location.pathname !== '/signup'
    && location.pathname !== '/twofa' && location.pathname !== '/notfound'
    && isLoggedIn) {
    CheckToken();
  }

  return (
    <Switch>
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/twofa" component={EmailVerifyPage} />
      <Route exact path="/notfound" component={NotFoundPage} />
      <Route exact path="/auth" component={AuthControl} />
      <Route path="/">
        { localStorage.getItem('p_auth') && localStorage.getItem('p_auth') !== 'undefined'
          ? (
            <>
              <Route path="/" component={SideMenu} />
              <Route path="/" exact component={MainUI} />
              <Route path="/chat" exact component={ChatUI} />
              <Route path="/profile/:id" exact component={ProfileUI} />
              <Route path="/setting" exact component={Setting} />
            </>
          )
          : <LoginPage /> }
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default withRouter(App);
