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

    const amountOut = ethers.parseEther("1");


    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    // const prevContractBalance = await
    const USDCbal = await USDC.balanceOf(impersonatedSigner.address);
    const WETHbal = await WETH.balanceOf(impersonatedSigner.address);
    console.log("USDC Balance:", ethers.formatUnits(USDCbal, 6));
    console.log("WETH Balance:", ethers.formatUnits(WETHbal, 18));
    console.log("---------------------------------------------------------");

    const swapETHForExactTokens = await ROUTER.connect(impersonatedSigner).swapETHForExactTokens(

    )

    console.log("USDC Balance:", ethers.formatUnits(USDCbal, 6));
    console.log("WETH Balance:", ethers.formatUnits(WETHbal, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});