import React, { Component } from "react";
import { Modal, Card, Icon, Row, Col, Carousel, Tag, Button } from "antd";
import { getAnnonce, supprimerAnnonce } from "../../../requests/annonces";
import moment from "moment";
import 'moment/locale/fr';
import Meta from "antd/lib/card/Meta";
import { Redirect } from "react-router-dom";
import axios from 'axios';
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
        <Row>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <Carousel autoplay style={{ height: "300px", lineHeight: "300px", textAlign: "center" }}>
              {this.state.images.length > 0 ?
                this.state.images.map(item => {
                  return (
                    <div key={item}>
                      <img alt="example"
                        src={process.env.REACT_APP_API_URL+"uploads/" + item}
                        style={{ maxHeight: "300px", width: "auto", margin: "auto" }}
                      />
                    </div>
                  )
                })
                :
                <div>
                  <img alt="example"
                    src={process.env.REACT_APP_API_URL+"uploads/no-image.jpg"}
                    style={{ maxHeight: "300px", width: "auto", margin: "auto" }}
                  />
                </div>
              }
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
  
      </div>
    );
  }
};

export default Reclamation;
