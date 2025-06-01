import { useEffect, useState } from "react"
import AxiosMotion from "../../axios"
import { useSelector } from "react-redux"
import { getAxiosConfig } from "../../axios/helpers"

const Dashboard = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([])
  const [businessUser, setBusinessUser] = useState(null)
  const [closedCampaigns, setClosedCampaigns] = useState([])
  const [wallMessages, setWallMessages] = useState([])

  const token = useSelector((state) => state.user.accessToken)

  useEffect(() => {
    const getActiveCampaigns = async () => {
      try {
        const config = getAxiosConfig(token)
        console.log(config)
        const res = await AxiosMotion.get("/campaign/open/", config)
        console.log(getActiveCampaigns, res)
        setActiveCampaigns(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    getActiveCampaigns()
  }, [])

  useEffect(() => {
    const getBusinessUser = async () => {
      try {
        const config = getAxiosConfig(token)
        const res = await AxiosMotion.get("/business/user/me/", config)
        setBusinessUser({
          ...res.data,
          logo: res.data.business_user_profile.logo,
          business_name: res.data.business_user_profile.business_name,
          street: res.data.business_user_profile.street,
          city: res.data.business_user_profile.city,
          country: res.data.business_user_profile.country,
          date_joined: res.data.date_joined,
        })
      } catch (error) {
        console.error(error)
      }
    }

    getBusinessUser()
  }, [token])

  useEffect(() => {
    const getClosedCampaigns = async () => {
      try {
        const config = getAxiosConfig(token)
        const res = await AxiosMotion.get("/campaign/closed/", config, {
          account: "business",
        })
        setClosedCampaigns(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    getClosedCampaigns()
  }, [])

  useEffect(() => {
    const getWallMessages = async () => {
      try {
        const config = getAxiosConfig(token)
        const res = await AxiosMotion.get("/business-wall/", config)
        setWallMessages(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    getWallMessages()
  }, [token])

  return (
    <div className="bg-custom-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Business Dashboard
        </h1>

        {businessUser && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Business Information
            </h2>
            {businessUser.logo && (
              <img
                src={businessUser.logo}
                alt="Business Logo"
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
            )}
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Business Name:</span>{" "}
              {businessUser.business_name}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Email:</span> {businessUser.email}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Street:</span> {businessUser.street}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">City:</span> {businessUser.city}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Country:</span>{" "}
              {businessUser.country}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Date Joined:</span>{" "}
              {businessUser.date_joined}
            </p>
          </section>
        )}

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="active-campaigns">
              <h3 className="text-xl font-medium text-gray-600 mb-4">
                Active Campaigns
              </h3>
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-green-50 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    {campaign.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Start Date: {campaign.start_date}
                  </p>
                  <p className="text-sm text-gray-600">
                    End Date: {campaign.end_date}
                  </p>
                  {/* Add more campaign details */}
                </div>
              ))}
            </div>
            <div className="closed-campaigns">
              <h3 className="text-xl font-medium text-gray-600 mb-4">
                Closed Campaigns
              </h3>
              {closedCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-red-50 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-red-700 mb-2">
                    {campaign.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Start Date: {campaign.start_date}
                  </p>
                  <p className="text-sm text-gray-600">
                    End Date: {campaign.end_date}
                  </p>
                  {/* Add more campaign details */}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Business Wall
          </h2>
          {wallMessages.map((message) => (
            <div
              key={message.id}
              className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm"
            >
              <p className="text-gray-700 mb-2">{message.content}</p>
              <p className="text-sm text-gray-600">Likes: {message.likes}</p>
              {/* Add more message details */}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
