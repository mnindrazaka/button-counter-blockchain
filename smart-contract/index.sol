// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.4.16 < 0.9.0;

contract Counter {
    int value;

    function increaseValue() public {
        value = value + 1;
    }

    function decreaseValue() public {
        value = value - 1;
    }

    function getValue() public view returns (int)  {
        return value;
    }
}