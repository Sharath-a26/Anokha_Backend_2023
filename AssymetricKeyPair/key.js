const fs = require('fs');
const crypto = require('crypto');

const generateKey = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });
      
      fs.writeFileSync('./AssymetricKeyPair/public_key.pem', publicKey);
      fs.writeFileSync('./AssymetricKeyPair/private_key.pem', privateKey);

  
}

const generateTransactionKey = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    
    fs.writeFileSync('./AssymetricKeyPair/transaction_public_key.pem', publicKey);
    fs.writeFileSync('./AssymetricKeyPair/transaction_private_key.pem', privateKey);


}
module.exports = {generateKey, generateTransactionKey};