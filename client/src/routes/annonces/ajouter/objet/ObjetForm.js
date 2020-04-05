import React from "react";
import { Card, Cascader, Col, DatePicker, Form, Input, InputNumber, Select, TimePicker, Button, Switch } from "antd";

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


class ObjetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      categorie: "",
      trouve: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCategorieChange = this.handleCategorieChange.bind(this);
    this.handleTrouveChange = this.handleTrouveChange.bind(this);
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

  handleCategorieChange(value) {
    this.setState({
      categorie: value
    })
    console.log(this.state)
  }

  handleTrouveChange(value, event) {
    this.setState({
      trouve: value
    })
    console.log(this.state)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
  }

  render() {
    return (
      <Card className="gx-card" title="Ajout d'une annonce pour un objet">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Trouvé ou perdu"
          >
            <Switch
              checkedChildren="Trouvé"
              unCheckedChildren="Perdu"
              onChange={this.handleTrouveChange}
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

          <FormItem
            {...formItemLayout}
            label="Catégorie"
            hasFeedback
          >
            <Select
              defaultValue="1"
              name="categorie"
              value={this.state.categorie}
              onChange={this.handleCategorieChange}
            >
              <Option value="1">Smartphone</Option>
              <Option value="2">Sac à main</Option>
              <Option value="3">Sacoche</Option>
              <Option value="4">Lunettes de soleil</Option>
              <Option value="5">Lunettes de vue</Option>
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Fail"
            validateStatus="error"
            help="Should be combination of numbers & alphabets"
          >
            <Input placeholder="unavailable choice" id="error" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Warning"
            validateStatus="warning"
          >
            <Input placeholder="Warning" id="warning-1" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Validating"
            hasFeedback
            validateStatus="validating"
            help="The information is being validated..."
          >
            <Input placeholder="I'm the content is being validated" id="validating" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Success"
            hasFeedback
            validateStatus="success"
          >
            <Input placeholder="I'm the content" id="success" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Warning"
            hasFeedback
            validateStatus="warning"
          >
            <Input placeholder="Warning" id="warning" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Fail"
            hasFeedback
            validateStatus="error"
            help="Should be combination of numbers & alphabets"
          >
            <Input placeholder="unavailable choice" id="error-1" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Success"
            hasFeedback
            validateStatus="success"
          >
            <DatePicker style={{ width: '100%' }} />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Warning"
            hasFeedback
            validateStatus="warning"
          >
            <TimePicker style={{ width: '100%' }} />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Error"
            hasFeedback
            validateStatus="error"
          >
            <Select defaultValue="1">
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Validating"
            hasFeedback
            validateStatus="validating"
            help="The information is being validated..."
          >
            <Cascader defaultValue={['1']} options={[]} />
          </FormItem>

          <FormItem
            label="inline"
            {...formItemLayout}
          >

            <div className="ant-row gx-form-row0">
              <Col xs={24} sm={11}>
                <FormItem validateStatus="error" help="Please select the correct date">
                  <DatePicker />
                </FormItem>
              </Col>
              <Col xs={24} sm={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  -
          </span>
              </Col>
              <Col xs={24} sm={11}>
                <FormItem>
                  <DatePicker />
                </FormItem>
              </Col>
            </div>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Success"
            hasFeedback
            validateStatus="success"
          >
            <InputNumber style={{ width: '100%' }} />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">Submit</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
};

export default ObjetForm;





