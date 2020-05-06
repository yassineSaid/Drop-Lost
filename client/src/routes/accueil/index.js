import React from "react";
import { Col, Row, Card, Button } from "antd";
import Auxiliary from "util/Auxiliary";
import { Link } from "react-router-dom";
import AnnoncesPerdusList from "../annonces/annoncesPerdus/AnnoncesPerdusList";

const Accueil = () => {
  return (
    <Auxiliary>
      <Row>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className="gx-text-center">
            <h2 className="h2 gx-mb-3 gx-text-black">Ajouter une annonce</h2>
            <p className="gx-text-black gx-mb-3">Vous avez trouvé ou perdu un(e)</p>
          </div>
        </Col>
        <Col xl={8} lg={24} md={8} sm={24} xs={24}>
          <Card>
            <div className="gx-flex-row gx-justify-content-center gx-mb-3 gx-mb-md-4">
              <i className={`icon icon-user gx-fs-xlxl gx-text-black`} />
            </div>
            <div className="gx-text-center">
              <Link to='/annonces/ajouter/personne'>
                <Button size="large" className="gx-btn-success gx-mb-1">Personne</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xl={8} lg={24} md={8} sm={24} xs={24}>
          <Card>
            <div className="gx-flex-row gx-justify-content-center gx-mb-3 gx-mb-md-4">
              <i className={`icon icon-orders gx-fs-xlxl gx-text-black`} />
            </div>
            <div className="gx-text-center">
              <Link to='/annonces/ajouter/objet'>
              <Button size="large" className="gx-btn-primary gx-mb-1">Objet</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xl={8} lg={24} md={8} sm={24} xs={24}>
          <Card>
            <div className="gx-flex-row gx-justify-content-center gx-mb-3 gx-mb-md-4">
              <i className={`icon icon-burger gx-fs-xlxl gx-text-black`} />
            </div>
            <div className="gx-text-center">
              <Link to='/annonces/ajouter/animal'>
              <Button size="large" className="gx-btn-secondary gx-mb-1">Animal</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className="gx-text-center">
            <h2 className="h2 gx-mb-3 gx-text-black">Dernières annonces postées</h2>
          </div>
        </Col>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <AnnoncesPerdusList />
        </Col>
      </Row>

    </Auxiliary>
  );
};

export default Accueil;
