import React from "react";
import { Avatar, Card, Icon, List, Spin } from "antd";
import { getMesAnnonces } from "../../../requests/annonces";
import moment from "moment";
import 'moment/locale/fr';
import { Link } from "react-router-dom";
moment.locale('fr')

const listData = [];
for (let i = 0; i < 5; i++) {
  listData.push({
    href: 'http://ant.design' +
      '' +
      '',
    title: `Ant design part ${i}`,
    avatar: 'https://via.placeholder.com/290x193',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}



const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class MesAnnoncesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      annonces: []
    };
  }

  pagination = {
    pageSize: 10,
    current: 1,
    total: listData.length,
    onChange: (() => {
    }),
  };

  componentDidMount() {
    getMesAnnonces().then(response => {
      if (response.done) {
        console.log(response.response.data)
        this.setState({
          loading: false,
          annonces: response.response.data.annonces
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
    return (
      <Card className="gx-card" title="Mes annonces">
        {!this.state.loading ?
          <List
            itemLayout="vertical"
            size="large"
            pagination={this.pagination}
            dataSource={this.state.annonces}
            renderItem={item => (
              <List.Item
                key={item._id}
                //actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />,
                //<IconText type="message" text="2" />]}
                extra={<img className="gx-img-fluid" width={272} alt="logo"
                  src='https://via.placeholder.com/290x193' />}
              >
                <List.Item.Meta
                  avatar='https://via.placeholder.com/290x193'
                  title={
                    <Link to={"annonce/" + item._id}>Annonce du {moment(item.date).format("DD MMMM YYYY")}
                    {"objet" in item ? " pour un objet" : "personne" in item ? " pour une personne" :
                    "animal" in item ? " pour un animal" : null} </Link>
                  }
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          /> :
          <Spin size="large" />}
      </Card>
    );
  }
};

export default MesAnnoncesList;





