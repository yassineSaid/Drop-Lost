import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import PropTypes from "prop-types";
import MileageMap from './MileageMap';
import {Layout,Card, Input, Descriptions,Form,Progress} from "antd";
import './map.css';
import {Col, Row} from "antd";
import Widget from "components/Widget/index";

const labels = [
  ["A", "B"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["I", "J"],
  ["K", "L"],
  ["M", "N"],
  ["O", "P"],
  ["Q", "R"],
  ["S", "T"],
  ["U", "V"],
  ["W", "X"],
  ["Y", "Z"],
  ["AB", "AC"],
  ["AD", "AE"]
];

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "",     formLayout: 'horizontal', };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log("Success", latLng))
      .catch(error => console.error("Error", error));
  };

  render() {
    const { wayPoints } = this.props;
    const {formLayout} = this.state;
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: {xs: 24, sm: 6},
      wrapperCol: {xs: 24, sm: 14},
    } : null;
    const buttonItemLayout = formLayout === 'horizontal' ? {
      wrapperCol: {xs: 24, sm: {span: 14, offset: 6}},
    } : null;
    return (
  
      <React.Fragment>
       <Row>
      <Col lg={8} md={12} sm={24} xs={24}>
     <Card style={{width:"350px",height:"500px"}}>
     {wayPoints &&
          wayPoints.map(point => (
            <div
              key={point.id}
              style={{padding: "4px",
                height: "200px",
              
                marginTop: "38px"
              }}
              className="col-md-auto"
            >
              
              <div style={{marginBottom:'10px'}} className="col-md-8">
                <PlacesAutocomplete
                  value={point.fromAddress}
                  onChange={address =>
                    this.props.handleFromChange(address, point.id)
                  }
                  onSelect={address =>
                    this.props.handleFromSelect(address, point.id)
                  }
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading
                  }) => (
                    <div className="autocomplete-root" >
         <Descriptions title="Départ :">
         </Descriptions>
            <Input
                       style={{width:"300px"}}
                        {...getInputProps({
                          placeholder: "Search from ...",
                          className: "location-search-input Map-Input"
                        })}
                      />

                
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              style={{ backgroundColor: "#6855er34" }}
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style
                              })}
                            >
                              <span style={{zIndex:'9999'}}>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              <div  style={{ marginBottom: "10px!important" }} className="col-md-8">
                <PlacesAutocomplete
                  value={point.toAddress}
                  onChange={address =>
                    this.props.handleToChange(address, point.id)
                  }
                  onSelect={address =>
                    this.props.handleToSelect(address, point.id)
                  }
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading
                  }) => (
                    <div className="autocomplete-root">
                      <Descriptions style={{color:"blue"}}title="Destination">
                      </Descriptions>
                      <Input
                      style={{width:"300px"}}
                        {...getInputProps({
                          placeholder: "Search to ...",
                          className: "location-search-input Map-Input"
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              style={{ backgroundColor: "#6855er34" }}
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style
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
 
               
      <h3 style={{display: 'flex',  justifyContent:'center',marginTop:"20px",color:"#038fde"}}>Evaluation des routes</h3>

      <Card className="gx-card">
       <Progress  type="circle" percent={100} width={70}/>
      <Progress  type="circle" percent={50} width={70}/>
      <Progress  type="circle" percent={70} width={70} status="exception"/>
      <Row><p style={{display: 'flex',  justifyContent:'center',color:"#52c41a"}}>Trajet Vert :Sans danger</p><p style={{display: 'flex',  justifyContent:'center',color:"#038fde"}}>Trajet Bleu :Moyennement Dangeureux</p><p style={{display: 'flex',  justifyContent:'center',color:"rgb(255, 85, 0)"}}>Trajet Rouge : Dangeureux</p></Row>
      
      {/* <div id={`GoogleMapaccordion`} className="col-md-12">
                {point.geoCodedWayPoints &&
                  point.geoCodedWayPoints.length > 0 &&
                  point.geoCodedWayPoints.map((points, index) => (

                    <React.Fragment key={index}>
                      <div id={"GoogleMapOne" + index}>
                        <h5
                          className="heading-h5 collapsed"
                          data-toggle="collapse"
                          data-target={"#GoogleMapcollapse" + index}
                          aria-expanded="true"
                          aria-controls={"collapse" + index}
                        >
                          {`Via ${points.legs && points.summary}
                      (${points.legs[0] &&
                        points.legs[0].distance &&
                        points.legs[0].distance.text})`}
                          <span className="totla-dis">
                            <span>
                              {points.legs[0] &&
                                points.legs[0].duration &&
                                points.legs[0].duration.text}
                            </span>
                          </span>
                        </h5>

                        

                        <div className="clearfix" />
                      </div>
                    </React.Fragment>
                    ))}
                    </div> */}
      
      
      
      
      </Card>
  

   

              </div>
            </div>
          ))}
       
          </Card>


 
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
      <Card style={{width:"800px",height:"800px"}}>      <div className="col-md-12 pl-0">
          <MileageMap
            wayPoints={wayPoints}
            labels={labels}
            travelMode="DRIVING"
          />
        </div></Card>
      </Col>
    </Row>
      </React.Fragment>
    );
  }
}
LocationSearchInput.propTypes = {
  handleFromChange: PropTypes.func,
  handleFromSelect: PropTypes.func,
  handleToChange: PropTypes.func,
  handleToSelect: PropTypes.func,
  handleAddLocation: PropTypes.func,
  handleDeleteLocation: PropTypes.func,
  handleSelectRoute: PropTypes.func,
  wayPoint: PropTypes.array
};
export default LocationSearchInput;
