const clients = new Set()

const BASE_PATH = 'public'

const serve = Bun.serve({
  port: 3000,
  fetch(req, server) {
    const url = new URL(req.url)
    if(url.pathname === "/") {
      return new Response(Bun.file(`${BASE_PATH}/index.html`))
    }

    if(url.pathname === '/ws' && server.upgrade) {
      return server.upgrade(req, {
        data: { connectedAt: Date.now() }
      })
    }
    return new Response('Not Found', {status: 404})
  },
  websocket:{
    open(ws) {
      clients.add(ws)
      console.log('client terhubung');
    },
    message(ws, message){
      console.log('pesan masuk'. message);

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }

    },
    close(ws) {
      clients.delete(ws)
      console.log('Client terputus');
    }
  }
})

console.log(`listening on http://localhost:${serve.port}`)
