import * as core from '@actions/core';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const KEY_VAULT_URI = core.getInput('KEY_VAULT_URI') || process.env.KEY_VAULT_URI;
const SHOW_ENV_VARIABLES = core.getInput('SHOW_ENV_VARIABLES') || process.env.SHOW_ENV_VARIABLES;

const credential = new DefaultAzureCredential();
const client = new SecretClient(KEY_VAULT_URI, credential);

const KVNAME  = getKeyVaultName(KEY_VAULT_URI);


interface envResult {
    
    expiresOn: string,
    createdOn: Date,
    updatedOn: Date,
    id: string,
    tags: { environment: string, type: string },
    vaultUrl: string,
    name: string,
    version: number,
    enabled: boolean,
    recoverableDays: number,
    recoveryLevel: string,
    value: string,
    environment: string
}
async function asiewr(): Promise<envResult[]> {

    let arrSecrets = []


    return new Promise( async (resolve, reject) => {

        try {
            
            for await (let secretProperties of client.listPropertiesOfSecrets()) {
    

              let prefix = ""
              const azureSecret = await client.getSecret(secretProperties.name);
              
              

              if (!azureSecret.properties.expiresOn){
                let fecha = new Date();
                let secreetofecha = azureSecret.properties.expiresOn
                if(secreetofecha < fecha ) prefix = "***"
              }
                
              secretProperties['name'] = azureSecret.name
              secretProperties['value'] = prefix;
              arrSecrets.push(secretProperties)

              process.env[azureSecret.name] = prefix
            }
    
            resolve(arrSecrets);

        } catch (err: any) {

            console.log('Error: ', err);
            reject('Error: ' + err);

        }
        //console.log(process.env)
    });
}


function getKeyVaultName(uri: string){
    let nombre = uri.replace('https://','').replace('.vault.azure.net','').toUpperCase();
    return nombre;
}

asiewr().then((dmsg) => {
    if(SHOW_ENV_VARIABLES) console.log(process.env);
    else{
        console.log("##########################################################")
        console.log(" Listado de secretros en el KV: " + KVNAME)
        console.log("##########################################################")
        console.log('')    

        dmsg.forEach(element => {
            console.log('   ' + element.name + ": " + element.value)
        });
        
        console.log('')
        console.log("##########################################################")
    }
  });