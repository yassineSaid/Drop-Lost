import React from "react";
import axios from 'axios';
import { Button, Divider,Tag} from "antd";



class MatchCard extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      match : this.props.data,
      toDrop : this.props.data.etat === "Attente de Récuperation",
      toPick : this.props.data.etat === "Attente de Déposition"

    }
  }


  markAsPicked = () => {

    const payload = {
      match: this.state.match._id
    }

    axios.get(process.env.REACT_APP_API_URL + "match/agent/recuperer", { params: payload,withCredentials: true }).then(
      response => {
        this.setState({
          toDrop : !this.state.toDrop
        })
      }
    ).catch()
  }

  markAsDropped = () => {

    const payload = {
      match: this.state.match._id
    }

    axios.get(process.env.REACT_APP_API_URL + "match/agent/deposer", { params: payload,withCredentials: true }).then(
      response => {
        this.setState({
          toDrop : !this.state.toDrop,
          toPick : !this.state.toPick
        })
      }
    ).catch()

  }


  render() {

    const {match,toDrop,toPick} = this.state;
    return (
      <div className={`gx-user-list gx-card-list`}>
        <div className="gx-description">
          <div className="gx-flex-row">
            <Divider orientation="left">Détails du Matching </Divider>
            <p>
              <span className="gx-mr-3">Objet : <span className="gx-text-grey">{match.annonces[0].objet.marque + ` ` + match.annonces[0].objet.modele}</span></span>
            </p>
          </div>
          <p className="gx-text-grey gx-mb-2"></p>
          <p>
            <span className="gx-mr-3">Code : <span className="gx-text-grey"><Tag color="green">{match.code}</Tag></span></span>
          </p>
        </div>
        <div className="gx-card-list-footer">
          <Divider orientation="right">Marqué Comme :</Divider>
          <Button type="primary" disabled={!toDrop} onClick={this.markAsPicked}>Récupéré</Button>
          <Button disabled={!toPick} onClick={this.markAsDropped} >Déposé</Button>
        </div>
      </div>
    )
  }
}


export default MatchCard;
