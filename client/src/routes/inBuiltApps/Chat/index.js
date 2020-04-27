import React, { Component } from "react";
import { Avatar, Button, Drawer, Input, Tabs , Upload , Modal } from "antd";
import CustomScrollbars from "util/CustomScrollbars";
import Moment from "moment";
import axios from 'axios';
import ChatUserList from "components/chat/ChatUserList";
import Conversation from "components/chat/Conversation/index";
import IntlMessages from "util/IntlMessages";
import SearchBox from "components/SearchBox";
import io from "socket.io-client";
import {Spin,Icon} from "antd";
import { Redirect } from "react-router-dom";


const SOCKET_URI = "http://localhost:5000/";
const TabPane = Tabs.TabPane;
const antIcon = <Icon type="loading" style={{fontSize: 36}} spin/>;

class Chat extends Component {

  socket = null;

  componentDidMount() {
    this.socket = io.connect(SOCKET_URI);
    this.setupSocketListeners();
  }

  componentDidUpdate() {
    //console.log(this.state)
  }

  setupSocketListeners() {
    this.socket.on("message", this.onMessageRecieved.bind(this));
  }

  onMessageRecieved(message) {

    //console.log(message);
    const updatedConversation = {
      'type': 'received',
      'body': message.body,
      'date': Moment().unix() * 1000,
      'message' : message.message
    };
    console.log(updatedConversation)
    if (message.from !== this.state.loggedUser._id) {
      this.setState({
        conversation: this.state.conversation.concat(updatedConversation)
      })
    }
  }

  handleOnChangeImage = (info) => {
    if (info.file.status !== 'uploading') {
      //console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      //console.log("file uploaded");
    } else if (info.file.status === 'error') {
      //console.log("error");
    }
  }

  uploadImage = async options => {
    const { onSuccess, onError, file } = options;
    const fmData = new FormData();
    const config = { headers: { "content-type": "multipart/form-data" }, withCredentials : true };
    fmData.append("image", file);
    fmData.append("to", this.state.selectedUser.recipientObj._id);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/upload",
        fmData,
        config
      );

