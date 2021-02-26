import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Image } from 'semantic-ui-react'
import mmImg from "../img/metamask.png";
import { Button, Modal, Divider } from 'semantic-ui-react'
import { Icon } from 'semantic-ui-react'
import Web3 from "web3"
import Eth from "web3-eth"
import "../App.css"

var web3 = null

class Poetry extends React.Component {

    state={
        title: "MetaMask",
        titleColor: "red",
        hasMM: false,
        open:false,
        btnPositive: true,
        btnText: "Connect MetaMask",
        btnDisabled: false,
        chainId:"",
        ethBal:"",
        accountNum:"",
        showAcctDetail:false, 

    }

    async componentDidMount(){
        this.props.setTitle(this.state.title, this.state.titleColor)
	    this.props.noMenu(false)
        if (typeof window.ethereum !== 'undefined') {
            this.setState({hasMM: true})
            // web3 = new Web3(Web3.givenProvider)
            // console.log(web3)
            // const acct = await web3.eth.getAccounts()
            // console.log(acct)
            // weenus adrs 0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA
            // const c = web3.eth.Contract(0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA)
            // console.log(c.address)
            return
            // if (window.ethereum.isConnected()){
            //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            //     const account = accounts[0];
            //     const fFive = account.slice(0,8)
            //     const lFive=account.slice(-5)
            //     const wAddress = `${fFive}...${lFive}`
            //     this.setState({btnText:wAddress})
            //     this.setState({btnPositive:false})
            //     this.setState({btnDisabled:true})
            // }
          }
     
    }
   async checkMMInstall(event){
        event.preventDefault()
        if(this.state.hasMM === false){
            this.setState({open: true})
        } else {
            await this.setState({showAcctDetail: true})
           const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
           const account = accounts[0];
           const fFive = account.slice(0,10)
           const lFive=account.slice(-8)
           const wAddress = `${fFive}...${lFive}`
           this.setState({btnText:wAddress})
          this.setState({btnPositive:false})
          this.setState({btnDisabled:true})
          this.setState({accountNum: wAddress})
          const chainId = await window.ethereum.request({method: 'eth_chainId'})
          const ethBal = await window.ethereum.request({method: 'eth_getBalance', 
                                                         params: [account, 'latest']})
            await this.setState({chainId: chainId})
            await this.setState({ethBal:ethBal})
        }
      
    }



    render(){
        return(
            <div>
                <Divider hidden />
                {/* image from "https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png" */}
                <Image src={mmImg} size='mini' circular />
                <Divider hidden />
                {
                    (this.state.showAcctDetail) &&
                    (<div className="act-detail">
                        <p className="chainID">Chain ID: {this.state.chainId}</p> 
                        <p className="chainID">ETH: {this.state.ethBal/1000000000000000000}</p> 
                        <p className='accoutNum'><Icon color="purple"name="selected radio" />{this.state.accountNum}</p>
                    </div>
                        
                     )
                }
                <Modal
      onClose={() => this.setState({open:false})}
      open={this.state.open}
      trigger={ (!this.state.btnDisabled) && (<Button positive={this.state.btnPositive} disabled={this.state.btnDisabled} onClick={this.checkMMInstall.bind(this)}>{this.state.btnText}</Button>)}
    >
 <Modal.Header>Error</Modal.Header>
      <Modal.Content>
    Your don't have MetaMask Extension Installed
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="OK"
          labelPosition='right'
          icon='checkmark'
          onClick={() => this.setState({open:false})}
          positive
        />
      </Modal.Actions>
    </Modal>
  
            </div>
        )
    }
}
export default Poetry;