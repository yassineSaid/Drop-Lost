import React from "react";
import { Button, Modal, Collapse, Form, Select, Tooltip, Icon, Card, Row, Col, notification, message,Popover } from "antd";
import "./basic.less";
import Moment from "moment";
import axios from 'axios';
import MapGL, { Marker, GeolocateControl, setRTLTextPlugin } from 'react-map-gl';
import Pin from './pin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Redirect } from "react-router-dom";

const mapboxgl = require('mapbox-gl');

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

const TOKEN = 'pk.eyJ1Ijoib3Vzc2FtYWZlIiwiYSI6ImNrM3hvMDUxZjBzZG8za3A2cHNyMzh3bWQifQ.zjwKRhcnIP_nowp9lPg5PA'; // Set your mapbox token here



class Confirmer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      annonce: this.props.annonce[0],
      match: this.props.match[0],
      disabled: true,
      methode: null,
      recherche: 'Recherche en cours de la boutique la plus proche à votre position !',
      latitude: null,
      longitude: null,
      store: [],
      loading: "validating",
      navigate: false,
      viewport: {
        latitude: 36.8065,
        longitude: 10.1815,
        zoom: 8,
        bearing: 0,
        pitch: 0
      },
      routes: [],
      copied: false,
      ref: null,
      selectedStore : null,
      showMap : false,
    }
    this.selectChange = this.selectChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      success => this.setState({
        latitude: success.coords.latitude,
        longitude: success.coords.longitude,
        viewport: {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
          zoom: 8,
          bearing: 0,
          pitch: 0
        }
      })
    );

    if (mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        false
      );
    }
  }

  componentDidUpdate() {
    //console.log(this.state.showMap)
  }

  success = () => {
    message.success('Coordonnées copiés !');
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  selectChange = (value) => {
    this.setState({
      methode: value,
      disabled: false
    })
    if (value === 'Boutique') {
      const payload = {
        lat: this.state.latitude,
        lon: this.state.longitude
      }
      //console.log(payload)
      axios.get(process.env.REACT_APP_API_URL + "api/chat/store", { params: payload, withCredentials: true }).then(
        response => {
          //console.log(response);
          this.setState({
            store: response.data,
            selectedStore : response.data[0],
            loading: "success",
            recherche: 'Distance : ' + (response.data[0].distance / 1000).toFixed(2) + ' km',
          })
        }
      ).catch()
    }
  };

  close = () => {
    this.setState({
      navigate: true
    })
  };

  openNotification = (type) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => notification.close(key)}>
        Plus de details
      </Button>
    );
    notification[type]({
      message: 'Succés',
      description: 'Votre demande de matching a été traiter avec succés.',
      btn,
      key,
      onClose: this.close(),
    });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    const payload = {
      perdu: this.state.annonce._id,
      trouve: this.state.match._id,
      methode: this.state.methode,
      boutique: this.state.methode === 'Boutique' ? this.state.selectedStore._id : ''
    }

    console.log(payload)
    axios.post(process.env.REACT_APP_API_URL + "match/create", payload, { withCredentials: true }).then(
      response => {
        this.setState({
          ref: response.data.match
        })
      }
    ).catch()
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);

    setTimeout(() => {
      this.openNotification('success');

    }, 2500);

  };

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  onSelectChange = (value) => {
    this.setState({
      showMap : true,
      selectedStore : this.state.store[value]
    })
  }

  render() {
    const { visible, confirmLoading, disabled, viewport, selectedStore } = this.state;
    const formItemLayout = {
      labelCol: { xs: 24, sm: 7 },
      wrapperCol: { xs: 24, sm: 17 },
    };
    const formItemLayout1 = {
      labelCol: { xs: 24, sm: 0 },
      wrapperCol: { xs: 24, sm: 24 },
    };
    if (this.state.navigate) {
      return <Redirect to={'/in-built-apps/match/' + this.state.ref} />;
    }
    return (

      <div className="ant-card-extra">
        <Button type="primary" size="default" icon="check" onClick={this.showModal}>Confirmer</Button>
        <Modal title="Confirmer le matching !"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Annuler</Button>,
            <Button key="submit" type="primary" loading={confirmLoading} onClick={this.handleOk} disabled={disabled}>Confimer</Button>
          ]}
        >
          <Collapse >
            <Panel header="Votre Annonce" key="1">
              <div className="gx-flex-row">
                <h5><i className="icon icon-data-entry"></i> Description</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{this.state.annonce.description}</span>
              </div>
              <div className="gx-flex-row">
                <h5><i class="icon icon-calendar"></i> Date d'ajout</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{Moment(this.state.annonce.date).format('dddd LL')}</span>
              </div>
            </Panel>
            <Panel header="Annonce similaire " key="2">
              <div className="gx-flex-row">
                <h5><i class="icon icon-data-entry"></i> Description</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{this.state.match.description}</span>
              </div>
              <div className="gx-flex-row">
                <h5><i className="icon icon-calendar"></i> Date d'ajout</h5>
                <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                <span>{Moment(this.state.match.date).format('dddd LL')}</span>
              </div>
            </Panel>
          </Collapse>
          <div>
            <br></br>
          </div>
          <Card className="gx-card" title="Details">
            <Form >
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    Récuperation&nbsp;
                    <Tooltip title="Vous pouvez récuperer votre objet de la boutique la plus proche à vous !">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
                hasFeedback
              >
                {<Select placeholder="Selectionner une option" onChange={this.selectChange}>
                  <Option value="En Personne">En Personne</Option>
                  <Option value="Boutique">Boutique TrustIt </Option>
                </Select>}
              </FormItem>
              {this.state.methode === 'Boutique' ?
                <Row>
                  <Col span={24} sm={2}>
                    <div className="icons">
                      <i className="icon icon-location"></i>
                    </div>
                  </Col>
                  <Col span={24} sm={18}>
                    <FormItem
                      {...formItemLayout1}
                      hasFeedback

                      validateStatus={this.state.store.length !== 0 ? "" : "validating"}
                    >
                      <Select
                        name="boutique"
                        placeholder= "Selectionner une boutique "
                        onChange={this.onSelectChange}
                        disabled={this.state.store.length !== 0 ? false : true}
                      >
                        {this.state.store.length !== 0 ? this.state.store.map(function (item, i) {
                          return <Option value={i} key={i}>{item.store.name}</Option>
                        }) : null  }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={2}>
                    {this.state.loading === 'success' ?
                      <CopyToClipboard text={selectedStore.store.location.coordinates[0]+","+selectedStore.store.location.coordinates[1]}>
                        <Popover placement="right" content={parseFloat(selectedStore.distance / 1000).toFixed(2) + " - KM"} title="Distance">
                          <Button onClick={this.success}><i className="icon icon-copy"></i></Button>
                        </Popover>
                      </CopyToClipboard> : ''}
                  </Col>
                </Row> : ''
              }
            </Form>
            { this.state.showMap && this.state.methode === "Boutique" ?
              <div className="nt-col-xs-24 ant-col-sm-26">
                <MapGL
                  {...viewport}
                  width="100%"
                  height="350px"
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  onViewportChange={this._updateViewport}
                  mapboxApiAccessToken={TOKEN}
                >
                  <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                  />

                  <Marker
                    longitude={selectedStore.store.location.coordinates[1]}
                    latitude={selectedStore.store.location.coordinates[0]}
                    offsetTop={-20}
                    offsetLeft={-10}
                  >
                    <Pin size={20} />
                  </Marker>
                </MapGL>
              </div> : ''}
          </Card>
        </Modal>
      </div>
    );
  }
}

export default Confirmer;