      onSuccess("Ok");
      const updatedConversation = {
        'type': 'sent',
        'body': res.data.image,
        'date': Moment().unix() * 1000,
        'message' : 'image'
      };
      this.setState({
        conversation: this.state.conversation.concat(updatedConversation)
      })
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };


  filterContact = (userName) => {
    if (userName === '') {
      return this.state.contactListSearch;
    }
    return this.state.contactListSearch.filter((user) => user.prenom.toLowerCase().indexOf(userName.toLowerCase()) > -1 ||
      user.nom.toLowerCase().indexOf(userName.toLowerCase()) > -1);
  };

  confirmerMatching = () => {
    this.setState({
      visible : true
    })
  }

  handleCancel = () => {

    this.setState({
      visible: false,
    });
  };


  Communication = () => {
    const { message, selectedUser, conversation } = this.state;
    const conversationData = conversation;

    return <div className="gx-chat-main">
      <div className="gx-chat-main-header">
        <span className="gx-d-block gx-d-lg-none gx-chat-btn"><i className="gx-icon-btn icon icon-chat"
          onClick={this.onToggleDrawer.bind(this)} /></span>
        <div className="gx-chat-main-header-info">

          <div className="gx-chat-avatar gx-mr-2">
            <div className="gx-status-pos">
              <Avatar src={selectedUser.thumb}
                className="gx-rounded-circle gx-size-60"
                alt="" />

              <span className={`gx-status gx-${selectedUser.status}`} />
            </div>
          </div>
          <div>
            <div className="gx-chat-contact-name">
              {selectedUser.recipientObj === undefined ? `${selectedUser.nom} ${selectedUser.prenom}` : `${selectedUser.recipientObj.nom} ${selectedUser.recipientObj.prenom}`}
            </div>
            <span data-text="true">Match pour l'annonce : <span className="gx-chat-contact-name">{selectedUser.annonce[0].description}</span></span>
          </div>

        </div>
        <div class="ant-card-extra"><Button type="primary" size="default" icon="check" onClick={this.confirmerMatching}>Confirmer</Button></div>
        <Modal title="Title" visible={this.state.visible}  onCancel={this.handleCancel}>
          <p>This is a test !</p>
        </Modal>
      </div>

      <CustomScrollbars className="gx-chat-list-scroll">
        <Conversation conversationData={conversationData}
          selectedUser={selectedUser} />
      </CustomScrollbars>

      <div className="gx-chat-main-footer">
        <div className="gx-flex-row gx-align-items-center" style={{ maxHeight: 51 }}>
          <div className="gx-col">
            <div className="gx-form-group">
              <textarea
                id="required" className="gx-border-0 ant-input gx-chat-textarea"
                onKeyUp={this._handleKeyPress.bind(this)}
                onChange={this.updateMessageValue.bind(this)}
                value={message}
                placeholder="Type and hit enter to send message"
              />
            </div>
          </div>
          <Upload showUploadList={false}
                  accept="image/*"
                  customRequest={this.uploadImage}
                  onChange={this.handleOnChangeImage}
          >
            <i className="gx-icon-btn icon icon-image" />
          </Upload>
          <i className="gx-icon-btn icon icon-sent" onClick={this.submitComment.bind(this)} />
        </div>
      </div>
    </div>

  };


  AppUsersInfo = () => {
    return <div className="gx-chat-sidenav-main">
      <div className="gx-bg-grey-light gx-chat-sidenav-header">

        <div className="gx-chat-user-hd gx-mb-0">
          <i className="gx-icon-btn icon icon-arrow-left" onClick={() => {
            this.setState({ userState: 1 });
          }} />

        </div>
        <div className="gx-chat-user gx-chat-user-center">
          <div className="gx-chat-avatar gx-mx-auto">
            <Avatar src='https://via.placeholder.com/150x150'
              className="gx-size-60" alt="John Doe" />
          </div>

        <div className="gx-user-name h4 gx-my-2">{this.state.loggedUser.nom} {this.state.loggedUser.prenom}</div>

        </div>
      </div>
      <div className="gx-chat-sidenav-content">

        <CustomScrollbars className="gx-chat-sidenav-scroll">
          <div className="gx-p-4">
            <form>
              <div className="gx-form-group gx-mt-4">
                <label>Mood</label>

                <Input
                  fullWidth
                  id="exampleTextarea"
                  multiline
                  rows={3}
                  onKeyUp={this._handleKeyPress.bind(this)}
                  onChange={this.updateMessageValue.bind(this)}
                  defaultValue="it's a status....not your diary..."
                  placeholder="Status"
                  margin="none" />

              </div>
            </form>
          </div>
        </CustomScrollbars>

      </div>
    </div>
  };
  ChatUsers = () => {
    return <div className="gx-chat-sidenav-main">

      <div className="gx-chat-sidenav-header">

        <div className="gx-chat-user-hd">

          <div className="gx-chat-avatar gx-mr-3" onClick={() => {
            this.setState({
              userState: 2
            });
          }}>
            <div className="gx-status-pos">
              <Avatar id="avatar-button" src='https://via.placeholder.com/150x150'
                className="gx-size-50"
                alt="" />
              <span className="gx-status gx-online" />
            </div>
          </div>

          <div className="gx-module-user-info gx-flex-column gx-justify-content-center">
            <div className="gx-module-title">
              <h5 className="gx-mb-0">{this.state.loggedUser.nom} {this.state.loggedUser.prenom}</h5>
            </div>
            <div className="gx-module-user-detail">
              <span className="gx-text-grey gx-link">{this.state.loggedUser.email}</span>
            </div>
          </div>
        </div>

        <div className="gx-chat-search-wrapper">

          <SearchBox styleName="gx-chat-search-bar gx-lt-icon-search-bar-lg"
            placeholder="Search or start new chat"
            onChange={this.updateSearchChatUser.bind(this)}
            value={this.state.searchChatUser} />

        </div>
      </div>

      <div className="gx-chat-sidenav-content">
        {/*<AppBar position="static" className="no-shadow chat-tabs-header">*/}
        <Tabs className="gx-tabs-half" defaultActiveKey="1">
          <TabPane label={<IntlMessages id="chat.chatUser" />} tab={<IntlMessages id="chat.chatUser" />} key="1">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-1">
              {this.state.chatUsers.length === 0 ?
                <div className="gx-p-5">{this.state.userNotFound}</div>
                :
                <ChatUserList chatUsers={this.state.chatUsers}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser.bind(this)} />
              }
            </CustomScrollbars>
          </TabPane>
        </Tabs>


      </div>
    </div>
  };
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitComment();
    }
  };

  handleChange = (event, value) => {
    this.setState({ selectedTabIndex: value });
  };

  handleChangeIndex = index => {
    this.setState({ selectedTabIndex: index });
  };
  onSelectUser = (user) => {

    this.setState({ loader: true });
    if (this.state.conversation != null) {
      //console.log(this.state.conversation)
      this.socket.emit('unsubscribe', { room: this.state.conversation._id })
    }
    axios.get("http://localhost:5000/api/chat/conversations/query", { params: { userId: user.recipientObj._id }, withCredentials: true }).then(
      response => {
        this.setState({
          selectedSectionId: user._id,
          drawerState: this.props.drawerState,
          selectedUser: user,
          conversation: response.data.map(message => {
            return ({
              ...message,
              type: message.from === this.state.loggedUser._id ? 'sent' : 'received'
            })
          })
        });
        //console.log(this.state.conversation);
        this.socket.emit('subscribe', { room: user._id });
        console.log(user)
        this.setState({ loader: false });
        /*setTimeout(() => {
          this.setState({ loader: false });
        }, 1000);*/
      }
    ).catch()
  };
  showCommunication = () => {
    return (
      <div className="gx-chat-box">
        {this.state.selectedUser === null ?
          <div className="gx-comment-box">
            <div className="gx-fs-80"><i className="icon icon-chat gx-text-muted" /></div>
            <h1 className="gx-text-muted">{<IntlMessages id="chat.selectUserChat" />}</h1>
            <Button className="gx-d-block gx-d-lg-none" type="primary"
              onClick={this.onToggleDrawer.bind(this)}>{<IntlMessages
                id="chat.selectContactChat" />}</Button>

          </div>
          : this.Communication()}
      </div>)
  };


  constructor() {
    super();
    this.state = {
      loader: false,
      userNotFound: 'No user found',
      drawerState: false,
      selectedSectionId: '',
      selectedTabIndex: 1,
      userState: 1,
      searchChatUser: '',
      selectedUser: null,
      message: '',
      chatUsers: [],
      chatUsersSearch: [],
      conversationList: [],
      conversation: null,
      redirect : false,
      loggedUser : JSON.parse(localStorage.getItem('User')),
      file: null,
      uploading: false,
    }


    axios.get("http://localhost:5000/api/chat/conversations", { withCredentials: true }).then(
      response => {
        this.setState({
          chatUsers: response.data,
          chatUsersSearch: response.data,
        })
      }
    ).catch(error => {
      if (error.response.status === 401) {
        window.location.href = '/signin'
      } else {
        this.setState({
          chatUsers: [],
          chatUsersSearch: [],
        })
      }
    })


  }

  submitComment() {
    if (this.state.message !== '') {
      const updatedConversation = {
        'type': 'sent',
        'body': this.state.message,
        'date': Moment().unix() * 1000,
        'message' : 'texte'
      };
      const payload = {
        to: this.state.selectedUser.recipientObj._id,
        body: this.state.message.trim()
      }
      this.setState({
        conversation: this.state.conversation.concat(updatedConversation),
        message: ''
      })
      axios.post("http://localhost:5000/api/chat/", payload, { withCredentials: true }).then(
        response => {

        }
      ).catch(error => {
        if (error.response.status === 401) {
          window.location.href = '/signin'
        }
      })



    }
  }

  updateMessageValue(evt) {
    this.setState({
      message: evt.target.value
    });
  }

  updateSearchChatUser(evt) {
    this.setState({
      searchChatUser: evt.target.value,
      chatUsers: this.filterContact(evt.target.value),
    });
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState
    });
  }

  render() {
    if (this.state.loggedUser === null) {
      return <Redirect to='/signin'/>;
    }
    const { loader, userState, drawerState } = this.state;
    return (
      <div className="gx-main-content">
        <div className="gx-app-module gx-chat-module">
          <div className="gx-chat-module-box">
            <div className="gx-d-block gx-d-lg-none">
              <Drawer
                placement="left"
                closable={false}
                visible={drawerState}
                onClose={this.onToggleDrawer.bind(this)}>
                {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
              </Drawer>
            </div>
            <div className="gx-chat-sidenav gx-d-none gx-d-lg-flex">
              {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
            </div>
            {loader ?
              <div className="gx-loader-view">
                <Spin indicator={antIcon}/>
              </div> : this.showCommunication()
            }
          </div>
        </div>
      </div>
    )
  }
}


export default Chat;
