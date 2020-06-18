import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  Circle,
  DirectionsRenderer,
  InfoWindow
} from "react-google-maps";
import axios from 'axios';
import { JSDOM } from "jsdom";
import _ from 'lodash';
import { Polyline } from "react-google-maps";
import {Layout,Card, Col,Row,Button,Modal,List,Tag} from "antd";
import { compose, withProps } from "recompose";
import PropTypes from "prop-types";
import Widget from "components/Widget/index";
import { Redirect } from "react-router-dom";
const google = window.google;
class MapDirectionsRenderer extends React.Component {
  static propTypes = {
    waypoints: PropTypes.array,
    places: PropTypes.array
  };
  state = {
    directions: null,
    error: false,
    couleurNb:0,
    reclamations:[],
    stores : [],
    TrustItCenters:[],
    isOpen:false
  };

  componentDidMount() {
    const { places } = this.props;
    const waypoints = places.map(p => ({
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true
    }));
 
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: waypoints,
        provideRouteAlternatives: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            markers: true
          });
        } else {
          //   this.setState({ error: result });
        }
      }
    );
  }
 
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { places } = nextProps;
    const waypoints = places.map(p => ({
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: waypoints
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            multiDirection:nextProps.geocodedWaypoints && nextProps.geocodedWaypoints.length
              ? nextProps.geocodedWaypoints
              : []
          });
        } else {
          //   this.setState({ error: result });
        }
      }
    );
  }
 

  render() {
    
    // if (this.state.error) {
    //   return <h1>{this.state.error}</h1>;
    // }
    return (
      this.state.directions && (
        <DirectionsRenderer
          directions={this.state.directions}
          routeIndex={this.props.index}
          options={{
            polylineOptions: {
              strokeOpacity: 1,
              strokeWeight: 2,
              strokeColor: this.props.colors
            }
          }}
        />
      )
    );
  }
}
var isOpen=false;
//Les fonctions
function handleToggleOpen (){
isOpen=true;

}

function handleToggleClose() {
  isOpen=false;
}

function envoyerMessage(points){
  var pathtosend="Je vous propose un Rendez vous à cet endroit https://www.google.fr/maps/@"+points.lat+","+points.lng+",13z"
  var idMatch = window.location.href.substring(window.location.href.lastIndexOf('/')+1);
  const payload = {
    match: idMatch
  }
  axios.get(process.env.REACT_APP_API_URL + "match/", { params: payload, withCredentials: true }).then(
    response => {
      const data = response.data[0];
      const toSend = {
        to : data.annonces[1].user,
        body : pathtosend,
      }
      axios.post(process.env.REACT_APP_API_URL+"api/chat/", toSend, { withCredentials: true }).then(
        (resp) => {
          Modal.success({
            content: 'Votre message a bien été envoyé',
          });
        }
      ).catch(error => {
        console.log(error)
        if (error.response.status === 401) {
          window.location.href = '/signin'
        }
      })
      // if(data !== []) {
      //   const perdu = {
      //     title: "Ajout annonce objet perdu",
      //     description: data.annonces[0].description,
      //     time: Moment(data.annonces[0].date).format('dddd LL')
      //   }
  
      //   const trouve = {
      //     title: "Ajout annonce objet trouvé",
      //     description: data.annonces[1].description,
      //     time: Moment(data.annonces[1].date).format('dddd LL')
      //   }
  
      //   const matchResult = {
      //     title: "Matching entre les deux annonces !",
      //     description: data.etat,
      //     time: Moment(Number(data.date)).format('dddd LL')
      //   }
  
  
      //   this.setState({
      //     matching: response.data[0],
      //     perdu,
      //     trouve,
      //     matchResult,
      //     loading: false,
      //     confirmed: response.data[0].etat === 'Objet Récupéré'
      //   })
      // }
  
    }
  
  ).catch()
}

function fn(element,tab){
  var test =false;
  tab.forEach(itemmarker => 
    { 
     
      if(element.lat==itemmarker.lat&&element.lng==itemmarker.lng)
        {
          alert("true");
          test=true;
        }
      });
      return test;
    }
   // {lat:36.86336,lng:10.16866},{lat:36.86373,lng:10.16819},
   //,{lat:36.86373,lng:10.16819},{lat:36.80674,lng:10.18811} 
