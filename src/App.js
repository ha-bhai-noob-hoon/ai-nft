import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [name , setName] = useState('');
  const [description , setDescription] = useState('');
  const [image, setImage] = useState(null);
  


  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    console.log('submitting...' , name , description)
    const imageData = createImage()
  
  }

  const createImage = async(e) => {
    console.log('creating image...');
    const URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"


    const response = await axios({
      url:URL ,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'applicatoin/json'
      },
      data : JSON.stringify({
        inputs: description, options: { wait_for_model : true },
      }),      
      responseType: 'arraybuffer',
    })

    const type = response.headers['Content-Type']
    const data = response.data

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,` + base64data
    setImage(img)

    return data;
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
        <div className='form'>
          <form onSubmit={submitHandler}>
            <input type="text"  placeholder='Create a name... ' onChange={(e) => {setName(e.target.value)}}/>
            <input type="text" placeholder='Create a description...' onChange={(e) => {setDescription(e.target.value)}}/>
            <input type="submit" value='Create & Mint'/>
          </form>

          <div className='image'>
            <img src={image} alt="AI generated image" />
          </div>

        </div>

        <p>View &nbsp; <a href="">Metadata</a></p>

    </div>

    
  );
}

export default App;
