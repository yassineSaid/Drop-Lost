import React from "react";
import {Button, Card, Modal} from "antd";



class Confimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible : this.props.show
    }

  }
  handleCancel = () => {
    //console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  render() {
    const {visible} = this.state;
    return (
        <Modal title="Title"
               visible={visible}
               onCancel={this.props.show}
        >
          <p>This is a test ! </p>
        </Modal>
    );
  }
}

export default Confimer;
