import React from "react";
import { Button, Modal, Collapse, Form, Select, Tooltip, Icon, Card, Row, Col, Divider, message } from "antd";
import "./basic.less";
import Moment from "moment";
import axios from 'axios';
import MapGL, { Marker, GeolocateControl, setRTLTextPlugin } from 'react-map-gl';
import Pin from './pin';
import { CopyToClipboard } from 'react-copy-to-clipboard';


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


class Confimer extends React.Component {

  constructor(props) {
    super(props);
    //console.log(this.props)
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
      store: null,
      loading: "validating",
      viewport: {
        latitude: 36.8065,
        longitude: 10.1815,
        zoom: 8,
        bearing: 0,
        pitch: 0
      },
      copied: false,
    }
    this.selectChange = this.selectChange.bind(this);
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
        true
      );
    }
  }

  componentDidUpdate() {
    console.log(this.state)
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
      methode: value
    })
    if (value === 'boutique') {
      const payload = {
        lat: this.state.latitude,
        lon: this.state.longitude
      }
      //console.log(payload)
      axios.get("http://localhost:5000/api/chat/store", { params: payload, withCredentials: true }).then(
        response => {
          //console.log(response);
          this.setState({
            store: response.data[0],
            loading: "success",
            recherche: 'Distance : ' + (response.data[0].distance / 1000).toFixed(2) + ' km'
          })
        }
      ).catch()
    }
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  render() {
    const { visible, confirmLoading, disabled, viewport } = this.state;
    const formItemLayout = {
      labelCol: { xs: 24, sm: 7 },
      wrapperCol: { xs: 24, sm: 17 },
    };
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
                  <Option value="directe">En Personne</Option>
                  <Option value="boutique">Boutique TrustIt </Option>
                </Select>}
              </FormItem>
              {this.state.methode === 'boutique' ?
                <Row>
                  <Col span={24} sm={2}>
                    <div className="icons">
                      <i className="icon icon-location"></i>
                    </div>
                  </Col>
                  <Col span={24} sm={18}>
                        <h3 className="loc">{this.state.loading === "success" ? this.state.store.store.name : 'Recherche en cours ...'}</h3>
                  </Col>
                  <Col sm={2}>
                    {this.state.loading === 'success' ?
                      <CopyToClipboard text={`${this.state.store.store.location.coordinates[0]}, ${this.state.store.store.location.coordinates[1]}`} onCopy={() => this.setState({ copied: true })}>
                          <Button onClick={this.success}><i className="icon icon-copy"></i></Button>
                      </CopyToClipboard> : ''}
                  </Col>
                </Row> : ''
              }
            </Form>
            {this.state.loading === 'success' ?
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
                    longitude={this.state.store.store.location.coordinates[1]}
                    latitude={this.state.store.store.location.coordinates[0]}
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

export default Confimer;
