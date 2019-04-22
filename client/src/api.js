// const apiurl = "/api";
const apiurl = "https://jantschulev.ml/realbooks/api";

const makeRequest = (url, method, body) =>
  fetch(`${apiurl}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  })
    .then(r => r.json())
    .then(response => {
      if (response.error === true) throw Error(response.message);
      else return response;
    });

const api = {
  get: url => makeRequest(url, "GET")
};

export default api;
