import "./Card.css";

import { Card, Col, Row } from 'antd';
import { DeleteFilled, EditOutlined, HeartFilled, HeartTwoTone } from '@ant-design/icons';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import UserModal from "./UserModal";
import axios from 'axios';

const { Meta } = Card;

const Cards = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
    
  };


const handleSave = (updatedUser) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
  );
  setEditingUser(null);
};

 
const handleDelete = async (user) => {
  try {
    const res = await axios.delete(`http://localhost:3001/delete/user/${user._id}`,user)
    const updatedUser = res.data;

    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== updatedUser.id));

  }catch (error){
    console.log(error);
  }
};


const handleLike = async (user) => {
  try {
    const updatedUser = { ...user, like: !user.like };
    await axios.put(`http://localhost:3001/update/user/${user._id}`, updatedUser);

    setUsers((prevUsers) => prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
    
    <Row justify="space-around" >
      {users.map((user) => (
        <Col key={user.id}  xs={24} sm={24} md={8} lg={8} xl={6}>
        <div style={{margin: '15px'}}>
          <Card
            cover={<div className="cardHeadImage"> <img alt={user.name} src={`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`} style={{background:"#f5f5f5" , width: "200px", height: "200px;"}}/></div>}
            actions={[
                  user.like ? (
                    <HeartFilled style={{ color: 'rgb(255, 0, 0)' }} onClick={() => handleLike(user)} />
                  ) : (
                    <HeartTwoTone twoToneColor="rgb(255, 0, 0)" onClick={() => handleLike(user)} />
                  ),
                <EditOutlined onClick={() => handleEditClick(user)} />,
                <DeleteFilled onClick={() => handleDelete(user)}/>,
            ]}
            className="card"
          >
            <Meta
              title=<h3>{user.name}</h3>
              description={
                <>
                 <p style={{display: "flex", flexDirection: "row"}}><MailOutlined  /> {user.email}</p>
                 <p style={{display: "flex", flexDirection: "row"}}><PhoneOutlined />{user.phone}</p>
                 <p style={{display: "flex", flexDirection: "row"}}><GlobalOutlined />https://{user.website}</p>
               </>
              }
            />
          </Card>
          </div>
      
        </Col>
      ))}
    </Row>
    
{editingUser && (
  <UserModal 
  user={editingUser} 
  onOk={handleSave} 
  onCancel={() => setEditingUser(null)} 
  open={isModalOpen} />
)}

</>
);
};


export default Cards;
