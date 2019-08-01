var HDWalletProvider = require("truffle-hdwallet-provider");

var eric_mnemonic = "mixture monkey liberty legal gravity loan frame trust author render summer kingdom"
var kazi_mnemonic = "wasp hammer rich initial hard flip umbrella upgrade custom category soft enjoy";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*" // Match any network id
    // },
    // develop: {
    //   port: 8545
    // }
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(eric_mnemonic, "https://rinkeby.infura.io/v3/7d68f17e33f54915bf06a9e3baffc389");
      },
      network_id: "*"
    },
    // ropsten: {
    //   provider: function () {
    //     return new HDWalletProvider(kazi_mnemonic, "https://ropsten.infura.io/v3/7d68f17e33f54915bf06a9e3baffc389")
    //   },
    //   network_id: "*"
    // }
  }
};
