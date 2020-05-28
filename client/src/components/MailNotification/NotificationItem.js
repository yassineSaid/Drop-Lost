import React from "react";
import {Avatar} from "antd";
import Moment from "moment";

const NotificationItem = ({notification}) => {
  const {date,lastMessage,recipientObj} = notification;
  return (
    <li className="gx-media">
      <div className="gx-user-thumb gx-mr-3">
        <Avatar className="gx-size-40">{(recipientObj.prenom.slice(0,1)+recipientObj.nom.slice(0,1)).toUpperCase()}</Avatar>
      </div>
      <div className="gx-media-body">
        <div className="gx-flex-row gx-justify-content-between gx-align-items-center">
          <h5 className="gx-text-capitalize gx-user-name gx-mb-0"><span className="gx-link">{recipientObj.prenom} {recipientObj.nom}</span></h5>
          <span className="gx-meta-date"><small>{Moment(Number(date)).format('L')}</small></span>
        </div>
        <p className="gx-fs-sm">{lastMessage}</p>
        <div className="gx-last-message-time">{Moment(Number(date)).format('LT')}</div>
        <span className="gx-btn gx-btn-sm gx-top2 gx-text-muted"><i className="icon icon-reply gx-pr-2"/>Reply</span>
        <span className="gx-btn gx-btn-sm gx-top2 gx-text-muted"><i
          className="icon icon-custom-view gx-pr-2"/>Read</span>
      </div>
    </li>
  );
};

export default NotificationItem;
