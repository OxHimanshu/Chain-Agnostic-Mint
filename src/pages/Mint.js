import { useNetwork, useAccount, useSigner } from 'wagmi';
import { useAlert, positions } from 'react-alert';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';
import { ethers } from "ethers";
import initiatemintabi from "../abis/initiatemintabi.json";
import mintnftabi from "../abis/mintnftabi.json";

function Swap() {

    const alert = useAlert()

    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    const { data: signer } = useSigner()

    const chainObj = {
        5: {
            chainId: 5,
            chianName: "Goerli",
            explorer: "https://goerli.etherscan.io/tx/",
            rpc: "https://goerli.infura.io/v3/",
            mintContract: "0x1ceb42fc604c8607d844acbe2ab81ba3e3c80eae",
            domain: 5
        },
        80_001: {
            chainId: 80_001,
            chianName: "Mumbai",
            explorer: "https://mumbai.polygonscan.com/tx/",
            rpc: "https://matic-mumbai.chainstacklabs.com",
            mintContract: "0x17E695CA08DaBa6f9b351008A2DD9D65cb8F679b",
            domain: 80001
        },
        1_287: {
            chainId: 1_287,
            chianName: "Moonbase Alpha",
            explorer: "https://moonbase-blockscout.testnet.moonbeam.network/tx/",
            rpc: "https://rpc.testnet.moonbeam.network",
            mintContract: "0xa2d9bd7e1f692ab33aa1066611b99a4a4bcf83d7",
            domain: 0x6d6f2d61
        }
    } 

    async function mintNFT() {
        try{
            if(chain.id === 80_001) {
                const mintContract = new ethers.Contract(chainObj[chain.id].mintContract, mintnftabi, signer);
                const txn = await mintContract.initiateMint({ value: ethers.utils.parseUnits("1", "wei") });
                alert.success(
                    <div>
                        <div>Transaction Sent</div>
                        <button className='text-xs' onClick={()=> window.open(chainObj[chain.id].explorer + txn.hash, "_blank")}>View on explorer</button>
                    </div>, {
                    timeout: 0,
                    position: positions.BOTTOM_RIGHT
                });
            } else {
                const initiateMintContract = new ethers.Contract(chainObj[chain.id].mintContract, initiatemintabi, signer);
                const txn = await initiateMintContract.initiateMint(chainObj[80_001].domain, chainObj[80_001].mintContract, { value: ethers.utils.parseUnits("1", "wei") });
                alert.success(
                    <div>
                        <div>Transaction Sent</div>
                        <button className='text-xs' onClick={()=> window.open("https://explorer.hyperlane.xyz/?search=" + txn.hash, "_blank")}>View on explorer</button>
                    </div>, {
                    timeout: 0,
                    position: positions.BOTTOM_RIGHT
                });
            }
        } catch(ex) {
            console.log(ex);
            alert.error(<div>Operation failed</div>, {
                timeout: 30000,
                position: positions.TOP_RIGHT
            });
        }
    }

    return (
        <div>
            <div className='z-[10]'>
            <div className="rounded-b-lg flex items-center justify-between w-full h-20 px-12">
                <Link className="flex-1 font-semibold text-4xl text-green-600 hover:text-green-500" to='/'>
                    <div className='flex justify-center pl-56'> <button className='rounded-md border-2 bg-[#C03540] p-2 mt-6'><img src="https://www.azuki.com/Azuki%20Logo%20White.svg" className='h-12 w-48' /></button></div>
                </Link>
                <div className="">
                    <ConnectButton chainStatus="icon" showBalance={false}/>
                </div>
            </div>
            </div>
            <div className='h-5/6'>
                <div className="flex flex-1 items-center justify-end z-[10]">
                {
                    isConnected && 
                    <div className='drop-shadow-2xl bg-[#C03540] w-[370px] p-4 flex flex-row items-center justify-between mt-[610px] space-x-2 mr-10'>
                        <div className='text-white text-xl font-semibold'>OPEN FOR MINTING</div>
                        <button onClick={() => mintNFT()} className='bg-black text-white font-normal text-lg p-2 px-10'>Mint</button>
                    </div>
                }
                </div>
                {
                    isConnected &&
                    <div className='mt-2 flex items-center justify-center font-semibold text-xl'>
                    Powered By HyperLane
                </div>

                }
                
            </div>
        </div>
    )
}
export default Swap;