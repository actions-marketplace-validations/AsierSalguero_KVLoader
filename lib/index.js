"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const identity_1 = require("@azure/identity");
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const KEY_VAULT_URI_NAME = core.getInput('KEY_VAULT_URI_NAME') || process.env.KEY_VAULT_URI_NAME;
const SHOW_ENV_VARIABLES = core.getInput('SHOW_ENV_VARIABLES') || process.env.SHOW_ENV_VARIABLES;
const credential = new identity_1.DefaultAzureCredential();
const KVNAME = getKeyVaultUriName(KEY_VAULT_URI_NAME);
const KVURI = getKeyVaultUriName(KEY_VAULT_URI_NAME);
const client = new keyvault_secrets_1.SecretClient(KVURI, credential);
function asiewr() {
    return __awaiter(this, void 0, void 0, function* () {
        let arrSecrets = [];
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                try {
                    for (var _d = true, _e = __asyncValues(client.listPropertiesOfSecrets()), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            let secretProperties = _c;
                            let prefix = "";
                            const azureSecret = yield client.getSecret(secretProperties.name);
                            if (!azureSecret.properties.expiresOn) {
                                let fecha = new Date();
                                let secreetofecha = azureSecret.properties.expiresOn;
                                if (secreetofecha < fecha)
                                    prefix = "***";
                            }
                            secretProperties['name'] = azureSecret.name;
                            secretProperties['value'] = prefix;
                            arrSecrets.push(secretProperties);
                            process.env[azureSecret.name] = prefix;
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                resolve(arrSecrets);
            }
            catch (err) {
                console.log('Error: ', err);
                reject('Error: ' + err);
            }
        }));
    });
}
function getKeyVaultUriName(uri) {
    if (uri.indexOf('.vault.azure.net/') >= 0)
        return uri.toUpperCase();
    else
        return 'https://' + uri + '.vault.azure.net/';
}
asiewr().then((dmsg) => {
    if (SHOW_ENV_VARIABLES)
        console.log(process.env);
    else {
        console.log("##########################################################");
        console.log(" Listado de secretros en el KV: " + KVNAME);
        console.log("##########################################################");
        console.log('');
        dmsg.forEach(element => {
            console.log('   ' + element.name + ": " + element.value);
        });
        console.log('');
        console.log("##########################################################");
    }
});
//# sourceMappingURL=index.js.map