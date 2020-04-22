import React, { Component } from "react";
import {Card, Table} from "antd";
import axios from 'axios';


function ban(data){
     axios.post('http://localhost:5000/users/admin/ban',data).then(window.location.reload(false));
}
function unban(data){
  axios.post('http://localhost:5000/users/admin/unban',data).then(window.location.reload(false));
}
class listUsers extends Component {
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
          
{record.Isactive&&            <span className="gx-link"onClick={() => ban(record)}>ban</span>
}   
{!record.Isactive&&            <span className="gx-link"onClick={() => unban(record)}>unban</span>
}           
          </span>
          ),
        }
      ];
      

    componentDidMount() {
        axios.get('http://localhost:5000/users/superadmin/allusers') //the api to hit request
            .then((response) => {
                const data = response.data.AdminsList.map((Admins) => ({
                    nom: Admins.nom,
                    prenom: Admins.prenom,
                    email:Admins.email,
                    Isactive:Admins.Isactive

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

  
export default listUsers;
