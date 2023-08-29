
import { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Button, 

  Avatar,
  Tooltip,
  Modal,
  Space,
  Select,
  Form, Input,Upload,
  Breadcrumb

} from "antd";
import {
  EditOutlined, 
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  createMatiere, deleteMatiere, getMatieres, getModules,  updateMatiere } from "../service/axios";


const { Meta } = Card;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function Matieres() {
 

  const [matieres,setMatieres]=useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null); 

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editMatiere, setEditMatiere] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  useEffect(()=>{
    handleGetMatiere();
    handleGetModules();
}, [])


const [evaluations, setEvaluations] = useState([]);

const handleAddEvaluation = () => {
  setEvaluations([...evaluations, { name: '', pourcentage: '' }]);
};

const handleEvaluationChange = (index, field, value) => {
  const newEvaluations = [...evaluations];
  newEvaluations[index][field] = value;
  setEvaluations(newEvaluations);
};

const handleGetModules = () => {
  getModules().then(
    (res)=>{
      setModules(res.data)
    }
  ).catch(
    (error)=>{
      console.log(error);
    }
  )
}
const handleGetMatiere=()=>{
  getMatieres().then(
     (res)=>{
       setMatieres(res.data)
     }
   ).catch(
     (error)=>{
       console.log(error);
     }
   )
}

const handleEditMatiere = (matiere) => {
  setEditMatiere(matiere);
  setEvaluations(matiere.evaluations)
  console.log(matiere)
  setFileList([
    {
      uid: matiere.photo_url,
      name: matiere.photo_url,
      status: 'done',
      url: `http://localhost:8000/api/images/${matiere.photo_url}`,
    },
  ]);

  setUpdateModalVisible(true);
  form.resetFields(); 
};


const handleShowDetails = (matiere) => {
  
  Modal.info({
    title: "Détails de matiere",
    content: (
      <div>
        <p>Nom: {matiere.name}</p>
        <p>Description: {matiere.description}</p>
        <p>Credit: {matiere.credit}</p>
        <p>Coefficient: {matiere.coefficient}</p>
        <p>Charge total: {matiere.charge_total} heures</p>
        <p>Évaluations:</p>
          <ul>
            {matiere.evaluations.map((evaluation, index) => (
              <li key={index}>
               {evaluation.name} : {evaluation.pourcentage}%
              </li>
            ))}
          </ul>
      </div>
    ),
  });
};
const handleModalClose = () => {
  setAddModalVisible(false);
  form.resetFields(); 
};

