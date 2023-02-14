const axios = require('axios');




const result =  axios.post(
    `http://192.168.1.217:5000/api/fileservice/0.1/files/test`,
    {
        x: JSON.stringify([3,4, 2])
    },
    {headers: {'Content-Type': 'application/json'}}
  ).then(response => console.log(response.config.data));