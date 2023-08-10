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
} from "antd";
import {
 
  VerticalAlignTopOutlined,
} from "@ant-design/icons";


import profilavatar from "../assets/images/face-1.jpg";
import convesionImg from "../assets/images/face-3.jpg";
import convesionImg2 from "../assets/images/face-4.jpg";
import convesionImg3 from "../assets/images/face-5.jpeg";
import project1 from "../assets/images/home-decor-1.jpeg";
import project2 from "../assets/images/home-decor-2.jpeg";
import project3 from "../assets/images/home-decor-3.jpeg";
import { getMatieres } from "../service/axios";

function Matieres() {
  const [imageURL, setImageURL] = useState(false);
  const [, setLoading] = useState(false);
  const [matieres,setMatieres]=useState([])

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

 
  const project = [
    {
      img: project1,
      titlesub: "Project #1",
      title: "Modern",
      disciption:
        "As Uber works through a huge amount of internal management turmoil.",
    },
    {
      img: project2,
      titlesub: "Project #2",
      title: "Scandinavian",
      disciption:
        "Music is something that every person has his or her own specific opinion about.",
    },
    {
      img: project3,
      titlesub: "Project #3",
      title: "Minimalist",
      disciption:
        "Different people have different taste, and various types of music, Zimbali Resort",
    },
  ];


  return (
    <>
    
     <Card
        bordered={false}
        className="header-solid mb-24"
    
      >
        <Row gutter={[24, 24]}>
          {matieres.map((p, index) => (
            <Col span={24} md={12} xl={6} key={index}>
              <Card
                bordered={false}
                className="card-project"
                cover={<img alt="example" src="" />}
              >
                <div className="card-tag">{p.id}</div>
                <h5>{p.name}</h5>
                <p>{p.desciption}</p>
                <Row gutter={[6, 0]} className="card-footer">
                  <Col span={12}>
                    <Button type="button">VIEW NOTES</Button>
                  </Col>
                 
                </Row>
              </Card>
            </Col>
          ))}
       
        </Row>
      </Card>
  
    
    </>
  );
}

export default Matieres;
