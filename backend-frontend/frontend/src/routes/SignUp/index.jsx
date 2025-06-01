import React, { useState } from "react"
import AxiosMotion from "../../axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { APIProvider, Map } from "@vis.gl/react-google-maps"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await AxiosMotion.post("/business/user/add/", { email })
      setSuccess(true)
      setLoading(false)
      navigate("/verify-account")
    } catch (error) {
      setError("Failed to send verification code. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
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
          <div className=" bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 font-copernicus rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 w-96 mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
                Get Started
              </h2>
              <h3 className="text-center mb-4">
                Start using SwiftyBee for your business
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-500 text-sm">
                    Verification code sent successfully!
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-black py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Sign Up"}
                </button>
              </form>
              <p className="mt-6 text-sm text-gray-600 text-center">
                By continuing, you acknowledge SwiftyBee's{" "}
                <Link
                  to="/privacy-policy"
                  className="text-orange-500 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
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

export default Signup
