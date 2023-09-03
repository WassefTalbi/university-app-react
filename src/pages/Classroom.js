import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Breadcrumb,
  Avatar,
  Tooltip,
  Modal,
  Table,
  InputNumber,
} from "antd";
import {
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {
  getEtudiantsByClass,
  getEtuiantWithGrades,
  getEvalutionsOfMatiere,
  getMatieres,
  getMatieresOfClassroom,
  getNotesByMatiere,
  updateGradeInBackend, // Import your API function to update grades
} from "../service/axios";

const { Meta } = Card;

function Classroom() {
  const { id } = useParams();

  const [matieres, setMatieres] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [etudiantWithGrades, setEtudiantWithGrades] = useState([]);
  const [notedModalVisible, setNotedModalVisible] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [currentClass, setCurrentClass] = useState([]);
  const { classroomId } = useParams();
  const location = useLocation();
  const departmentName = new URLSearchParams(location.search).get("department");

  const [editingKey, setEditingKey] = useState(null);

  const isEditing = (record, evaluationName) => {
    return record.id === editingKey && record.editingField === evaluationName;
  };

  const edit = (record, evaluationName) => {
    setEditingKey(record.id);
    record.editingField = evaluationName;
  };

  const save = async (record, evaluationName, value) => {
    const studentId = record.id; // Assuming `id` is the student's ID
    const matiereName = evaluationName; // Assuming `evaluationName` is the matiere name
  
    const requestData = {
      evaluation_name:evaluationName,
      matiere_id: selectedMatiere.id,
      value: value,
    };
  
    try {
      await updateGradeInBackend(studentId, requestData);
      const updatedEtudiantWithGrades = etudiantWithGrades.map((etudiant) => {
        if (etudiant.id === record.id) {
          etudiant.grades[evaluationName] = value;
          etudiant.editing = false;
          etudiant.editingField = null;
        }
        return etudiant;
      });
      setEtudiantWithGrades(updatedEtudiantWithGrades);
      setEditingKey(null);
    } catch (error) {
      console.error("Error saving grade:", error);
    }
  };

  useEffect(() => {
    handleGetMatieres();
    handleGetEtudiants();
  }, []);

  const handleGetEtudiants = () => {
    getEtudiantsByClass(id)
      .then((res) => {
        console.log("etudiants", res.data);
        setEtudiants(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetMatieres = () => {
    getMatieresOfClassroom(id)
      .then((res) => {
        console.log("test fr id", res.data);
        setCurrentClass(res.data);
        setMatieres(res.data.matieres);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleViewDetails = async (matiere) => {
    setSelectedMatiere(matiere);

    try {
      const notesResponse = await getNotesByMatiere(matiere.id);

      console.log(notesResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleNewGradeChange = (record, evaluationName, value) => {
    const updatedEtudiantWithGrades = etudiantWithGrades.map((etudiant) => {
      if (etudiant.id === record.id) {
        etudiant.grades[evaluationName] = value;
      }
      return etudiant;
    });
    setEtudiantWithGrades(updatedEtudiantWithGrades);
  };
  const handleNoted = async (matiere) => {
    handleEvaluation(matiere);
    setNotedModalVisible(true);
    try {
      const matiere_evaluations = await getEtuiantWithGrades(id, matiere.id);
      setEtudiantWithGrades(matiere_evaluations.data);
      console.log(matiere_evaluations.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEvaluation = async (matiere) => {
    setSelectedMatiere(matiere);
    try {
      const matiere_evaluations = await getEvalutionsOfMatiere(matiere.id);
      setEvaluations(matiere_evaluations.data.evaluations);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseNotedModal = () => {
    setSelectedMatiere(null);
    setEtudiantWithGrades(null);
    setNotedModalVisible(false);
  };

  const columns = [
    {
      title: "Etudiant",
      dataIndex: "studentInfo",
      key: "studentInfo",
      width: 200,
      render: (text, record) => (
        <div>
          <div>
            <span>
              <strong>CIN:</strong> {record.cin ? `${record.cin} ` : "-"}
            </span>
          </div>
          <div>
            <span>
              <strong>Nom et Prenom :</strong>{" "}
              {record.name ? `${record.name} ` : "-"}
            </span>
          </div>
        </div>
      ),
    },
    ...evaluations.map((evaluation) => ({
      title: evaluation.name,
      dataIndex: `grades.${evaluation.name}`,
      key: `grades.${evaluation.name}`,
      render: (text, record) => {
        const editing = isEditing(record, evaluation.name);

        return editing ? (
          <InputNumber
            value={record.grades[evaluation.name]}
            onChange={(value) =>
              handleNewGradeChange(record, evaluation.name, value)
            }
            onBlur={() => save(record, evaluation.name, record.grades[evaluation.name])}
            onPressEnter={() => save(record, evaluation.name, record.grades[evaluation.name])}
            autoFocus
          />
        ) : (
          <span onClick={() => edit(record, evaluation.name)}>
            {record.grades[evaluation.name] !== null ? record.grades[evaluation.name] : "-"}
          </span>
        );
      },
    })),
  ];

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
          <Col key={index}>
            <Card
              gutter={[6, 0]}
              style={{
                width: 300,
              }}
              cover={
                <img
                  alt="example"
                  style={{ width: "100%", height: "200px" }}
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
                  <SettingOutlined
                    key="noted"
                    onClick={() => handleNoted(p)}
                  />
                </Tooltip>,
              ]}
            >
              <Meta
                avatar={
                  <Avatar
                    src={`http://localhost:8000/api/images/${p.photo_url}`}
                  />
                }
                title={p.name}
                description={p.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={selectedMatiere?.name}
        visible={notedModalVisible}
        onCancel={handleCloseNotedModal}
        footer={null}
        width={900}
      >
        <Table
          dataSource={etudiantWithGrades}
          rowKey="id"
          pagination={false}
          columns={columns}
          scroll={{ x: true }}
        />
      </Modal>
    </>
  );
}

export default Classroom;
