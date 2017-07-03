function parseQuery (search) {
  var s = search.slice(1)
  return s.split('&').reduce(function (prev, o) {
    var parts = o.split('=')
    prev[parts[0]] = parts[1]
    return prev
  }, {})
}

var query = parseQuery(window.location.search)
var banner

function removeBanner () {
  document.body.removeChild(banner)
}

if (query && query.ref) {
  if (query.ref === 'producthunt') {
    banner = document.createElement('div');
    banner.style = 'background-color: #da552f; min-height: 64px; color: white; font-size: 18px; padding: 10px; line-height: 32px;'
    banner.innerHTML = '<img src="https://s3.producthunt.com/static/kitty_265x244%402x.png" data-reactid="50" height="64px" style="float:left; margin-right: 20px;">Hello product hunter! It\'s dangerous to go alone! Take this.<br /> Here is a coupon for 30% off for 3 months: <span style="background: rgba(255, 255, 255, 0.2); padding: 5px;">wooden-sword</span><button onclick="removeBanner()" style="position: absolute; right: 10px; top: 10px; background: transparent; border: none; color: white; font-size: 40px;">×</button>'
    document.body.insertBefore(banner, document.body.firstChild)
  }
}
