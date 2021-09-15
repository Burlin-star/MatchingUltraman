import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
// import './style.css';
import UltramanToken from '../abis/UltramanToken.json'
import brain from '../guts.png'

const CARD_ARRAY = [
  {
    name:'fries',
    img:'/images/jiedun.png'
  },
  {
    name:'cheeseburger',
    img:'/images/jiedun.png'
  },
  {
    name:'ice-cream',
    img:'/images/jiedun.png'
  },
  {
    name:'pizza',
    img:'/images/jiedun.png'
  },
  {
    name:'milkshake',
    img:'/images/jiedun.png'
  },
  {
    name:'hotdog',
    img:'/images/jiedun.png'
  },
  {
    name:'fries',
    img:'/images/jiedun.png'
  },
  {
    name:'cheeseburger',
    img:'/images/jiedun.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.jpg'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.jpg'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.jpg'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.jpg'
  }
]



const ULTRAMAN_ARRAY = [
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  },
  {
    name:'sailuo1',
    img:'/ultraman/sailuo1.png'
  }
]



class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({cardArray : CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async randomUltraman(){
    var item = ULTRAMAN_ARRAY[Math.floor(Math.random()*ULTRAMAN_ARRAY.length)]
    return item
  }

  async loadWeb3() {
    // console.log("web3")
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider try connect Metamask!')
    }
  }

  async loadBlockchainData(){
    // console.log("loadBlockchainData")
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Load smart contract
    const networkId = await web3.eth.net.getId()
    // console.log("newworkid:" + newworkId)
    // console.log("networks:" + UltramanToken.networks)
    const networkData = UltramanToken.networks[networkId]
    if(networkData){
      const abi = UltramanToken.abi
      const address = networkData.address 
      const token = new web3.eth.Contract(abi, address)
      this.setState({ token: token })
      const totalSupply = await token.methods.totalSupply().call()
      this.setState({ totalSupply})
      // load Tokens
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      for(let i = 0;i < balanceOf;i ++){
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0],i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs:[...this.state.tokenURIs, tokenURI]
        })
      }
    }else{
      alert('Smart contract not deployed to detected network.')
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    // if(this.state.cardsWon.includes(cardId)){
    //     return window.location.origin + '/images/white.png'
    // }else 
    console.log("cardsChosenId length:" + this.state.cardsChosenId.length)
    if(this.state.cardsChosenId.includes(cardId)){
      return CARD_ARRAY[cardId].img
    }else{
      return window.location.origin + '/images/blankb.jpg'
    }
    // return CARD_ARRAY[cardId].img
  }

  flipCard = async(cardId) => {
    let alreadyChosen = this.state.cardsChosenId.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if(alreadyChosen === 1){
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async() => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    console.log("optionOneId:" + optionOneId)
    console.log("card0:" + this.state.cardsChosen[0])

    console.log("optionOneId:" + optionTwoId)
    console.log("card1:" + this.state.cardsChosen[1])
    if(optionOneId == optionTwoId){
      alert('You have clicked the same image!')
    }else if(this.state.cardsChosen[0] === this.state.cardsChosen[1] && this.state.cardsChosen[0] == 'sailuo1'){
      alert('You found a match')
      this.state.token.methods.mint(
        this.state.account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      ).send({ from: this.state.account})
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
          tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
        })
      })
      this.setState({
        cardsWon:[...this.state.cardsWon, optionOneId, optionTwoId]
      })
    }else{
      alert('Sorry, try again!')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    // if(this.state.cardsWon.length === CARD_ARRAY.length){
    //   alert('Congratulations! You found them all!')
    // }
    this.setState({cardArray : CARD_ARRAY.sort(() => 0.5 - Math.random()) })
    console.log("cardsChosenId length:" + this.state.cardsChosenId.length)
  }
  

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon:[]
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Ultraman Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <div class="content">
                <h1>
                  <span class="capital">M</span>
                  <span>a</span>
                  <span>t</span>
                  <span>c</span>
                  <span>h</span>
                  <span class="capital">U</span>
                  <span>l</span>
                  <span>t</span>
                  <span>r</span>
                  <span>a</span>
                  <span>m</span>
                  <span>a</span>
                  <span>n</span>
                </h1>
                <h2>
                  <span class="capital">S</span>
                  <span>t</span>
                  <span>a</span>
                  <span>r</span>
                  <span>t</span>
                  <span class="capital">n</span>
                  <span>o</span>
                  <span>w</span>
                </h2>
              </div>

                <div className="grid mb-4" >

                { this.state.cardArray.map((card, key) => {
                      return(
                        <img 
                          key = {key}
                          src = {this.chooseImage(key)}
                          data-id = {key}
                          onClick = {(event) => {
                            let cardId = event.target.getAttribute('data-id')
                            this.flipCard(cardId)
                            // if(!this.state.cardsWon.includes(cardId.toString())){
                            //   this.flipCard(cardId)
                            // }
                          }}
                        />
                      )
                    })}
                  {/* Code goes here... */}

                </div>

                <div>

                  <h5>Token Collected:<span id="result">&nbsp;{this.state.tokenURIs.length}</span></h5>
                  {/* Code goes here... */}

                  {/* <div className="grid mb-4" > */}
                  <div>

                      { this.state.tokenURIs.map((tokenURI, key) => {
                        return (
                          <img
                            key = {key}
                            src = {tokenURI}
                          />
                        )
                      })}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
