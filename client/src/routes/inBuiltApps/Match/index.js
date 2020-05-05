import React from "react";
import axios from 'axios';
import { Col, Row, Card, Divider, Tag } from "antd";
import Moment from "moment";


class Match extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    console.log(params)
    this.state = {
      loading: true,
      matching: null
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    const payload = {
      match: params.match
    }
    axios.get("http://localhost:5000/match/", { params: payload, withCredentials: true }).then(
      response => {
        this.setState({
          matching: response.data[0],
          loading: false
        })
      }

    ).catch()
  }


  render() {
    const { loading, matching } = this.state;
    return (
      <div className="gx-main-content">
        <Row>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Card loading={loading} title="Détails du Matching">
              {matching !== null ?
                <div>
                  <Row>
                    <Col span={24} sm={6}>
                      <h4>Annonce </h4>
                    </Col>
                    <Col span={24} sm={2}>
                      <Divider type="vertical"></Divider>
                    </Col>
                    <Col span={24} sm={16}>
                      <span>{matching.annonces[0].description}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} sm={6}>
                      <h4>Match </h4>
                    </Col>
                    <Col span={24} sm={2}>
                      <Divider type="vertical"></Divider>
                    </Col>
                    <Col span={24} sm={16}>
                      <span>{matching.annonces[1].description}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} sm={6}>
                      <h4>Date </h4>
                    </Col>
                    <Col span={24} sm={2}>
                      <Divider type="vertical"></Divider>
                    </Col>
                    <Col span={24} sm={16}>
                      <span>{Moment(Number(matching.date)).format('LLLL')}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} sm={6}>
                      <h4>Etat </h4>
                    </Col>
                    <Col span={24} sm={2}>
                      <Divider type="vertical"></Divider>
                    </Col>
                    <Col span={24} sm={16}>
                      <Tag color="green">{matching.etat}</Tag>
                    </Col>
                  </Row>
                  {matching.code !== null ?
                  <Row>
                    <Col span={24} sm={6}>
                      <h4>Code </h4>
                    </Col>
                    <Col span={24} sm={2}>
                      <Divider type="vertical"></Divider>
                    </Col>
                    <Col span={24} sm={16}>
                      <Tag color="geekblue">{matching.code}</Tag>
                    </Col>
                  </Row> : ''}
                </div> : ''}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}


export default Match;
