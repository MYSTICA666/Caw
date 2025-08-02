// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICawActions {
  function nextCawonce(uint32 senderId) external view returns (uint256);
}
