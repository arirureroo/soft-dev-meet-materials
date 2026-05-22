import http from 'http';

const server = http.createServer((req, res) => {
  // allow browser requests from any origin for demo use
  // "cors"
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  // tell the client to expect a chunked text response
  res.writeHead(200, {
    'content-type': 'text/plain',
    'transfer-encoding': 'chunked',
  });
  // send headers immediately before the body arrives
  res.flushHeaders();

  // collect the request body so we can stream it back
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));

  req.on('end', () => {
    // combine all chunks and split into smaller pieces
    const body = Buffer.concat(chunks).toString();
    const chunkSize = 5;
    const pieces = [];
    for (let i = 0; i < body.length; i += chunkSize) {
      pieces.push(body.slice(i, i + chunkSize));
    }

    // send each piece with a short delay to simulate streaming
    pieces.forEach((piece, i) => {
      setTimeout(() => {
        res.write(piece);
        if (i === pieces.length - 1) res.end();
      }, i * 200);
    });
  });
});

// start the server on localhost:8000
server.listen(8000, 'localhost', () => console.log('Server is running...'));
