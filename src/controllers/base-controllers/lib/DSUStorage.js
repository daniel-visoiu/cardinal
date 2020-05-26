function doDownload(url, expectedResultType, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      response[expectedResultType]().then((data) => {
        return callback(undefined, data);
      }).catch((err) => {
        throw err;
      });
    })
    .catch((err) => {
      return callback(err);
    });
}

function doUpload(url, data, callback) {

  fetch(url, {
    method: 'POST',
    body: data
  }).then((response) => {
    return response.json().then((data) => {
      if (!response.ok || response.status != 201) {
        let errorMessage = '';
        if (Array.isArray(data) && data.length) {
          errorMessage = `${data[0].error.message}. Code: ${data[0].error.code}`;
        } else if (typeof data === 'object') {
          errorMessage = data.message ? data.message : JSON.stringify(data);
        }
        throw new Error(`Upload request failed. ${errorMessage}`);
      }

      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.error) {
            throw new Error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`);
          }

          console.log(`Uploaded ${item.file.name} to ${item.result.path}`);
          callback(undefined, item.result.path);
        }
      }
    });
  }).catch((err) => {
    return callback(err);
  });
}

class DSUStorage {

  setObject(path, data, callback) {
    try {
      let dataSerialized = JSON.stringify(data);
      this.setItem(path, dataSerialized, callback);
    }
    catch (e) {
      callback(e);
    }
  }

  getObject(path, callback) {
    this.getItem(path, "json", callback)
  }

  setItem(path, data, callback) {
    let segments = path.split("/");
    let fileName = segments.splice(segments.length - 1, 1)[0];
    path = segments.join("/");
    let url = `/upload?path=${path}&filename=${fileName}`;
    doUpload(url, data, callback);
  }

  getItem(url, expectedResultType, callback) {
    if (typeof expectedResultType === "function") {
      callback = expectedResultType;
      expectedResultType = "arrayBuffer";
    }

    if (url[0] !== "/") {
        url = "/" + url;
    }

    url = "/download" + url;
    doDownload(url, expectedResultType, callback);
  }
}

export default DSUStorage;
