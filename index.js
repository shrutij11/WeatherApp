const http = require("http");
const fs = require("fs");
var requests = require("requests");
var port = process.env.PORT || 8000;
const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
if (req.url == "/"){
    
requests("https://api.openweathermap.org/data/2.5/weather?q=bokaro&units=metric&appid=747a2f827f9eb5750f8e8b75b93cabd7")

.on("data", (chunk)=> {
    const objdata= JSON.parse(chunk);
    const arrdata= [objdata];
    // console.log(arrdata);
    const realTimeData = arrdata
    .map((val) => replaceVal(homeFile, val))
    .join("");
  res.write(realTimeData);
})
.on("end", (err)=> {
    if(err)return console.log("conection closed due to errors", err);
    res.end();
});
}else {
    res.end("File not found");
  
}
});
server.listen(port, "127.0.0.1");
