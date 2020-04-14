import React, {Component} from "react";
import {Form} from "antd";
import axios from 'axios';
import ProjectWidget from "components/Widgets/ProjectWidget";



class LockScreen extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  componentDidMount() {
    console.log('I am mounted!');
    const { match: { params } } = this.props;
    console.log(params)
    axios.post('http://localhost:5000/users/verify', params)
    .then(console.log("done") )
    .catch(error => error);

    
  }

  render() {

    return (
      <div className="gx-login-container">
        <div className="gx-login-content gx-text-center">

        <ProjectWidget/>

        </div>
      </div>
    );
  }
}

const WrappedLockScreenForm = Form.create()(LockScreen);

export default (WrappedLockScreenForm);