const onFileChange = ({ fileList }) => {
  setFileList(fileList);
};
const onFinish = async (values) => {
  console.log("to add",fileList[0].originFileObj)
  const formData = new FormData();
  formData.append('file', fileList[0].originFileObj);
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("credit", values.credit);
  formData.append("coefficient", values.coefficient);
  formData.append("charge_total", values.charge_total);
  evaluations.forEach((evaluation, index) => {
    formData.append(`evaluations[${index}][name]`, evaluation.name);
    formData.append(`evaluations[${index}][pourcentage]`, evaluation.pourcentage);
});

  try {
    console.log("this is form data",formData)
   await createMatiere(selectedModuleId,formData);
    setAddModalVisible(false);
    toast.success("Matiere ajouté avec succès!");
    handleGetMatiere();
  } catch (error) {
    console.log('Error response:', error.response.data);

    toast.error('Error submitting data.');
  }
};
const onUpdate = async (values) => {
  const formData = new FormData();
  formData.append('file', fileList[0].originFileObj);
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("credit", values.credit);
  formData.append("coefficient", values.coefficient);
  formData.append("charge_total", values.charge_total);
  evaluations.forEach((evaluation, index) => {
    formData.append(`evaluations[${index}][id]`, evaluation.id); 
    formData.append(`evaluations[${index}][name]`, evaluation.name);
    formData.append(`evaluations[${index}][pourcentage]`, evaluation.pourcentage);
  });
  try {
    
   await updateMatiere(editMatiere.id,formData);
   setUpdateModalVisible(false);
    toast.success("Matiere modifié avec succès!");
    handleGetMatiere();
  } catch (error) {
    toast.error('Error submitting data.');
  }
};
const handleDeleteMatiere = (matiere) => {
  // Show a confirmation alert
  if (window.confirm(`Êtes-vous sûr de vouloir supprimer la matiere ${matiere.name}  ?`)) {
    // Make the API call to delete the student
    deleteMatiere(matiere.id)
      .then((res) => {
        toast.success("matiere supprimé avec succès!"); 
        // Update the student list
        const updatedMatieres = matieres.filter((subject) => subject.id !== matiere.id);
        setMatieres(updatedMatieres);
      })
      .catch((err) => {   
        toast.error("matiere non supprimé ! error"); 
     
      });
  }
};
const onModuleSelectChange = (moduleId) => {
  setSelectedModuleId(moduleId); 
};
  return (
    <> 
      <Row style={{ marginBottom: "20px" }}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Matieres</Breadcrumb.Item>
      </Breadcrumb>
      </Row>
    <Row style={{ marginBottom: "20px" }}>

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {setAddModalVisible(true)
                  
                  }}
                >
                 Ajouter une matiere
                </Button>
    </Row>
   
    <Row gutter={[24, 24]} >
      
           
             
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
            
          <Tooltip title="Détails matiere">
          <EyeOutlined key="detail" onClick={() => handleShowDetails(p)}  />
           </Tooltip>,
          <Tooltip title="modifier matiere">
            <EditOutlined key="edit" onClick={() => handleEditMatiere(p)}  />
          </Tooltip>,
          <Tooltip title="supprimer matiere">
            <DeleteOutlined key="delete" onClick={() => handleDeleteMatiere(p)}  />
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
       title="Modifier matiere"
       visible={updateModalVisible}
       onCancel={() => setUpdateModalVisible(false)}
       footer={null}
     >
        <Form
      
          form={form} 
          onFinish={onUpdate}
          initialValues={editMatiere}
        >
          <Form.Item
            label="nom de matiere"
            name="name"
            rules={[{ required: true, message: "Veuillez entrer le nom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Veuillez entrer le description" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Credit"
            name="credit"
            rules={[{ required: true, message: "Veuillez entrer le credit" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Coefficient"
            name="coefficient"
            rules={[{ required: true, message: "Veuillez entrer le coefficient" },
            
          ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Charge total"
            name="charge_total"
            rules={[{ required: true, message: "Veuillez entrer le charge_total" }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item label="Photo de matiere"  rules={[ { required: true, message: "Veuillez télécharger une photo de profil" },
    ]}>
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            listType="picture"
            maxCount={1}
            onChange={onFileChange}
          >
            <Button icon={<UploadOutlined />}> Télécharger une photo</Button>
          </Upload>
        </Form.Item>

        <div>
      <h3>Évaluations existantes :</h3>
      {evaluations.map((evaluation, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Nom de l'évaluation"
              value={evaluation.name}
              onChange={(e) => handleEvaluationChange(index, 'name', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Pourcentage"
              value={evaluation.pourcentage}
              onChange={(e) => handleEvaluationChange(index, 'pourcentage', e.target.value)}
              addonAfter="%"
            />
          </Space>
        </div>
      ))}
      <Button type="dashed" onClick={handleAddEvaluation} block>
        Ajouter un champ d'évaluation
      </Button>
    </div>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Mettre à jour
            </Button>
          </Form.Item>
        </Form>

     </Modal>

     <Modal
        title="Ajouter une matiere"
        visible={addModalVisible}
        onCancel={handleModalClose} //{() => setAddModalVisible(false)}
        footer={null}
      >
         <Form
      
      form={form} 
      onFinish={onFinish}

    >
      <Form.Item
        label="nom de matiere"
        name="name"
        rules={[{ required: true, message: "Veuillez entrer le nom" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Veuillez entrer le description" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Credit"
        name="credit"
        rules={[{ required: true, message: "Veuillez entrer le credit" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Coefficient"
        name="coefficient"
        rules={[{ required: true, message: "Veuillez entrer le coefficient" },
        
      ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Charge total"
        name="charge_total"
        rules={[{ required: true, message: "Veuillez entrer le charge_total" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
            label="Sélectionner un module"
            name="module_id"
            rules={[{ required: true, message: "Veuillez sélectionner un module" }]}
          >
            <Select onChange={onModuleSelectChange}>
              {modules.map((module) => (
                <Select.Option key={module.id} value={module.id}>
                  {module.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
      <Form.Item label="Photo de matiere"  rules={[ { required: true, message: "Veuillez télécharger une photo de profil" },
]}>
      <Upload
        fileList={fileList}
        beforeUpload={() => false}
        listType="picture"
        maxCount={1}
        onChange={onFileChange}
      >
        <Button icon={<UploadOutlined />}> Télécharger une photo</Button>
      </Upload>
    </Form.Item>
    <div>
      {evaluations.map((evaluation, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Nom de l'évaluation"
              value={evaluation.name}
              onChange={(e) => handleEvaluationChange(index, 'name', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Pourcentage"
              value={evaluation.pourcentage}
              onChange={(e) => handleEvaluationChange(index, 'pourcentage', e.target.value)}
              addonAfter="%"
            />
          </Space>
        </div>
      ))}
      <Button type="dashed" onClick={handleAddEvaluation} block>
        Ajouter un champ d'évaluation
      </Button>
    </div>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
        <Button style={{ marginTop: "20px" }} type="primary" htmlType="submit">
        Ajouter matiere
        </Button>
      </Form.Item>
    </Form>
     </Modal>
     <div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Matieres;
