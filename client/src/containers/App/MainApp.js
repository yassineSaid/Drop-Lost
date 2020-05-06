import React, { Component } from "react";
import { Layout } from "antd";

import HorizontalDark from "../Topbar/HorizontalDark/index";

import { footerText } from "util/config";
import App from "routes/index";
import { connect } from "react-redux";

const { Content, Footer } = Layout;

export class MainApp extends Component {

  render() {
    const { match } = this.props;

    return (
      <Layout className="gx-app-layout">
        <Layout>
          <HorizontalDark />
          <Content className="gx-layout-content gx-container-wrap">
            <App match={match} />
            <Footer>
              <div className="gx-layout-footer-content">
                {footerText}
              </div>
            </Footer>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = ({ settings }) => {
  const { width, navStyle } = settings;
  return { width, navStyle }
};
export default connect(mapStateToProps)(MainApp);

