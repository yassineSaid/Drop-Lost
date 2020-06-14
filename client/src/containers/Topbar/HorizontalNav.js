import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import IntlMessages from "../../util/IntlMessages";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";


const SubMenu = Menu.SubMenu;
function isLoggedIn() {
  return localStorage.getItem('User') != null
}
function isClient() {
  const user = JSON.parse(localStorage.getItem('User'));
  if (user.role === "user")
    return true
}
function isSuperAdmin() {
  const user = JSON.parse(localStorage.getItem('User'));
  if (user.role === "superadmin")
    return true
}
function isAgent() {
  const user = JSON.parse(localStorage.getItem('User'));
  if (user.role === "agent")
    return true
}
function isAdmin() {
  const user = JSON.parse(localStorage.getItem('User'));
  if (user.role === "admin")
    return true
}
class HorizontalNav extends Component {

  getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve";
      default:
        return "gx-menu-horizontal";

    }
  };

  render() {
    const { pathname, navStyle } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (

      <Menu
        defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal">

        <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="accueil"
          title={<Link to="/accueil" style={{ color: "white" }}>
            Accueil
                </Link>}>
        </SubMenu>
        {isLoggedIn() && isSuperAdmin() && <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="superadmin"
          title="Controle des admins">

          <Menu.Item key="/superadmin/addadmin">
            <Link to="/superadmin/addadmin">
              <i className="icon icon-user" />
                Ajouter une admin
              </Link>
          </Menu.Item>
          <Menu.Item key="/superadmin/listadmin">
            <Link to="/superadmin/listadmin">
              <i className="icon icon-user" />
               liste des admins
              </Link>
          </Menu.Item>
          <Menu.Item key="/superadmin/listeusers">
            <Link to="/superadmin/listeusers">
              <i className="icon icon-user" />
               liste des utilisateurs
              </Link>
          </Menu.Item>
        </SubMenu>}
        {isLoggedIn() && isAgent() && <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="agent"
          title="Controle des stores">

          <Menu.Item key="/agent/addstore">
            <Link to="/admin/addstore">
              <i className="icon icon-user" />
                Ajouter un store
              </Link>
          </Menu.Item>
          <Menu.Item key="/agent/liststore">
            <Link to="/agent/liststore">
              <i className="icon icon-user" />
               liste des stores
              </Link>
          </Menu.Item>

        </SubMenu>}
        {isLoggedIn() && isAdmin() && <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="admin"
          title="Controle des utilisateurs">

          <Menu.Item key="/admin/addagent">
            <Link to="/admin/addagent">
              <i className="icon icon-user" />
                Ajouter un agent
              </Link>
          </Menu.Item>
          <Menu.Item key="/admin/listagent">
            <Link to="/admin/listagent">
              <i className="icon icon-user" />
               liste des agents
              </Link>
          </Menu.Item>
          <Menu.Item key="/admin/listeusers">
            <Link to="/admin/listeusers">
              <i className="icon icon-user" />
               liste des utilisateurs
              </Link>
          </Menu.Item>
        </SubMenu>}
        <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="annonces"
          title="Annonces">
          <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="ajouter"
            title="Ajouter une annonce">
            <Menu.Item key="/annonces/ajouter/objet">
              <Link to="/annonces/ajouter/objet">
                <i className="icon icon-orders" />
                Objet
              </Link>
            </Menu.Item>
            <Menu.Item key="/annonces/ajouter/personne">
              <Link to="/annonces/ajouter/personne">
                <i className="icon icon-user" />
                Personne
              </Link>
            </Menu.Item>
            <Menu.Item key="/annonces/ajouter/animal">
              <Link to="/annonces/ajouter/animal">
                <i className="icon icon-burger" />
                Animal
              </Link>
            </Menu.Item>
          </SubMenu>
          {
            isLoggedIn() && <Menu.Item key="/annonces/mesAnnonces">
              <Link to="/annonces/mesAnnonces">
                <i className="icon icon-listing-dbrd" />
                Mes annonces
              </Link>
            </Menu.Item>
          }
          <Menu.Item key="/annonces/annoncesPerdus">
            <Link to="/annonces/annoncesPerdus">
              <i className="icon icon-listing-dbrd" />
                Annonces d'objets perdus
              </Link>
          </Menu.Item>
        </SubMenu>


        <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="chat"
          title="Chat">
          <Menu.Item key="in-built-apps/chat" >
            <Link to="/in-built-apps/chat">
              Consulter vos messages
              </Link>
          </Menu.Item>
        </SubMenu>

        {isLoggedIn() && isClient() && <Menu.Item key="matchs" className={this.getNavStyleSubMenuClass(navStyle)} >
            <Link to="/in-built-apps/list/match" style={{ color: "white" }}>
              Mes Matchs
              </Link>
        </Menu.Item>}
        {/* {isLoggedIn() && isClient() && <Menu.Item key="ajouterReclamation" className={this.getNavStyleSubMenuClass(navStyle)} >
            <Link to="/reclamations/AjouterReclamation" style={{ color: "white" }}>
              Mes reclamations
              </Link>
        </Menu.Item>} */}
        

        <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="Réclamations"
          title="Réclamations">
          <Menu.Item key="/reclamations/AjouterReclamation" >
          <Link to="/reclamations/AjouterReclamation" >
              Faire une réclamation
              </Link>
          </Menu.Item>
          <Menu.Item key="/reclamations/mesReclamations" >
          <Link to="/reclamations/mesReclamations" >
              Mes réclamations
              </Link>
          </Menu.Item>
          <Menu.Item key="/reclamations/listeDesReclamations" >
          <Link to="/reclamations/listeDesReclamations" >
              Liste des réclamations
              </Link>
          </Menu.Item>
        </SubMenu>
        {isLoggedIn() && isAgent() && <Menu.Item key="matchs" className={this.getNavStyleSubMenuClass(navStyle)} >
            <Link to="/in-built-apps/list/agent/match" style={{ color: "white" }}>
              Mes Matchs
              </Link>
        </Menu.Item>}



      </Menu>

    );
  }
}

HorizontalNav.propTypes = {};
const mapStateToProps = ({ settings }) => {
  const { themeType, navStyle, pathname, locale } = settings;
  return { themeType, navStyle, pathname, locale }
};
export default connect(mapStateToProps)(HorizontalNav);

