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
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
} from "antd";

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Images
import ava1 from "../assets/images/logo-shopify.svg";
import ava2 from "../assets/images/logo-atlassian.svg";
import ava3 from "../assets/images/logo-slack.svg";
import ava5 from "../assets/images/logo-jira.svg";
import ava6 from "../assets/images/logo-invision.svg";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
import pencil from "../assets/images/pencil.svg";
import { useEffect, useState } from "react";
import { getEtudiants } from "../service/axios";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
// table code start
const columns = [
  {
    title: "Avatar",
    dataIndex: "avatar", // Assuming you have an "avatar" property in your student data
    key: "avatar",
    render: (avatar) => <Avatar src={face2} />,
    width: "10%",
  },
  {
    title: "identifiant",
    dataIndex: "cin",
    key: "cin",
    width: "32%",
  },
  {
    title: "FirstName",
    dataIndex: "firstname",
    key: "name",
    width: "32%",
  },
  {
    title: "Lastname",
    dataIndex: "lastname",
    key: "lastname",
    width: "32%",
  },

 
  {
    title: "Birthday",
    key: "birthday",
    dataIndex: "birthday",
    width: "32%",
  },
];



function Etudiants() {

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const [etudiants,setEtudiants]=useState([])
  const [state,setState]=useState({
    currentPage:1,
    pageSize:10,
    keyword:"",
    totalPage:""
  })
    useEffect(()=>{
         handleGetEtudiant();
    },[])
  const handleGetEtudiant=()=>{
     getEtudiants().then(
        (res)=>{
          console.log(res.data);    
         setEtudiants(res.data)
          console.log("loading in state",etudiants);
        }
      ).catch(
        (error)=>{
          console.log(error);
        }
      )
}

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="All Etudiant"
            
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={etudiants} 
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>         
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Etudiants;
