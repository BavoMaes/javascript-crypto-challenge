const _sodium = require('libsodium-wrappers');
let key = null;

async function decrypt(ciphertext, nonce) {
    await _sodium.ready;
    const sodium = _sodium;

    if (!key) {
        throw 'no key';
    }
    
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
}

async function setKey(newKey) {
    key = newKey;
}

module.exports = {
    decrypt: decrypt,
    setKey: setKey
}