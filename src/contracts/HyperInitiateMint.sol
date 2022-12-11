// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";

interface IMailbox {
    function localDomain() external view returns (uint32);

    function dispatch(
        uint32 _destinationDomain,
        bytes32 _recipientAddress,
        bytes calldata _messageBody
    ) external returns (bytes32);

    function process(bytes calldata _metadata, bytes calldata _message)
        external;

    function count() external view returns (uint32);

    function root() external view returns (bytes32);

    function latestCheckpoint() external view returns (bytes32, uint32);
}


contract HyperInitiateMint {

    IMailbox mailbox;
    uint private mintCost;

    event Executed(address indexed _from, bytes _value);

    constructor(address _mailbox, uint _mintCost) {
        mailbox = IMailbox(_mailbox);
        mintCost = _mintCost;
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    // To send message to Hyperlane
    function sendMessage(
        uint32 _destinationDomain,
        address _recipient,
        bytes memory _message
    ) private {
        mailbox.dispatch(_destinationDomain, addressToBytes32(_recipient), _message);
    }

    function initiateMint (uint32 _destinationDomain, address _recipient) public payable {
        require(msg.value > mintCost, "Pay the mint cost!!");
        
        bytes memory message = abi.encode(msg.sender);

        sendMessage(_destinationDomain, _recipient, message);
    }

}