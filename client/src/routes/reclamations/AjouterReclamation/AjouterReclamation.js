/*
  Example
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LocationPicker from '../lib';
import moment from "moment";
import axios from "axios";
import { JSDOM } from "jsdom";
import Geocode from "react-geocode";
import { notification,Card, DatePicker,Descriptions, Form, Input, Select, Button, Switch, Upload, Icon, Modal } from "antd";
/* Default position */
Geocode.setApiKey("API_KEY");
const defaultPosition = {
  lat: 27.9878,
  lng: 86.9250
};
const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Réclamation ajouté',
    description:
      'Une notification a été envoyée aux personnes qui sont à 5 KM de votre emplacement',
  });
};

let _isMounted = false;
const FormItem = Form.Item;
const Option = Select.Option;

var  latAdresseUser;
var lngAdresseUser;
const formItemLayout = {
  labelCol: {
    xs: { span: 30 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 30 },
    sm: { span: 18 },
    md: { span: 16 },
    lg: { span: 12 },
  },
};
 class LocationPickerExample extends Component {
  
  constructor (props) {
    super(props);
    
    const sock = new WebSocket('ws://localhost:5000/notification');
    sock.onopen = function() {
        console.log('open');
    };
    const self = this;
    sock.onmessage = function(e) {
    
          const message = JSON.parse(e.data);
          const dataToSend = JSON.stringify(message);
          self.setState({ notification: message });
    };
    this.state = {
      address: "",
      position: {},
      defaultPosition: defaultPosition,
      description:'',
      photo:'',
      date:moment().format("DD-MM-YYYY"),
      fileListRec: [],
      actions : sock,
      notification : {},
      latAdresseUser,
      lngAdresseUser,
      recipients:[],
      viewState: []

    };
    // Bind
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handlePhotoChange = this.handlePhotoChange.bind(this);
     this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  onChange(value) {
    this.setState({
      viewState: value
    });
  }


  handleDescriptionChange(e) {
    this.setState({
        description: e.target.value
    });
}
handleAddressChange(e) {
  this.setState({
      address: e.target.value
  });
}
handlePhotoChange(e) {
  this.setState({
      photo: e.target.value
  });
}
handleDateChange(e) {
  this.setState({
      date: e.target.value
  });
}
  handleLocationChange ({ position, address }) {

    // Set new location
    this.setState({ position, address });
  }

  componentDidMount () {
    this._isMounted = true;
    navigator && navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.setState({
        defaultPosition: {
          lat: latitude,
          lng: longitude
        }
      });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  ////////////////////////////

  handleSubmit = (e) => {
    e.preventDefault();



    this.props.form.validateFields((err, values) => {
      if (!err) {
 
        let user = JSON.parse(localStorage.getItem('User'));
        var Reclamation = {
          address:this.state.address,
          lat:this.state.position.lat,
          lng:this.state.position.lng,
          description: this.state.description,
          date: moment(this.state.date,"DD-MM-YYYY"),
          user:user,
        }
        var text=user.nom+" a réclamé l'adresse "+this.state.address+"comme zone dangeureuse";
        const formData = new FormData();
        this.state.fileListRec.map( (file,i) => {
          formData.append("file"+i,file)
        })
        formData.append("reclamation",JSON.stringify(Reclamation))
        axios.post('http://localhost:5000/api/reclamations/ajouterReclamation', formData)
        .then(res => {
    
          
    
    //Tester un code 
    const arrayrecipents=[];
    axios.get('http://localhost:5000/api/notifications/getAllUsersToVerifyTheNotifications')
    .then((resp) => {
      resp.data.UsersList.map((item) => {
        //if(item._id!=user._id &&item.role=="user"){
        // Get latidude & longitude from address of users.
        Geocode.fromAddress(item.adresse).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
             this.state.latAdresseUser=lat;
             this.state.lngAdresseUser=lng;
        //Compare the two addresses with haversin;e_distance algorithm
         var rad = function(x) {
          return x * Math.PI / 180;
          };
          var R = 6378137;
          var dLat = rad(this.state.position.lat - this.state.latAdresseUser);
          var dLong = rad(this.state.position.lng - this.state.lngAdresseUser);
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(this.state.latAdresseUser)) * Math.cos(rad(this.state.position.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var distance = R * c;
          //  distance returns the distance in meter
   
      if (distance<=5000&&item.role=="user"){
      if(item._id!=user._id ){
         
        arrayrecipents.push(item);
        this.setState({recipients: arrayrecipents});
        localStorage.setItem("recipientsnotif",JSON.stringify(arrayrecipents));
     
      
        // this.setState({ 
        //   recipients:[...this.state.recipients, item]
        // })
      }
      }
     
      }
       );
     
      })
    
     
    }
    ).catch(err => console.log(err));
    
    
    

    const data=localStorage.getItem("recipientsnotif");

      var arraydata=[];
      arraydata=JSON.parse(data);
        var notif = {
          content : text,
          user:user,
          recipients:arraydata
        }
        //Le code de la notification 
        const headers = { headers: {
        "Accept": "application/json",
         "Content-type": "application/json",
        }}
                       axios.post('http://localhost:5000/api/notifications/addNotification', notif,headers)
                          .then(res => { 
                          const json = { type: 'notification' };
                          json.data = res.data;
                   
                          this.state.actions.send(JSON.stringify(res.data));
                          this.setState({content : ''});
                          localStorage.removeItem('recipientsnotif')
                        }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                        openNotificationWithIcon('success');
    this.setState({
              address: '',
              lng:'',
              lat:'',
              description: '',
              date:moment().format("DD-MM-YYYY"),
              content: '',
              recipients:[],
      
      });
    
      }
    });

   


  }
 
  ///////////////////////////////////
  render () {
    const { fileListRec } = this.state;
    const { getFieldDecorator } = this.props.form
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileListRec.indexOf(file);
          const newfileListRec = state.fileListRec.slice();
          newfileListRec.splice(index, 1);
          return {
            fileListRec: newfileListRec,
          };
        });
      },
      multiple: true,
      beforeUpload: file => {
        this.setState(state => ({
          fileListRec: [...state.fileListRec, file],
        }));
        return false;
      },
      fileListRec,
    };
    return (
      <div className="gx-main-content">
      <div className="gx-app-module gx-chat-module">
        <div className="gx-chat-module-box">
          {/* <div className="gx-chat-sidenav gx-d-none gx-d-lg-flex"> */}
  
 <Card className="gx-card" style={{ width: 500,color:"#038fde"}} title="Réclamer une zone dangereuse">
      <div>
      <Form onSubmit={this.handleSubmit}>
      <Descriptions title="Choisir La date de l'incident :">
      </Descriptions>
      <FormItem
            {...formItemLayout}
 
          >
            <DatePicker
            className="gx-mb-3 gx-w-100"
            format="DD-MM-YYYY"
            defaultValue={moment(this.state.date,"DD-MM-YYYY")}
            onChange={this.handleDateChange}
          />
          </FormItem>
          <Descriptions title="Décrivez l'incident">
      </Descriptions>
          <Form.Item
            {...formItemLayout}
          >

{getFieldDecorator("Description", {
            rules: [{ required: true, message: "Vous devez décrire l'incident!" }]
          })(
            <Input.TextArea
            style={{ width: 800}}
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="Décrivez l'incident avec des détails"
            name="description"
            value={this.state.description}
            onChange={this.handleDescriptionChange}
           
          />
          )}
           
          </Form.Item>
          <Descriptions title="Ajouter une photo l'incident ">
      </Descriptions>
        <FormItem
            {...formItemLayout}
          >
            <div className="dropbox">
              <Upload.Dragger {...props}
              style={{ width: 300}}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Cliquer ici ou déplacer vos photos ici</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            </div>
          </FormItem>
          <Descriptions title="Choisir l'adressse de l'incident">

</Descriptions>
<FormItem
            {...formItemLayout}
          >
{getFieldDecorator("Adresse", {
          rules: [{ required: true, message: "Vous devez sélectionner une adresse l'incident!" }]
        })(
 
        <div className="gx-form-group">
        <Input
         placeholder="Sélectionnez l'adresse de l'incident avec des détails"
          onChange= {this.handleAddressChange}
          value={this.state.address}
          margin="normal"
          name="adresse"
          />
      </div>
        )}
        </FormItem>
             <Form.Item {...formItemLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
          </Form>
      </div>
      </Card>
          {/* </div> */}
            <Card className="gx-card"  style={{ width: 800}}>

 
          <LocationPicker
            containerElement={ <div style={ {height: '100%'} } /> }
            mapElement={ <div style={ {height: '600px',marginTop:"25px"} } /> }
            defaultPosition={this.state.defaultPosition}
            radius={-1}
            onChange={this.handleLocationChange}
          />
          </Card>
          
        
        </div>
      </div>
    </div>
    )
  }
}

export default Form.create()(LocationPickerExample)

//ReactDOM.render(<LocationPickerExample />, document.getElementById('root'));
