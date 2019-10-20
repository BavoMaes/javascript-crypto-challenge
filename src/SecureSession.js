const _sodium = require('libsodium-wrappers');

let keypair;
let clientPublicKey;
let sharedKey;

let serverPublicKey = async () => {
    await _sodium.ready;
    if (!keypair) {
        keypair = _sodium.crypto_kx_keypair();
    }
    return keypair.publicKey;
}

let setClientPublicKey = (key) => {
    if (!clientPublicKey || key == clientPublicKey) {
        clientPublicKey = key;
    } else {
        throw "client public key already set";
    } 
}

let decrypt = async (ciphertext, nonce) => {
    await _sodium.ready;
    sharedKey = _sodium.crypto_kx_server_session_keys(keypair.publicKey, keypair.privateKey, clientPublicKey);
    return _sodium.crypto_secretbox_open_easy(ciphertext, nonce, sharedKey.sharedRx);
}

let encrypt = async (msg) => {
    await _sodium.ready;
    let nonce = _sodium.randombytes_buf(_sodium.crypto_secretbox_NONCEBYTES)
    let ciphertext = _sodium.crypto_secretbox_easy(msg, nonce, sharedKey.sharedTx);
    return {
        ciphertext: ciphertext,
        nonce: nonce
    };
}

module.exports = {
    serverPublicKey: serverPublicKey,
    setClientPublicKey: setClientPublicKey,
    decrypt: decrypt,
    encrypt: encrypt
}