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
  Upload,
  message,
  Avatar,
  Tooltip,
  Modal,
  
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined, SettingOutlined ,
  EyeOutlined,
  VerticalAlignTopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


import { getImage, getMatieres } from "../service/axios";


const { Meta } = Card;
function Matieres() {
 
  const [imageURL, setImageURL] = useState(false);
 
  const [, setLoading] = useState(false);
  const [matieres,setMatieres]=useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  useEffect(()=>{
    handleGetMatiere();
   
},[])



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
const handleViewDetails = (matiere) => {
  setSelectedMatiere(matiere);
  setModalVisible(true);
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
    
      </Modal>
    
    </>
  );
}

export default Matieres;
