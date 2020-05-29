import React from "react";
import axios from 'axios';
import { Col, Row, Card, Icon, Button } from "antd";
import Moment from "moment";
import WithIconTimeLineItem from "components/timeline/WithIconTimeLineItem";
import "./basic.less";
import { Link } from "react-router-dom";

class Match extends React.Component {


  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    console.log(params)
    this.state = {
      loading: true,
      matching: null,
      perdu: null,
      trouve: null,
      matchResult: null,
      iconLoading: false,
      confirmed: false,
    }
  }

  enterIconLoading = () => {
    const { match: { params } } = this.props;

    this.setState({ iconLoading: true });


    const payload = {
      match: params.match
    }
    axios.get(process.env.REACT_APP_API_URL + "match/success/", { params: payload, withCredentials: true }).then(
      response => {
        this.setState({
          matchResult: {
            ...this.state.matchResult,
            description: "Objet Récupéré"
          },
          confirmed: true
        });
      }
    ).catch();

    setTimeout(() => {
      this.setState({iconLoading: false});
    }, 1500);
  };



  componentDidMount() {
    const { match: { params } } = this.props;
    const payload = {
      match: params.match
    }
    axios.get(process.env.REACT_APP_API_URL + "match/", { params: payload, withCredentials: true }).then(
      response => {
        const data = response.data[0];
        console.log('test')
        console.log(data)
        if(data !== []) {
          const perdu = {
            title: "Ajout annonce objet perdu",
            description: data.annonces[0].description,
            time: Moment(data.annonces[0].date).format('dddd LL')
          }

          const trouve = {
            title: "Ajout annonce objet trouvé",
            description: data.annonces[1].description,
            time: Moment(data.annonces[1].date).format('dddd LL')
          }

          const matchResult = {
            title: "Matching entre les deux annonces !",
            description: data.etat,
            time: Moment(Number(data.date)).format('dddd LL')
          }


          this.setState({
            matching: response.data[0],
            perdu,
            trouve,
            matchResult,
            loading: false,
            confirmed: response.data[0].etat === 'Objet Récupéré'
          })
        }

      }

    ).catch()
  }


  render() {
    const { loading, perdu, trouve, matchResult, confirmed, iconLoading,matching } = this.state;
    return (
      <div className="gx-main-content">
        <Row>
          <Col span={24}>
            <Card loading={loading} title="Timeline du matching" extra={<Link to="/in-built-apps/list/match"> Retour </Link>}>
              <div className="gx-timeline-section gx-timeline-center">
                <WithIconTimeLineItem timeLine={perdu} color="green">
                  <i className="icon icon-search-new gx-p-2" />
                </WithIconTimeLineItem>
                <WithIconTimeLineItem styleName="gx-timeline-inverted" timeLine={trouve}
                  color="purple">
                  <i className="icon icon-add gx-p-2" />
                </WithIconTimeLineItem>
                {matchResult != null ?
                  <WithIconTimeLineItem timeLine={matchResult} color="red">
                    {matchResult.description === "Objet Récupéré" ? <i className="icon icon-check gx-p-2" />
                      : <Icon type="loading" style={{ fontSize: 24, paddingTop: 13 }} />}
                  </WithIconTimeLineItem> : ""}
              </div>
              <div className="gx-text-center">
                {matching && matching.methode !== "Boutique" ?
                <Button disabled = {confirmed} type="primary" icon="check" loading={iconLoading} onClick={this.enterIconLoading}>
                  Marqué comme récupéré
              </Button> : "" }
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}


export default Match;
