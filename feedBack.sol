// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FeedbackDApp {
    struct Feedback {
        address sender;
        string message;
    }

    Feedback[] public feedbacks;

    function sendFeedback(string memory _message) public {
        Feedback memory newFeedback = Feedback(msg.sender, _message);
        feedbacks.push(newFeedback);
    }

    function getFeedbacksCount() public view returns (uint) {
        return feedbacks.length;
    }

    function getFeedback(
        uint _index
    ) public view returns (address, string memory) {
        Feedback memory feedback = feedbacks[_index];
        return (feedback.sender, feedback.message);
    }
}
