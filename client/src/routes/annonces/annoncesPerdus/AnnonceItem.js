import React from "react";
import { Button } from "antd";
import moment from "moment";
import 'moment/locale/fr';
moment.locale('fr')

class AnnonceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      annonce: this.props.annonce
    };
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

  render() {
    const { images, type, objet, personne, animal, description, date, user } = this.state.annonce
    return (
      <div className={`gx-product-item  'gx-product-vertical'`}>
        <div className="gx-product-image">
          <div className="gx-grid-thumb-equal">
            <span className="gx-link gx-grid-thumb-cover">
              <img src={images.length > 0 ? "http://localhost:5000/uploads/" + images[0] : "http://localhost:5000/uploads/no-image.jpg"} />
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
            <h4>{moment(date).format("DD MMMM YYYY")+" par "+this.Capitalize(user.prenom)+" "+this.Capitalize(user.nom)} </h4>
          </div>
          <p>{this.descriptionText(description)}</p>
        </div>

        <div className="gx-product-footer">
          <Button variant="raised">eCommerce.addToCart</Button>

          <Button type="primary">eCommerce.readMore</Button>
        </div>
      </div >
    );
  }
};

export default AnnonceItem;
