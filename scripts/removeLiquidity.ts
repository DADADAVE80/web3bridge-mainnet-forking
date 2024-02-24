import {ethers} from "hardhat";

const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const address = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    await helpers.impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);

    const USDC = await ethers.getContractAt("IERC20", USDCAddress);
    const DAI = await ethers.getContractAt("IERC20", DAIAddress);
    const WETH = await ethers.getContractAt("IERC20", WETHAddress);

    const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

    const amountADesired = ethers.parseUnits("3000000", 6);
    const amountBDesired = ethers.parseUnits("90000000", 18);
    const amountAMin = ethers.parseUnits("300000", 6);
    const amountBMin = ethers.parseUnits("9000000", 18);

    const approveTx1 = await USDC.connect(impersonatedSigner).approve(UNIRouter, amountADesired);
    await approveTx1.wait();

    const approveTx2 = await DAI.connect(impersonatedSigner).approve(UNIRouter, amountBDesired);
    await approveTx2.wait();

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    // const prevContractBalance = await
    const USDCBalBefore = await USDC.balanceOf(impersonatedSigner.address);
    const DAIBalBefore = await DAI.balanceOf(impersonatedSigner.address);
    const WETHBalBefore = await WETH.balanceOf(impersonatedSigner.address);

    console.log("USDC Balance Before Liq:", ethers.formatUnits(USDCBalBefore, 6));
    console.log("DAI Balance Before Liq:", ethers.formatUnits(DAIBalBefore, 18));
    console.log("WETH Balance Before Liq:", ethers.formatUnits(WETHBalBefore, 18));
    console.log("---------------------------------------------------------");

    const addLiqudityTx = await ROUTER.connect(impersonatedSigner).addLiquidity(
        USDCAddress,
        DAIAddress,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        UNIRouter,
        deadline
    );

    await addLiqudityTx.wait();

    const USDCBalAfter = await USDC.balanceOf(impersonatedSigner.address);
    const DAIBalAfter = await DAI.balanceOf(impersonatedSigner.address);
    const WETHBalAfter = await WETH.balanceOf(impersonatedSigner.address);

    console.log("USDC Balance After Liq:", ethers.formatUnits(USDCBalAfter, 6));
    console.log("DAI Balance After Liq:", ethers.formatUnits(DAIBalAfter, 18));
    console.log("WETH Balance After Liq:", ethers.formatUnits(WETHBalAfter, 18));

    const [amountA, amountB, liquidity] = addLiqudityTx;

    const approveTx3 = await USDC.connect(impersonatedSigner).approve(address, amountADesired);
    await approveTx3.wait();

    const approveTx4 = await DAI.connect(impersonatedSigner).approve(address, amountBDesired);
    await approveTx4.wait();

    const removeLiquidityTx = await ROUTER.connect(impersonatedSigner).removeLiquidity(
        USDCAddress,
        DAIAddress,
        liquidity,
        amountAMin,
        amountBMin,
        address,
        deadline
    );

    await removeLiquidityTx.wait();

    const USDCBalRm = await USDC.balanceOf(impersonatedSigner.address);
    const DAIBalRm = await DAI.balanceOf(impersonatedSigner.address);
    const WETHBalRm = await WETH.balanceOf(impersonatedSigner.address);

    console.log("USDC Balance Rem Liq:", ethers.formatUnits(USDCBalRm, 6));
    console.log("DAI Balance Rem Liq:", ethers.formatUnits(DAIBalRm, 18));
    console.log("WETH Balance Rem Liq:", ethers.formatUnits(WETHBalRm, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});