import React from "react";
import { Card, Collapse, Divider, Button,Col } from "antd";
import axios from 'axios';
import { Link } from "react-router-dom";

const Panel = Collapse.Panel;


class ListMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true
    }
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_API_URL + "match/list", { withCredentials: true }).then(
      response => {
        this.setState({
          list: response.data,
          loading: false
        })
      }
    ).catch()
  }

  render() {

    const { loading, list } = this.state;
    return (
      <div className="gx-main-content">
        <Card loading={loading} className="gx-card" title="Liste de vos matchs ">
          <Collapse accordion>
            {list.map((match, index) =>
              <Panel
                header={`Objet Perdu : ` + match.annonces[0].objet.marque + ` ` + match.annonces[0].objet.modele}
                key={index}
                extra={<Link to={"/in-built-apps/match/" + match._id}> Voir Timeline </Link>}
              >
                <Divider orientation="left">Votre Annonce</Divider>
                <div className="gx-user-list">
                  <div className="gx-description">
                    <div className="gx-flex-row">
                    <Col span={2}>
                      <h5>Description</h5>
                    </Col>
                      <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                      <span>{match.annonces[0].description}</span>
                    </div>
                  </div>
                  <div className="gx-card-list-footer">
                    <Button type="primary">Voir Details</Button>
                  </div>
                </div>
                <Divider orientation="left">Annonce Similaire</Divider>
                <div className="gx-user-list">
                  <div className="gx-description">
                    <div className="gx-flex-row">
                    <Col span={2}>
                      <h5>Description</h5>
                    </Col>
                      <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                      <span>{match.annonces[1].description}</span>
                    </div>
                  </div>
                  <div className="gx-card-list-footer">
                    <Button type="primary">Voir Details</Button>
                  </div>
                </div>
                <Divider orientation="left">Details du Matching</Divider>
                <div className="gx-user-list">
                  <div className="gx-description">
                    <div className="gx-flex-row">
                    <Col span={2}>
                      <h5>Etat</h5>
                      </Col>
                      <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                      <span>{match.etat}</span>
                    </div>
                    <div className="gx-flex-row">
                    <Col span={2}>
                      <h5>Type</h5>
                      </Col>
                      <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
                      <span>{match.methode}</span>
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </Collapse>
        </Card>
      </div>
    )
  }
}


export default ListMatch;
