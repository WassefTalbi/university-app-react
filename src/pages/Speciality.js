import React, { useEffect, useState } from "react";
import { List, Card, Dropdown, Menu, Modal,Row, Table,Breadcrumb } from "antd";
import { DownloadOutlined,DownOutlined } from "@ant-design/icons";
import { getPlanOfSpeciality, getSpecialites } from "../service/axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin
import logoImage from '../assets/images/iset_Zg.jpeg';

function Speciality() {


  const [specialities, setSpecialities] = useState([]);
  const [degre, setDegre] = useState([]);
  const [planDetude, setPlanDetude] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false); 

  useEffect(() => {
    handleGetSpecialites();
  }, []);

  const handleGetSpecialites = () => {
    getSpecialites()
      .then((res) => {
        setSpecialities(res.data);
        console.log("loading speciality", res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetPlan = (degre) => {
    getPlanOfSpeciality(degre.id)
      .then((res) => {
        setDegre(degre);
        setPlanDetude(res.data);
        setModalVisible(true); // Show the modal

        console.log("loading in plan", res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const subTableColumns = [
    {
      title: "Num",
      dataIndex: "ref",
    },
    {
      title: "Unité d'Enseignement",
      dataIndex: "name",
    },
    {
      title: "Nature",
      dataIndex: "nature",
    },
   
    
    {
          title: "Module Credit",
          dataIndex: "credit",

    },
    {
      
          title: "Coefficient de module",
          dataIndex: "coefficient",
    
    },

  ];

  const expandedRowRender = (module) => {
    const matiereColumns = [
      {
        title: "Elément Constitutif",
        dataIndex: "name",
      },
      {
        title: "Charge Total par semestre",
        dataIndex: "charge_total",
        render: (charge_total) => `${charge_total} heures`,
      },
      {
        title: "Credit",
        dataIndex: "credit",
      },
      {
        title: "Coefficient",
        dataIndex: "coefficient",
      },
      {
        title: "Evaluations",
        dataIndex: "evaluations",
        render: (evaluations) => (
          <ul>
            {evaluations.map((evaluation) => (
              <li key={evaluation.id}>
                {evaluation.name}: {evaluation.pourcentage}%
              </li>
            ))}
          </ul>
        ),
      },
    ];

    const matieresData = module.matieres.map((matiere) => ({
      key: matiere.id,
      name: matiere.name,
      charge_total: matiere.charge_total,
      credit: matiere.credit,
      coefficient: matiere.coefficient,
      evaluations: matiere.evaluations,
    }));

    return (
      <Table
        columns={matiereColumns}
        dataSource={matieresData}
        pagination={false}
      />
    );
  };
  const generatePDFContent = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [210, 297],
    });
    const img = new Image();
    img.src = logoImage;

 
    //  doc.addImage(img, 'PNG', 10, 10, 40, 40);

    doc.setFontSize(18);
    doc.text(`${degre.niveau} année Master - Semestre ${degre.semestre}`, 20, 20);
  
    const tableHeaders = ["Ref", "Unité d'Enseignement", "Crédit UE", "Coefficient UE", "Elément Contitutif", "Charge Total par semestre", "Credit", "Coefficient", "Evaluations"];
    const tableData = [];
    let totalChargeTotal = 0;
    let totalCredit = 0;
    let totalCoefficient = 0;
  
    planDetude.modules.forEach((module) => {
      module.matieres.forEach((matiere, index) => {
        if (index === 0) {
          tableData.push([module.ref, module.name, module.credit, module.coefficient, matiere.name, `${matiere.charge_total} heures`, matiere.credit, matiere.coefficient, getEvaluationsString(matiere.evaluations)]);
        } else {
          tableData.push(["", "", "", "", matiere.name, `${matiere.charge_total} heures`, matiere.credit, matiere.coefficient, getEvaluationsString(matiere.evaluations)]);
        }
      });
    });
  
    tableData.forEach((rowData) => {
      totalChargeTotal += parseInt(rowData[5]);
      totalCredit += parseInt(rowData[6]);
      totalCoefficient += parseInt(rowData[7]);
    });
  
    const totalRow = ["", "", "", "", "Total", `${totalChargeTotal} heures`, totalCredit, totalCoefficient, ""];
    tableData.push(totalRow);
  
    const startY = 40;
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY,
      theme: "grid",
      styles: {
        cellPadding: 4,
        fontSize: 10,
        valign: "middle",
      },
      didDrawCell: (data) => {
        if (data.row.index === tableData.length - 1) {
          doc.setTextColor(255, 0, 0); // Set text color to red for the "Total" row
        }
      },
    });
  
    // Calculate Y position for the additional text
    const textY = startY + doc.autoTable.previous.finalY + 10; // Add some spacing
  
    // Set text color to red for the "Total" row
    doc.setTextColor(255, 0, 0);
    doc.setFontSize(15);
    doc.text(`(*) L'étudiant choisira trois matières parmi quatre proposées`, 20, textY);
  
    return doc;
  };
  
  const getEvaluationsString = (evaluations) => {
    return evaluations.map((evaluation) => `${evaluation.name}: ${evaluation.pourcentage}%`).join("\n");
  };
  
  
  
  
  

  return (
    <>
      <Row style={{ marginBottom: "20px" }}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Spécialités</Breadcrumb.Item>
      </Breadcrumb>
      </Row>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={specialities}
        renderItem={(Specialite) => (
          <List.Item>
            <Card title={Specialite.type}>
              {Specialite.name}
              <div style={{ position: "relative", marginTop: "10px" }}>
                <Dropdown
                  overlayStyle={{ minWidth: "200px" }} // Adjust the width as needed
                  overlay={
                    <Menu>
                      {Specialite.degres.map((degre) => (
                        <Menu.Item
                          key={degre.id}
                          onClick={() => handleGetPlan(degre)}
                        >{`${degre.niveau} année Master - Semestre ${degre.semestre}`}</Menu.Item>
                      ))}
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <span>{`Voir plan d'étude`}</span>
                    <DownOutlined />
                  </a>
                </Dropdown>
              </div>
            </Card>
          </List.Item>
        )}
      />

<Modal
        title={degre.niveau + " année Master - Semestre " + degre.semestre}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={900}
        footer={null}
      >
        
              <button
        type="primary"
        icon={<DownloadOutlined />} 
        onClick={() => {
          const pdfContent = generatePDFContent();
          pdfContent.save("module_plan.pdf");
          setGeneratingPDF(false);
        }}
      >
        Télécharger plan d'etude
      </button>
          <Table
            columns={subTableColumns}
            expandable={{ expandedRowRender }}
            dataSource={planDetude.modules}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
    
      </Modal>

    </>
  );
}

export default Speciality;
