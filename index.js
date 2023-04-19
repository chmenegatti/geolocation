const axios = require('axios')
const fs = require("fs")

const dbip = async (url) => {
  const { data } = await axios.get(url)

  return data
}

const checkFile = (edge) => {
  if (!fs.existsSync(`${edge}.json`)) {
    console.log(`Arquivo ${edge}.json não exite, indo para o próximo`)
    return false
  } 
  return true
}

const getData = async (file, edge) => {

  let dados = []
  let total = file.length + 1
  let chunk = 1000
  let atual = 1
  let agora = 1

  for (const item of file) {
    const url = `http://api.db-ip.com/v2/2cc8ce9a617ed4e64343d73641f5487b65f165a0/${item["IpAddress"]}`
      
    const dbIpData = await dbip(url)

    Object.assign(item, dbIpData)    
    console.log(item["IpAddress"]," - ", dbIpData["city"], " - ", dbIpData["countryName"], " - ", atual)
    dados.push(item)
    
    if (atual === chunk && atual < total) {
      fs.writeFileSync(`${edge}-${agora}-${atual}-dbip.json`, JSON.stringify(dados), "utf-8")
      chunk += 1000
      agora = atual + 1
      dados = []
    }
    atual += 1
    if (atual === total) {
      fs.writeFileSync(`${edge}-${agora}-${atual}-dbip.json`, JSON.stringify(dados), "utf-8")
    }
  }
}

const sliceFile = async (edge) => {
  let file
  switch (edge) {
    case 'tesp2':
      if (checkFile(edge)) {
        file = require('./tesp2.json')
        await getData(file, edge)
      }
      break;
    case 'tesp3':
      if (checkFile(edge)) {
        file = require('./tesp3.json')
        await getData(file, edge)
      }
      break;
    case 'tesp4':
      if (checkFile(edge)) {
        file = require('./tesp4.json')
        await getData(file, edge)
      }
      break;
    case 'tesp5':
      if (checkFile(edge)) {
        file = require('./tesp5.json')
        await getData(file, edge)
      }
      break;
    case 'tesp6':
      if (checkFile(edge)) {
        file = require('./tesp6.json')
        await getData(file, edge)
      }
      break;
    case 'tesp7':
      if (checkFile(edge)) {
        file = require('./tesp7.json')
        await getData(file, edge)
      }
      break;
  
    default:
      break;
  }
  
}

(async function command  (){
  const edges = ['tesp2', 'tesp3', 'tesp4', 'tesp5', 'tesp6', 'tesp7']
  
  for (const edge of edges) {
    await sliceFile(edge)
  }
  
})();




