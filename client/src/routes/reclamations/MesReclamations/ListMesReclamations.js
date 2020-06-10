import React from "react";
import { Avatar, Card, Icon, List, Spin } from "antd";
import moment from "moment";
import 'moment/locale/fr';
import { Link } from "react-router-dom";
import axios from "axios";
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

class MesreclamationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reclamations: [],
      pagination: {
        pageSize: 5,
        current: 1,
        total: 0
      }
    };
    this.onChange = this.onChange.bind(this)
  }
  onChange(page, pageSize) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: page
      }
    })
  }

  componentDidMount() {
    // getMesAnnonces().then(response => {
    //   if (response.done) {
    //     console.log(response.response.data)
    //     this.setState({
    //       loading: false,
    //       annonces: response.response.data.annonces,
    //       pagination: {
    //         ...this.state.pagination,
    //         total: response.response.data.annonces.length,
    //         onChange: this.onChange
    //       }
    //     })
    //   }
    //   else {
    //     if (response.response.response.status === 401) {
    //       window.location.replace('/signin');
    //     }
    //   }
    // })
    let user = JSON.parse(localStorage.getItem('User'));
    console.log("the userrrr"+JSON.stringify(user._id));
    axios.get('http://localhost:5000/api/reclamations/getAllReclamations', { params: { userId: user._id }, withCredentials: true })
    .then((resp) => {
        console.log("The reclamations"+resp.data)

           this.setState({
          loading: false,
          reclamations: resp.data,
          pagination: {
            ...this.state.pagination,
            total: resp.data.length,
            onChange: this.onChange
          }
        })

    }
    ).catch(err => console.log(err));
  }
  render() {
    return (
      <Card className="gx-card" title="Mes reclamations">
        {!this.state.loading ?
          <List
            itemLayout="vertical"
            size="large"
            pagination={this.state.pagination}
            dataSource={this.state.reclamations}
            renderItem={item => (
              <List.Item
                key={item._id}
                //actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />,
                //<IconText type="message" text="2" />]}
                extra={<img className="gx-img-fluid" width={272} alt="logo"
                  src={item.photo.length>0 ? "http://localhost:5000/uploadsReclamations/"+item.photo[0].replace('["','').replace('"]','') : process.env.REACT_APP_API_URL+"uploads/no-image.jpg"} />}
              >
                <List.Item.Meta
                  avatar='https://via.placeholder.com/290x193'
                  title={
                    <Link to={"maReclamation/" + item._id}>Reclamation du {moment(item.date).format("DD MMMM YYYY")}

                     </Link>
                  }
                  description={item.description}
                />
                {item.address}
          

              </List.Item>
            )}
          /> :
          <Spin size="large" />}
      </Card>
    );
  }
};

export default MesreclamationsList;