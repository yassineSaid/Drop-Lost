import React, {Component} from "react";
import {connect} from "react-redux";
import {Avatar, Popover} from "antd";
import {userSignOut} from "appRedux/actions/Auth";
import {Link} from "react-router-dom";

class UserInfo extends Component {

  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li><Link to="/social-apps/profile">My Account</Link></li>
        <li><Link to="accueil" onClick={() => this.props.userSignOut()} onMouseDown={() =>this.props.isLoggedIn(false)}>
            Logout
          </Link>
        </li>
      </ul>
    );

    return (
      <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
               trigger="click">
        <Avatar src='https://via.placeholder.com/150x150'
                className="gx-avatar gx-pointer" alt=""/>
      </Popover>
    )

  }
}

export default connect(null, {userSignOut})(UserInfo);
