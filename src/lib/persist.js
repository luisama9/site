import server from "../server"

// secret stuff in here.

// increase this number to bust all locally stored mirage
// databases
let currentVersion = 4
let initialData = server._config.fixtures
let originalHandled = server.pretender.handledRequest

let saveDb = function() {
  localStorage.setItem("mirage:db:version", currentVersion)
  localStorage.setItem("mirage:db:data", JSON.stringify(server.db.dump()))
}

let resetDb = function(data = initialData) {
  server.db.emptyData()
  server.db.loadData(data)
  saveDb()
}

let loadDb = function() {
  let data
  let version = localStorage.getItem("mirage:db:version")
  let dataString = localStorage.getItem("mirage:db:data")

  if (dataString && version === currentVersion.toString()) {
    try {
      resetDb(JSON.parse(dataString))
    } catch (e) {}
  }

  server.pretender.handledRequest = function() {
    originalHandled.call(server.pretender, ...arguments)
    saveDb()
  }
}

export { loadDb, resetDb }
