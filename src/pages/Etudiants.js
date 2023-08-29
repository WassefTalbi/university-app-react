
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Space,
  Avatar,
  Form, Input,Upload,
  DatePicker,
  Breadcrumb
} from "antd";
import {
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  
} from "@ant-design/icons";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { useEffect, useState } from "react";
import { createEtudiant, deleteEtudiant, getEtudiants, updateEtudiant } from "../service/axios";


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const handleShowDetails = (record) => {
  
  Modal.info({
    title: "Détails de l'étudiant",
    content: (
      <div>
        <p>Identifiant: {record.cin}</p>
        <p>Nom et prénom: {record.firstname} {record.lastname}</p>
        <p>Email: {record.firstname}.{record.lastname}@isetZg.com</p>
        <p>Téléphone: 56432766</p>
        <p>Date de naissance: {record.birthday}</p>
      </div>
    ),
  });
};

function Etudiants() {


  const [etudiants,setEtudiants]=useState([])
 
  const [totalPages,setTotalPages]=useState(1);
  const [loading,setLoading]=useState(false);
  const [per_page,setPer_page]=useState(1);
  const [currentPage,setCurrentPage]=useState(1);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
 

    useEffect(()=>{
         handleGetEtudiant(currentPage);
    },[currentPage])
  const handleGetEtudiant=(currentPage)=>{
   
     getEtudiants(currentPage).then(
        (res)=>{
          setLoading(true)
          setEtudiants(res.data.data);
          setTotalPages(res.data.total)
          setPer_page(res.data.per_page)
          setCurrentPage(res.data.current_page)
          setLoading(false)
        }
      ).catch(
        (error)=>{
          console.log(error);
        }
      )
}
const handleUpdate = (record) => {
  setRecordToUpdate(record);
  setFileList([
    {
      uid: record.photo_url,
      name: record.photo_url,
      status: 'done',
      url: `http://localhost:8000/api/images/${record.photo_url}`,
    },
  ]);

  console.log(record)
  setUpdateModalVisible(true)

};

const onUpdate = async (values) => {
  const formData = new FormData();
  formData.append('file', fileList[0].originFileObj);
  formData.append("firstname", values.firstname);
  formData.append("lastname", values.lastname);
  formData.append("cin", values.cin);
  formData.append("birthday", values.birthday);
  try {
   await updateEtudiant(recordToUpdate.id,formData);
    setUpdateModalVisible(false);
    toast.success("Étudiant modifié avec succès!");
    handleGetEtudiant(currentPage);
  } catch (error) {
    toast.error('Error submitting data.');
  }
};
const columns = [
  {
    title: "photo",
    dataIndex: "photo_url", 
    key: "photo_url",
    render: (photo_url) => <Avatar src={`http://localhost:8000/api/images/${photo_url}`} />,
    width: "10%",
  },
  {
    title: "identifiant",
    dataIndex: "cin",
    key: "cin",
    width: "32%",
  },
  {
    title: "Prenom",
    dataIndex: "firstname",
    key: "name",
    width: "32%",
  },
  {
    title: "Nom",
    dataIndex: "lastname",
    key: "lastname",
    width: "32%",
  },
  {
    title: "date naissance",
    key: "birthday",
    dataIndex: "birthday",
    width: "32%",
  },
  {
    title: "actions",
    key: "action",
    width: "10%",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleShowDetails(record)}
        >
          Détails
        </Button>
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}
        >
          Modifier
        </Button>
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          Supprimer
        </Button>
      </Space>
    ),
  },
];
const handleDelete = (record) => {
  // Show a confirmation alert
  if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${record.firstname} ${record.lastname} ?`)) {
    // Make the API call to delete the student
    deleteEtudiant(record.id)
      .then((res) => {
        console.log("Student deleted:", res);
        toast.success("Étudiant supprimé avec succès!"); 
        // Update the student list
        const updatedEtudiants = etudiants.filter((etudiant) => etudiant.id !== record.id);
        setEtudiants(updatedEtudiants);

        // If the current page becomes empty, decrement the current page
        if (updatedEtudiants.length === 0 && currentPage > 1) {
          handleGetEtudiant(currentPage - 1);
        }

      })
      .catch((err) => {
        console.log("Error deleting student:", err);
        toast.error("Étudiant non supprimé ! error"); 
     
      });
  }
};

const [form] = Form.useForm();
const [fileList, setFileList] = useState([]);
const onFinish = async (values) => {
  console.log("to add",fileList[0].originFileObj)
  const formData = new FormData();
  formData.append('file', fileList[0].originFileObj);
  formData.append("firstname", values.firstname);
  formData.append("lastname", values.lastname);
  formData.append("cin", values.cin);
  formData.append("birthday", values.birthday.toISOString().split('T')[0]);

  try {
    console.log("this is form data",formData)
   await createEtudiant(formData);
    setAddModalVisible(false);
    toast.success("Étudiant ajouté avec succès!");
    handleGetEtudiant(currentPage);
  } catch (error) {
    console.log('Error response:', error.response.data);

    toast.error('Error submitting data.');
  }
};

const onFileChange = ({ fileList }) => {
  setFileList(fileList);
};
const handleModalClose = () => {
  setAddModalVisible(false);
  form.resetFields(); 
};

  return (
    <>
      <Row style={{ marginBottom: "20px" }}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Etudiants</Breadcrumb.Item>
      </Breadcrumb>
      </Row>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Tout les étudiants"
              extra={(
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {setAddModalVisible(true)
                  
                  }}
                >
                 Ajouter un étudiant
                </Button>
              )}
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={etudiants} 
                  pagination={{
                    pageSize:per_page,
                    total:totalPages,
                    current:currentPage,
                    onChange:async (page) => {
                      console.log(page);
                      setCurrentPage(page);
                      await handleGetEtudiant(page); // Wait for the data to be fetched
              
                    }
                  }}
                
                  loading={loading}
                  className="ant-border-space"
                />
              </div>
            </Card>         
          </Col>
        </Row>
      </div>
      {updateModalVisible && (
       <Modal
       title="Modifier l'étudiant"
       visible={updateModalVisible}
       onCancel={() => setUpdateModalVisible(false)}
       footer={null}
     >
       <Form
         {...layout}
         form={form} 
         onFinish={onUpdate}
         initialValues={recordToUpdate}
       >
         <Form.Item
           label="Prénom"
           name="firstname"
           rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
         >
           <Input />
         </Form.Item>
         <Form.Item
           label="Nom"
           name="lastname"
           rules={[{ required: true, message: "Veuillez entrer le nom" }]}
         >
           <Input />
         </Form.Item>
         <Form.Item
           label="CIN"
           name="cin"
           rules={[{ required: true, message: "Veuillez entrer le CIN" }]}
         >
           <Input />
         </Form.Item>
         <Form.Item
           label="Date de naissance"
           name="birthday"
           rules={[{ required: true, message: "Veuillez entrer la date de naissance" }]}
         >
           <Input />
         </Form.Item>
         <Form.Item label="Photo de profil"  rules={[ { required: true, message: "Veuillez télécharger une photo de profil" },
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
         <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
           <Button type="primary" htmlType="submit">
             Mettre à jour
           </Button>
         </Form.Item>
       </Form>

     </Modal>
      )}
       <Modal
        title="Ajouter un étudiant"
        visible={addModalVisible}
        onCancel={handleModalClose} //{() => setAddModalVisible(false)}
        footer={null}
      >
         <Form form={form}  onFinish={onFinish}>
       <Form.Item name="cin" label="identifiant"  rules={[{ required: true, message: "Veuillez entrer le CIN" }]}
>
        <Input />
      </Form.Item>
      <Form.Item name="firstname" label="nom"  rules={[{ required: true, message: "Veuillez entrer le nom" }]}
>
        <Input />
      </Form.Item>
      <Form.Item name="lastname" label="prenom"  rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
>
        <Input />
      </Form.Item>
      <Form.Item name="birthday" label="Date de naissance"  rules={[{ required: true, message: "Veuillez entrer la date de naissance" }]}
>
        <DatePicker style={{ width: "100%" }} />
     </Form.Item>
      
     
      <Form.Item label="Photo de profil"  rules={[ { required: true, message: "Veuillez télécharger une photo de profil" },
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
         Ajouter
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

export default Etudiants;
