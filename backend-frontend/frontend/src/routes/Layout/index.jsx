import { Outlet } from "react-router-dom"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import Features from "../../components/Features"
import { APIProvider, Map } from "@vis.gl/react-google-maps"

const Layout = () => {
  return (
    <>
      <Header />
      <div className=" items-center w-full h-fit min-h-screen ">

        {/* <div className="min-h-screen h-fit flex"> */}
          {/* <div className="h-fit flex"> */}
            <Outlet />
          {/* </div> */}

        {/* </div> */}

        
      </div>
      <Footer />
    </>
  )
}

export default Layout
