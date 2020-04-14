import React from "react";
import { Card, DatePicker, Form, Input, Select, Button, Switch, Upload, Icon } from "antd";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 16 },
    lg: { span: 12 },
  },
};

function disabledDate(current) {
  // Can not select days before today and today
  return current && current >= moment().endOf('day');
}


class AnimalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      type: "chat",
      trouve: false,
      date: moment().format("DD-MM-YYYY"),
      nom: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleTrouveChange = this.handleTrouveChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    console.log(this.state)
  }

  handleTypeChange(value) {
    this.setState({
      type: value
    })
    console.log(this.state)
  }

  handleTrouveChange(value, event) {
    if (value) {
      this.setState({
        trouve: value,
        nom: null
      })
    }
    else {
      this.setState({
        trouve: value,
        nom: ""
      })
    }
    console.log(this.state)
  }

  handleDateChange(date, dateS) {
    this.setState({
      date: dateS
    })
    console.log(this.state)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    return (
      <Card className="gx-card" title="Ajout d'une annonce pour un animal">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Trouvé ou perdu"
          >
            <Switch
              checkedChildren="Trouvé"
              unCheckedChildren="Perdu"
              onChange={this.handleTrouveChange}
              value={this.state.trouve}
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Description"
          >
            <Input.TextArea
              placeholder="Décrivez l'objet avec un maximum de détails"
              name="description"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </FormItem>
          {this.state.nom !== null ?
            <FormItem
              {...formItemLayout}
              label="Nom"
            >
              <Input
                placeholder="A quel nom répond votre animal"
                name="nom"
                value={this.state.description}
                onChange={this.handleInputChange}
              />
            </FormItem> : null
          }

          <FormItem
            {...formItemLayout}
            label="Type"
            hasFeedback
          >
            <Select
              defaultValue="chat"
              name="type"
              value={this.state.type}
              onChange={this.handleTypeChange}
            >
              <Option value="chat">Chat</Option>
              <Option value="chien">Chien</Option>
              <Option value="autre">Autre</Option>
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Date"
          >
            <DatePicker
              className="gx-mb-3 gx-w-100"
              format="DD-MM-YYYY"
              value={moment(this.state.date,"DD-MM-YYYY")}
              onChange={this.handleDateChange}
              disabledDate={disabledDate}
              placeholder={this.state.trouve ? "Date à laquelle vous avez trouvé l'animal" : "Date à laquelle vous avez perdu l'animal"}
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Photos"
          >
            <div className="dropbox">
              <Upload.Dragger name="files" action="/upload.do" multiple={true}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Cliquer ici ou déplacer vos photos ici</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">Submit</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
};

export default AnimalForm;





