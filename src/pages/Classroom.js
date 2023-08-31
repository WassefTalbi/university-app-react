
import { useEffect, useState } from "react";
import { useLocation, useParams } from 'react-router-dom';

import {
  Row,
  Col,
  Card,
  Button, 
  Breadcrumb,
  Avatar,
  Tooltip,
  Modal,
  Descriptions,

  
} from "antd";
import {
  SettingOutlined ,
  EyeOutlined,
} from "@ant-design/icons";


import {  getEtudiantsByClass, getEvalutionsOfMatiere, getMatieres, getMatieresOfClassroom, getNotesByMatiere } from "../service/axios";



const { Meta } = Card;
function Classroom() {
 
    const { id } = useParams();


  const [matieres,setMatieres]=useState([])
  const [evaluations,setEvaluations]=useState([])
  const [etudiants,setEtudiants]=useState([])
  const [notedModalVisible, setNotedModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [currentClass, setCurrentClass] = useState([]); // State to hold the list of notes
  const [notes, setNotes] = useState([]); // State to hold the list of notes
  const { classroomId } = useParams();
  const location = useLocation();
  const departmentName = new URLSearchParams(location.search).get('department');
  useEffect(()=>{
    handleGetMatieres();
    handleGetEtudiants();
}, [])

const handleGetEtudiants=()=>{
  getEtudiantsByClass(id).then(
   (res)=>{
     console.log("etudiants",res.data);
     setEtudiants(res.data)
 
   }
 ).catch(
   (error)=>{
     console.log(error);
   }
 )
}
const handleGetMatieres=()=>{
    getMatieresOfClassroom(id).then(
     (res)=>{
       console.log("test fr id",res.data);
       setCurrentClass(res.data)
       setMatieres(res.data.matieres)
   
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
const handleNoted = async (matiere) => {
  setSelectedMatiere(matiere);
  setNotedModalVisible(true);
  try {
    const matiere_evaluations = await getEvalutionsOfMatiere(matiere.id); 
    setEvaluations(matiere_evaluations.data.evaluations);
    console.log(matiere_evaluations.data.evaluations)
    console.log(etudiants)
  } catch (error) {
    console.log(error);
  }
};

const handleCloseModal = () => {
  setSelectedMatiere(null);
  setModalVisible(false);
};
const handleCloseNotedModal = () => {
  setSelectedMatiere(null);
  setNotedModalVisible(false);
};

  


  return (
    <>    
       <Row style={{ marginBottom: "20px" }}>
    <Breadcrumb>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>Department {departmentName}</Breadcrumb.Item>
      <Breadcrumb.Item>class {currentClass.ref}</Breadcrumb.Item>
    </Breadcrumb>
    </Row>
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
          bodyStyle={{
            width: 300,
          }}
          actions={[
            
            <Tooltip title="View Notes">
            <EyeOutlined key="eye" onClick={() => handleViewDetails(p)} />
            </Tooltip>,
            <Tooltip title="Noted">
            <SettingOutlined key="noted" onClick={() => handleNoted(p)}  />
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
                paddingRight: "20px", 
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
      <Modal
        title={selectedMatiere?.name}
        visible={notedModalVisible}
        onCancel={handleCloseNotedModal}
        footer={[
          <Button key="close" onClick={handleCloseNotedModal}>
            Close
          </Button>,
        ]}
      >
       
            <Row gutter={[24, 24]}>
    
            </Row>
      </Modal>
    </>
  );
}

export default Classroom;
