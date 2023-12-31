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
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Etudiants from "./pages/Etudiants";
import Matieres from "./pages/Matieres";
import Speciality from "./pages/Speciality";
import Departments from "./pages/Department";
import Classroom from "./pages/Classroom";

function App() {
  return (
    <div className="App">
     
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/etudiants" component={Etudiants} />
          <Route exact path="/departments" component={Departments} />
          <Route exact path="/specialities" component={Speciality} />       
          <Route exact path="/class-details/:id" component={Classroom} />
          <Route exact path="/matieres" component={Matieres} />
          <Route exact path="/spec-details" component={module} />

          <Route exact path="/rtl" component={Rtl} />
          <Route exact path="/profile" component={Profile} />

          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
