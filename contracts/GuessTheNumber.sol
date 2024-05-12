// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//5.11修改
contract GuessTheNumber {
    address public owner;
    bytes32 public encryptedTargetNumber;
    bool public gameEnded;
    mapping(address => bool) public hasPaid;
    mapping(address => uint) public guessesLeft;
    mapping(address => uint) public totalGuesses;

    event NumberGuessed(address indexed player, bytes32 guess);
    event GameEnded(address winner, uint prizeAmount);
    event Result(string message);

    constructor(bytes32 _encryptedTargetNumber) {
        owner = msg.sender;
        encryptedTargetNumber = _encryptedTargetNumber;
        gameEnded = false;
    }

    function guessNumber(bytes32 _guess) external {
    require(!gameEnded, "Game has ended");
    require(guessesLeft[msg.sender] > 0, "No more guesses left");

    guessesLeft[msg.sender]--;
    totalGuesses[msg.sender]++;

    emit NumberGuessed(msg.sender, _guess);

    if (_guess == encryptedTargetNumber) {
        gameEnded = true;
        emit GameEnded(msg.sender, address(this).balance);
        payable(msg.sender).transfer(address(this).balance);
        emit Result("Congratulations! You guessed the correct number.");
    } else {
        emit Result("Sorry, your guess is incorrect. Keep trying!");
    }
}

    function payToPlay() external payable {
        require(msg.value > 0, "Please send some ether to participate");

        hasPaid[msg.sender] = true;
        guessesLeft[msg.sender] += 3;
    }

    function restartGame(bytes32 _newEncryptedTargetNumber) external {
        require(msg.sender == owner, "Only the owner can restart the game");

        encryptedTargetNumber = _newEncryptedTargetNumber;
        gameEnded = false;

        guessesLeft[msg.sender] = 0;
    }

    function getGuessesLeft() external view returns (uint) {
        return guessesLeft[msg.sender];
    }

    function getTotalGuesses() external view returns (uint) {
        return totalGuesses[msg.sender];
    }

    function endGame() external {
        require(msg.sender == owner, "Only the owner can end the game");
        gameEnded = true;
    }

    function isPlayer(address _address) external view returns (bool) {
        return hasPaid[_address];
    }

    function getRandomNumber(uint _maxNumber) external view returns (uint) {
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.chainid, block.coinbase))) % _maxNumber + 1;
        return randomNumber;
    }
}
