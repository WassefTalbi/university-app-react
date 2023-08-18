import axios from "axios";

export const universityApi= axios.create(
    {baseURL:"http://localhost:8000/api/"}
)

export const  getEtudiants=(page)=>{
return universityApi.get(`etudiants?page=${page}`);
}
export const  getMatieres=()=>{
    return universityApi.get("matieres");
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