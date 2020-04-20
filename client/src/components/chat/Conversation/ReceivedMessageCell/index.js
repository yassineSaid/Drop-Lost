import React from "react";
import {Avatar} from "antd";
import moment from 'moment'
import 'moment/locale/fr'


const ReceivedMessageCell = ({conversation, user}) => {
  moment.locale('fr');
  return (
    <div className="gx-chat-item">

      <Avatar className="gx-size-40 gx-align-self-end" src={user.thumb}
              alt=""/>

      <div className="gx-bubble-block">
        <div className="gx-bubble">
          <div className="gx-message">{conversation.body}</div>
          <div className="gx-time gx-text-muted gx-text-right gx-mt-2">{moment(Number(conversation.date)).format('LLLL')}</div>
        </div>
      </div>

    </div>
  )
};

export default ReceivedMessageCell;
