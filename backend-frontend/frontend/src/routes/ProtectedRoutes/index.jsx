import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

const ProtectedRoutes = () => {
  const location = useLocation()
  const isLoggedin = useSelector((state) => state.user.accessToken)

  return !isLoggedin ? (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  ) : (
    <Outlet />
  )
}

export default ProtectedRoutes
