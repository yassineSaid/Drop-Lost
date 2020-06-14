import CustomScrollbars from "util/CustomScrollbars";
import Auxiliary from "util/Auxiliary";
import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Spin, Icon } from "antd";
const antIcon = <Icon type="loading" style={{ fontSize: 36 }} spin />;

class Notification extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
   
  }
    

  render() {
    return (
      <li className="gx-media">

      <div className="gx-media-body gx-align-self-center">
        <p className="gx-fs-sm gx-mb-0">{this.props.notification.content }</p>
     <small>{moment(Date.parse(this.props.notification.createdAt)).fromNow()}</small>
      </div>
    </li>
  )

  }
 
}
export default class ListNotififications extends Component {
  _isMounted = false;
  constructor(props){
    super(props);
   // this.state = { notifications: [] }
    this.state = {
      loggedUser: JSON.parse(localStorage.getItem('User')) ? JSON.parse(localStorage.getItem('User')) : null,
      loading : false,
      notifications : [],
      errorMessage : "Pas De Notifications !",
    }

  }

  componentDidMount(){
    this._isMounted = true;
    let user = JSON.parse(localStorage.getItem('User'));
    axios.get('http://localhost:5000/api/notifications/allNotifications', { params: { userId: user._id }, withCredentials: true })
      .then(resp => {
        console.log("Les valeurs"+JSON.stringify(resp.data.notifications));
        this.setState({ 
        notifications : resp.data.notifications,
        loading:false
      });  
    })
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps){

    const data = nextProps.notification;
    if (this._isMounted) {

      this.setState({ notifications : [data, ...this.state.notifications] });


      }
     
  } 
  componentWillUnmount() {
    this._isMounted = false;
  }

  commentList() {  
  //return this.state.notifications.map(currentcomment => {
    const {notifications , loading , errorMessage} = this.state
   console.log("The notifications"+notifications)
      return (
 
        <ul className="gx-sub-popover">
        {/* { loading ? <div className="gx-loader-view"><Spin indicator={antIcon} /> </div> : errorMessage !== "Pas De Notifications !" && notifications !== [] ? */}
        {  notifications.map((notification, index) => <Notification key={index} socket={this.props.actions} notification={notification}/>) 
        }
     {/* <Notification notification={currentcomment} socket={this.props.actions} key={currentcomment._id}/> */}
      </ul>



      )

   //})
  }
  render() {
    return (
      <Auxiliary>
      <div className="gx-popover-header">
      <h3 className="gx-mb-0">Notifications</h3>
      <i className="gx-icon-btn icon icon-charvlet-down"/>
    </div>
        <div style={{display :'inline-block',padding:'0px',margin:'0px'}}>

        <CustomScrollbars className="gx-popover-scroll">
        { this.commentList() }
        </CustomScrollbars>
        </div>
     
        </Auxiliary>
      
   
    );
  }
}