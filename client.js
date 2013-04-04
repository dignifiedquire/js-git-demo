var shoe = require('shoe')
  , fetch = require('git-fetch-pack')
  , unpack = require('git-list-pack')
  , through = require('through')
  , Buffer = require('buffer').Buffer
  , walk = require('git-walk-refs')
  , $ = require('jquery-browserify')
  , _ = require('lodash')
  , objectify = require('git-objectify-pack')

// make a websocket connection to the
// server.
var conn = shoe('/git')
  , client


// automatically clone plate.
client = fetch(
    'git://github.com/chrisdickinson/plate.git'
  , want
)

// we get a callback for each ref. say `true`
// if we want the ref, `false` if we don't.
function want(ref, ready) {
  return ready(/(HEAD|heads)/.test(ref.name))
}

function write(content) {
  content = '<pre>' + _.escape(content) + '</pre>'
  $('#content').append(content)
}

client
  .pipe(conn)
  .pipe(parse())
  .pipe(client)

// `pack` is a separate stream that
// emits binary packfile data.
function find(oid, ready) {
  // for finding ref-delta objects that might
  // be outside of the current packfile
  return ready(null, referencedObject | null)
}

client.pack.pipe(unpack()).pipe(objectify(find))


// parse turns our serialized objects
// back into js objects.
function parse() {
  return through(function(data) {
    // turn it back into a JS object + buffer data.
    data = JSON.parse(data)
    if(data.data !== null) {
      data.data = new Buffer(data.data, 'base64')
    }
    this.queue(data)
  })
}
