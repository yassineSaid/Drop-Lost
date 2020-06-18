// import React from "react";


// export default class ListeDesReclamations extends React.Component {
// }



import React, {Component} from "react";
import {Circle, GoogleMap, InfoWindow, withGoogleMap,Marker} from "react-google-maps";
import canUseDOM from "can-use-dom";
import raf from "raf";
import { connect } from "react-redux";
import axios from 'axios';
import { JSDOM } from "jsdom";
import _ from 'lodash';
const geolocation = (
  canUseDOM && navigator.geolocation ?
    navigator.geolocation :
    ({
      getCurrentPosition(success, failure) {
        failure(`Your browser doesn't support geolocation.`);
      },
    })
);
let recycleCenters = [{lat:36.86336,lng:10.16866},{lat:36.80987,lng:10.18812},{lat:36.8092,lng:10.08685}]
var TrustItCenters=[]
var reclamations=[]
var isOpen=false;
const GeolocationExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={11}
    center={props.center}
  >
      {TrustItCenters.map(center => (
            <Marker
                 key={center.id}
                 defaultIcon={require("assets/images/marker.png")}
                 position={{
                     lat: center.lat,
                     lng: center.lng
                 }}

                 >
                 </Marker>

        ))}
{props.center && reclamations.map(center => (
     <Circle center={{ lat:  parseFloat(center.lat), lng:parseFloat(center.lng) }}     radius={props.radius} options={{
        fillColor: 'red',
        fillOpacity: 0.20,
        strokeColor: 'red',
        strokeOpacity: 1,
        strokeWeight: 1,
      }}
     />

        ))
}
    {props.center && (
      <Marker
      position={props.center}

      />
    )}
  </GoogleMap>
));

/*
 * https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class ListeDesReclamations extends Component {

  state = {
    center: null,
    content: null,
    radius: 10000,
    store : null,
    stores : [],
    TrustItCenters:[],
    reclamations:[],
    isOpen: false
  };

  isUnmounted = false;
  handleToggleOpen = () => {

    this.setState({
      isOpen: true
    });
  }
  
  handleToggleClose = () => {
    this.setState({
      isOpen: false
    });
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/reclamations/getReclamations')
    .then((resp) => {
   console.log("Les reclamations"+JSON.stringify(resp.data))
   resp.data.forEach(element => {
    const val={lat:element.lat,lng:element.lng}
    reclamations.push(val);
    localStorage.setItem('listeReclam',reclamations)
       
   });
   this.setState({reclamations:localStorage.getItem('listeReclam')})
    }
    ).catch(err => console.log(err));
      //DEBUT CODE
      axios.get("https://api.allorigins.win/raw?url=https://www.trustit.tn/reseau-trustit/").then(response => {
        const page = new JSDOM(response.data);
        const storesList = page.window.document.querySelectorAll(".panel-title a");
        const storesName = [];
     
        storesList.forEach(element => {
          const data = {
            name : element.innerHTML.trim(),
            code : element.attributes['aria-controls'].nodeValue.replace('collapse','marker'),
          }
          storesName.push(data);
        })
   

        const array = response.data.replace(/\s/g,'').match(/marker.*?(?=;)/gm);
     
        const arr = array.filter(element => element.match(/^marker[0-9]+.*/));
    
        const finale = arr.map(element => {
          return ({
              code : element.split('=')[0],
              location: {
                  type : 'Point',
                  coordinates: [parseFloat(element.match(/lat:(.*)(?=,lng)/)[1]) , parseFloat(element.match(/lng:(.*)(?=},map)/)[1]) ]
              }
          })
      })
  
      var merged = _.merge(_.keyBy(storesName, 'code'), _.keyBy(finale, 'code'));
      var values = _.values(merged);
      console.log("stores list"+JSON.stringify(values))      


      values.forEach(element => {
        console.log("stores list"+JSON.stringify(element.location.coordinates[1]));
        const val={lat:element.location.coordinates[0],lng:element.location.coordinates[1]}
        TrustItCenters.push(val);
        localStorage.setItem('liste',TrustItCenters)
    })

    
      this.setState({
        stores : values,
        TrustItCenters:localStorage.getItem('liste')

      })
      })
      this.setState({listCenters:localStorage.getItem('liste',TrustItCenters)})
       console.log("The stores"+this.state.stores)
      //
    const tick = () => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({radius: Math.max(this.state.radius - 20, 0)});

      if (this.state.radius > 800) {
        raf(tick);
      }
    };
    geolocation.getCurrentPosition((position) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        content: `Location found using HTML5.`,
      });

      raf(tick);
    }, (reason) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: 60,
          lng: 105,
        },
        content: `Error: The Geolocation service failed (${reason}).`,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <GeolocationExampleGoogleMap
        loadingElement={<div style={{height: `100%`}}/>}
        containerElement={<div style={{height: `550px`}}/>}
        mapElement={<div style={{height: `100%`}}/>}
        center={this.state.center}
        content={this.state.content}
        radius={this.state.radius}
      />
    );
  }
}
