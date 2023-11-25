const URL = 'url'
function client(endpoint, { body, ...customConfig }) {
  const headers = { ContentType: 'application/json' }
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }
  if (body) config.body = JSON.stringify(body)

  return fetch(`https://${URL}/${endpoint}`, config).then(async res => {
    if (res.status === 401) {
      return
    }
    const data = await res.json()
    if (res.ok) {
      return data
    }
    return Promise.reject(data)
  })
}

export default client
