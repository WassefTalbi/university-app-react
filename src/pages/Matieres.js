/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Button, 

  Avatar,
  Tooltip,
  Modal,
  Descriptions,

  
} from "antd";
import {
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  
} from "@ant-design/icons";


import {  getMatieres, getNotesByMatiere } from "../service/axios";


const { Meta } = Card;
function Matieres() {
 

  const [matieres,setMatieres]=useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [notes, setNotes] = useState([]); // State to hold the list of notes

  useEffect(()=>{
    handleGetMatiere();
   
}, [])


const handleGetMatiere=()=>{
  getMatieres().then(
     (res)=>{
       console.log(res.data);
       setMatieres(res.data)
       console.log("loading in state",matieres);
     }
   ).catch(
     (error)=>{
       console.log(error);
     }
   )
}
const handleViewDetails = async (matiere) => {
  setSelectedMatiere(matiere);
  setModalVisible(true);
  try {
    const notesResponse = await getNotesByMatiere(matiere.id); // Replace with your API call to get notes
    setNotes(notesResponse.data.notes);
    console.log(notesResponse.data)
  } catch (error) {
    console.log(error);
  }
};

const handleCloseModal = () => {
  setSelectedMatiere(null);
  setModalVisible(false);
};

  


  return (
    <>    
        <Row gutter={[24, 24]}>
        
        {matieres.map((p, index) => (
            <Col >
              <Card gutter={[6, 0]}  key={index}
          style={{
            width: 300,
          }}
          cover={
            <img
              alt="example"
              style={{ width: '100%', height: '200px' }}
              src={`http://localhost:8000/api/images/${p.photo_url}`} 
            />
          }
          actions={[
            
            <Tooltip title="View Notes">
            <EyeOutlined key="eye" onClick={() => handleViewDetails(p)} />
          </Tooltip>,
          <Tooltip title="Edit matiere">
            <EditOutlined key="edit" />
          </Tooltip>,
          <Tooltip title="Delete matiere">
            <DeleteOutlined key="delete" />
          </Tooltip>,
            
          ]}
        >
          <Meta
            avatar={<Avatar src={`http://localhost:8000/api/images/${p.photo_url}`}  />}
            title={p.name}
            description={p.description}
          />
             </Card>
          
             </Col>   
))}
        </Row>
     
        <Modal
        title={selectedMatiere?.name}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        <Row gutter={[24, 24]}>
        <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: "20px", // To prevent content from shifting when scroll bar appears
              }}
            >
              {notes.map((note, index) => (
                <Col  span={24} key={index}>
                  <Card className="card-billing-info" bordered="false">
                    <div className="col-info">
                    <Avatar src={`http://localhost:8000/api/images/${note.etudiant.photo_url}`}  />
                    <Descriptions title={`Note Score: ${note.score}`} titleStyle={{ color: note.score < 10 ? 'red' : 'green' }}>
                        <Descriptions.Item label="Full Name" span={3}>
                        {note.etudiant.firstname} {note.etudiant.lastname}
                        
                        </Descriptions.Item>

                        <Descriptions.Item label="Email Address" span={3}>
                        {note.etudiant.firstname}.{note.etudiant.lastname}@isetZG.com
                        </Descriptions.Item>
                        <Descriptions.Item label="Identifiant" span={3}>
                          {note.etudiant.cin}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                    <div className="col-action">
                      <Button type="link" danger>
                        DELETE
                      </Button>
                      <Button type="link" className="darkbtn">
                         EDIT
                      </Button>
                      
                    </div>
                    
                  </Card>
                 
                </Col>
              ))}
              </div>
            </Row>
      </Modal>
    
    </>
  );
}

export default Matieres;
