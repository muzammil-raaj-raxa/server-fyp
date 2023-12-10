
function generateRandomKey(length) {
    const characters = '0123456789';
    let randomKey = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomKey += characters.charAt(randomIndex);
    }

    return randomKey;
  }

  module.exports = generateRandomKey;
