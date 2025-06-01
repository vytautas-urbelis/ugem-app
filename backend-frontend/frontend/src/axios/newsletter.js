import AxiosMotion from ".";

export const SubscribeNewsletter = async (email) => {
    const res = await AxiosMotion.post("/newsletter/", {
        email,
      })
      return res
}
