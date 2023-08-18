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
  Avatar,
  Tooltip,


  
} from "antd";
import {
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  
} from "@ant-design/icons";


import {  getSpecialites } from "../service/axios";


const { Meta } = Card;
function Speciality() {
 
  const [specialities,setSpecialities]=useState([])
 
  useEffect(() => {
    handleGetSpecialites();
  }, []);

const handleGetSpecialites=()=>{
  getSpecialites().then(
     (res)=>{
       setSpecialities(res.data)
       console.log("loading in state",specialities);
     }
   ).catch(
     (error)=>{
       console.log(error);
     }
   )
}


  return (
    <>    
        <Row gutter={[24, 24]}>
        
        {specialities.map((p, index) => (
            <Col >
              <Card gutter={[6, 0]}  key={index}
          style={{
            width: 300,
          }}
        
          actions={[
            
            <Tooltip title="View modules">
            <EyeOutlined key="eye" />
          </Tooltip>,
          <Tooltip title="Edit speciality">
            <EditOutlined key="edit" />
          </Tooltip>,
          <Tooltip title="Delete speciality">
            <DeleteOutlined key="delete" />
          </Tooltip>,
            
          ]}
        >
          <Meta
           
            title={p.type}
            description={p.name}
          />
             </Card>
          
             </Col>   
))}
        </Row>
     
     
    
    </>
  );
}

export default Speciality;
