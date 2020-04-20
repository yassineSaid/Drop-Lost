import React from "react";
import UserCell from "./UserCell/index";

const ContactList = ({onSelectUser, selectedSectionId, contactList}) => {
  return (
    <div className="gx-chat-user">
      { contactList !== [] ?
        contactList.map((user, index) =>
        <UserCell key={index} user={user} selectedSectionId={selectedSectionId} onSelectUser={onSelectUser}/>
      ) :
      <div></div>
      }
    </div>
  )
};

export default ContactList;
