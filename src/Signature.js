const _sodium = require('libsodium-wrappers');

let keyPair = null;

async function verifyingKey() {
    if (!keyPair) {
        await _sodium.ready;
        keyPair = _sodium.crypto_sign_keypair();
    }
    return keyPair.publicKey;
}

async function sign(message) {
    await _sodium.ready;
    return _sodium.crypto_sign(message, keyPair.privateKey);
}

module.exports = {
    sign: sign,
    verifyingKey: verifyingKey
}