const Web3 = require("web3");
const BigNumber = require("bignumber.js");

const {
    DummyTokenContract
} = require("@dharmaprotocol/dharma.js/dist/lib/src/wrappers/contract_wrappers/dummy_token_wrapper");

const setBalances = async () => {
    const provider = new Web3.providers.HttpProvider("http://localhost:8545");

    const web3 = new Web3(provider);

    const contractOwnerAddress = "0xd2f45e02ab7b190ac9a87b743eab4c8f2ed0e491";
    const debtorAddress = "0xd2f45e02ab7b190ac9a87b743eab4c8f2ed0e491";
    const creditorAddress = "0x3fa17c1f1a0ae2db269f0b572ca44b15bc83929a";

    const principalTokenSymbol = "WETH";
    const collateralTokenSymbol = "REP";

    const TX_DEFAULTS = { from: contractOwner, gas: 400000 };

    const principalTokenAddress = await dharma.contracts.getTokenAddressBySymbolAsync(principalTokenSymbol);

    const collateralTokenAddress = await dharma.contracts.getTokenAddressBySymbolAsync(collateralTokenSymbol);

    const principalToken = await DummyTokenContract.at(principalTokenAddress, web3, TX_DEFAULTS);
    const collateralToken = await DummyTokenContract.at(collateralTokenAddress, web3, TX_DEFAULTS);

    // Grant creditor a balance of the principal token
    await principalToken.setBalance.sendTransactionAsync(
        creditorAddress,
        new BigNumber(1000).times(new BigNumber(10).pow(18)),
        {
            from: contractOwnerAddress
        }
    );

    // Grant debtor a balance of the collateral token
    await collateralToken.setBalance.sendTransactionAsync(
        debtorAddress,
        new BigNumber(1000).times(new BigNumber(10).pow(18)),
        {
            from: contractOwnerAddress
        }
    );

    // Set the debtor's balance of the principal token to 0
    await principalToken.setBalance.sendTransactionAsync(debtorAddress, new BigNumber(0), {
        from: contractOwnerAddress
    });

    await dharma.token.setUnlimitedProxyAllowanceAsync(principalToken.address, {
        from: creditorAddress
    });

    await dharma.token.setUnlimitedProxyAllowanceAsync(principalToken.address, {
        from: debtorAddress
    });

    await dharma.token.setUnlimitedProxyAllowanceAsync(collateralToken.address, {
        from: debtorAddress
    });
};

module.exports = setBalances;
