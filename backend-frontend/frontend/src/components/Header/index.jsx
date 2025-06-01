// import { useDispatch, useSelector } from "react-redux"
import {Link, NavLink, useNavigate} from "react-router-dom"
// import { logout_user } from "../../store/slices/userSlice"
import ugemLogo from '../../assets/ugem-logo.png'

const Header = () => {
  // const isLoggedIn = useSelector((state) => state.user.accessToken)
  // const dispatch = useDispatch()
  // const navigate = useNavigate()

  // const logOutUser = () => {
  //   dispatch(logout_user())
  //   window.localStorage.removeItem("accessToken")
  //   navigate("/")
  // }

  return (
    <header className="bg-white items-center justify-center relative px-4 w-full z-10">
      {/*<div className=" m-auto mx-4 md:mx-8 lg:mx-24 xl:mx-52 flex justify-between items-center fixed top-2 md:top-10 lg:top-10 xl:top-10 right-0 left-0 border p-6 rounded-xl bg-white">*/}
      <div className=" m-auto flex justify-between items-center fixed right-0 left-0 border-b border-b-gray-300 py-6 px-4 md:px-16 lg:px-32 xl:px-60 bg-white">
        <div className="flex items-center w-30">
          <Link to="/" className="text-black font-bold text-3xl">
          <div className="flex items-center">
            <img src={`${ugemLogo}`} alt="uGem" width="100" height="30"/>
          </div>
          </Link>
        </div>
        {/*<nav className="hidden md:flex md:items-center md:space-x-8">*/}
        {/*  {!isLoggedIn && (*/}
        {/*    <NavLink*/}
        {/*      to="/login"*/}
        {/*      className="block py-2 md:py-0 px-4 text-gray-300 hover:text-white transition duration-300"*/}
        {/*    >*/}
        {/*      Login*/}
        {/*    </NavLink>*/}
        {/*  )}*/}
        {/*  {isLoggedIn && (*/}
        {/*    <>*/}
        {/*      <NavLink*/}
        {/*        to="/account"*/}
        {/*        className="block py-2 md:py-0 px-4 text-gray-300 hover:text-white transition duration-300"*/}
        {/*        activeClassName="text-white"*/}
        {/*      >*/}
        {/*        Account*/}
        {/*      </NavLink>*/}
        {/*      <NavLink*/}
        {/*        to="/dashboard"*/}
        {/*        className="block py-2 md:py-0 px-4 text-gray-300 hover:text-white transition duration-300"*/}
        {/*        activeClassName="text-white"*/}
        {/*      >*/}
        {/*        Dashboard*/}
        {/*      </NavLink>*/}
        {/*      <button className="text-gray-300" onClick={logOutUser}>*/}
        {/*        Logout*/}
        {/*      </button>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</nav>*/}
        {/*<div className="md:hidden">*/}
        {/*  <button className="text-white focus:outline-none">*/}
        {/*    <svg*/}
        {/*      className="w-6 h-6"*/}
        {/*      fill="none"*/}
        {/*      stroke="currentColor"*/}
        {/*      viewBox="0 0 24 24"*/}
        {/*      xmlns="http://www.w3.org/2000/svg"*/}
        {/*    >*/}
        {/*      <path*/}
        {/*        strokeLinecap="round"*/}
        {/*        strokeLinejoin="round"*/}
        {/*        strokeWidth="2"*/}
        {/*        d="M4 6h16M4 12h16m-7 6h7"*/}
        {/*      ></path>*/}
        {/*    </svg>*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </header>
  )
}

export default Header
