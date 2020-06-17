import React from "react";
import { Avatar, Card, Icon, List, Spin,Button,Modal,Input, Form,DatePicker } from "antd";
import Widget from "components/Widget";
import moment from "moment";
import 'moment/locale/fr';
import { Link } from "react-router-dom";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import TextArea from "antd/lib/input/TextArea";
import Geocode from "react-geocode";

moment.locale('fr')
Geocode.setApiKey("API_KEY");
const listData = [];
for (let i = 0; i < 5; i++) {
  listData.push({
    href: 'http://ant.design' +
      '' +
      '',
    title: `Ant design part ${i}`,
    avatar: 'https://via.placeholder.com/290x193',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}





const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class MesreclamationsList extends React.Component {
handleCancel = () => this.setState({previewVisible: false})
handlePreview = (file) => {
  console.log("previewImage")

}
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reclamations: [],
      pagination: {
        pageSize: 5,
        current: 1,
        total: 0
      },
      address: '',
      description:'',
      reclamation:undefined,
      displayModal:false,
      date:'',
      lat:'',
      lng:''
    };
    //Bind
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.onChange = this.onChange.bind(this)
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
handleDateChange(e) {
  this.setState({
      date: e.target.value
  });
}
  onChange(page, pageSize) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: page
      }
    })
  }
  supprimerReclamation(item){

axios.get('http://localhost:5000/api/reclamations/supprimerReclamation/'+item._id)
.then((resp) => {
this.componentDidMount()
}
).catch(err => console.log(err));


  }
  getReclamation(e){
this.setState({reclamation:e,
  displayModal:true,address:e.address});
  }
  handleChange = address => {
    this.setState({ address:address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };


  componentDidMount() {
    // getMesAnnonces().then(response => {
    //   if (response.done) {
    //     console.log(response.response.data)
    //     this.setState({
    //       loading: false,
    //       annonces: response.response.data.annonces,
    //       pagination: {
    //         ...this.state.pagination,
    //         total: response.response.data.annonces.length,
    //         onChange: this.onChange
    //       }
    //     })
    //   }
    //   else {
    //     if (response.response.response.status === 401) {
    //       window.location.replace('/signin');
    //     }
    //   }
    // })

    let user = JSON.parse(localStorage.getItem('User'));

    axios.get('http://localhost:5000/api/reclamations/getAllReclamations', { params: { userId: user._id }, withCredentials: true })
    .then((resp) => {
           this.setState({
          loading: false,
          reclamations: resp.data,
          pagination: {
            ...this.state.pagination,
            total: resp.data.length,
            onChange: this.onChange
          }
        })

    }
    ).catch(err => console.log(err));
  }
 ModifyReclamation(e){
 
  Geocode.fromAddress(this.state.address).then(
    response => {
      const { lat, lng } = response.results[0].geometry.location;
      this.setState({lat:lat,lng:lng});
      var Reclamation={
        _id:this.state.reclamation._id,
        description:this.state.description,
        address:this.state.address,
        lat:this.state.lat,
        lng:this.state.lng
      }
       axios.put('http://localhost:5000/api/reclamations/updateReclamation',Reclamation)
    .then((resp) => {
  
           this.setState({
          reclamation: undefined,
          displayModal:false
        })
        this.componentDidMount()

    }
    ).catch(err => console.log(err));

    },
    error => {
      console.error(error);
    }
  );
 }
  render() {
    return (
      <Card className="gx-card" title="Mes reclamations">
    
    {this.state.reclamation!=null ? 
       <Modal visible={this.state.displayModal} footer={null} onCancel={() => this.setState({ displayModal: false,reclamation:undefined})} title="Modifier une Réclamation">
     <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
               <div className="gx-modal-box-form-item">
            <div className="gx-form-group">
            <Input
        
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'gx-form-group',
               
              })}
            />
            </div>
            </div>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <div className="gx-modal-box-row">
          <div className="gx-modal-box-avatar">
     
          </div>
          <div className="gx-modal-box-form-item">
          <div className="gx-form-group">
            <DatePicker
            className="gx-mb-3 gx-w-100"
            format="DD-MM-YYYY"
            defaultValue={moment(this.state.reclamation.date,"DD-MM-YYYY")}
            onChange={this.handleDateChange}
          />
            </div>
            <div className="gx-form-group">
              <TextArea
                required
                placeholder="Description"
                onChange={this.handleDescriptionChange}
              defaultValue={this.state.reclamation.description}
                margin="none"/>
            </div>
  
            <div style={{display: 'flex',justifyContent: 'end'}}>
            <Button onClick={() => this.ModifyReclamation(this.state.reclamation)} >Modifier</Button>
            <Button danger type="danger" onClick={() => this.setState({ displayModal: false,reclamation:undefined})}>Cancel</Button>
            </div>
          </div>
        </div>
  </Modal>
  :<h1></h1>}
      
      
        
        
         {!this.state.loading ?
        
          <List
            itemLayout="vertical"
            size="large"
            pagination={this.state.pagination}
            dataSource={this.state.reclamations}
            renderItem={item => (
              <List.Item
                key={item._id}
                //actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />,
                //<IconText type="message" text="2" />]}
                //extra={}
              >
                <div style={{display: 'flex',justifyContent: 'end'}}>
         <List.Item.Meta 
         title={<img className="gx-img-fluid" width={250} alt="logo"
         src={item.photo.length>0 ? "http://localhost:5000/uploadsReclamations/"+item.photo[0].replace('["','').replace('"]','') : process.env.REACT_APP_API_URL+"uploads/no-image.jpg"} />}
         >
         </List.Item.Meta>
         </div>
                <List.Item.Meta
                  avatar='https://via.placeholder.com/290x193'
                  title={

                  
                  <p>Reclamation du {moment(item.date).format("DD MMMM YYYY")}</p>
 
                  }
                  description={item.address}
                />
                <List.Item.Meta
                  title={
                    <div className="gx-card-list-footer" style={{display: 'flex',justifyContent: 'end'}}>
                     
                    <Button type="primary" onClick={() => this.getReclamation(item)} >Modifier</Button>
                    <Button type="danger"onClick={() => this.supprimerReclamation(item)}>Supprimer</Button>
              
                   </div>

                  }
                >
                </List.Item.Meta>
       
              </List.Item>
            )}
          /> :
          <Spin size="large" />}
      </Card>
    );
  }
};

export default MesreclamationsList;