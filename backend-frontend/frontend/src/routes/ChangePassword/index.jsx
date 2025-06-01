import React, { useState } from "react"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useParams } from "react-router-dom"
import { RecoverUserPassword } from "../../axios/recoverUserPassword"

const ChangePassword = () => {
  const [password, setPassword] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)

  const { PasswordRecoveryCode } = useParams()
  // const [isValid, setIsValid] = useState(false)

  const VerifyAccount = async () => {
    // Check if passwords match
    setLoading(true)
    if (password !== passwordRepeat) {
      setLoading(false)
      return setError("Passwords do not match.")
    }

    // Regular expressions to check for required criteria
    const hasNumber = /\d/ // At least one digit
    const hasLetter = /[a-zA-Z]/ // At least one letter
    const isLongEnough = password.length >= 8 // At least 8 characters

    // Check if password meets all criteria
    if (!isLongEnough) {
      setLoading(false)
      return setError("Password must be at least 8 characters long.")
    }
    if (!hasNumber.test(password)) {
      setLoading(false)
      return setError("Password must contain at least one number.")
    }
    if (!hasLetter.test(passwordRepeat)) {
      setLoading(false)
      return setError("Password must contain at least one letter.")
    }

    // If all checks pass
    setMessage("")
    setError("")
    try {
      await RecoverUserPassword(PasswordRecoveryCode, password, passwordRepeat)
      setVerified(true)
      setMessage("Password changed successfully.")
    } catch (error) {
      console.log(error)
      setError("The link has expired.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <React.StrictMode>
      <div className="flex flex-col justify-start  items-center h-[100vh]">
        <div className="flex flex-col mt-16 p-4 items-center max-w-96 bg-white shadow-xl rounded-lg justify-center">
          <div className="p-8 h-96 w-80 flex flex-col items-center justify-center">
            {loading ? (
              <LoadingSpinner />
            ) : !verified ? (
              <div className="pl-8 pr-8 h-96 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  uGem
                </h1>
                <div className="text-base text-gray-900 mb-4">
                  Please create new password.
                </div>
                <input
                  type="password"
                  className={`h-10 p-2 text-xl text-gray-700 border-2 w-60  rounded-md`}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  placeholder="Password"
                ></input>
                <input
                  type="password"
                  className={`h-10 p-2 text-xl text-gray-700 border-2 w-60 mt-5  rounded-md`}
                  value={passwordRepeat}
                  onChange={(event) => {
                    setPasswordRepeat(event.target.value)
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
                  <div>Change password</div>
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

export default ChangePassword
