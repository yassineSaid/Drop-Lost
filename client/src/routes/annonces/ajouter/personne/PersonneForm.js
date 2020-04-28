import React from "react";
import { Card, DatePicker, Form, Input, Select, Button, Switch, Upload, Icon, InputNumber, Modal } from "antd";
import moment from "moment";
import RadioGroup from "antd/lib/radio/group";
import RadioButton from "antd/lib/radio/radioButton";
import { matchAnnonce, ajouterAnnonce, ajouterImages } from "../../../../requests/annonces";
import Annonce from "../../annonce";

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


class PersonneForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      type: "",
      trouve: false,
      date: moment().format("DD-MM-YYYY"),
      nom: "",
      sexe: "homme",
      age: null,
      annonceId: null,
      fileList: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
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
      date: date
    })
    console.log(this.state)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var annonce = {
      type: "personne",
      trouve: this.state.trouve,
      description: this.state.description,
      date: moment(this.state.date, "DD-MM-YYYY"),
      personne: {
        nom: this.state.nom,
        sexe: this.state.sexe,
        age: this.state.age,
      }
    }
    const formData = new FormData();
    this.state.fileList.map( (file,i) => {
      formData.append("file"+i,file)
    })
    formData.append("annonce",JSON.stringify(annonce))
    ajouterAnnonce(formData).then(response => {
      if (response.done){
        Modal.success({
          content: 'Votre annonce a bien été ajoutée',
        });
        console.log(response)
      }
      else if (response.response.response.status === 401) {
        Modal.error({
          content: 'Vous devez vous connecter pour pouvoir poster cette annonce <a href="'+window.location.origin+'/signin">Connexion</a>',
        });
      }
    })
    console.log(this.state)
  }

  render() {
    const { fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      multiple: true,
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <Card className="gx-card" title="Ajout d'une annonce pour une personne">
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
            label="Sexe"
          >
            <RadioGroup onChange={this.handleInputChange} value={this.state.sexe} name="sexe">
              <RadioButton value="homme">Homme</RadioButton>
              <RadioButton value="femme">Femme</RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Age"
          >
            <Input
              placeholder="Si vous ne connaissez pas l'age mettez l'age approximatif"
              type="number"
              name="age"
              value={this.state.age}
              onChange={this.handleInputChange}
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Description"
          >
            <Input.TextArea
              placeholder="Décrivez la personne avec un maximum de détails"
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
                placeholder="Nom de la personne"
                name="nom"
                value={this.state.nom}
                onChange={this.handleInputChange}
              />
            </FormItem> : null
          }

          <FormItem
            {...formItemLayout}
            label="Date"
          >
            <DatePicker
              className="gx-mb-3 gx-w-100"
              format="DD-MM-YYYY"
              defaultValue={moment(this.state.date, "DD-MM-YYYY")}
              onChange={this.handleDateChange}
              disabledDate={disabledDate}
              placeholder={this.state.trouve ? "Date à laquelle vous avez trouvé la personne" : "Date à laquelle vous avez perdu la personne"}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Photos"
          >
            <div className="dropbox">
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Cliquer ici ou déplacer vos photos ici</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">Confirmer</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
};

export default PersonneForm;





