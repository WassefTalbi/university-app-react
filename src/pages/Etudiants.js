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
  Table,
  Button,
  Modal,
  Space,
  Avatar,
  Form, Input,Upload
} from "antd";
import {
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  
} from "@ant-design/icons";


import { useEffect, useState } from "react";
import { getEtudiants } from "../service/axios";


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const handleShowDetails = (record) => {
  
  Modal.info({
    title: "Student Details",
    content: (
      <div>
        <p>Student ID: {record.id}</p>
        <p>First Name: {record.firstname}</p>
        <p>Last Name: {record.lastname}</p>
        {/* Display other details as needed */}
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
  
    useEffect(()=>{
         handleGetEtudiant(currentPage);
    },[])
  const handleGetEtudiant=(page)=>{
   console.log(page)
     getEtudiants(page).then(
        (res)=>{
          console.log(res.data);    
          setLoading(true)
          setEtudiants(res.data.data);
          setTotalPages(res.data.last_page)
          setPer_page(res.data.per_page)
          setCurrentPage(res.data.current_page)
          setLoading(false)
          console.log("loading in state",etudiants);
        }
      ).catch(
        (error)=>{
          console.log(error);
        }
      )
}
const handleUpdate = (record) => {
  setRecordToUpdate(record);
  console.log(record)
  setUpdateModalVisible(true)

};
const handleUpdateSubmit = (values) => {
  // Submit update form logic here
  console.log("Form values:", values);
  setUpdateModalVisible(false);
};
const columns = [
  {
    title: "avatar",
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
          Details
        </Button>
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}
        >
          Update
        </Button>
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      </Space>
    ),
  },
];
const handleDelete = (id) => {
  // Implement the logic to delete the student with the given id
  // You might want to show a confirmation dialog before proceeding
};


  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="All Etudiant"
              extra={(
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    // Implement the logic to show the add student modal or navigate to add student page
                    // For example, you can set a state to control the modal visibility
                  }}
                >
                  Add Student
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
                    onChange:(page)=>{
                      handleGetEtudiant(page)
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
        title="Update Student"
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
      >
                <Form
            {...layout}
            onFinish={handleUpdateSubmit}
            initialValues={recordToUpdate}
          >
            <Form.Item
              label="First Name"
              name="firstname"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastname"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="CIN"
              name="cin"
              rules={[{ required: true, message: "Please enter CIN" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Birthday"
              name="birthday"
              rules={[{ required: true, message: "Please enter birthday" }]}
            >  

              <Input />

            </Form.Item>
            <Form.Item label="Profile Photo">
      <Upload
        name="avatar"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture"
      >
        <Button icon={<UploadOutlined />}>Upload Photo</Button>
      </Upload>
    </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
      </Modal>
      )}
    </>
  );
}

export default Etudiants;
