# Person Analysis App

An app to upload and analyze images with Microsoft Azure's Computer Vision and confirm whether or not there is a person in the image!

## Setup & Run

After cloning the project, you should be able to simply run ```npm start``` and the app will run on http://localhost:3000/.

## Navigation

Simply click "Choose File" and select an image from your local machine. You should see your image and a new "Scan" button rendered. Clicking this will send the image to Computer Vision to be scanned, and after a second your results will be displayed. In the case that a person is found, you'll receive a success message as well as the esimated confidence (all provided by Computer Vision).
![Success](https://i.imgur.com/VZL8R1Q.png)
If a person is not found in the analysis, you'll receive a failure message.
![Failure](https://i.imgur.com/qs1l5UZ.png)
Feel free to upload more images after your analysis. Thanks for checking this out!
