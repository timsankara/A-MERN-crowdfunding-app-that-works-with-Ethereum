// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21 <0.7.0;

contract CrowdFundMe {
    constructor() public {
        address(this);
    }

    struct Campaign {
        uint256 donation_amount;
    }

    mapping(string => Campaign) CampaignMapping;

    function donate(string calldata campaign_index) external payable {
        CampaignMapping[campaign_index].donation_amount += msg.value;
    }

    function returnCampaignDonationAmount(string memory campaign_index)
        public
        view
        returns (uint256)
    {
        uint256 current_campaign_donation = CampaignMapping[campaign_index]
            .donation_amount;
        return current_campaign_donation;
    }

    function returnBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(
        address payable _withdrawal_address,
        uint256 _withdrawal_amount,
        string memory donating_campaign
    ) public payable {
        _withdrawal_address.transfer(_withdrawal_amount);
        CampaignMapping[donating_campaign]
            .donation_amount -= _withdrawal_amount;
    }
}
