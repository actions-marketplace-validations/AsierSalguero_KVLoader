import * as core from '@actions/core';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const KEY_VAULT_URI_NAME = core.getInput('KEY_VAULT_URI_NAME') || process.env.KEY_VAULT_URI_NAME;
const SHOW_ENV_VARIABLES = core.getInput('SHOW_ENV_VARIABLES') || process.env.SHOW_ENV_VARIABLES;

const credential = new DefaultAzureCredential();
const KVNAME  = getKeyVaultUriName(KEY_VAULT_URI_NAME);
const KVURI = getKeyVaultUriName(KEY_VAULT_URI_NAME);
const client = new SecretClient(KVURI, credential);

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
    });
}


function getKeyVaultUriName(uri: string){

    if(uri.indexOf('.vault.azure.net/') >= 0) return uri.toUpperCase();
    else return 'https://'+uri+'.vault.azure.net/';
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