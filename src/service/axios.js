import axios from "axios";

export const universityApi= axios.create(
    {baseURL:"http://localhost:8000/api/"}
)

export const  getEtudiants=()=>{
return universityApi.get("etudiants");
}
export const  getMatieres=()=>{
    return universityApi.get("matieres");
    }