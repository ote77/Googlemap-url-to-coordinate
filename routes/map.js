// import Deshortifier from 'deshortify'
var express = require('express')
var router = express.Router()
var Meta = require('html-metadata-parser')
var request = require('request')

// Take all the params from Url
const parseQueryString = url => {
  var json = {}
  var arr = url.substr(url.indexOf('?') + 1).split('&')
  arr.forEach(item => {
    var tmp = item.split('=')
    json[tmp[0]] = tmp[1]
  })
  return json
}

// Change the url to China version
const modifyUrl = url => {
  var modifiedUrl = 'https://www.google.com/maps?'
  var arr = url.substr(url.indexOf('?') + 1).split('&')
  arr.forEach(item => {
    var tmp = item.split('=')
    if (tmp[0] === 'hl') {
      tmp[1] = 'zh-Hans-CN'
    } else if (tmp[0] === 'gl') {
      tmp[1] = 'cn'
    }
    modifiedUrl = modifiedUrl + tmp[0] + '=' + tmp[1] + '&'
  })
  return modifiedUrl
}

router.get('/:shortId', function (req, res) {
  const uri = 'https://goo.gl/maps/' + req.params.shortId
  request(
    {
      uri: uri,
      followRedirect: false
    },
    function (err, httpResponse) {
      if (err) {
        return console.error(err)
      }
      var url = httpResponse.headers.location || uri
      url = modifyUrl(url)
      Meta.parser(url, function (err, result) {
        if (err) {
          console.log('<------ err ------>\n', err)
        }
        const params = parseQueryString(result.og.image)
        const cor = params.ll ? params.ll : params.center.replace('%2C', ',')
        console.log('<------ cor ------>\n', cor)
        res.json(cor)
      })
    }
  )
})

module.exports = router
