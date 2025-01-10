export const mempoolsClaimsApechainAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mptoken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "apeId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
    ],
    name: "MemeTokenClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_memeToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_apeId",
        type: "uint256",
      },
      {
        internalType: "enum MemePoolsClaimsApeChain.ApeType",
        name: "apeType",
        type: "uint8",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_memeToken",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_boredApeIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_mutantApeIds",
        type: "uint256[]",
      },
    ],
    name: "claimBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "claimer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_baycAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_maycAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_memePerApe",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_memePerMutantApe",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_memeToken",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_apeIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_mutantApeIds",
        type: "uint256[]",
      },
    ],
    name: "rewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
