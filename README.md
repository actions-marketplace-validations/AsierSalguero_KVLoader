# Azure KV Secrets Loader
Lee los secretos de un keyvault y los añade a las variables de entorno, ademas indica si el secreto esta caducado

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
  uses: azure/login@v1.0.0
    with:
      creds: ${{ secrets.AZ_LOGIN_CREDENTIALS }}
      enable-AzPSSession: false

- name: Get the secrets
  uses: AsierSalguero/KVLoader@v1
  with:
    KEY_VAULT_URI: ${{ secrets.KEY_VAULT_URI }}
    SHOW_ENV_VARIABLES: False
  id: kvloader

