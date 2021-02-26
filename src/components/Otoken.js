import { toHexStringOfMinLength } from "pdf-lib"
import React from "react"
import { Dropdown, Input  } from 'semantic-ui-react'
import { Divider } from 'semantic-ui-react'
import { Button, Modal, Message } from 'semantic-ui-react'
import { Icon } from 'semantic-ui-react'
import "../App.css"



const options = [
    { key: 1, text: 'ETH <——> DAI', value: 1 },
    { key: 2, text: 'UNI <——> ETH', value: 2 },
    { key: 3, text: 'WISE <——> ETH', value: 3 },
  ]



class Otoken extends React.Component {
    state={
        title: "Swap",
        titleColor: "red",
        open:false,
        pairValue: 0,
        pairAddress: "",
        firstSwap: "",
        firstSwapVal:"",
        secondSwapVal: "",
        secondSwap:"",
        showSwap: false,
        hideMessage: true,
        hasMM: true,
        isTimes: true,
        ethBal: '',
        enoughBal : true
    }
    async componentDidMount(){
        this.props.setTitle(this.state.title, this.state.titleColor)
	    this.props.noMenu(false)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const ethBal = await window.ethereum.request({method: 'eth_getBalance', 
                                                         params: [account, 'latest']})
        this.setState({ethBal:ethBal})
    }
    async handleChangeSelect(event, {value}){
        await this.setState({pairValue: value})
        if (this.state.pairValue === 1){
             this.setState({pairAddress: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"})
        } else if(this.state.pairValue === 2){
             this.setState({pairAddress: "0xd3d2e2692501a5c9ca623199d38826e513033a17"})
        } else if (this.state.pairValue === 3){
             this.setState({pairAddress: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e"})
        }
    }

    async handleChangeEnterAdd(event){
       await this.setState({pairAddress: event.target.value})
        if(this.state.pairAddress === "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"){
            this.setState({pairValue: 1})
        } else if(this.state.pairAddress === "0xd3d2e2692501a5c9ca623199d38826e513033a17"){
            this.setState({pairValue: 2})
        } else if(this.state.pairAddress === "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e"){
            this.setState({pairValue: 3})
        }
    }

     onHandleClick(event){
        event.preventDefault()
        if (
            this.state.pairValue !== 1 && 
            this.state.pairValue !== 2 && 
            this.state.pairValue !== 3 && 
            this.state.pairAddress !== "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" && 
            this.state.pairAddress !== "0xd3d2e2692501a5c9ca623199d38826e513033a17" && 
            this.state.pairAddress !== "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e"
            ){
            this.setState({hideMessage:false})
        }else {
            this.setState({hideMessage:true})
            this.setState({showSwap:true})
            if(this.state.pairValue === 1 || this.state.pairAddress === "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" ){
               this.setState({firstSwap: "ETH"})
               this.setState({secondSwap: "DAI"})
           }
           if(this.state.pairValue === 2 || this.state.pairAddress === "0xd3d2e2692501a5c9ca623199d38826e513033a17"){
               this.setState({firstSwap: "UNI"})
               this.setState({secondSwap: "ETH"})
           }
           if(this.state.pairValue === 3 || this.state.pairAddress === "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e"){
               this.setState({firstSwap: "WISE"})
               this.setState({secondSwap: "ETH"})
           }
        }
     
    }
    async handleChangeSwapVal(event){
       await this.setState({firstSwapVal:event.target.value})
       if (this.state.isTimes === true){
        await this.setState({secondSwapVal:this.state.firstSwapVal*10})
       }else {
        await this.setState({secondSwapVal:this.state.firstSwapVal/10})
       }
       

    }

    async onClickSwap(event){
        if (typeof window.ethereum !== 'undefined') {
           this.setState({hasMM:true})
           const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
           const account = accounts[0];
           const chainId = await window.ethereum.request({method: 'eth_chainId'})
           const ethBal = await window.ethereum.request({method: 'eth_getBalance', 
                                                         params: [account, 'latest']})
            if(this.state.firstSwap !== "ETH"){
                if(parseInt(this.state.secondSwapVal) > (this.state.ethBal/1000000000000000000)){
            this.setState({enoughBal:false})
                }else{
                    this.setState({enoughBal:true})
                }
            } else if(this.state.firstSwap === "ETH"){
                if(parseInt(this.state.firstSwapVal) > (this.state.ethBal/1000000000000000000)){
                    this.setState({enoughBal:false})
                        } else{
                            this.setState({enoughBal:true})
                        }
            } 
            if(this.state.enoughBal){
                const transactionParameters = {
                    nonce: '0x00', // ignored by MetaMask
                    // gasPrice: '0x10000', // customizable by user during MetaMask confirmation.
                    // gas: '0x100000', // customizable by user during MetaMask confirmation.
                    to: "0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA", // Required except during contract publications.
                    from: account, // must match user's active address.
                    value: "10000000000", // Only required to send ether to the recipient from the initiating external account.
                    data:
                      '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
                    chainId: chainId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
                  };
                  
                  // txHash is a hex string
                  // As with any RPC call, it may throw an error
                  const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                  });
            }
    }
    else{
        this.setState({hasMM:false})

    }
    }
    handleSwithIcon(){
        this.setState({isTimes: !this.state.isTimes})
        let fToken = this.state.firstSwap;
        let fTokenVal = this.state.firstSwapVal;
        this.setState({firstSwap: this.state.secondSwap})
        this.setState({secondSwap: fToken})
        this.setState({firstSwapVal: this.state.secondSwapVal})
        this.setState({secondSwapVal: fTokenVal})
    }


    render(){
        // const { value } = this.state
       if(!this.state.showSwap){
           return(
               <div><p>Please select a pair</p>
               <Dropdown
               fluid
               clearable
                   search
                   selection
                   wrapSelection={false}
                   options={options}
                   placeholder='Select a pair'
                   value={this.state.pairValue}
                   onChange={this.handleChangeSelect.bind(this)}
                 />
                 <Divider hidden/>
                 <p>Or enter the Pair Address: <Input fluid placeholder='Search...' type="text" value={this.state.pairAddress} onChange={this.handleChangeEnterAdd.bind(this)}/></p>
                 <Button onClick={this.onHandleClick.bind(this)} fluid color="pink">Next</Button>
                 <Message hidden={this.state.hideMessage} negative onDismiss={e=>this.setState({hideMessage:true})}>
    Please Enter a valid contract address
  </Message>
                 </div>
           )
       } else {
           return (
               <div>
                   <p> <Input placeholder='0.00' value={this.state.firstSwapVal} onChange={this.handleChangeSwapVal.bind(this)}/> <span className="swap-tag">{this.state.firstSwap}</span></p>
                   <Icon name="sync" color="teal" onClick={this.handleSwithIcon.bind(this)} flipped/>
          <p><Input disabled placeholder='0.00' value={this.state.secondSwapVal}/> <span className="swap-tag">{this.state.secondSwap}</span></p>
          <Button  color="blue" onClick={e=>this.setState({showSwap:false})}>Cancel</Button>
          <Button  color="pink" onClick={this.onClickSwap.bind(this)}>Swap</Button>
          <Message hidden={this.state.hasMM} negative onDismiss={e=>this.setState({hasMM:true})}>
    Please install Meta Mask Extension First
  </Message>
  <Message hidden={this.state.enoughBal} negative onDismiss={e=>this.setState({enoughBal:true})}>
    Not enough balance
  </Message>
          </div>
          
           )
       }

    }
}

export default Otoken;
