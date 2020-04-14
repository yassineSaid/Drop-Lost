import React from "react";
import {Link} from "react-router-dom";

import Widget from "components/Widget/index";



const ProjectWidget = () => {
  return (
    <Widget styleName="gx-ch-capitalize gx-card-sm-px"
     title="Account verrified">
      <div className="gx-text-center gx-pt-sm-3">
        <img className="gx-size-60 gx-mb-3" src={require("assets/images/widget/birds.png")} alt='birds'/>

        <h2 className="gx-mb-3 gx-mb-sm-4">You're account has been verified </h2>

        <ul className="gx-list-inline gx-mb-3 gx-mb-lg-4">
        <h4 className="gx-mb-3 gx-mb-sm-4"> You may now login</h4>

        </ul>
        <Link className="gx-btn gx-btn-primary gx-text-white gx-mb-1" to="/signin">sign Up</Link>
      </div>
    </Widget>
  );
};

export default ProjectWidget;
