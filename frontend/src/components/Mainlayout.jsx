import { Outlet,useLocation } from "react-router-dom";
import { useEffect } from "react";
 // Your footer component
import HealthPortal from "../ui/HealthPortal";


const MainLayout = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on route change
    }, [location.pathname]);
  return (
    <div>
       
      <HealthPortal/>
      <Outlet />  

    </div>
  );
};

export default MainLayout;
