// https://observablehq.com/@bumbeishvili/fetcher@491
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Fetcher`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Usage

## https://beta.observablehq.com/@bumbeishvili/fetcher-usage
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Fetcher`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Fetcher is convenient wrapper around different libs, which are responsible for data loading and parsing`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## <div style="color:red"> This notebook in some cases, uses (cors-anywhere.herokuapp.com) proxy server , which is only provided so that you can easily and quickly try out CORS Anywhere

<br>
## <div style="color:red">  So you may experience loading errors , when it's used too often!
<div>

For the workaround, you can fork this notebook, replace corsbypass url , which is located bottom and import changed version ... `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Implementations`
)});
  main.variable(observer("corsBypasserUrl")).define("corsBypasserUrl", function(){return(
"https://cors-anywhere.herokuapp.com/"
)});
  main.variable(observer("load")).define("load", ["getData","corsBypasserUrl"], function(getData,corsBypasserUrl){return(
function load(url,type){
  return new Promise((resolve,reject)=>{
    
    var promisedData =  getData(url,type);
    
    promisedData.then(function(result){
      resolve(result);
    })
    .catch(function(e){
      resolve(getData(corsBypasserUrl+url,type))
    });
    
  })
}
)});
  main.variable(observer("requireFromGithub")).define("requireFromGithub", ["require"], function(require){return(
async function requireFromGithub(jsFileUrl,prop){
  const response = await fetch(jsFileUrl);
  const blob = await response.blob();
  return require(URL.createObjectURL(blob)).catch(() => {return window[prop]});
}
)});
  main.variable(observer("requireScript")).define("requireScript", ["requireFromGithub"], function(requireFromGithub){return(
requireFromGithub
)});
  main.variable(observer("scrape")).define("scrape", ["load"], function(load){return(
function scrape(url,type){
   return new Promise((resolve,reject)=>{
      var textPromise = load(url,'text');
      textPromise.then(text=>{
          var div = document.createElement('div');
          div.innerHTML=`<div>${text}</div>`
         // div.innerHTML = text;
          if(type=="dom"||type=="object"){
            resolve(div.querySelector('div'));
          }
          resolve(div);
      })
   })
}
)});
  main.variable(observer("getData")).define("getData", ["convert","corsBypasserUrl","loadSvg","loadGoogleSpreadsheet","loadExcellFile","d3"], function(convert,corsBypasserUrl,loadSvg,loadGoogleSpreadsheet,loadExcellFile,d3){return(
function  getData(url,type){
   
  var convertedUrl = convert(url,type);
  
  if(type){
    convertedUrl.type=type; 
  }
  
  if(convertedUrl.isHttp){
       return getData(corsBypasserUrl+url,type);
  }
  
  if(convertedUrl.isSvg){
      return loadSvg(url,type);
  }
  if(convertedUrl.isSpreadSheet){
      return loadGoogleSpreadsheet(url,type);
  }
  
  if(convertedUrl.isExcel){
     return loadExcellFile(url,type);
  }
  
   if(convertedUrl.isJsonLike){
      return d3.json(url);
  }
   
  if(!!d3[convertedUrl.type]){
     return d3[convertedUrl.type](url);
  }
   
   if(d3[convertedUrl.extension]){
       return d3[convertedUrl.extension](url);
   }
   
  return d3.json(url)
 }
)});
  main.variable(observer("loadSvg")).define("loadSvg", ["svg"], function(svg){return(
function loadSvg(url){
  function stripXmlPreamble( str ) {
     return str .replace( /^<\?xml version='1.0'\?>/, '' ) .replace(/^\n/,'')
  }
  const textPromise =  fetch(url).then( response => response.text() );
  return new Promise((res,rej)=>{
    debugger;
    textPromise.then(text=>{
       res(  svg`${stripXmlPreamble( text )}` )
    })
  })
  
}
)});
  main.variable(observer("loadGoogleSpreadsheet")).define("loadGoogleSpreadsheet", ["Tabletop"], function(Tabletop){return(
function loadGoogleSpreadsheet(url,isNotSimpleSheet){
  return new Promise((resolve,reject)=>{
    Tabletop.init(
       { 
        key: url,
        callback: function(data){
               resolve(data);
             },
       simpleSheet: isNotSimpleSheet?false:true })
})
}
)});
  main.variable(observer("loadExcellFile")).define("loadExcellFile", ["XLSX"], function(XLSX){return(
function loadExcellFile (url){
 return new Promise((resolve,reject)=>{
     var req = new window.XMLHttpRequest();
     req.open("GET", url, true);
     req.responseType = "arraybuffer";

     req.onload = function(e) {
        var data = new Uint8Array(req.response);
        var workbook = XLSX.read(data, {type:"array"});
        resolve(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]))
     }
     req.send();
}) 
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Libraries`
)});
  main.variable(observer("XLSX")).define("XLSX", ["require"], function(require){return(
require('https://unpkg.com/xlsx@0.12.9/dist/xlsx.full.min.js')
.then(d=>{
   return window.XLSX;
})
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3-fetch")
)});
  main.variable(observer("Tabletop")).define("Tabletop", ["require"], function(require){return(
require('tabletop')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Utility funcs`
)});
  main.variable(observer("convert")).define("convert", ["endsWith","isSpreadsheet","isExcel","isJsonLike","isHttp","extension"], function(endsWith,isSpreadsheet,isExcel,isJsonLike,isHttp,extension){return(
function convert (url,type){
  return  {
    endsWith:endsWith(url,type),
    url:url,
    isSpreadSheet:isSpreadsheet(url,type),
    isExcel:isExcel(url,type),
    isJsonLike:isJsonLike(url,type),
    isHttp:isHttp(url,type),
    extension:extension(url,type)
  }
}
)});
  main.variable(observer("endsWith")).define("endsWith", function(){return(
function endsWith(url){
   
   var matched = url.match(/\.([a-zA-Z]*)$/g)
   if(!matched) return
   return matched[0];
}
)});
  main.variable(observer("isSpreadsheet")).define("isSpreadsheet", function(){return(
function isSpreadsheet(url){
   var matched = url.match(/docs\.google\.com\/spreadsheets\//g)
   if(!matched) return false
   return !!matched[0]; 
}
)});
  main.variable(observer("excellExtensions")).define("excellExtensions", function(){return(
['xlsx','xml','.xlsx','.xml']
)});
  main.variable(observer("isExcel")).define("isExcel", ["endsWith","excellExtensions"], function(endsWith,excellExtensions){return(
function isExcel(url,type){
  var fileExtension = endsWith(url);
  if(!fileExtension) return false;
  var files=excellExtensions;
  return files.includes(fileExtension)||files.includes(type)
}
)});
  main.variable(observer("jsonExtensions")).define("jsonExtensions", function(){return(
[".json",".topojson",".geojson"]
)});
  main.variable(observer("isJsonLike")).define("isJsonLike", ["endsWith","jsonExtensions"], function(endsWith,jsonExtensions){return(
function isJsonLike(url){
    var fileExtension = endsWith(url);
    if(!fileExtension) return false;
    var files=jsonExtensions;
    return files.includes(fileExtension)
}
)});
  main.variable(observer("isHttp")).define("isHttp", function(){return(
function isHttp(url){
   var matched = url.match(/^http:/g)
   if(!matched) return false
   return !!matched[0]; 
}
)});
  main.variable(observer("extension")).define("extension", function(){return(
function extension(url){
   
   var matched = url.match(/([a-zA-Z]*)$/g)
   if(!matched) return
   return matched[0];
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Tests`
)});
  main.variable(observer("urls")).define("urls", function(){return(
[
  "https://gist.githubusercontent.com/vorth/3363aceb1dad0f521bcf9fd92b0e148c/raw/cd7812b655f4516b5cefe6f6adba838cb8a6b534/vZome-lifelike-ball.svg",
  "https://docs.google.com/spreadsheets/d/1GT9RMEV___rCtJvpdcThMQ62pKMrejx1BHsMO_Mrna0/edit#gid=0",
  "https://raw.githubusercontent.com/bumbeishvili/data-house/master/geo/mosaxleoba.xml",
  "https://raw.githubusercontent.com/bumbeishvili/geojson-georgian-regions/master/geo_regions.topojson",
  "https://raw.githubusercontent.com/bumbeishvili/geojson-georgian-regions/master/geo_regions.geojson",
  "https://gist.githubusercontent.com/mbostock/4063570/raw/11847750012dfe5351ee1eb290d2a254a67051d0/flare.csv",
  "https://raw.githubusercontent.com/bumbeishvili/resume.json/master/resume.json",
  "http://www.nbg.ge/rss.php",
  
]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Debug zone`
)});
  main.variable(observer("converted")).define("converted", ["urls","convert"], function(urls,convert){return(
JSON.stringify(urls.map(convert),null,' ')
)});
  return main;
}
