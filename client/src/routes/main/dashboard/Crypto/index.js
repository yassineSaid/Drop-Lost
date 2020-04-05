import React from "react";
import { Col, Row, Card, Button } from "antd";

import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { increamentData, lineData } from "../../Metrics/data";
import ChartCard from "components/dashboard/Crypto/ChartCard";
import Auxiliary from "util/Auxiliary";
import Portfolio from "components/dashboard/Crypto/Portfolio";
import BalanceHistory from "components/dashboard/Crypto/BalanceHistory";
import SendMoney from "components/dashboard/Crypto/SendMoney";
import RewardCard from "components/dashboard/Crypto/RewardCard";
import CurrencyCalculator from "components/dashboard/Crypto/CurrencyCalculator";
import CryptoNews from "components/dashboard/Crypto/CryptoNews";
import DownloadMobileApps from "components/dashboard/Crypto/DownloadMobileApps";
import OrderHistory from "components/dashboard/Crypto/OrderHistory";
import { Link } from "react-router-dom";

const Crypto = () => {
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
        <Col xl={6} lg={12} md={12} sm={12} xs={24}>
          <ChartCard prize="$9,626" title="23" icon="bitcoin"
            children={<ResponsiveContainer width="100%" height={75}>
              <AreaChart data={increamentData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip />
                <defs>
                  <linearGradient id="color3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#163469" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#FE9E15" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Area dataKey='price' strokeWidth={0} stackId="2" stroke='#4D95F3' fill="url(#color3)"
                  fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>}
            styleName="up" desc="Bitcoin Price" />
        </Col>
        <Col xl={6} lg={12} md={12} sm={12} xs={24}>
          <ChartCard prize="$7,831" title="07" icon="etherium"
            children={<ResponsiveContainer width="100%" height={75}>
              <AreaChart data={increamentData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip />
                <defs>
                  <linearGradient id="color4" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#4ECDE4" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#06BB8A" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Area dataKey='price' type='monotone' strokeWidth={0} stackId="2" stroke='#4D95F3'
                  fill="url(#color4)"
                  fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>}
            styleName="up" desc="Etherium Price" />
        </Col>
        <Col xl={6} lg={12} md={12} sm={12} xs={24}>
          <ChartCard prize="$1,239" title="08" icon="ripple"
            children={<ResponsiveContainer width="100%" height={75}>
              <AreaChart data={increamentData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip />
                <defs>
                  <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e81a24" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FEEADA" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <Area dataKey='price' strokeWidth={0} stackId="2" stroke='#FEEADA' fill="url(#color5)"
                  fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>}
            styleName="down" desc="Ripple Price" />
        </Col>
        <Col xl={6} lg={12} md={12} sm={12} xs={24}>
          <ChartCard prize="$849" title="47" icon="litcoin"
            children={<ResponsiveContainer width="100%" height={75}>

              <LineChart data={lineData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Tooltip />
                <Line dataKey="price" stroke="#038FDE" dot={{ stroke: '#FEA931', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>}
            styleName="down" desc="Litecoin Price" />
        </Col>
        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
          <Portfolio />
        </Col>
        <Col xl={12} lg={24} md={12} sm={24} xs={24}>
          <BalanceHistory />
        </Col>

        <Col xl={9} lg={24} md={24} sm={24} xs={24}>
          <SendMoney />
        </Col>
        <Col xl={6} lg={12} md={12} sm={24} xs={24}>
          <RewardCard />
        </Col>
        <Col xl={9} lg={12} md={12} sm={24} xs={24}>
          <CurrencyCalculator />
        </Col>

        <Col xl={15} lg={24} md={24} sm={24} xs={24}>
          <CryptoNews />
        </Col>
        <Col xl={9} lg={24} md={24} sm={24} xs={24}>
          <DownloadMobileApps />
          <OrderHistory />
        </Col>
      </Row>

    </Auxiliary>
  );
};

export default Crypto;
