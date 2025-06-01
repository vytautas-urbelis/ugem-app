import React, { useState, useEffect } from "react"
import { Map } from "@vis.gl/react-google-maps"
import LoadingSpinner from "../../components/LoadingSpinner"
import { ipinfoAPI } from "../../utils/CONST"
import { useParams } from "react-router-dom"
import { VerifyBEmail } from "../../axios/emailVerification"

const VerifyBusinessEmail = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  // const [messageColor, setMessageColor] = useState("text-black")
  // const [lat, setLat] = useState(10)
  // const [lng, setLng] = useState(10)

  const { code } = useParams()

  useEffect(() => {
    const VerifyEmail = async () => {
      setLoading(true)
      try {
        await VerifyBEmail(code)
        setMessage("Your email has been verified!")
      } catch (error) {
        setMessage("This link is expired!")
      } finally {
        setTimeout(() => {setLoading(false)}, 1000)

      }
    }
    VerifyEmail()
  }, [])

  // useEffect(() => {
  //   console.log(code)
  //   const Location = async () => {
  //     try {
  //       // Fetch user's country data from ipinfo.io
  //       const response = await fetch(
  //         `https://ipinfo.io/json?token=${ipinfoAPI}`,
  //       )
  //       const data = await response.json()
  //       const loc = data.loc.split(",")
  //       setLat(parseFloat(loc[0]))
  //       setLng(parseFloat(loc[1]))
  //
  //       // Set the country name in state
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   Location()
  // }, [])

  return (
    <React.StrictMode>
      <div className="flex flex-col justify-center items-center bg-white">
        <div className="flex flex-col mt-16 p-4 items-center max-w-96 bg-white shadow-xl rounded-lg justify-center border border-gray-200">
          <div className="p-8 h-96 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              uGem email verification.
            </h1>
            {loading ? <LoadingSpinner /> : <div>{message}</div>}
          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}

export default VerifyBusinessEmail
