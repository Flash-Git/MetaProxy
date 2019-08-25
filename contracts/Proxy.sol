pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";

//import "./OldCounter.sol";
contract OldCounter  {
  uint256 public value;

  function increase() public {
    value += 1;
  }
  function decrease() public {
    value -= 1;
  }
}

contract Proxy is GSNRecipient {
  OldCounter counter;

  function setCounter(address _counter) public {
    counter = OldCounter(_counter);
  }

  function value() public view {
    counter.value();
  }

  function increase() public {
    counter.increase();
  }
  function decrease() public {
    counter.decrease();
  }

  function acceptRelayedCall(
    address relay,
    address from,
    bytes calldata encodedFunction,
    uint256 transactionFee,
    uint256 gasPrice,
    uint256 gasLimit,
    uint256 nonce,
    bytes calldata approvalData,
    uint256 maxPossibleCharge
  ) external view returns (uint256, bytes memory) {
    return _approveRelayedCall();
  }
}
