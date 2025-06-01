

import React, {useState, useEffect} from "react"

import LoadingSpinner from "../../components/LoadingSpinner"
import {useParams} from "react-router-dom"

const GetStarted = () => {
    const [loading, setLoading] = useState(false)

    const {code} = useParams()

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/iPhone|iPad|iPod/.test(userAgent)) {
      // Redirect to Apple App Store
      window.location.href = "https://apps.apple.com/app/ugem/id6739421449";
    } else if (/Android/.test(userAgent)) {
      // Redirect to Google Play Store
      window.location.href = "https://play.google.com/store/apps/details?id=app.ugem";
    } else {
      // Redirect to a website
      window.location.href = "https://ugem.app";
    }
  }, []);

    //
    // useEffect(() => {
    //     const VerifyEmail = async () => {
    //         setLoading(true)
    //         try {
    //             await VerifyCEmail(code)
    //             setMessage("Your email has been verified!")
    //         } catch (error) {
    //             setMessage("This link is expired!")
    //         } finally {
    //             setTimeout(() => {
    //                 setLoading(false)
    //             }, 1000)
    //
    //         }
    //     }
    //     VerifyEmail()
    // }, [])

    return (
        // <React.StrictMode>
            <div className="flex flex-col justify-center items-center bg-white">
                <div
                    className="flex flex-col mt-40 p-4 items-center max-w-96 bg-white shadow-xl rounded-lg justify-center border border-gray-200">

                        {loading ? <LoadingSpinner/> : <div></div>}

                </div>
            </div>
        // </React.StrictMode>
    )
}

export default GetStarted

