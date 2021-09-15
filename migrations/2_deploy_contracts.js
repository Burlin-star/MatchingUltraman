const MemoryToken = artifacts.require("UltramanToken");

module.exports = function(deployer) {
  // Code goes here...
  deployer.deploy(MemoryToken);
};
