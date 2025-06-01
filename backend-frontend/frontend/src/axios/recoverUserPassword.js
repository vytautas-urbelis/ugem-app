import AxiosMotion from "."

export const RecoverUserPassword = async (
  recoveryCode,
  password,
  password2,
) => {
  const res = await AxiosMotion.post("/user/change-password/", {
    recoveryCode,
    password,
    password2,
  })
  return res
}
