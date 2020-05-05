import React, { Component } from "react";
import {Card,  Table} from "antd";
import axios from 'axios';
const BASE_URL=process.env.REACT_APP_API_URL


function handleAdmin(data){
    axios.post(BASE_URL+'users/admin/ban',data).then(window.location.reload(false));
   
}

class listStore extends Component {
    constructor() {
        super();

        this.state = {
            
            data: []
        }

       
    }
     columns = [
        {
          title: 'type',
          dataIndex: 'type',
          key: 'type',
          render: text => <span className="gx-link">{text}</span>,
        },
        {
          title: 'description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'trouve',
          dataIndex: 'trouve',
          key: 'trouve',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
          
            <span className="gx-link"onClick={() => handleAdmin(record)}>ban</span>
           
          </span>
          ),
        }
      ];
      

    componentDidMount() {
      const { match: { params } } = this.props;
     const  pathparms={
        nom:params.nom
      }
        axios.get(BASE_URL+'users/agent/listobjectinstore/'+pathparms.nom) //the api to hit request
            .then((response) => {
                console.log(response)
                
            });
    }

    render() {
        
    return (
        <Card title="Liste des admins">
          <Table className="gx-table-responsive" columns={this.columns} dataSource={this.state.data} pagination={{pageSize: 5}}/>
        </Card>
      );
    }
    
}

  
export default listStore;
