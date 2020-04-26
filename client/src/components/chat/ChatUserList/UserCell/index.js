import React from "react";
import {Avatar} from "antd";
import moment from 'moment'
import 'moment/locale/fr'


const UserCell = ({chat, selectedSectionId, onSelectUser}) => {
  moment.locale('fr');
  return (
    <div className={`gx-chat-user-item ${selectedSectionId === chat.id ? 'active' : ''}`} onClick={() => {
      onSelectUser(chat);
    }}>
      <div className="gx-chat-user-row">
        <div className="gx-chat-avatar">
          <div className="gx-status-pos">
            <Avatar src={chat.thumb} className="gx-size-40" alt={chat.recipientObj.name}/>
            <span className={`gx-status gx-small gx-${chat.status}`}/>
          </div>
        </div>

        <div className="gx-chat-info">
          <span className="gx-name h4">{chat.recipientObj.nom} {chat.recipientObj.prenom} </span>
          <div className="gx-chat-info-des gx-text-truncate">Match pour : {chat.annonce[0].description.substring(0, 25) + "..."}</div>
          <div className="gx-last-message-time">{moment(Number(chat.date)).format('LLLL')}</div>
        </div>

        {chat.unreadMessage > 0 ? <div className="gx-chat-date">
          <div className="gx-bg-primary gx-rounded-circle gx-badge gx-text-white">{chat.unreadMessage}</div>
        </div> : null}
      </div>
    </div>
  )
};

export default UserCell;
