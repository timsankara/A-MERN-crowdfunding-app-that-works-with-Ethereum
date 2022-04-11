// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.7.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Campaign {

    address public owner;
    string public deadline;
    string public description;
    bool public isThere = false;
    uint public fundraising_goal;
    address[] public contributors;
    address payable funding_address;
    
    struct WithdrawalRequests {
        string request_description;
        uint amount;
        bool approved;
        // address merchant;
        uint votePercentage;
    }
    
    mapping(uint => WithdrawalRequests) withdrawalRequestsMapping;
    
    // address
    constructor (
    string memory _description, 
    uint _funding_goal, 
    string memory _deadline
    )public{
        description = _description;
        fundraising_goal = _funding_goal;
        owner = msg.sender;
        deadline = _deadline;
    }
    
    function getRaisedFunds() public view returns (uint){
        return funding_address.balance;
        // return block.timestamp;
    }

    function contribute() public payable returns(bool){
        funding_address.transfer(msg.value);
        contributors.push(msg.sender);
    }
    
    function returnNumberOfContributors() public view returns(uint){
        return contributors.length;
    }
    
    // function createRequest(string memory _request_description, address _merchant) public{
    //     withdrawalRequestsMapping[1] = WithdrawalRequests('test description',  100, false, 0 );
    // }

}