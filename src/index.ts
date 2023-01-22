import * as core from '@actions/core';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const KEY_VAULT_URI = core.getInput('KEY_VAULT_URI') || process.env.KEY_VAULT_URI;
const credential = new DefaultAzureCredential();
const client = new SecretClient(KEY_VAULT_URI, credential);


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

    let arrSecrets = [];


    return new Promise( async (resolve, reject) => {

        try {
            
            for await (let secretProperties of client.listPropertiesOfSecrets()) {
    

              let prefix = " "
              const azureSecret = await client.getSecret(secretProperties.name);
              
              let fecha = new Date();

              if (azureSecret.properties.expiresOn !== null && azureSecret.properties.expiresOn.getDate() < fecha.getDate()){
                prefix = "caducado"
              }
                
              secretProperties['name'] = azureSecret.name
              secretProperties['value'] = azureSecret.value;
              arrSecrets.push(secretProperties)

              process.env[''+azureSecret.name] = '***'
              console.log('Secreto ' + azureSecret.name)

            }
    
            resolve(arrSecrets);

        } catch (err: any) {

            console.log('Error: ', err);
            reject('Error: ' + err);

        }
        //console.log(process.env)
    });
}
asiewr().then(()=>{ console.log(process.env)});