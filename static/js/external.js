class API {
  constructor(scheme='http', host='localhost', port='8080', endpoint='',
              method='get', data={}, obj=null, callback=null) {
    const url = `${scheme}://${host}:${port}/${endpoint}`;
    fetch(url, {method: method, data: Object.entries(data) ? data : null}).then(
      response => response.json()
    ).then(
      resData => callback(obj, resData)
    );
  }
}
