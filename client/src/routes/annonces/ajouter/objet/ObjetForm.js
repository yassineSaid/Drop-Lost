import React from "react";
import { Card, DatePicker, Form, Input, Select, Button, Switch, Upload, Icon, Modal } from "antd";
import moment from "moment";
import axios from "axios";
import { JSDOM } from "jsdom";
import {ajouterAnnonce,matchAnnonce, ajouterImages} from "../../../../requests/annonces"

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
const electronique = ["Appareil photo", "Chargeur/cable", "Clé USB/disque de stockage", "Écouteur", "Ordinateur portable", "Tablette", "Autre"]
const document = ["Argent comptant", "Pièce d'identité", "Portefeuille", "Sac à main", "Autre"]
const cle = ["Carte d'accès", "Clé d'auto", "Clé cadenas", "Autre"]
const lunette = ["Lunette de vue", "Lunette de soleil", "Autre"]
const outils = ["Autre"]
const vetement = ["Chapeau, Casquette", "Foulard", "Gants", "Gilet", "Manteau, Veste", "Soulier, Botte", "Vêtements de sport"]
const autre= ["autre"]
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
      date: moment().format("DD-MM-YYYY"),
      marque: null,
      marques: [],
      modeles: [],
      modele: null,
      sousCategorieArray: null,
      sousCategorie: null,
      annonceId: null,
      fileList: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCategorieChange = this.handleCategorieChange.bind(this);
    this.handleSousCategorieChange = this.handleSousCategorieChange.bind(this);
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
      var sousCategorie = []
      if (value === "electronique") sousCategorie = electronique
      else if (value === "cle") sousCategorie = cle
      else if (value === "document") sousCategorie = document
      else if (value === "lunette") sousCategorie = lunette
      else if (value === "outils") sousCategorie = outils
      else if (value === "vetement") sousCategorie = vetement
      else if (value === "autre") sousCategorie = autre
      this.setState({
        sousCategorieArray: sousCategorie,
        sousCategorie: sousCategorie[0]
      })
    }
    else {
      this.setState({
        sousCategorie: null,
        sousCategorieArray: null
      })
    }
    console.log(this.state)
  }

  handleSousCategorieChange(value) {
    this.setState({
      sousCategorie: value
    })
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
      date: date
    })
    console.log(this.state)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var annonce = {
      type: "objet",
      trouve: this.state.trouve,
      description: this.state.description,
      date: moment(this.state.date,"DD-MM-YYYY"),
      objet: {
        categorie: this.state.categorie,
        sousCategorie: this.state.sousCategorie,
        marque: this.state.marque,
        modele: this.state.modele
      }
    }
    const formData = new FormData();
    this.state.fileList.map( (file,i) => {
      formData.append("file"+i,file)
    })
    ajouterAnnonce(annonce).then(response => {
      if (response.done){
        console.log(response)
        this.setState({
          annonceId: response.response.data.result._id
        })
        ajouterImages(response.response.data.result._id,formData).then(response => {
          if (response.done){
            Modal.success({
              content: 'Votre annonce a bien été ajoutée',
            });
            console.log(response)
          }
        })
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
              <Option value="electronique">Appareil éléctronique</Option>
              <Option value="document">Argent, document personnel, pièce d'identité</Option>
              <Option value="cle">Clé, cadenas, carte d'accès</Option>
              <Option value="lunette">Lunette</Option>
              <Option value="outils">Outils</Option>
              <Option value="vetement">Vêtement</Option>
              <Option value="autre">Autre</Option>
            </Select>
          </FormItem>

          {this.state.categorie === "smartphone" ? <FormItem
            {...formItemLayout}
            label="Marque"
            hasFeedback
            validateStatus={this.state.marques.length !== 0 ? "" : "validating"}
          >
            <Select
              name="marque"
              value={this.state.marque}
              onChange={this.handleMarqueChange}
              disabled={this.state.marques.length !== 0 ? false : true}
            >
              {this.state.marques.length !== 0 ? this.state.marques.map(function (item, i) {
                return <Option value={i} key={i}>{item.marque}</Option>
              })
                : null
              }
            </Select>
          </FormItem> : this.state.sousCategorie!== null ?
            <FormItem
              {...formItemLayout}
              label="Sous catégorie"
              hasFeedback
            >
              <Select
                name="sousCategorie"
                value={this.state.sousCategorie}
                onChange={this.handleSousCategorieChange}
              >
                {this.state.sousCategorieArray.map(function(item,i){
                  return <Option value={i} key={i}>{item}</Option>
                })}
              </Select>
            </FormItem>
          : null }

          {this.state.marque !== null ? <FormItem
            {...formItemLayout}
            label="Modele"
            hasFeedback
            validateStatus={this.state.modeles.length !== 0 ? "" : "validating"}
          >
            <Select
              name="modele"
              value={this.state.modele}
              onChange={this.handleModeleChange}
              disabled={this.state.modeles.length !== 0 ? false : true}
            >
              {this.state.modeles.length !== 0 ? this.state.modeles.map(function (item, i) {
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
              defaultValue={moment(this.state.date,"DD-MM-YYYY")}
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
            <Button type="primary" htmlType="submit">Submit</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
};

export default ObjetForm;





