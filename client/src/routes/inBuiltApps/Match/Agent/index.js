import React from "react";
import axios from 'axios';
import { Button, Divider } from "antd";
import "./basic.less";
import MatchCard from './card'


class ListMatch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true
    }

  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_API_URL + "match/agent/list", { withCredentials: true }).then(
      response => {
        this.setState({
          list: response.data
        })
      }
    ).catch()
  }




  render() {
    const { list } = this.state;
    return (
      <div className="gx-main-content">
        {list.map((match, index) =>
          <MatchCard data = {match} key={index} />
        )}
      </div>
    )
  }
}
export default ListMatch;
