export const getAxiosConfig = (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const config = {
    headers,
  }

  return config
}
