pragma solidity >=0.4.22 <0.6.0;

contract OldCounter  {
  uint256 public value;

  function increase() public {
    value += 1;
  }
  function decrease() public {
    value -= 1;
  }
}
