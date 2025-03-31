import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";
import SideBar from "./components/SideBar";
import HomePage from "./components/HomePage";

function App() {
  return (
    <>
    <Router>
   
        
        <div>
          <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </div>

       

      </Router>
      {/* <HomePage/> */}
    </>
  );
}

export default App;
