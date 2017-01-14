class Request {
  constructor({method="GET", url}={}) {
    return new Promise((resolve, reject)=>{
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open(method, url);
      xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState == 4){
          if (xmlhttp.status == 200) {
            resolve(xmlhttp.responseText);
          } else {
            reject(xmlhttp.responseText);
          }
        }
      };
      xmlhttp.send();
    });
  }
}