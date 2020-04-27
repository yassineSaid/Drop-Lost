import React from "react";
import { Button, Modal, Collapse, Form, Select,Tooltip,Icon } from "antd";
import "./basic.less";
import Moment from "moment";


const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;


class Confimer extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      visible: false,
      confirmLoading: false,
      annonce: this.props.annonce[0],
      match: this.props.match[0],
      disabled: true,
      methode : null
    }
    this.selectChange = this.selectChange.bind(this);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  selectChange = (value) => {
    this.setState({
      methode : value
    })
    if(value === 'boutique'){
      this.setState({
        disabled : false
      })
    }
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  render() {
    const { visible, confirmLoading, disabled } = this.state;
    const formItemLayout = {
      labelCol: { xs: 24, sm: 7 },
      wrapperCol: { xs: 24, sm: 14 },
    };
    return (
      <div className="ant-card-extra">
        <Button type="primary" size="default" icon="check" onClick={this.showModal}>Confirmer</Button>
        <Modal title="Confirmer le matching !"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Annuler</Button>,
            <Button key="submit" type="primary" loading={confirmLoading} onClick={this.handleOk} disabled={disabled}>Confimer</Button>
          ]}
        >
          <Collapse >
            <Panel header="Votre Annonce" key="1">
              <div className="gx-flex-row">
                <h5><i className="icon icon-data-entry"></i> Description</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{this.state.annonce.description}</span>
              </div>
              <div className="gx-flex-row">
                <h5><i class="icon icon-calendar"></i> Date d'ajout</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{Moment(this.state.annonce.date).format('dddd LL')}</span>
              </div>
            </Panel>
            <Panel header="Annonce similaire " key="2">
              <div className="gx-flex-row">
                <h5><i class="icon icon-data-entry"></i> Description</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{this.state.match.description}</span>
              </div>
              <div className="gx-flex-row">
                <h5><i className="icon icon-calendar"></i> Date d'ajout</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{Moment(this.state.match.date).format('dddd LL')}</span>
              </div>
            </Panel>
          </Collapse>
          <Form >
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                Récuperation&nbsp;
                  <Tooltip title="Vous pouvez récuperer votre objet de la boutique la plus proche à vous !">
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </span>
              )}
              hasFeedback
            >
              {<Select placeholder="Selectionner une option" onChange={this.selectChange}>
                <Option value="directe">En Personne</Option>
                <Option value="boutique">Boutique TrustIt </Option>
              </Select>}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Confimer;
