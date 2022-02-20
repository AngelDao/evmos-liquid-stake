import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useState, useEffect, memo, useRef } from "react";
import { utils, BigNumber } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default memo(function ExampleUI({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newAmount, setNewAmount] = useState("0");
  const [isLoading, setLoading] = useState(false);
  const [stakedBalance, setStakedBalance] = useState(0);

  const getStakedBalance = async () => {
    if (readContracts.LiquidStaking){
      setTimeout(async ()=> {
        console.log("READ CONTRACTS, ", readContracts)
        const stEVMOS = await readContracts.LiquidStaking.balanceOf(address);
        const myBalance = utils.formatEther(stEVMOS);
        setStakedBalance(myBalance)
        console.log("MY stEVMOS Balance", myBalance, stEVMOS)
      })
    }
  }

  const stake = async () => {
    if (writeContracts.LiquidStaking
      && parseFloat(newAmount) > 0
      && !isLoading
      && parseFloat(newAmount) <= parseFloat(utils.formatEther(yourLocalBalance))
    ){
      setLoading(true)
      try { 
        const stakeResult = await writeContracts.LiquidStaking.submit({
          value: utils.parseEther(newAmount).toString(),
        });
        console.log("Stake Result", stakeResult)
      } catch(e){
        console.log(e)
      }

      setLoading(false)
    
    }
  }

  const inputRef = useRef();

  useEffect(()=> {
    getStakedBalance();
  }, [getStakedBalance])

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Stake EVMOS</h2>
        <h4>Receive StEVMOS</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Row>
            <Col flex="auto">
            <Input
              ref={inputRef}
              value={newAmount}
              onChange={e => {
                if (parseFloat(e.target.value) != NaN){
                  setNewAmount(e.target.value);
                }
              }}
            /></Col>
            <Col flex="60px"><Button
              style={{ marginLeft:4}}
              onClick={async () => {
                setNewAmount(utils.formatEther(yourLocalBalance))
              }}
            >
              Max
            </Button></Col>
          </Row>

          {isLoading ?
        <div style={{ marginTop: 32 }}>
           <Spin />
        </div>
            : <Button
            style={{ marginTop: 8 }}
            onClick={stake}
          >
            Stake
          </Button>}
        </div>
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>EVMOS Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
        <h2>StEVMOS Balance: {stakedBalance}</h2>
        <Divider />
        
      </div>
    </div>
  );
})
