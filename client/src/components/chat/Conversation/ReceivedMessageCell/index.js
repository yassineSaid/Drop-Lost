import React from "react";
import {Avatar , Modal} from "antd";
import moment from 'moment'
import 'moment/locale/fr'


class ReceivedMessageCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible : false
    }
  }

  render() {
    return (
      <div className="gx-chat-item">

        <Avatar className="gx-size-40 gx-align-self-end" src={this.props.user.thumb}
                alt=""/>

        <div className="gx-bubble-block">
          <div className="gx-bubble">
            <div className="gx-message">{this.props.conversation.message === "texte" ? this.props.conversation.body : <img alt="example"
                        src={"http://localhost:5000/uploads/chat/" + this.props.conversation.body}
                        style={{ maxHeight: "150px", width: "auto" }} onClick={() => this.setState({previewVisible : true})}
                      />}</div>
            <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({previewVisible : false})} >
                <img alt="example" style={{width: '100%'}} src={"http://localhost:5000/uploads/chat/" + this.props.conversation.body}/>
            </Modal>
            <div className="gx-time gx-text-muted gx-text-right gx-mt-2">{moment(Number(this.props.conversation.date)).format('LLLL')}</div>
          </div>
        </div>

      </div>
    )
  }
}

export default ReceivedMessageCell;
