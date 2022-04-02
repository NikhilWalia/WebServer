const express = require('express');
const res = require('express/lib/response');
const url = require('url');
const router = express.Router();
const bodyParser = require('body-parser'); 
const axios = require('axios');
const req = require('express/lib/request');
const { callbackify } = require('util');
const app = express();
app.use(express.json());
const port = 3000;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended:true
}));

app.post('/kyc/validation', (req, res) => {
    console.log("Handle POST :", req.body.reference_id);        
    processDecentroValidation(req.body, (output)=>{
        console.log("output :", output);
        res.send(output);
    });
    // res.send(JSON.stringify(  response ));
//    res.end(JSON.stringify(response)); 
})

app.get('/', (req, res) => {
  var queryData = url.parse(req.url, true);  
  console.log(queryData.query)
  res.send('I am GET Response')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

function processDecentroValidation(body, callBack) {
    let data = JSON.stringify({
        "reference_id": body.reference_id,
        "document_type": body.document_type,
        "id_number": body.id_number,
        "consent": "Y",
        "consent_purpose": "For bank account purpose only"
      });

      decentroPost(data, callBack)
}

async function decentroPost(data, callBack) {
   
    const config = {
        method: 'post',
        url: 'https://in.staging.decentro.tech/kyc/public_registry/validate', 
        headers: { 
            'client_id': 'aryoclub_staging', 
            'client_secret': 'oM0xRwMEp4gm3I9lYJZVZ8KI74gwG7VG', 
            'module_secret': 'cDZIRtM1YYvgfuvDd3Qt93ylYHm3TZFX', 
            'Content-Type': 'application/json'
          },
          data : data
    }

    axios(config)
        .then(function (response) {
         console.log("response", JSON.stringify(response.data));
         callBack(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
}
app.use('/', router);