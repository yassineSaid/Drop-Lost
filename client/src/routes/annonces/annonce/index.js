import React, { Component } from "react";
import { Modal, Card, Icon, Row, Col, Carousel, Tag, Button } from "antd";
import { getAnnonce, supprimerAnnonce } from "../../../requests/annonces";
import moment from "moment";
import 'moment/locale/fr';
import Meta from "antd/lib/card/Meta";
import { Redirect } from "react-router-dom";
import axios from 'axios';
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
      images: [],
      redirect: false,
      redirectToMesAnnonces: false,
      user: JSON.parse(localStorage.getItem('User')),
      owner: false
    };
    this.handleContact = this.handleContact.bind(this);
    this.handleSupprimer = this.handleSupprimer.bind(this);
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
        if (this.state.user!== null){
          console.log(this.state.user._id)
          console.log(response.response.data.annonce.user)
          if (this.state.user._id===response.response.data.annonce.user){
            this.setState({
              owner: true
            })
          }
        }
      }
      else {
        if (response.response.response.status === 401) {
          window.location.replace('/signin');
        }
      }
    })
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
    axios.post("http://localhost:5000/api/chat/create", payload, { withCredentials: true }).then(
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
      return <Redirect to='/annonces/mesAnnonces' />;
    }

    return (
      <div>
        <Row>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <Carousel autoplay style={{ height: "300px", lineHeight: "300px", textAlign: "center" }}>
              {this.state.images.map(item => {
                return (
                  <div key={item}>
                    <img alt="example"
                      src={"http://localhost:5000/uploads/" + item}
                      style={{ maxHeight: "300px", width: "auto", margin: "auto" }}
                    />
                  </div>
                )
              })}
            </Carousel>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={this.state.loading}
              title={!this.state.loading ? "Annonce du " + moment(this.state.annonce.date).format("DD MMMM YYYY") : null}
              extra={this.state.owner ? <Button type="danger" onClick={this.handleSupprimer}>Supprimer cette annonce</Button> : null}
            >
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
                    : "Il y a " + this.state.annonces.length + " annonces qui correspondent à la votre"
                }
              </p>
              {
                this.state.annonces.map((item, i) => {
                  var score = item.score / item.scoreTotal * 100
                  var scoreV = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(score)
                  return (
                    <Card
                      type="inner"
                      title={"Annonce " + (i + 1)}
                      key={i}
                      actions={[<Button onClick={() => this.handleContact(item, this.state.annonce)} ><Icon type="edit" /> Contacter cette personne</Button>]}
                    >
                      <p>
                        {item.description}
                      </p>
                      <Tag color={score > 70 ? "#87d068" : score > 50 ? "#f29d41" : "#f50"}>
                        {"Cette annonce correspond à la votre à " + scoreV + "%"}
                      </Tag>
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
