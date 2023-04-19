import fs from 'fs';                                                                                                                                                                                                                   
import csv from 'csv-parser';                                                                                                                                                                                                          
import axios from 'axios';                                                                                                                                                                                                             
import { SingleBar } from 'cli-progress';                                                                                                                                                                                              
import pLimit from 'p-limit';
import dotenv from 'dotenv';

dotenv.config();

const apikey = process.env.API_KEY;
const csvFilePath = 'entrada.csv';                                                                                                                                                                                                     
const jsonFilePath = 'saida.json';                                                                                                                                                                                                     

const maxRecordsPerFile = 1000;                                                                                                                                                                                                        
const maxConcurrentRequests = 10;                                                                                                                                                                                                      

const convertToJSON = () => {                                                                                                                                                                                                          
  const data = [];                                                                                                                                                                                                                     
  
  fs.createReadStream(csvFilePath)                                                                                                                                                                                                     
  .pipe(csv())                                                                                                                                                                                                                       
  .on('data', (row) => {                                                                                                                                                                                                             
    data.push(row);                                                                                                                                                                                                                  
  })                                                                                                                                                                                                                                 
  .on('end', () => {                                                                                                                                                                                                                 
    fs.writeFileSync(jsonFilePath, JSON.stringify(data));                                                                                                                                                                            
    console.log('CSV convertido para JSON com sucesso!');                                                                                                                                                                            
  });                                                                                                                                                                                                                                
};                                                                                                                                                                                                                                     


const getDbipData = async (ipAddress, apikey) => {                                                                                                                                                                                             
  try {                                                                                                                                                                                                                                
    const response = await axios.get(`http://api.db-ip.com/v2/${apikey}/${ipAddress}`);                                                                                                                                                    
    return response.data;                                                                                                                                                                                                              
  } catch (error) {                                                                                                                                                                                                                    
    console.error(`Erro ao obter dados da API dbip para o endereço IP ${ipAddress}: ${error.message}`);                                                                                                                                
    return null;                                                                                                                                                                                                                       
  }                                                                                                                                                                                                                                    
};                                                                                                                                                                                                                                     

const saveDataToFile = (filename, data) => {                                                                                                                                                                                           
  try {                                                                                                                                                                                                                                
    fs.writeFileSync(`${filename}`, JSON.stringify(data));                                                                                                                                                                             
    console.log(`Arquivo ${filename} salvo com sucesso!`);                                                                                                                                                                             
  } catch (error) {                                                                                                                                                                                                                    
    console.error(`Erro ao salvar dados no arquivo ${filename}: ${error.message}`);                                                                                                                                                    
  }                                                                                                                                                                                                                                    
};                                                                                                                                                                                                                                     

const progressBar = new SingleBar({}, {                                                                                                                                                                                                
  format: 'Progresso |{bar}| {percentage}% | {value}/{total} registros',                                                                                                                                                               
  barCompleteChar: '\u2588',                                                                                                                                                                                                           
  barIncompleteChar: '\u2591',                                                                                                                                                                                                         
});                                                                                                                                                                                                                                    

const processJsonFile = async () => {                                                                                                                                                                                                  
  try {                                                                                                                                                                                                                                
    const jsonFileContent = await fs.promises.readFile(jsonFilePath, 'utf8');                                                                                                                                                          
    const objects = JSON.parse(jsonFileContent);                                                                                                                                                                                       
    let currentCount = 0;                                                                                                                                                                                                              
    let records = [];                                                                                                                                                                                                                  
    const totalCount = objects.length;                                                                                                                                                                                                 
    
    progressBar.start(totalCount, 0);                                                                                                                                                                                                  
    
    const limit = pLimit(maxConcurrentRequests);                                                                                                                                                                                       
    
    const promises = objects.map((object) =>                                                                                                                                                                                           
    limit(async () => {                                                                                                                                                                                                              
      const ipAddress = object.IpAddress;                                                                                                                                                                                            
      const dbipData = await getDbipData(ipAddress, apikey);                                                                                                                                                                                 
      
      if (dbipData !== null) {                                                                                                                                                                                                       
        records.push({                                                                                                                                                                                                               
          ...object,                                                                                                                                                                                                                 
          ...dbipData,                                                                                                                                                                                                               
        });                                                                                                                                                                                                                          
      }                                                                                                                                                                                                                              
      
      currentCount++;                                                                                                                                                                                                                
      
      if (records.length === maxRecordsPerFile || currentCount === totalCount) {                                                                                                                                                     
        const filename = `output-${currentCount}-${Date.now()}.json`;                                                                                                                                                                
        saveDataToFile(filename, records);                                                                                                                                                                                           
        records = [];                                                                                                                                                                                                                
      }                                                                                                                                                                                                                              
      
      progressBar.update(currentCount);                                                                                                                                                                                              
    })                                                                                                                                                                                                                               
    );                                                                                                                                                                                                                                 
    
    await Promise.all(promises);                                                                                                                                                                                                       
    
    progressBar.stop();                                                                                                                                                                                                                
  } catch (error) {                                                                                                                                                                                                                    
    console.error(`Erro ao processar o arquivo JSON: ${error.message}`);                                                                                                                                                               
  }                                                                                                                                                                                                                                    
};                                                                                                                                                                                                                                     

const main = async () => {                                                                                                                                                                                                             
  convertToJSON();
  setTimeout(processJsonFile, 1000);                                                                                                                                                                                                   
};                                                                                                                                                                                                                                     

main();                                                     