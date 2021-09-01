import React from 'react';
import './App.css';
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

function App(): JSX.Element {
  document.body.style.backgroundColor = '#F4F3FF';
  return (
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/twofa" component={EmailVerifyPage} />
      <Route exact path="/main" component={MainUI} />
      <Route exact path="/chat" component={ChatUI} />
      <Route exact path="/profile/:id" component={ProfileUI} />
      <Route path="/auth" component={AuthControl} />
      <Route path="/notfound" component={NotFoundPage} />
      <Route path="/setting" component={Setting} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default withRouter(App);
