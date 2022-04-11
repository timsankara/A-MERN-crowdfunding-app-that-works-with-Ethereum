var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var CrowdFundMe = artifacts.require("./CrowdFundMe.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(CrowdFundMe);
};
