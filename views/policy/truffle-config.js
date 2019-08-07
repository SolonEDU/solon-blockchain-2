var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = ""

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "/*infura link*/");
      },
      network_id: "*"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "/*infura link*/");
      },
      network_id: "*"
    }
  }
};
