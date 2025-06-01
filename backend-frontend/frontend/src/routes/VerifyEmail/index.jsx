// import React, { useState, useEffect } from "react"
// import { Map } from "@vis.gl/react-google-maps"
// import LoadingSpinner from "../../components/LoadingSpinner"
// import { ipinfoAPI } from "../../utils/CONST"
// import { useParams } from "react-router-dom"
// import { VerifyCEmail } from "../../axios/emailVerification"
//
// const VerifyEmail = () => {
//   const [password, setPassword] = useState("")
//   const [passwordRepeat, setPasswordRepeat] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const [verified, setVerified] = useState(false)
//   const [messageColor, setMessageColor] = useState("text-black")
//   const [lat, setLat] = useState(10)
//   const [lng, setLng] = useState(10)
//
//   const { code } = useParams()
//   // const [isValid, setIsValid] = useState(false)
//
//   const VerifyAccount = async () => {
//     // Check if passwords match
//     setLoading(true)
//     if (password !== passwordRepeat) {
//       setLoading(false)
//       return setMessage("Passwords do not match.")
//     }
//
//     // Regular expressions to check for required criteria
//     const hasNumber = /\d/ // At least one digit
//     const hasLetter = /[a-zA-Z]/ // At least one letter
//     const isLongEnough = password.length >= 8 // At least 8 characters
//
//     // Check if password meets all criteria
//     if (!isLongEnough) {
//       setLoading(false)
//       return setMessage("Password must be at least 8 characters long.")
//     }
//     if (!hasNumber.test(password)) {
//       setLoading(false)
//       return setMessage("Password must contain at least one number.")
//     }
//     if (!hasLetter.test(passwordRepeat)) {
//       setLoading(false)
//       return setMessage("Password must contain at least one letter.")
//     }
//
//     // If all checks pass
//     setMessage("")
//     try {
//       await VerifyCEmail(code, password, passwordRepeat)
//       setVerified(true)
//       setMessage("Account successfully verified.")
//     } catch (error) {
//       setMessage("The link has expired.")
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   useEffect(() => {
//     const Location = async () => {
//       try {
//         // Fetch user's country data from ipinfo.io
//         const response = await fetch(
//           `https://ipinfo.io/json?token=${ipinfoAPI}`,
//         )
//         const data = await response.json()
//         const loc = data.loc.split(",")
//         setLat(parseFloat(loc[0]))
//         setLng(parseFloat(loc[1]))
//
//         // Set the country name in state
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     Location()
//   }, [])
//
//   return (
//     <React.StrictMode>
//       <div className="absolute h-full top-20 z-[-1]">
//         <Map
//           style={{
//             width: "100vw",
//             height: "inherit",
//             zIndex: "-1",
//             position: "absolute",
//           }}
//           defaultCenter={{ lat: lat, lng: lng }}
//           defaultZoom={5}
//           zoom={7}
//           center={{ lat: lat, lng: lng }}
//           gestureHandling={"greedy"}
//           disableDefaultUI={true}
//         />
//         <div className="absolute top-0 opacity-60 bg-gray-100 w-screen h-[100vh]"></div>
//       </div>
//       <div className="flex flex-col justify-center items-center h-[100vh]">
//         <div className="flex flex-col mt-16 p-4 items-center max-w-96 bg-white shadow-xl rounded-lg justify-center">
//           <div className="p-8 h-96 flex flex-col items-center justify-center">
//             <h1 className="text-2xl font-bold text-gray-900 mb-6">
//               Welcome to SwiftyBee
//             </h1>
//             {loading ? (
//               <LoadingSpinner />
//             ) : !verified ? (
//               <div className="p-8 h-96 flex flex-col items-center justify-center">
//                 <input
//                   type="password"
//                   className={`h-10 p-2 text-xl text-gray-700 border-2 w-60  rounded-md`}
//                   value={password}
//                   onChange={(event) => {
//                     setPassword(event.target.value)
//                   }}
//                   placeholder="Password"
//                 ></input>
//                 <input
//                   type="password"
//                   className={`h-10 p-2 text-xl text-gray-700 border-2 w-60 mt-5  rounded-md`}
//                   value={passwordRepeat}
//                   onChange={(event) => {
//                     setPasswordRepeat(event.target.value)
//                   }}
//                   placeholder="Repeate Password"
//                 ></input>
//                 <button
//                   className=" active:text-slate-400 active:border-slate-400 mt-5 h-10 p-2 border-2 w-60 border-black rounded-md"
//                   onClick={() => VerifyAccount()}
//                 >
//                   <div>Verify Account</div>
//                 </button>
//                 <div className="text-center justify-center items-center mt-3">
//                   {message}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center justify-center items-center mt-3">
//                 {message}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </React.StrictMode>
//   )
// }
//
// export default VerifyEmail

import React, {useState, useEffect} from "react"

import LoadingSpinner from "../../components/LoadingSpinner"
import {useParams} from "react-router-dom"
import {VerifyCEmail} from "../../axios/emailVerification"

const VerifyEmail = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    // const [messageColor, setMessageColor] = useState("text-black")
    // const [lat, setLat] = useState(10)
    // const [lng, setLng] = useState(10)

    const {code} = useParams()

    useEffect(() => {
        const VerifyEmail = async () => {
            setLoading(true)
            try {
                await VerifyCEmail(code)
                setMessage("Your email has been verified!")
            } catch (error) {
                setMessage("This link is expired!")
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 1000)

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
                <div
                    className="flex flex-col mt-16 p-4 items-center max-w-96 bg-white shadow-xl rounded-lg justify-center border border-gray-200">
                    <div className="p-8 h-96 flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">
                            uGem email verification.
                        </h1>
                        {loading ? <LoadingSpinner/> : <div>{message}</div>}
                    </div>
                </div>
            </div>
        </React.StrictMode>
    )
}

export default VerifyEmail

