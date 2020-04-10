import React from "react";
import { Button, Select, Form, Icon, Input } from "antd";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import {
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGithubSignIn,
  userGoogleSignIn,
  userSignUp,
  userTwitterSignIn
} from "appRedux/actions/Auth";

import IntlMessages from "util/IntlMessages";
import { message } from "antd/lib/index";
import CircularProgress from "components/CircularProgress/index";
const Option = Select.Option;

const FormItem = Form.Item;
class SignUp extends React.Component {
  state = {
    confirmDirty: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
        console.log('Received values of form: ', values);
        this.props.showAuthLoader();

        this.props.userSignUp(values);
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Les deux mots de passe doivent etre similaire!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (this.props.authUser !== null) {
      this.props.history.push('/social-apps/profile');
    }
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showMessage, loader, alertMessage } = this.props;

    return (

      <div className="gx-app-login-container">
        <br /><br /><br /><br />
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
              <img src='https://via.placeholder.com/272x395' alt='Neature' />
            </div>
            <div className="gx-app-logo-wid">
              <h1><IntlMessages id="app.userAuth.signUp" /></h1>
              <p><IntlMessages id="app.userAuth.bySigning" /></p>
              <p><IntlMessages id="app.userAuth.getAccount" /></p>
            </div>
            <div className="gx-app-logo">
              <img alt="example" src={require("assets/images/logo.png")} />
            </div>
          </div>

          <div className="gx-app-login-content">
            <Form onSubmit={this.handleSubmit}>

              <FormItem

                label={(
                  <span>
                    Nom
                  </span>
                )}
              >
                {getFieldDecorator('nom', {
                  rules: [{ required: true, message: 'Nom est obligatoire!', whitespace: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem

                label={(
                  <span>
                    Prenom
                  </span>
                )}
              >
                {getFieldDecorator('prenom', {
                  rules: [{ required: true, message: 'Prenom est obligatoire!', whitespace: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                label={(
                  <span>
                    Ville
                  </span>
                )}
              >
                {getFieldDecorator('ville', {
                  rules: [
                    { required: true, message: 'Choisisez votre ville!' },
                  ],
                })(
                  <Select placeholder="Choisisez votre ville">
                    <Option value="Ariana">Ariana</Option>
                    <Option value="Beja">Beja</Option>
                    <Option value="Ben Arous">Ben Arous</Option>
                    <Option value="Bizerte">Bizerte</Option>
                    <Option value="Gabes">Gabes</Option>
                    <Option value="Gafsa">Gafsa</Option>
                    <Option value="Jendouba">Jendouba</Option>
                    <Option value="Kairouan">Kairouan</Option>
                    <Option value="Kasserine">Kasserine</Option>
                    <Option value="Kebili">Kebili</Option>
                    <Option value="Kef">Kef</Option>
                    <Option value="Mahdia">Mahdia</Option>
                    <Option value="Manouba">Manouba</Option>
                    <Option value="Medenine">Medenine</Option>
                    <Option value="Monastir">Monastir</Option>
                    <Option value="Nabeul">Nabeul</Option>
                    <Option value="Sfax">Sfax</Option>
                    <Option value="Sidi Bouzid">Sidi Bouzid</Option>
                    <Option value="Siliana">Siliana</Option>
                    <Option value="Sousse">Sousse</Option>
                    <Option value="Tataouine">Tataouine</Option>
                    <Option value="Tozeur">Tozeur</Option>
                    <Option value="Tunis">Tunis</Option>
                    <Option value="Zaghouan">Zaghouan</Option>

                  </Select>
                )}
              </FormItem>
              <FormItem

                label={(
                  <span>
                    Adresse
                  </span>
                )}
              >
                {getFieldDecorator('adresse', {
                  rules: [{ required: true, message: 'Adresse est obligatoire!', whitespace: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem

                label="Numero du telephone"
              >
                {getFieldDecorator('numero', {
                  rules: [{ required: true, message: 'Numero du telephone est obligatoire!' }],
                })(
                  <Input addonBefore={216} style={{ width: '100%' }} />
                )}
              </FormItem>
              <FormItem

                label="E-mail"
              >
                {getFieldDecorator('email', {
                  rules: [{
                    type: 'email', message: 'Entre un E-mail valide',
                  }, {
                    required: true, message: 'E-mail est obligatoire!!',
                  }],
                })(
                  <Input id="email1" />
                )}
              </FormItem>
              <FormItem

                label="Mot de passe"
              >
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: 'Mot de passe obligatoire',
                  }, {
                    validator: this.validateToNextPassword,
                  }],
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem

                label="Confirmer Mot de passe"
              >
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: 'Confirmer votre Mot de passe!',
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
              </FormItem>

              <FormItem>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signUp" />
                </Button>
                <span><IntlMessages id="app.userAuth.or" /></span> <Link to="/signin"><IntlMessages
                  id="app.userAuth.signIn" /></Link>
              </FormItem>
              <div className="gx-flex-row gx-justify-content-between">
                <span>or connect with</span>
                <ul className="gx-social-link">
                
                <li>
                    <Icon type="facebook" onClick={() => {
                      this.props.showAuthLoader();
                      this.props.userFacebookSignIn();
                    }} />
                  </li><li>
                    <Icon type="google" onClick={() => {
                      this.props.showAuthLoader();
                      this.props.userGoogleSignIn();
                    }} />
                  </li>
                  <li>
                    <Icon type="github" onClick={() => {
                      this.props.showAuthLoader();
                      this.props.userGithubSignIn();
                    }} />
                  </li>
                  <li>
                    <Icon type="twitter" onClick={() => {
                      this.props.showAuthLoader();
                      this.props.userTwitterSignIn();
                    }} />
                  </li>
                </ul>
              </div>
            </Form>
          </div>
          {loader &&
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          }
          {showMessage &&
            message.error(alertMessage)}
        </div>
      </div>

    );
  }

}

const WrappedSignUpForm = Form.create()(SignUp);

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser }
};

export default connect(mapStateToProps, {
  userSignUp,
  hideMessage,
  showAuthLoader,
  userFacebookSignIn,
  userGoogleSignIn,
  userGithubSignIn,
  userTwitterSignIn
})(WrappedSignUpForm);
