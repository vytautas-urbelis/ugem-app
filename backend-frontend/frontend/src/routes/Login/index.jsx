import React, { useState } from "react"
import AxiosMotion from "../../axios"
import { useDispatch } from "react-redux"
import { login_user } from "../../store/slices/userSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { APIProvider, Map } from "@vis.gl/react-google-maps"

const Login = () => {
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const ErrorMessage = ({ error }) => {
    if (!error) return null

    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">
          {error.message || String(error)}
        </span>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await AxiosMotion.post("/auth/token/", {
        email,
        password,
        account: "business",
      })
      const accessToken = res.data.access
      window.localStorage.setItem("accessToken", accessToken)
      dispatch(login_user(accessToken))
      const from = location.state?.from || "/account"
      navigate(from)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError({ message: "Invalid email or password. Please try again." })
        } else {
          setError({ message: "An error occurred. Please try again later." })
        }
      } else if (error.request) {
        setError({
          message:
            "No response from server. Please check your internet connection.",
        })
      } else {
        setError({ message: "An unexpected error occurred. Please try again." })
      }
    }
  }

  return (
    <div className="flex flex-col h-fit">
      <div className="absolute h-full top-20 z-[-1]">
        <Map
          style={{
            width: "100vw",
            height: "inherit",
            zIndex: "-1",
            position: "absolute",
          }}
          defaultCenter={{ lat: 50, lng: 10 }}
          defaultZoom={5}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />
        <div className="absolute top-0 opacity-60 bg-gray-100 w-screen h-[100vh]"></div>
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        {isModalOpen && (
          <div className="bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 font-copernicus rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 w-96 mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
                Welcome Back
              </h2>
              <h3 className="text-center mb-4">
                Login to your SwiftyBee account
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-400 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-orange-400 hover:text-orange-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-black py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Login
                </button>
              </form>
              <ErrorMessage error={error} />
              <p className="mt-6 text-sm text-gray-600 text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-orange-400 hover:text-orange-500"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Login
