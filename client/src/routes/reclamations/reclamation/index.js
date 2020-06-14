import React, { Component } from "react";
import { Modal, Card, Icon, Row, Col, Carousel, Tag, Button,Input } from "antd";
import { getAnnonce, supprimerAnnonce } from "../../../requests/annonces";
import moment from "moment";
import 'moment/locale/fr';
import Meta from "antd/lib/card/Meta";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
moment.locale('fr')




class Reclamation extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    console.log(params)
    this.state = {
      id: params.id,
      loading: true,
      reclamation: null,
      images: [],
      redirect: false,
      redirectToMesreclamations: false,
      user: JSON.parse(localStorage.getItem('User')),
      owner: false
    };
    this.handleContact = this.handleContact.bind(this);
    this.handleSupprimer = this.handleSupprimer.bind(this);
  }
  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  componentDidMount() {
    // getreclamation(this.state.id).then(response => {
    //   if (response.done) {
    //     console.log(response.response.data)
    //     this.setState({
    //       loading: false,
    //       annonce: response.response.data.annonce,
    //       matched: response.response.data.matched,
    //       annonces: response.response.data.annonces,
    //       images: response.response.data.annonce.images
    //     })
    //     if (this.state.user !== null) {
    //       console.log(this.state.user._id)
    //       console.log(response.response.data.annonce.user)
    //       if (this.state.user._id === response.response.data.annonce.user) {
    //         this.setState({
    //           owner: true
    //         })
    //       }
    //     }
    //   }
    //   else {
    //     if (response.response.response.status === 401) {
    //       window.location.replace('/signin');
    //     }
    //   }
    // })
  }

  handleSupprimer() {
    supprimerAnnonce(this.state.annonce._id).then(response => {
      if (response.done) {
        Modal.success({
          content: 'Votre annonce a bien été supprimée',
          onOk() {
            this.setState({
              redirectToMesAnnonces: true
            })
          }
        });
        console.log(response)
      }
      else if (response.response.response.status === 401) {
        Modal.error({
          content: 'Vous ne pouvez pas supprimer cette annonce',
        });
      }
    })
  }

  handleContact(match, annonce) {
    const payload = {
      to : match.user._id,
      annonce : annonce._id,
      matchAnnonce : match._id
    }
    axios.post(process.env.REACT_APP_API_URL+"api/chat/create", payload, { withCredentials: true }).then(
      () => this.setState({ redirect: true })
    ).catch(error => {
      if (error.response.status === 401) {
        window.location.href = '/signin'
      }
    })
  }

  render() {

    const { redirect, redirectToMesAnnonces } = this.state;
    if (redirect) {
      return <Redirect to='/in-built-apps/chat/' />;
    }
    if (redirectToMesAnnonces) {
      return <Redirect to='/reclamations/mesReclamations' />;
    }

    return (
      <div>
             <Modal visible={true} footer={null} onCancel={this.handleCancel}>
    
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
           <Input
             required
             placeholder="Name"
            // onChange={(event) => this.setState({name: event.target.value})}
             //defaultValue={name}
             margin="none"/>
         </div>
         <div className="gx-form-group">
           <Input
             placeholder="Email"
             //onChange={(event) => this.setState({email: event.target.value})}
             //value={email}
             margin="normal"/>
         </div>
         <div className="gx-form-group">
           <Input
             placeholder="Phone"
             //onChange={(event) => this.setState({phone: event.target.value})}
            // value={phone}
             margin="normal"
           />
         </div>
         <div className="gx-form-group">
           <Input
             placeholder="Designation"
             //onChange={(event) => this.setState({designation: event.target.value})}
            // value={designation}
             autosize={{minRows: 2, maxRows: 6}}
             margin="normal"/>
         </div>
       </div>
     </div>
   
       </Modal>
     
        
  
      </div>
    );
  }
};

export default Reclamation;
