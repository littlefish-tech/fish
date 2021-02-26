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



class Invest extends React.Component {
    state={
        title: "Invest",
        titleColor: "red",
        open:false,
        pairValue: 0,
        pairAddress: "",
        firstInvest: "",
        firstInvestVal:"",
        secondInvestVal: "",
        secondInvest:"",
        showInvest: false,
        hideMessage: true,
        hasMM: true,
        isTimes: true,
        notshowInvestMsg: true,
        ethBal: '',
        enoughBal : true,
        inputError: false
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
            this.setState({showInvest:true})
            if(this.state.pairValue === 1 || this.state.pairAddress === "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" ){
               this.setState({firstInvest: "ETH"})
               this.setState({secondInvest: "DAI"})
           }
           if(this.state.pairValue === 2 || this.state.pairAddress === "0xd3d2e2692501a5c9ca623199d38826e513033a17"){
               this.setState({firstInvest: "UNI"})
               this.setState({secondInvest: "ETH"})
           }
           if(this.state.pairValue === 3 || this.state.pairAddress === "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e"){
               this.setState({firstInvest: "WISE"})
               this.setState({secondInvest: "ETH"})
           }
        }
     
    }
    async handleChangeSwapVal(event){
       await this.setState({firstInvestVal:event.target.value})
       if (this.state.isTimes === true){
        await this.setState({secondInvestVal:this.state.firstInvestVal*5})
       }else {
        await this.setState({secondInvestVal:this.state.firstInvestVal/5})
       }
       

    }

    async onClickInvest(event){
        if (typeof window.ethereum !== 'undefined') {
           this.setState({hasMM:true})
           this.setState({notshowInvestMsg: false})
           const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
           const account = accounts[0];
           const chainId = await window.ethereum.request({method: 'eth_chainId'})
           const ethBal = await window.ethereum.request({method: 'eth_getBalance', 
                                                         params: [account, 'latest']})
            if(this.state.firstInvestVal === "" || typeof(parseFloat(this.state.firstInvestVal)) !== "number" || parseFloat(this.state.firstInvestVal) === 0){
                this.setState({inputError: true})
                this.setState({notshowInvestMsg:true})
                }else {
                    if(this.state.firstInvest !== "ETH"){
                        if(parseInt(this.state.secondInvestVal) > (this.state.ethBal/2000000000000000000)){
                            // await this.setState({notshowInvestMsg:true})
                            await this.setState({enoughBal:false})
                   
                    
                        }else{
                            this.setState({enoughBal:true})
                        }
                    } else if(this.state.firstInvest === "ETH"){
                        if(parseInt(this.state.firstInvestVal) > (this.state.ethBal/2000000000000000000)){
                            // await this.setState({notshowInvestMsg:true})
                            await this.setState({enoughBal:false})
                          
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
           
  
    }
    else{
        this.setState({hasMM:false})

    }
    }

    render(){
        // const { value } = this.state
       if(!this.state.showInvest){
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
                   <p> <Input placeholder='0.00' value={this.state.firstInvestVal} onChange={this.handleChangeSwapVal.bind(this)}/> <span className="swap-tag">{this.state.firstInvest}</span></p>
                   <Icon name="plus" color="red" flipped/>
          <p><Input disabled placeholder='0.00' value={this.state.secondInvestVal}/> <span className="swap-tag">{this.state.secondInvest}</span></p>
          <Button  color="blue" onClick={e=>this.setState({showInvest:false})}>Cancel</Button>
          <Button  color="pink" onClick={this.onClickInvest.bind(this)}>Invest</Button>
          <Message hidden={this.state.hasMM} negative onDismiss={e=>this.setState({hasMM:true})}>
    Please install Meta Mask Extension First
  </Message>
  <Message hidden={this.state.enoughBal} negative onDismiss={e=>this.setState({enoughBal:true})}>
    Not enough balance
  </Message>
  <Message hidden={!this.state.inputError} negative onDismiss={e=>this.setState({inputError:false})}>
    Input Error
  </Message>
  <Message hidden={this.state.notshowInvestMsg} onDismiss={e=>this.setState({notshowInvestMsg:true})}>
      <Message.Header>Prices and pool share</Message.Header>
      <div className="invest-detail">
          <div>
          <p>
        {parseFloat(this.state.firstInvestVal/this.state.secondInvestVal).toFixed(4)}
        </p>
        <p>
        {this.state.secondInvest} per {this.state.firstInvest}
        </p>
          </div>
          <div>
          <p>
          {parseFloat(this.state.secondInvestVal/this.state.firstInvestVal).toFixed(4)}
        </p>
        <p>
        {this.state.firstInvest} per {this.state.secondInvest}
        </p>
          </div>
          <div>
          <p>
        1.5%
        </p>
        <p>
        Share of Pool
        </p>
          </div>
      </div>
      
    </Message>
  
          </div>
          
           )
       }

    }
}

export default Invest;