var express = require('express')
var router = express.Router()
var Meta = require('html-metadata-parser')

const parseQueryString = url => {
  var json = {}
  var arr = url.substr(url.indexOf('?') + 1).split('&')
  arr.forEach(item => {
    var tmp = item.split('=')
    json[tmp[0]] = tmp[1]
  })
  return json
}

// Short Url from Google
router.get('/:shortId', function (req, res, next) {
  const url = 'https://goo.gl/maps/' + req.params.shortId
  console.log('<------ url ------>\n', url)
  Meta.parser(url, function (err, result) {
    if (err) {
      console.log('<------ ------>\n', err)
    }
    const params = parseQueryString(result.og.image)
    console.log('<------ paramas ------>\n', params.ll)
    res.json(params.ll)
  })
})

module.exports = router
