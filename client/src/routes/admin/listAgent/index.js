import React, { Component } from "react";
import {Card,  Table} from "antd";
import axios from 'axios';


function handleAdmin(data){
    axios.post('http://localhost:5000/users/admin/ban',data).then(window.location.reload(false));
   
}

class listAgent extends Component {
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
          title: 'prenom',
          dataIndex: 'prenom',
          key: 'prenom',
        },
        {
          title: 'email',
          dataIndex: 'email',
          key: 'email',
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
        axios.get('http://localhost:5000/users/admin/allagents') //the api to hit request
            .then((response) => {
                const data = response.data.agentslist.map((Admins) => ({
                    nom: Admins.nom,
                    prenom: Admins.prenom,
                    email:Admins.email
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

  
export default listAgent;
