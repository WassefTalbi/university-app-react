  import React, { useEffect, useState } from "react";
  import { Row, Col, Card, Button , Form, DatePicker,Input,Modal,Breadcrumb} from "antd";
  import { EditOutlined, DeleteOutlined,EyeOutlined,PlusOutlined,HomeOutlined, UserOutlined } from "@ant-design/icons";
  import { createClass, createDepartment, deleteClass, deleteDepartment, getDepartments } from "../service/axios";
  import { Link } from 'react-router-dom';
  import { ToastContainer, toast } from 'react-toastify';
  import moment from 'moment'; 
  const departmentCardStyle = {
    marginBottom: "16px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  function Departments() {


    const [departments, setDepartments] = useState([]);
    const [currentDepartment, setCurrentDepartment] = useState([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addDepartmentModalVisible, setAddDepartmentModalVisible] = useState(false);
    useEffect(() => {
      handleGetDepartments();
    }, []);
    const [form] = Form.useForm();
    const handleGetDepartments = () => {
      getDepartments()
        .then((res) => {
          setDepartments(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

      // Function to customize the date display and parsing
      const academicYearDisplay = (moment) => {
        if (moment) {
          const startYear = moment.year();
          const endYear = startYear + 1;
          return `${startYear}-${endYear}`;
        }
        return '';
      };
        // Function to disable dates in the past
    const disabledDate = (current) => {
      return current && current < moment().startOf('year');
    };
    const handleModalClose = () => {
      setAddModalVisible(false);
      form.resetFields(); 
    };
    const handleDepartmentModalClose = () => {
      setAddDepartmentModalVisible(false);
      form.resetFields(); 
    };
    const onFinish = async (values) => {

    const formData = new FormData();
    formData.append("ref", values.ref);
    const academicYear = values.anneScolaire.format('YYYY') + '-' + (values.anneScolaire.year() + 1);
    formData.append("anneScolaire", academicYear);

    try {
    
    await createClass(currentDepartment.id,formData);
      setAddModalVisible(false);
      toast.success("classe ajouté avec succès!");
      handleGetDepartments();
    } catch (error) {
      console.log('Error response:', error.response.data);

      toast.error('Error submitting data.');
    }
  };
  const onFinishDepartment = async (values) => {

    const formData = new FormData();
    formData.append("type", values.type);
    formData.append("name", values.name);

    try {
    
    await createDepartment(formData);
    setAddDepartmentModalVisible(false);
      toast.success("Département ajouté avec succès!");
      handleGetDepartments();
    } catch (error) {
      console.log('Error response:', error.response.data);

      toast.error('Error submitting data.');
    }
  };
  const handleDeleteDepartment = (department) => {
    // Show a confirmation alert
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${department.name}  ?`)) {
      // Make the API call to delete the student
      deleteDepartment(department.id)
        .then((res) => {
          toast.success("département supprimé avec succès!"); 
          // Update the student list
          const updatedDepartment = departments.filter((dep) => dep.id !== department.id);
          setDepartments(updatedDepartment);
        })
        .catch((err) => {   
          toast.error("département non supprimé ! error"); 
       
        });
    }
  };
  const handleDeleteClass = (department,classe) => {
    // Show a confirmation alert
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${classe.ref}  ?`)) {
      // Make the API call to delete the student
      console.log(classe.id)
      deleteClass(classe.id)
        .then((res) => {
          toast.success("classe supprimé avec succès!"); 
          handleGetDepartments();
          
        })
        .catch((err) => {   
          toast.error("département non supprimé ! error"); 
       
        });
    }
  };
    return (
      <>
      <Row style={{ marginBottom: "20px" }}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>départements</Breadcrumb.Item>
      </Breadcrumb>
      </Row>
      <div>

        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: "16px" }}
           onClick={() => {setAddDepartmentModalVisible(true) }}
        >
        Ajouter un département
        </Button>
      
        {departments.map((department) => (
          <Card
            key={department.id}
            style={{ ...departmentCardStyle, background: "#F5F5F5" }}
          >
            <Row gutter={16} align="middle">
              <Col span={20}>
                <h2>{department.type}</h2>
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: "20px" }} size="small"
                onClick={() => {setAddModalVisible(true) ; setCurrentDepartment(department)}}
                >
                Ajouter une classe
                </Button>
              </Col>
            </Row>
            <Row gutter={16}>
              {department.classrooms.map((classroom) => (
                <Col span={8} key={classroom.id}>
                  <Card hoverable style={departmentCardStyle}>
                    <h3> class : { classroom.ref}</h3>
                    <p>{classroom.anneScolaire}</p>
                    <Link to=  {{
                        pathname: `/class-details/${classroom.id}`,
                        search: `?department=${department.type}`,
                      }} style={{ color:"",marginRight: "4px" }}
                     >
                         Détails
                    </Link>  
                  <Link to="" style={{ color:"green",marginRight: "4px" }}> Modifier</Link> 
                  <Link to="#"  onClick={() => {handleDeleteClass(department,classroom)}}  style={{color:"red"  }}> Supprimer</Link> 
                
                    
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </div>
      <Modal
          title="Ajouter une classe"
          visible={addModalVisible}
          onCancel={handleModalClose} //{() => setAddModalVisible(false)}
          footer={null}
        >
          <Form
        
        form={form} 
        onFinish={onFinish}

      >
        <Form.Item
          label="ref classe"
          name="ref"
          rules={[{ required: true, message: "Veuillez entrer le nom" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
            label="anneScolaire"
            name="anneScolaire"
            rules={[{ required: true, message: "Veuillez entrer l'anneScolaire" }]}
          >
            <DatePicker
            picker="year"
            disabledDate={disabledDate}
              format={academicYearDisplay}
              placeholder="Sélectionnez une année scolaire"
            />
          </Form.Item>
      
        
      
    
    
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Button style={{ marginTop: "20px" }} type="primary" htmlType="submit">
          Ajouter classe
          </Button>
        </Form.Item>
      </Form>
      </Modal>

      <Modal
          title="Ajouter un département"
          visible={addDepartmentModalVisible}
          onCancel={handleDepartmentModalClose} //{() => setAddModalVisible(false)}
          footer={null}
        >
          <Form
        
        form={form} 
        onFinish={onFinishDepartment}

      >
        <Form.Item
          label="type department "
          name="type"
          rules={[{ required: true, message: "Veuillez entrer le type" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
            label="libellé"
            name="name"
            rules={[{ required: true, message: "Veuillez entrer le libellé" }]}
          >
            <Input />
          </Form.Item>
      
        
      
    
    
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Button style={{ marginTop: "20px" }} type="primary" htmlType="submit">
          Ajouter département
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

  export default Departments;
