import React, {Component} from "react";
import {connect} from "react-redux";

import {Button, Form, Icon, Input,message} from "antd";
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

const FormItem = Form.Item;

class SignIn extends Component {


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
    if (this.props.authUser !== null) {
      this.props.history.push('/');
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {showMessage, loader, alertMessage} = this.props;


    return (
      <div className="gx-login-container">
        <div className="gx-login-content">
          <div className="gx-login-header gx-text-center">
            <h1 className="gx-login-title">Sign In</h1>
          </div>
          <Form onSubmit={this.handleSubmit} className="gx-login-form gx-form-row0">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{required: true, message: 'Please input your email!'}],
              })(
                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                       placeholder="Email"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{required: true, message: 'Please input your Password!'}],
              })(
                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                       type="password"
                       placeholder="Password"/>
              )}
            </FormItem>
          
            <FormItem className="gx-text-center">
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
            </FormItem>
          </Form>
        </div>
        {loader ?
              <div className="gx-loader-view">
                <CircularProgress/>
              </div> : null}
            {showMessage ?
              message.error(alertMessage.toString()) : null}
      </div>
      
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignIn);
const mapStateToProps = ({auth}) => {
  const {loader, alertMessage, showMessage, authUser} = auth;
  return {loader, alertMessage, showMessage, authUser}
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
