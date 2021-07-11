const http = require('http');
const fs =require('fs');
const requests = require('requests');


const homeFile = fs.readFileSync("index.html","utf-8");
const replaceVal = (tempVal,orgVal)=>{
        let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
         temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
         temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
         temperature = temperature.replace("{%location%}",orgVal.name);
         temperature = temperature.replace("{%country%}",orgVal.sys.country);
         temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);

    return temperature;
}
const server = http.createServer((req,res)=>{
     if(req.url =="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Lucknow,IN&units=metric&APPID=a1e87e25b00472695045c9d995235ec4')
        .on('data', (chunk)=> {
          const objdata = JSON.parse(chunk);
          const arrdata = [objdata];
          const realTimeData = arrdata.map((val)=> replaceVal(homeFile,val)).join("");
          res.write(realTimeData);
        console.log(realTimeData);
        })
        .on('end',  (err)=> {
          if (err) return console.log('connection closed due to errors', err);
         
         res.end();
        });
     }else{
        res.end("404 File not found");
     }
});

server.listen(3000,"127.0.0.1");