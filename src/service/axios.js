import axios from "axios";

export const universityApi= axios.create(
    {baseURL:"http://localhost:8000/api/"}
)
//etudiant
export const  getEtudiants=(page)=>{
 return universityApi.get(`etudiants?page=${page}`);
}
export const  createEtudiant=(values)=>{
  return universityApi.post(`etudiants`,values, {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>/form-data'
    }
  });
  }
export const  updateEtudiant=(id,values)=>{
    return universityApi.post(`etudiants/${id}`,values, {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>/form-data'
      }
    });
    }
export const  deleteEtudiant=(id)=>{
  return universityApi.delete(`etudiants/${id}`);
  }
export const  getMatieres=()=>{
  return universityApi.get("matieres");
  }

  //matiere
export const  createMatiere=(idModule,values)=>{
    return universityApi.post(`matieres/${idModule}`,values, {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>/form-data'
      }
    });
    }
export const  updateMatiere=(id,values)=>{
    return universityApi.post(`matieres-modifier/${id}`,values, {
        headers: {
          'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>/form-data'
        }
      });
    }
export const  deleteMatiere=(id)=>{
    return universityApi.delete(`matieres/${id}`);
    }
export const  getMatieresOfClassroom=(id)=>{
      return universityApi.get(`classrooms/${id}/matieres`);
   }
export const  getPlanOfSpeciality=(idDegre)=>{
  return universityApi.get(`specialites/generatePlanDEtude-of-specialite/${idDegre}`);
    }

    //departments && classrooms

export const  createClass=(idDepartment,values)=>{
 return universityApi.post(`classrooms/${idDepartment}`,values);
    }
export const  createDepartment=(values)=>{
  return universityApi.post(`departments/`,values);
   }
   export const  deleteDepartment=(id)=>{
    return universityApi.delete(`departments/${id}`);
    }
    export const  deleteClass=(id)=>{
      return universityApi.delete(`classrooms/${id}`);
      }
export const  getModules=()=>{
   return universityApi.get("modules");
   }
export const  getSpecialites=()=>{
    return universityApi.get("specialites");
    }
export const  getDepartments=()=>{
     return universityApi.get("departments");
    }
export const  getClassroomsOfDepartment=(idDepartment)=>{
      return universityApi.get(`departments/classrooms-of-department/${idDepartment}`);
     }
    
export const getImage=(filename)=>{
  return universityApi.get(`images/${filename}`);
    }
export const  getNotesByMatiere=(idMatiere)=>{
    return universityApi.get(`matieres/notes-of-matiere-of-classroom/${idMatiere}`);
  }