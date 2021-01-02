const ID = "f93e0d12-48dc-4fc3-87da-c72f3776e2f6"
const endpoint = `/api/v1/sites/${ID}/forms`

exports.handler = async function() {
  const data = await fetch(endpoint)
    .catch(err => {
      console.log(err);
    })
    .then(resp => resp.json)
    .then(data => data)

  console.log(data);

  return {
    statusCode: 200,
    body: data
  };
  
}