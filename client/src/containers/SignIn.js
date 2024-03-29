import React from "react";
import { Button, Form,  Input, message } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import {
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGithubSignIn,
  userGoogleSignIn,
  userSignIn,
  userTwitterSignIn
} from "appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";
const BASE_URL=process.env.REACT_APP_API_URL

const FormItem = Form.Item;
class SignIn extends React.Component {

  sendFacebookToken = (userID, accessToken) => {
    axios
      .post(BASE_URL+"users/oauth/facebook", {
        userID,
        accessToken
      }
        , { withCredentials: true })
      .then(localStorage.setItem("User", userID))
      .catch(error => error);
  };
  responseFacebook = response => {
    console.log(response);
    this.sendFacebookToken(response.userID, response.accessToken)
    if (localStorage.getItem("User") !== null) {
      this.props.history.push('/accueil');
    }
  };
  sendGoogleToken = tokenId => {
    axios
      .post(BASE_URL+'users/oauth/google', {
        idToken: tokenId
      }, { withCredentials: true })
      .then(response => {
        // returning the data here allows the caller to get it through another .then(...)
        localStorage.setItem('User', JSON.stringify( response.data.user));
      })
      .catch(error => error);


  };
  responseGoogle = response => {
    console.log(response);
    this.sendGoogleToken(response.tokenId);
    if (localStorage.getItem('User') !== null) {
      this.props.history.push('/accueil');
    }

  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
        this.props.showAuthLoader();
        this.props.userSignIn(values);
      }
    });
  };
  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (localStorage.getItem("User") !== null) {
      this.props.history.push('/accueil');
    }
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { showMessage, loader, alertMessage } = this.props;

    return (
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg">
                <img src="https://via.placeholder.com/272x395" alt='Neature' />
              </div>
              <div className="gx-app-logo-wid">
                <h1><IntlMessages id="app.userAuth.signIn" /></h1>
                <p><IntlMessages id="app.userAuth.bySigning" /></p>
                <p><IntlMessages id="app.userAuth.getAccount" /></p>
              </div>
              <div className="gx-app-logo">
                <img alt="example" src={require("assets/images/logo.png")} />
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">

                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{
                      required: true, type: 'email', message: 'The input is not valid E-mail!',
                    }],
                  })(
                    <Input placeholder="Email" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input type="password" placeholder="Password" />
                  )}
                </FormItem>
                <span
                  className="gx-text-light gx-fs-sm"> Forget password ? <Link to="/custom-views/user-auth/forgot-password"  >Click here</Link></span>
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signIn" />
                  </Button>
                  <span><IntlMessages id="app.userAuth.or" /></span> <Link to="/signup"><IntlMessages
                    id="app.userAuth.signUp" /></Link>
                </FormItem>
                <div className="gx-flex-row gx-justify-content-between">
                  <span>or connect with</span>
                    <GoogleLogin
                      clientId="132856096478-jo705a4g0tu8ungd07r1fhocu1d9ccp3.apps.googleusercontent.com"
                      buttonText="Login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    <FacebookLogin
                      appId="212504969965178"
                      callback={this.responseFacebook} />


                </div>
                <span
                  className="gx-text-light gx-fs-sm"> demo user email: 'demo@example.com' and password: 'demo#123'</span>
              </Form>
            </div>

            {loader ?
              <div className="gx-loader-view">
                <CircularProgress />
              </div> : null}
            {showMessage ?
              message.error(alertMessage.toString()) : null}
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignIn);

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser }
};

export default connect(mapStateToProps, {
  userSignIn,
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGoogleSignIn,
  userGithubSignIn,
  userTwitterSignIn
})(WrappedNormalLoginForm);
