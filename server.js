var net = require('net')
  , fs = require('fs')

var unpack = require('git-list-pack')
  , concat = require('concat-stream')
  , transport = require('git-transport-protocol')
  , through = require('through')

var http = require('http')
  , ecstatic = require('ecstatic')(__dirname)
  , shoe = require('shoe')
  , server
  , sock

// serve up files.
server = http.createServer(ecstatic)
server.listen(9999)
console.log('Server started at port 9999')

// do websockets. install at `/git`.
sock = shoe(connect)
sock.install(server, '/git')

function connect(conn) {
  // this runs whenever we get a new websocket connection.
  var tcp = net.connect({host: 'github.com', port: 9418})

  conn
    .pipe(transport(tcp))
    .pipe(translate())
    .pipe(conn)
}

function translate() {
  return through(function(data) {
    // if there's data, base64 so we don't have any
    // silly unicode issues. then queue
    // up the stringified object.
    data.data = data.data ? data.data.toString('base64') : null
    this.queue(JSON.stringify(data))
  })
}
