import React, { useState, useEffect, useCallback } from "react";
import { useWeb3Network } from "@openzeppelin/network";

const PROVIDER_URL = "http://127.0.0.1:8545";

function App() {
  // get GSN web3
  const context = useWeb3Network(PROVIDER_URL, {
    gsn: { dev: false }
  });

  const { accounts, lib } = context;

  // load Counter json artifact
  const proxyJSON = require("./build/contracts/Proxy.json");

  // load Counter Instance
  const [counterInstance, setCounterInstance] = useState(undefined);

  let deployedNetwork = undefined;
  if (!counterInstance && context && context.networkId) {
    const deployedNetwork = proxyJSON.networks[context.networkId.toString()];
    const instance = new context.lib.eth.Contract(
      proxyJSON.abi,
      deployedNetwork.address
    );
    setCounterInstance(instance);
  }

  const [count, setCount] = useState(0);

  const getCount = useCallback(async () => {
    if (counterInstance) {
      // Get the value from the contract to prove it worked.
      const response = await counterInstance.methods.value().call();
      // Update state with the result.
      setCount(response);
    }
  }, [counterInstance]);

  useEffect(() => {
    getCount();
  }, [counterInstance, getCount]);

  const { methods } = counterInstance || {};

  const increase = async () => {
    await counterInstance.methods.increase().send({ from: accounts[0] });
    getCount();
  };

  const decrease = async () => {
    await counterInstance.methods.decrease().send({ from: accounts[0] });
    getCount();
  };

  return (
    <div>
      <h3> Counter counterInstance </h3>
      {lib && !counterInstance && (
        <React.Fragment>
          <div>Contract Instance or network not loaded.</div>
        </React.Fragment>
      )}
      {lib && counterInstance && (
        <React.Fragment>
          <div>
            <div>Counter Value:</div>
            <div>{count}</div>
          </div>
          <div>Counter Actions</div>
          <div>
            <button onClick={() => increase(1)} size="small">
              Increase Counter by 1
            </button>
            <button
              onClick={() => decrease(1)}
              disabled={!(methods && methods.decrease)}
              size="small"
            >
              Decrease Counter by 1
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
