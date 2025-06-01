import React, { useState } from "react"
import LoadingSpinner from "../../components/LoadingSpinner"
import {AuthAccount, DeleteAccountRequest} from "../../axios/userAccount.js";

const DeleteAccount = () => {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)

  const VerifyAccount = async () => {
    // Check if passwords match
    setLoading(true)

    // If all checks pass
    setMessage("")
    setError("")
    try {
      // await RecoverUserPassword(PasswordRecoveryCode, password, passwordRepeat)
      const response = await AuthAccount(email, password)
      console.log(response.data)
      await DeleteAccountRequest(response.data.access)
      setVerified(true)
      setMessage("Account was deleted successfully.")
    } catch (error) {
      console.log(error)
      setError("Account doesn't exist.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <React.StrictMode>
      <div className="flex flex-col justify-start items-center h-[100vh]">
        <div className="flex flex-col mt-16 p-4 items-center max-w-96 bg-white shadow-xl rounded-lg justify-center">
          <div className="p-8 h-96 w-80 flex flex-col items-center justify-center">
            {loading ? (
              <LoadingSpinner />
            ) : !verified ? (
              <div className="pl-8 pr-8 h-96 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  uGem
                </h1>
                <div className="text-base text-center text-gray-900 mb-4">
                  Enter your Email and Password to delete account
                </div>
                <input
                  className={`h-10 p-2 text-xl text-gray-700 border-2 w-60  rounded-md`}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                  placeholder="Email"
                ></input>
                <input
                  type="password"
                  className={`h-10 p-2 text-xl text-gray-700 border-2 w-60 mt-5  rounded-md`}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  placeholder="Repeate Password"
                ></input>
                <div className="text-center text-sm justify-center items-center mt-3 text-red-500">
                  {error}
                </div>
                <button
                  className=" active:text-slate-400 active:border-slate-400 mt-5 h-10 p-2 border-2 w-60 border-black rounded-md"
                  onClick={() => VerifyAccount()}
                >
                  <div>Delete account</div>
                </button>
              </div>
            ) : (
              <div className="text-center justify-center items-center mt-3">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}

export default DeleteAccount