let recycleCenters = [{lat:36.86336,lng:10.16866},{lat:36.80987,lng:10.18812},{lat:36.8092,lng:10.08685}]
var reclamations=[]
var TrustItCenters=[]
var liste=[]
var listeNames=[];
const storesName = [];
var   nb=0;
axios.get('http://localhost:5000/api/reclamations/getReclamations')
.then((resp) => {
resp.data.forEach(element => {
const val={lat:element.lat,lng:element.lng}
reclamations.push(val);
})
}
).catch(err => console.log(err));  
      //DEBUT CODE
axios.get("https://api.allorigins.win/raw?url=https://www.trustit.tn/reseau-trustit/").then(response => {
        const page = new JSDOM(response.data);
        const storesList = page.window.document.querySelectorAll(".panel-title a");
    
        storesList.forEach(element => {
          const data = {
            name : element.innerHTML.trim(),
            code : element.attributes['aria-controls'].nodeValue.replace('collapse','marker'),
          }
          storesName.push(data);
        })
        const array = response.data.replace(/\s/g,'').match(/marker.*?(?=;)/gm)
        const arr = array.filter(element => element.match(/^marker[0-9]+.*/))
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

      values.forEach(element => {
        const val={lat:element.location.coordinates[0],lng:element.location.coordinates[1],listeNames:element.name}
        TrustItCenters.push(val);
    })
    TrustItCenters.forEach(element => {
      reclamations.forEach(rec => {
           //Compare the two addresses with haversin;e_distance algorithm
           var rad = function(x) {
            return x * Math.PI / 180;
            };
            var R = 6378137;
            var dLat = rad(element.lat - rec.lat);
            var dLong = rad(element.lng - rec.lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(rec.lat)) * Math.cos(rad(element.lat)) *
              Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = R * c;
            //  distance returns the distance in meter
          
            if(distance>=10000){
        
              var distan=distance/1000;
              const val={lat:element.lat,lng:element.lng,names:element.listeNames,dist:distan}
              liste.push(val);
              //localStorage.setItem('liststr',liste)
            }
      })
    })
     console.log("La liste"+JSON.stringify(liste))
     console.log("el Nb"+nb)
      })
      //
const places = {
    circle: {
      radius: 50,
      options: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      }
    }
  }
const MileageMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5EKrHABEcEowV8yEQh8AnEh0SuTquSQM&v=3.exp",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div key="klj" style={{ height: `400px`,width:'850px',marginBottom:"50px" }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    key={props.travelMode}
    defaultZoom={8}
    center={ { lat:  36.8229819, lng: 10.1758262 } }
  >
{reclamations.map(center => (
            <Marker
                 key={center.id}
                 position={{
                     lat: parseFloat(center.lat),
                     lng: parseFloat(center.lng) 
                 }}
            />
        ))}
        {reclamations.map(center => (
            <Circle center={{ lat:  parseFloat(center.lat), lng:parseFloat(center.lng)  }} radius={200}  options={places.circle.options}
           />
            
        ))}
    {props.wayPoints.map((wayPoint, wayIndex) => {
      
        wayPoint = JSON.parse(JSON.stringify(wayPoint));
      const markerPoints = [
        { latitude: wayPoint.fromLat, longitude: wayPoint.fromLng },
        { latitude: wayPoint.toLat, longitude: wayPoint.toLng }
      ];
      const multiDirectionArray = [];
      wayPoint.geoCodedWayPoints &&
        wayPoint.geoCodedWayPoints.length &&
        wayPoint.geoCodedWayPoints.forEach((multiPoints, index) => {
          multiDirectionArray[index] = [];
          multiPoints.legs[0].steps.forEach((LatLng, idx) => {
          multiDirectionArray[index][idx] = [
              {
                lat: LatLng.start_location.lat,
                lng: LatLng.start_location.lng
              },
              {
                lat: LatLng.end_location.lat,
                lng: LatLng.end_location.lng
              }
            ];
           
          });
        });

      const decode = encoded => {
        var points = [];
        var index = 0,
          len = encoded.length;
        var lat = 0,
          lng = 0;
        while (index < len) {
          var b,
            shift = 0,
            result = 0;
          do {
            b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          var dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lat += dlat;
          shift = 0;
          result = 0;
          do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          var dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lng += dlng;

          points.push({ lat: lat / 1e5, lng: lng / 1e5 });
        }
        return points;
      };
      let count=0;
 //TEST CODE
 // Polygon containsLatLng - method to determine if a latLng is within a polygo
 if (!google.maps.Polygon.prototype.getBounds) {
  google.maps.Polygon.prototype.getBounds = function () {
      var bounds = new google.maps.LatLngBounds();
      this.getPath().forEach(function (element, index) { bounds.extend(element); });
      return bounds;
  }
}
google.maps.Polygon.prototype.containsLatLng = function(latLng) {
  // Exclude points outside of bounds as there is no way they are in the poly

  var inPoly = false,
    bounds, lat, lng,
    numPaths, p, path, numPoints,
    i, j, vertex1, vertex2;

  // Arguments are a pair of lat, lng variables
  if (arguments.length == 2) {
    if (
      typeof arguments[0] == "number" &&
      typeof arguments[1] == "number"
    ) {
      lat = arguments[0];
      lng = arguments[1];
    }
  } else if (arguments.length == 1) {
    bounds = google.maps.Polygon.prototype.getBounds();

    if (!bounds && !bounds.contains(latLng)) {
      return false;
    }
    lat = latLng.lat();
    lng = latLng.lng();
  } else {
    console.log("Wrong number of inputs in google.maps.Polygon.prototype.contains.LatLng");
  }

  // Raycast point in polygon method

  numPaths = this.getPaths().getLength();
  for (p = 0; p < numPaths; p++) {
    path = this.getPaths().getAt(p);
    numPoints = path.getLength();
    j = numPoints - 1;

    for (i = 0; i < numPoints; i++) {
      vertex1 = path.getAt(i);
      vertex2 = path.getAt(j);

      if (
        vertex1.lng() <  lng &&
        vertex2.lng() >= lng ||
        vertex2.lng() <  lng &&
        vertex1.lng() >= lng
      ) {
        if (
          vertex1.lat() +
          (lng - vertex1.lng()) /
          (vertex2.lng() - vertex1.lng()) *
          (vertex2.lat() - vertex1.lat()) <
          lat
        ) {
          inPoly = !inPoly;
        }
      }

      j = i;
    }
  }

  return inPoly;
};
// Polygon containsLatLng - method to determine if a latLng is within a polygon
google.maps.Polygon.prototype.containsLatLng = function(latLng) {
  // Exclude points outside of bounds as there is no way they are in the poly

  var inPoly = false,
    bounds, lat, lng,
    numPaths, p, path, numPoints,
    i, j, vertex1, vertex2;

  // Arguments are a pair of lat, lng variables
  if (arguments.length == 2) {
    if (
      typeof arguments[0] == "number" &&
      typeof arguments[1] == "number"
    ) {
      lat = arguments[0];
      lng = arguments[1];
    }
  } else if (arguments.length == 1) {
    bounds = this.getBounds();

    if (!bounds && !bounds.contains(latLng)) {
      return false;
    }
    lat = latLng.lat();
    lng = latLng.lng();
  } else {
    console.log("Wrong number of inputs in google.maps.Polygon.prototype.contains.LatLng");
  }

  // Raycast point in polygon method

  numPaths = this.getPaths().getLength();
  for (p = 0; p < numPaths; p++) {
    path = this.getPaths().getAt(p);
    numPoints = path.getLength();
    j = numPoints - 1;

    for (i = 0; i < numPoints; i++) {
      vertex1 = path.getAt(i);
      vertex2 = path.getAt(j);

      if (
        vertex1.lng() <  lng &&
        vertex2.lng() >= lng ||
        vertex2.lng() <  lng &&
        vertex1.lng() >= lng
      ) {
        if (
          vertex1.lat() +
          (lng - vertex1.lng()) /
          (vertex2.lng() - vertex1.lng()) *
          (vertex2.lat() - vertex1.lat()) <
          lat
        ) {
          inPoly = !inPoly;
        }
      }
      j = i;
    }
  }

  return inPoly;
};
 //
      var ccount=0;
      var numberpath=0;
      var test=false;
      var a=0;
      const getRandomColor = [];
      let multiDirectionPolygonArray = [];
      //let arrayMultiDirection=[];
      var flightPath;
      var numberpoly=0;
      wayPoint.geoCodedWayPoints &&
       wayPoint.geoCodedWayPoints.length &&
        wayPoint.geoCodedWayPoints.forEach((multiPoints, index) => {
          multiDirectionPolygonArray[index] = [];
          multiPoints.legs[0].steps.forEach((LatLng, idx) => {
           let polygonLatLng = decode(LatLng.polyline.points)
           multiDirectionPolygonArray[index][idx] = polygonLatLng;  
           polygonLatLng.map(i => {
            reclamations.map(element => {
              if(i.lat==element.lat&&i.lng==element.lng){
                count++

              }
            });
             
           });
          });
        });
        multiDirectionPolygonArray.map((marker, index) =>{
   
          marker.map(mrk =>{
           flightPath = new google.maps.Polyline({
              path: mrk,
            });
      
          } );
          var path = flightPath.getPath();
   
          flightPath.latLngs.forEach(element => {
            numberpoly++;
          
            
          });
          if(reclamations.length==0){
            //Vert
            getRandomColor.push("#4caf50");
          }
          reclamations.forEach(element => {
            var pos=new google.maps.LatLng(element.lat,element.lng);
            if (google.maps.geometry.poly.isLocationOnEdge(pos,flightPath))
            {
              ccount++;
              test=true;

            }
          
          //   console.log("The res"+count)
          // console.log("The res cc"+ccount)
          // console.log("TheTest"+test)
           
           a=(count-ccount)/numberpoly;
          //  console.log("The result "+a)
          if(a==0){
            //vert
       
          getRandomColor.push("#4caf50");
  
          }else if(Math.trunc(a)<=2 ){
             //Blue
            getRandomColor.push("#0277bd");
       
          }
          else{
            //Red
            getRandomColor.push("#f5222d");
            nb++;
          }
        });
          });
  
      return (
      
        <React.Fragment key={wayPoint.id}>
          {markerPoints &&
            markerPoints.map((marker, index) => {
              const position = { lat: marker.latitude, lng: marker.longitude };
              return (
                <React.Fragment key={wayPoint.id + index}>
                  <Marker
                    key={index}
                    draggable={true}
                    options={{ draggable: true }}
                    position={position}
                    label={props.labels[wayIndex][index]}
                    labelStyle={{ background: "#fff", color: "#FFF" }}
                  />
                </React.Fragment>
              );
            })}
          {multiDirectionPolygonArray &&
            multiDirectionPolygonArray.map((marker, index) =>
              marker.map(mrk => (
                <Polyline
                  path={mrk}
                  geodesic={true}
                  options={{
                    strokeColor:getRandomColor[index],
                    strokeOpacity: 1,
                    strokeWeight: 4
                  }}
                />
              ))
            )}
          <MapDirectionsRenderer
            places={markerPoints}
            routeIndex={wayPoint.id}
            colors={getRandomColor[wayIndex]}
            geocodedWaypoints={wayPoint.geoCodedWayPoints}
          />
    
          <div id={`GoogleMapaccordion`} className="col-md-12">
       <Card>
          <Row>
                {wayPoint.geoCodedWayPoints &&
                  wayPoint.geoCodedWayPoints.length > 0 &&
                  wayPoint.geoCodedWayPoints.map((points, index) => (
           
               <Col>
               
                <Card.Grid style={{marginLeft:"17px",height:"300px",width:"250px"}}>

                <h4 style={{color:getRandomColor[wayIndex],fontWeight:'bold'}} >Route <sub
                    className="gx-fs-md gx-bottom-0">{index+1} | {getRandomColor[wayIndex]=="#0277bd"?"Bleu":""}
                    {getRandomColor[wayIndex]=="#4caf50"? "Verte":""}
                    {getRandomColor[wayIndex]=="#f5222d"? "Rouge":""}
                    </sub></h4>
                    <hr class="solid" style={{borderTop:"2px solid #bbb"}}></hr>
              <div className="gx-currentplan-row" style={{display: 'flex',  justifyContent:'center',marginTop:"20px"}}>
                <div className="gx-currentplan-col" >
                {/* <div className="gx-currentplan-col gx-currentplan-right">
                  <div className="gx-currentplan-right-content">
                  </div>
                </div>
               */}
                  {/* <p className="gx-mb-1"><span className="gx-size-10 gx-bg-dark gx-rounded-xs gx-d-inline-block gx-mr-1"/> 
                  <span>
               {points.legs && points.summary}
                </span>
                 </p>     */}
                  <p style={{fontWeight: "bold"}}><i class="icon icon-location"></i>{points.legs && points.summary}</p>
                <p>
                  <span style={{fontWeight: 'bold',size:"25px" }}>
                  <i class="icon icon-map-directions"></i> {points.legs[0] &&
                    points.legs[0].distance &&
                    points.legs[0].distance.text}

                  </span>
                      <span className="totla-dis">

                      </span></p>
                  <p className="gx-mb-1">
                  <span style={{fontWeight: 'bold',size:"25px" }}>
                  <i class="icon icon-timepicker"></i> {points.legs[0] &&
                                points.legs[0].duration &&
                                points.legs[0].duration.text}
                </span>
                 </p>
                {/* {nb>=6 ? <h1>Nochhh</h1>: ""} */}
                {getRandomColor[wayIndex]=="#0277bd"?  <Button type="primary" icon="check" onClick={() =>envoyerMessage(points.legs[0].end_location)} >
                 Choisir
                </Button >:""}
                <hr class="solid" style={{borderTop:"2px solid #bbb"}}></hr>
                <h4 style={{color:getRandomColor[wayIndex],fontWeight:'bold'}} > {getRandomColor[wayIndex]=="#0277bd"?"1 point dangeureux":""}
                    {getRandomColor[wayIndex]=="#4caf50"? "Aucun point dangeureux":""}
                    {getRandomColor[wayIndex]=="#f5222d"? "Beaucoup de points dangeureux":""}
                    
                  </h4>
                  {getRandomColor[wayIndex]=="#4caf50"? 
                <Button type="primary" icon="check" onClick={() =>envoyerMessage(points.legs[0].end_location)} >
                 Choisir
                </Button >:""}
                </div>
              </div>
                </Card.Grid> 
            </Col>
                    ))}
            </Row>  
          {nb>=6?
            
          <Row>
            <Col>
            <List className="gx-mb-4" style={{marginTop:"20px",width:"600px"}}
            size="large"
            header={<div style={{backgroundColor:"#fafafa"}}><p style={{color:"rgb(3, 143, 222)",size:"20px",fontWeight:"bold"}}>Liste des stores sécurisés</p></div>}
            bordered
            dataSource={liste}
            renderItem={item => (<List.Item>
              <Row>
                <Col>
              {item.names}
              </Col>
              <Col style={{display:'flex',justifyContent:'start',marginLeft:"80px"}}>
          <Tag size="15px" color={item.dist >=100 ? "#87d068" : item.dist >= 12 ? "rgb(3, 143, 222)" : "rgb(245, 34, 45)"}>
          Le taux de dangerosité est à {item.dist >=100 ? 90 : item.dist >= 12 ? 70 : 30} %</Tag>
            </Col>
            <Col>
            </Col>
            </Row>
            </List.Item>
              )}
      />
            </Col>
            </Row>
        
             :""} 
            </Card>
            </div>
            </React.Fragment>
        
      );
    })}
{nb>=6?liste.map(center => (
            <Marker
                 key={center.id}
                 defaultIcon={require("assets/images/marker.png")}
                 position={{
                     lat: center.lat,
                     lng: center.lng
                 }}
                 onClick={() => handleToggleOpen()}
                 >
     
            
                {/* <InfoWindow onCloseClick={handleToggleClose()}

                >
                    <span>{center.names}</span>
                </InfoWindow> */}
                 </Marker>

        )):""}
         
  </GoogleMap>
  



));

export default MileageMap;
