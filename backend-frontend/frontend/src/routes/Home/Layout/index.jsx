import { Outlet } from "react-router-dom"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import Features from "../../../components/Features"
import { APIProvider, Map } from "@vis.gl/react-google-maps"

const LayoutHome = () => {
  return (
    <>
    <Header/>
      <div className=" items-center w-full h-fit min-h-screen ">
        <Outlet />
      </div>
      <Footer/>
    </>
  )
}

export default LayoutHome
