import React, { Component } from "react";
import {Card,  Table} from "antd";
import axios from 'axios';


function handleAdmin(data){
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
          title: 'nom',
          dataIndex: 'nom',
          key: 'nom',
          render: text => <span className="gx-link">{text}</span>,
        },
        {
          title: 'adresse',
          dataIndex: 'adresse',
          key: 'adresse',
        },
        {
          title: 'numero',
          dataIndex: 'numero',
          key: 'numero',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
          
            <span className="gx-link"onClick={() =>  this.props.history.push('/')}>ban</span>
           
          </span>
          ),
        }
      ];
      

    componentDidMount() {
        axios.get(BASE_URL+'users/agent/liststores') //the api to hit request
            .then((response) => {
                const data = response.data.storelist.map((Admins) => ({
                    nom: Admins.nom,
                    adresse: Admins.adresse,
                    numero:Admins.numero
                }));

                this.setState({
                    data
                });
                
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
