import React from "react";
import NotificationItem from "./NotificationItem";
//import {notifications} from "./data";
import CustomScrollbars from 'util/CustomScrollbars'
import Auxiliary from "util/Auxiliary";
import axios from 'axios';
import { Spin, Icon } from "antd";

const antIcon = <Icon type="loading" style={{ fontSize: 36 }} spin />;



class MailNotification extends React.Component{


  socket = null;

  componentDidMount() {
    axios.get(process.env.REACT_APP_API_URL + "api/chat/conversations", { withCredentials: true }).then(
      response => {
        this.setState({
          notifications: response.data.filter(conversation => conversation.from !== this.state.loggedUser._id),
          loading : false
        })
      }
    ).catch(
      this.setState({
        errorMessage : "Vous n'êtes pas connecté !",
        loading : false
      })
    )
  }


  constructor(props) {
    super(props);
    this.state = {
      loggedUser: JSON.parse(localStorage.getItem('User')) ? JSON.parse(localStorage.getItem('User')) : null,
      loading : true
    }
  }

  render() {

    const {notifications , loading , errorMessage} = this.state
    console.log(notifications,errorMessage)
    return (
      <Auxiliary>
        <div className="gx-popover-header">
          <h3 className="gx-mb-0">Messages</h3>
          <i className="gx-icon-btn icon icon-charvlet-down"/>
        </div>
        <CustomScrollbars className="gx-popover-scroll">
          <ul className="gx-sub-popover">
            { loading ? <div className="gx-loader-view"><Spin indicator={antIcon} /> </div> : errorMessage && notifications ?
            notifications.map((notification, index) => <NotificationItem key={index} notification={notification}/>) :
            <h5 className="gx-text-center"><span className="gx-link">{errorMessage}</span></h5>
            }
          </ul>
        </CustomScrollbars>
      </Auxiliary>
    )
  }
};

export default MailNotification;

