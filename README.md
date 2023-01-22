# Enhanced ENV Azure Vault Action

This action gets secrets from Azure Vault as ENV parameters for specific environment and type.
It depends on Enhanced ENV Azure Vault NPM package, which prepares data for Azure Key Vault based on environment [staging / testing / production] and type [ Backend / Frontend / ..].
See https://www.npmjs.com/package/enhanced-env-azure-vault
## Inputs

### `KEY_VAULT_URI`

**Required** Url del keyvault.

### `SHOW_ENV_VARIABLES`

**Required** True | False , Si tru muestra los secretos con las variables d eentorno, si no solo los secretos del keyVault

## Outputs

### `env`

Environment parameters, you can see them in your Action job as `${{ env.xxxx }}`


## Example usage

```yaml
- name: Login via Az module
  uses: azure/login@v1
    with:
      creds: ${{ secrets.AZ_LOGIN_CREDENTIALS }}
      enable-AzPSSession: false

- name: Get the secrets
  uses: AsierSalguero/KVLoader@v1
  with:
    KEY_VAULT_URI: ${{ secrets.KEY_VAULT_URI }}
    SHOW_ENV_VARIABLES: False
  id: kvloader

