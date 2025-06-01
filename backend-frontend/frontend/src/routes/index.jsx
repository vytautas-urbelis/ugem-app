import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Login"
import Signup from "./SignUp"
import Layout from "./Layout"
import NotFound from "./NotFound"
import Dashboard from "./Dashboard"
import Account from "./Account"
import ProtectedRoutes from "./ProtectedRoutes"
import VerifyAccount from "./VerifyAccount"
import PrivacyPolicy from "./PrivacyPolicy"
import Home from "./Home"
import TermsOfService from "./TermsOfService"
import VerifyBusinessEmail from "./VerifyBusinessEmail"
import VerifyEmail from "./VerifyEmail"
import LayoutHome from "./Home/Layout"
import ChangePassword from "./ChangePassword"
import GetStarted from "./GetStarted/index.jsx";
import DeleteAccount from "./DeleteAccount/index.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutHome />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<Layout />}>
           {/*<Route path="/login" element={<Login />} />*/}
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfService />} />
          <Route
            path="/verify-business-email/:code"
            element={<VerifyBusinessEmail />}
          />
          <Route
            path="/change-password/:PasswordRecoveryCode"
            element={<ChangePassword />}
          />
          <Route path="/verify-email/:code" element={<VerifyEmail />} />
          <Route path="/get-started/:code" element={<GetStarted />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/account" element={<Account />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default Router
