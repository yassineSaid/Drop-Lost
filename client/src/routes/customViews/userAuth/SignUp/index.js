import React, { Component } from "react";
import { Button, Select, Form, Icon, Input } from "antd";
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
const FormItem = Form.Item;
const Option = Select.Option;

class SignUP extends Component {
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
  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div className="gx-login-container">
        <div className="gx-login-content">
          <div className="gx-login-header gx-text-center">
            <h1 className="gx-login-title">Sign Up</h1>
          </div>
          <Form onSubmit={this.handleSubmit} className="gx-login-form gx-form-row0">
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
            <FormItem className="gx-text-center">
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </FormItem>
          </Form>
          <div className="gx-flex-row">
            <span className="gx-mb-2 gx-mr-3">or Sign up using: </span>
            <ul className="gx-social-link">
              <li>
                <Icon type="google" onClick={() => {
                  this.props.showAuthLoader();
                  this.props.userGoogleSignIn();
                }} />
              </li>
              <li>
                <Icon type="facebook" onClick={() => {
                  this.props.showAuthLoader();
                  this.props.userFacebookSignIn();
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
        </div>
      </div>
    );
  }
}

const WrappedNormalSignUpForm = Form.create()(SignUP);
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
})(WrappedNormalSignUpForm);
