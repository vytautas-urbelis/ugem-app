import AxiosMotion from "."

export const VerifyBEmail = async (code) => {
  const res = await AxiosMotion.patch("/business/user/verify/", {
    code,
  })
  return res
}

export const VerifyCEmail = async (code) => {
  const res = await AxiosMotion.post("/customer/user/verify/", {
    code
  })
  return res
}
