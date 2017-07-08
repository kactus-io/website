window.fetch('https://api.github.com/repos/kactus-io/kactus/releases/latest')
  .then(function (res) { return res.json() })
  .then(function (res) {
    var url = res.assets[0].browser_download_url

    document.getElementById('download-url').href = url
  })
