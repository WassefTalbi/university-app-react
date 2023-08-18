import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "antd";
import { EditOutlined, DeleteOutlined,EyeOutlined,PlusOutlined } from "@ant-design/icons";
import { getDepartments } from "../service/axios";

const departmentCardStyle = {
  marginBottom: "16px",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    handleGetDepartments();
  }, []);

  const handleGetDepartments = () => {
    getDepartments()
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: "16px" }}>
        Add Department
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
              <Button type="primary" icon={<PlusOutlined />} size="small">
                Add Classroom
              </Button>
            </Col>
          </Row>
          <Row gutter={16}>
            {department.classrooms.map((classroom) => (
              <Col span={8} key={classroom.id}>
                <Card hoverable style={departmentCardStyle}>
                  <h3>{classroom.ref}</h3>
                  <p>{classroom.anneScolaire}</p>
                  <Button    type="primary"  size="small" icon={<EyeOutlined />}style={{ marginRight: "4px" }}>
                    Details
                  </Button>
                  <Button    type="default"  size="small" icon={<EditOutlined />}style={{ marginRight: "4px" }} >
                    Update
                  </Button>
                  <Button   type="danger" size="small" icon={<DeleteOutlined />}style={{ marginTop: "4px" }}>
                    Delete
                  </Button>
                  
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      ))}
    </div>
  );
}

export default Departments;
