import React from "react";

import ReceivedMessageCell from "./ReceivedMessageCell/index";
import SentMessageCell from "./SentMessageCell/index";

const Conversation = ({ conversationData, selectedUser }) => {

  return (
    <div className="gx-chat-main-content">
      {conversationData !== [] ?
        conversationData.map((conversation, index) => conversation.type === 'sent' ?
          <SentMessageCell key={index} conversation={conversation} /> :
          <ReceivedMessageCell key={index} conversation={conversation} user={selectedUser} />
        ) :
        <div class="gx-comment-box">
          <div class="gx-fs-80">
            <i class="icon icon-chat gx-text-muted"></i>
          </div><h1 class="gx-text-muted">
            <span>Enovoyé un message pour commencer la conversation</span>
          </h1>
        </div>
      }
    </div>
  )
};

export default Conversation;
