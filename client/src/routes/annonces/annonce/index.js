import React, { Component } from "react";
import { Avatar, Card, Icon, Row, Col, Carousel } from "antd";
import { getAnnonce } from "../../../requests/annonces";
import moment from "moment";
import 'moment/locale/fr';
import Meta from "antd/lib/card/Meta";
moment.locale('fr')


class Annonce extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    console.log(params)
    this.state = {
      id: params.id,
      loading: true,
      annonce: null,
      images: []
    };
  }

  componentDidMount() {
    getAnnonce(this.state.id).then(response => {
      if (response.done) {
        console.log(response.response.data)
        this.setState({
          loading: false,
          annonce: response.response.data.annonce,
          matched: response.response.data.matched,
          annonces: response.response.data.annonces,
          images: response.response.data.annonce.images
        })
      }
      else {
        if (response.response.response.status === 401) {
          window.location.replace('/signin');
        }
      }
    })
  }

  render() {
    return (
      <div>
        <Row>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <Carousel autoplay style={{height: "300px", lineHeight: "300px", textAlign: "center"}}>
              {this.state.images.map(item => {
                return (
                  <div key={item}>
                    <img alt="example"
                      src={"http://localhost:5000/uploads/" + item}
                      style={{maxHeight: "300px", width: "auto", margin: "auto"}}
                    />
                  </div>
                )
              })}
            </Carousel>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={this.state.loading}
              title={!this.state.loading ? "Annonce du " + moment(this.state.annonce.date).format("DD MMMM YYYY") : null}>
              {!this.state.loading ? this.state.annonce.description : null}
            </Card>
          </Col>
        </Row>
        {this.state.matched ? <Row>
          <Col span={24}>
            <Card title="Les annonces qui peuvent correspondre">
              <p
                style={{
                  fontSize: 14,
                  marginBottom: 16,
                  fontWeight: 500,
                }}>
                {this.state.annonces.length === 0 ? "Aucune annonce ne correspond à la votre "
                  : this.state.annonces.length === 1 ? "Il y a 1 annonce qui correspond à la votre"
                    : "Il y a " + this.state.annonces.length + " annonces qui correspond à la votre"
                }
              </p>
              {
                this.state.annonces.map((item, i) => {
                  return (
                    <Card
                      type="inner"
                      title={"Annonce " + (i + 1)}
                      key={i}
                    >
                      {item.description}
                    </Card>
                  )
                })
              }
            </Card>
          </Col>
        </Row> : null}
      </div>
    );
  }
};

export default Annonce;
