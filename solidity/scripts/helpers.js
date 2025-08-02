
// just run:
// .load ./scripts/helpers.js
//
// buyUsername(accounts[0], 'gilgamesh')
// deposit(accounts[0], 1, 10000)

(async () => {


  l2 = 40245;
  l1 = 40161;


  cawAddress = "0x56817dc696448135203C0556f702c6a953260411";
  clientManagerAddress = '0xdB2124deA6BF442FF7FBD76D358771E7d1F4a29F'
  uriGeneratorAddress = '0xefDcb58F7180CDa18249446b798b373C946E85eD'
  cawNamesAddress = '0xE3970742a65F3253694a33219e84407d6DA8A46C'
  cawNamesMinterAddress = '0x6E5d0E2979310613245B8EF5ec58A38607092524'
  cawNamesL2MainnetAddress = '0x6109eF3B2DDf21264c720C4176c44c6D86De63De' 
  cawActionsMainnetAddress = '0xaD0c695d2f33797241E7Dc4D019883D67Dce8EEC'

  token = await MintableCaw.at(cawAddress);
  minter = await CawNameMinter.at(cawNamesMinterAddress);
  cawNames = await CawName.at(cawNamesAddress);
  cawNamesL2Mainnet = await CawNameL2.at(cawNamesL2MainnetAddress);
  defaultClientId = 1;
  //
  //
  //
  // cawActionsMainnet = await CawActions.at(global.cawAddress);

  // uriGenerator;
  // clientManager;


  // First L2 Deploy
//   cawNamesL2Address = '0x56817dc696448135203C0556f702c6a953260411';
// cawActionsAddress = "0x4C49b7B1F3b02Aa0a0121968a6bC30B593bE7a19";
  // n = await CawNameL2.at(cawNamesL2Address)

  // cawNamesL2;
  // cawActions;

})();

  global.buyUsername = async function(user, name) {

    var balance = await token.balanceOf(user)
    await token.approve(minter.address, balance.toString(), {
      nonce: await web3.eth.getTransactionCount(user),
      from: user,
    });

    var quote = await cawNames.mintQuote(defaultClientId, false);
    console.log('mint quote returned:', quote);

    t = await minter.mint(defaultClientId, name, quote.lzTokenFee, {
      nonce: await web3.eth.getTransactionCount(user),
      value: (BigInt(quote.nativeFee)).toString(),
      from: user,
    });

    return t;
  }

global.deposit = async function(user, tokenId, amount, layer, clientId) {
  clientId ||= defaultClientId;
  layer ||= l2;
  console.log("DEPOSIT", tokenId, (BigInt(amount) * 10n**18n).toString());

  var balance = await token.balanceOf(user)
  await token.approve(cawNames.address, balance.toString(), {
    nonce: await web3.eth.getTransactionCount(user),
    from: user,
  });

  var cawAmount = (BigInt(amount) * 10n**18n).toString();
  var quote = await cawNames.depositQuote(clientId, tokenId, cawAmount, layer, false);
  console.log('deposit quote returned:', quote);

  t = await cawNames.deposit(clientId, tokenId, cawAmount, layer, quote.lzTokenFee, {
    nonce: await web3.eth.getTransactionCount(user),
    value: quote.nativeFee,
    from: user,
  });

  return t;
}
