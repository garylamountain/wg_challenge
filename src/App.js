import React, { Component } from 'react';

const SUBSCRIPTION_KEY = process.env.REACT_APP_SUBSCRIPTION_KEY;
const AZURE_URL = "https://wg.cognitiveservices.azure.com/vision/v2.1/analyze?visualFeatures=Tags&details=&language=en";
const CLOUDINARY_UPLOAD_URL='https://api.cloudinary.com/v1_1/dkojyntls/upload';
const CLOUDINARY_UPLOAD_PRESET = 'uxuhpkao';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: '',
      scanned: false,
      person: false,
      confidence: ''
    };
  }
  
  //called when user initially selects an image to upload
  handleFileSelect = event => {
    //store file to the state and render it on the screen
    this.setState({
      file: event.target.files[0],
      scanned: false,
      person: false,
      confidence: ''
    })

  }

  //called when user "scans" the image
  handleScan = () => {

    //we'll be persisting uploaded images on a cloudinary space,
    //this creates the body of the post request that'll send it there
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    //post request to send the image to cloudinary
    fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      //if the post is successful, cloudinary will provide a URL
      //which we can send to Computer Vision to be analyzed
      if (data.secure_url !== '') {

        //post request to send the image to Computer Vision
        fetch(AZURE_URL, {
          method: 'POST',
          body: JSON.stringify({"url": data.secure_url}),
          headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key' : SUBSCRIPTION_KEY
          }
        })
        .then(res => res.json())
        .then(data => {
          //search the tags array of the response, look for an object called
          //"person" which denotes that Computer Vision found a person in the image
          let result = data["tags"].find(({name}) => name === "person");
          //if "person" is found, store info about that finding in our state
          if(result){
            let confidenceNum = result.confidence * 100;
            this.setState({scanned: true, person: true, confidence: confidenceNum.toFixed(2)})
          //if "person" isn't found, we still need to update part of the state that
          //will show the results of this analysis
          } else {
            this.setState({scanned: true});
          }
        })
        .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <input type="file" className="fileUpload" onChange={this.handleFileSelect}/>
        <div className="item">
          {/* if the user has selected an image, render it as well as the scan button */}
          {this.state.file ? 
            <div>
              <img className="selectedImg" src={URL.createObjectURL(this.state.file)} alt=""/>
              <button className="scanBtn" onClick={this.handleScan}>Scan</button> 
            </div>
            : 
            null 
          }
          {/* if a image has been "scanned", display the results obtained from the analysis*/}
          {this.state.scanned ? 
            // if a person was found, display the success message, otherwise display the failure message
            (this.state.person ? 
              <h3 className="result">There's a person here! I'm {this.state.confidence}% confident!</h3> 
              :
              <h3 className="result">Sorry, I don't think there's a person here.</h3>
            ) 
            : 
            null 
          }
        </div>
      </div>
    );
  }

}

export default App;