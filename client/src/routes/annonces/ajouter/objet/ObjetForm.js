import React from "react";
import { Card, DatePicker, Form, Input, Select, Button, Switch, Upload, Icon } from "antd";
import moment from "moment";
import axios from "axios";
import { JSDOM } from "jsdom";

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


class ObjetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      categorie: null,
      trouve: false,
      date: null,
      marque: null,
      marques: [],
      modeles: [],
      modele: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCategorieChange = this.handleCategorieChange.bind(this);
    this.handleMarqueChange = this.handleMarqueChange.bind(this);
    this.handleModeleChange = this.handleModeleChange.bind(this);
    this.handleTrouveChange = this.handleTrouveChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    axios.get("https://api.allorigins.win/raw?url=https://www.trustit.tn/smartphone.html").then(
      response => {
        console.log(response)
        //var dom=response;
        const dom = new JSDOM(response.data);
        const all = dom.window.document.querySelectorAll("div.main-container div.col-md-3")
        const marques = []
        all.forEach(element => {
          let link = element.querySelector("a").href
          let marque = element.querySelector("span.thumb-info-inner").textContent
          let obj = {
            link: link,
            marque: marque
          }
          if (obj.marque !== "Autre") marques.push(obj)
        })
        console.log(marques);
        this.setState({
          marques: marques
        })
      }
    )
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
    if (value !== "smartphone") {
      this.setState({
        marque: null,
        modele: null
      })
    }
    console.log(this.state)
  }

  handleMarqueChange(value) {
    this.setState({
      marque: this.state.marques[value].marque
    })
    axios.get("https://api.allorigins.win/raw?url=" + this.state.marques[value].link).then(
      response => {
        console.log(response)
        //var dom=response;
        const dom = new JSDOM(response.data);
        const all = dom.window.document.querySelectorAll("span.thumb-info-inner")
        const modeles = []
        all.forEach(element => {
          let modele = element.textContent
          if (modele !== "Autre") modeles.push(modele)
        })
        console.log(modeles);
        this.setState({
          modeles: modeles
        })
      }
    )
    console.log(this.state)
  }

  handleModeleChange(value) {
    this.setState({
      modele: this.state.modeles[value]
    })
    console.log(this.state)
  }

  handleTrouveChange(value, event) {
    this.setState({
      trouve: value
    })
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
              name="categorie"
              value={this.state.categorie}
              onChange={this.handleCategorieChange}
            >
              <Option value="smartphone">Smartphone</Option>
              <Option value="2">Sac à main</Option>
              <Option value="3">Sacoche</Option>
              <Option value="4">Lunettes de soleil</Option>
              <Option value="5">Lunettes de vue</Option>
            </Select>
          </FormItem>

          {this.state.categorie === "smartphone" ? <FormItem
            {...formItemLayout}
            label="Marque"
            hasFeedback
            validateStatus={this.state.marques.length!==0 ? "" : "validating"}
          >
            <Select
              name="marque"
              value={this.state.marque}
              onChange={this.handleMarqueChange}
              disabled={this.state.marques.length!==0 ? false : true}
            >
              {this.state.marques.length!==0 ? this.state.marques.map(function (item, i) {
                return <Option value={i} key={i}>{item.marque}</Option>
              })
              : null
            }
            </Select>
          </FormItem> : null}

          {this.state.marque !== null ? <FormItem
            {...formItemLayout}
            label="Modele"
            hasFeedback
            validateStatus={this.state.modeles.length!==0 ? "" : "validating"}
          >
            <Select
              name="modele"
              value={this.state.modele}
              onChange={this.handleModeleChange}
              disabled={this.state.modeles.length!==0 ? false : true}
            >
              {this.state.modeles.length!==0 ? this.state.modeles.map(function (item, i) {
                return <Option value={i} key={i}>{item}</Option>
              })
              : null
            }
            </Select>
          </FormItem> : null}

          <FormItem
            {...formItemLayout}
            label="Date"
          >
            <DatePicker
              className="gx-mb-3 gx-w-100"
              format="DD-MM-YYYY"
              onChange={this.handleDateChange}
              disabledDate={disabledDate}
              placeholder={this.state.trouve ? "Date à laquelle vous avez trouvé l'objet" : "Date à laquelle vous avez perdu l'objet"}
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

export default ObjetForm;





