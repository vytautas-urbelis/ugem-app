import AxiosMotion from "."

export const DeleteAccountRequest = async ( token) => {
  return await AxiosMotion.delete("/business/user/delete/", {headers: {
      Authorization: `Bearer ${token}`
    }}, {})
}

export const AuthAccount = async (email, password) => {
  return await AxiosMotion.post("/auth/token/", {
    email, password, account: "customer"
  })
}
