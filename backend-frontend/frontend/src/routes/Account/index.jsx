import { useEffect, useState } from "react"
import AxiosMotion from "../../axios"
import { useSelector } from "react-redux"
import { getAxiosConfig } from "../../axios/helpers"

const Account = () => {
  const [businessUser, setBusinessUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [logo, setLogo] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [dateJoined, setDateJoined] = useState("")
  const token = useSelector((state) => state.user.accessToken)

  useEffect(() => {
    const getBusinessUser = async () => {
      try {
        const config = getAxiosConfig(token)
        const res = await AxiosMotion.get("/business/user/me/", config)
        setBusinessUser(res.data)
        setName(res.data.business_user_profile.business_name)
        setStreet(res.data.business_user_profile.street)
        setCity(res.data.business_user_profile.city)
        setCountry(res.data.business_user_profile.country)
        setEmail(res.data.email)
        setDateJoined(res.data.date_joined)
      } catch (error) {
        console.error(error)
      }
    }

    getBusinessUser()
  }, [token])

  const handleUpdate = async () => {
    try {
      const config = getAxiosConfig(token)
      const data = {
        business_name: name,
        email,
        street,
        city,
        country,
      }
      await AxiosMotion.patch("/business/user/update/", data, config)
      alert("Account updated successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to update account.")
    }
  }

  const handleSendQR = async () => {
    try {
      const config = getAxiosConfig(token)
      await AxiosMotion.post("/business/send-qr/", {}, config)
      alert("QR Code sent successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to send QR Code.")
    }
  }

  return (
    <div className="bg-custom-bg min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Account</h1>

        {businessUser && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Edit Account
            </h2>
            {logo && (
              <div className="mb-4">
                <img
                  src={logo}
                  alt="Business Logo"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Business Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Street</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Date Joined</label>
              <input
                type="text"
                value={dateJoined}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <button
              onClick={handleUpdate}
              className=" text-black font-bold py-2 px-4 rounded-lg hover:bg-blue-600 shadow-md z-10"
              style={{ display: "block", visibility: "visible" }}
            >
              Update Account
            </button>
          </section>
        )}

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Section
          </h2>
        </section>
      </div>
    </div>
  )
}

export default Account
