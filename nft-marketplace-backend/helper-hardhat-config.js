const networkConfig = {
    11155111: {
        name: "sepolia",

        //chainlink Oracle Variables
        chainlinkTokenAddress : "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        chainlinkOracleAddress: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        jobId : "0xca98366cc7314957b8c012c72f05aeeb00000000000000000000000000000000",
    },
    5: {
        name: "goerli",
    },
    137: {
        name: "polygon",
    },
    // local development chains
    1337: {
        name: "ganache",
    },
    31337: {
        name: "localhost",
        //chainlink Oracle Variables
        chainlinkTokenAddress : "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        chainlinkOracleAddress: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        jobId : "ca98366cc7314957b8c012c72f05aeeb",
    },
};

const DEVELOPMENT_CHAINS = ["hardhat", "localhost", "ganache"];

module.exports = { networkConfig, DEVELOPMENT_CHAINS };
