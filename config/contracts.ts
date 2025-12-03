/**
 * Smart Contract Configuration
 * PrimeCircle Access Control
 */

// Contract addresses on Base network
export const PRIME_CIRCLE_ACCESS = '0x04583ED817718CA61e96972CBd3992Ffb3008241'
export const ONE_WAY_ACCESS = '0xa5e58db187F07563B4fd5695090a489107D4703C'
export const OPPORTUNITIES_ACCESS = '0xD713Eba36BB9f2e1DC4DaF73cd88196a5b4908f3'
export const TIME_CAPSULES_NFT = '0x3F7A0ffC8703adcB405D3Fdb179a74281C5CF80b'

// Access prices in ETH
export const ACCESS_PRICE_ETH = '0.00035'
export const ONE_WAY_PRICE_ETH = '0.001'
export const OPPORTUNITIES_PRICE_ETH = '0.0007'

// Contract ABI (Application Binary Interface)
export const ACCESS_CONTRACT_ABI = [
    'function checkAccess(address user) external view returns (bool)',
    'function purchaseAccess() external payable',
    'function accessPrice() external view returns (uint256)',
    'function getBalance() external view returns (uint256)',
    'function hasAccess(address user) external view returns (bool)',
]

// ERC721 ABI for NFT balance check
export const ERC721_ABI = [
    'function balanceOf(address owner) external view returns (uint256)',
]
