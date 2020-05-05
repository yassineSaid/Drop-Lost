import React from "react";
import { Button } from "antd";
import moment from "moment";
import 'moment/locale/fr';
import { Link, Redirect } from "react-router-dom";
moment.locale('fr')

class AnnonceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      annonce: this.props.annonce,
      readMore: false
    };
    this.handleReadMore = this.handleReadMore.bind(this)
  }

  componentDidMount() {
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  descriptionText(str) {
    const limit = 28
    if (str.length > limit) return str.substr(0, limit) + "..."
    else return str
  }

  handleReadMore = (e) => {
    e.preventDefault();
    console.log("READ MORE")
    this.setState({
      readMore: true
    })
  }

  render() {
    const { images, type, objet, personne, animal, description, date, user, _id } = this.state.annonce
    if (this.state.readMore) {
      return <Redirect to={'annonce/'+_id} />;
    }
    return (
      <div className={`gx-product-item  'gx-product-vertical'`}>
        <div className="gx-product-image">
          <div className="gx-grid-thumb-equal">
            <span className="gx-link gx-grid-thumb-cover">
              <Link to={"annonce/" + _id}>
                <img src={images.length > 0 ? process.env.REACT_APP_API_URL+"uploads/" + images[0] : process.env.REACT_APP_API_URL+"uploads/no-image.jpg"} />
              </Link>
            </span>
          </div>
        </div>
        <div className="gx-product-body">
          {type === "objet" ?
            <h3 className="gx-product-title">{objet.categorie === "smartphone" ? this.Capitalize(objet.marque) : this.Capitalize(objet.categorie)}
              <small className="gx-text-grey">{", " + (objet.sousCategorie ? this.Capitalize(objet.sousCategorie) : this.Capitalize(objet.modele))}</small>
            </h3>
            : type === "personne" ?
              <h3 className="gx-product-title">{this.Capitalize(personne.sexe)}</h3>
              : type === "animal" ?
                <h3 className="gx-product-title">{this.Capitalize(animal.type)}
                  {animal.race ? <small className="gx-text-grey">{", " + animal.race}</small> : null}
                </h3>
                : null
          }

          <div className="ant-row-flex">
            <h4>{moment(date).format("DD MMMM YYYY") + " par " + this.Capitalize(user.prenom) + " " + this.Capitalize(user.nom)} </h4>
          </div>
          <p>{this.descriptionText(description)}</p>
        </div>

        <div className="gx-product-footer">
          <Button type="primary" onClick={this.handleReadMore}>Plus de détails</Button>
        </div>
      </div >
    );
  }
};

export default AnnonceItem;
