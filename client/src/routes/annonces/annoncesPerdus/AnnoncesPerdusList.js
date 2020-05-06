import React from "react";
import { Col, Row, Spin, Pagination } from "antd";
import { getAnnoncesPerdus } from "../../../requests/annonces";
import moment from "moment";
import 'moment/locale/fr';
import AnnonceItem from "./AnnonceItem";
moment.locale('fr')

const numEachPage = 12
class AnnoncesPerdusList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      annonces: [],
      minValue: 0,
      maxValue: numEachPage,
      pagination: {
        pageSize: numEachPage,
        current: 1,
        total: 0
      }
    };
    this.onChange = this.onChange.bind(this)
  }
  onChange(page, pageSize) {
    this.setState({
      minValue: (page - 1) * numEachPage,
      maxValue: page * numEachPage,
      pagination: {
        ...this.state.pagination,
        current: page
      }
    })
  }

  componentDidMount() {
    console.log(process.env)
    getAnnoncesPerdus().then(response => {
      if (response.done) {
        console.log(response.response.data)
        this.setState({
          loading: false,
          annonces: response.response.data.annonces,
          pagination: {
            ...this.state.pagination,
            total: response.response.data.annonces.length,
            onChange: this.onChange
          }
        })
      }
      else {
        if (response.response.response.status === 401) {
          window.location.replace('/signin');
        }
      }
    })
  }

  render() {
    const { minValue, maxValue, annonces } = this.state
    return (
      <div>
        <Row>
          {this.state.loading ?
            <Col xl={24} md={24} sm={24} xs={24} flex={"center"}>
              <div className="gx-text-center">
                <Spin size="large" />
              </div>
            </Col>
            :
            annonces.slice(minValue, maxValue).map(annonce => {
              return (
                <Col xl={6} md={8} sm={12} xs={24} key={annonce._id}>
                  <AnnonceItem annonce={annonce} />
                </Col>
              )
            })
          }
        </Row>
        {!this.state.loading && <Col xl={24} md={24} sm={24} xs={24} flex={"center"}>
          <div className="gx-text-center">
            <Pagination
              current={maxValue / numEachPage}
              defaultCurrent={1}
              defaultPageSize={numEachPage} //default size of page
              onChange={this.onChange}
              total={annonces.length} //total number of card data available
            />
          </div>
        </Col>
        }
      </div>
    );
  }
};

export default AnnoncesPerdusList;





