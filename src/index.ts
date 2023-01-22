import * as core from '@actions/core';

const KEY_VAULT_URI = core.getInput('KEY_VAULT_URI') || process.env.KEY_VAULT_URI;
process.env['KEY_VAULT_URI'] = KEY_VAULT_URI;

import * as manager from "enhanced-env-azure-vault";

const underscoreReplacedBy = "0x";

const environment = [ 'STAGE', 'TEST', 'PROD' ];
const typeVariant = [ 'frontend', 'backend', 'both' ];


const preparation = async () => {

  //Check proposed Environment [ TEST / STAGE / PROD ]

  let arrJson: {}[] = [];
  let tfvars_frontend: string[] = [];
  let tfvars_backend: string[] = [];

  const azureParameters = await manager.listAll(); 

  azureParameters.map( secretObject => {
    if (secretObject.enabled) {

      const obj:{} = {};
      
      core.exportVariable(secretObject.name, secretObject.value);
      core.setSecret(secretObject.value);

      obj['name'] = secretObject.name;
      obj['value'] = secretObject.value;
      obj['slotSetting'] = false;

      process.env[secretObject.name] = secretObject.value

      arrJson.push(obj);
      
    }
  })

  core.setOutput("json", JSON.stringify(arrJson, null));

};

preparation()
.catch( err => console.error('> ERROR in parameters: ', err ));
