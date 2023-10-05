# Node.js Chat Application - Setup Guide

**This guide provides instructions on setting up the Node.js chat application for the CA4 assessment using Codio. Please follow these steps to get started:**

## Step 1: Log into Codio
Log into codio via myAberdeen.
## Step 2: Navigate into the folder
Navigate into the "CA4" directory using the following commands:

        cd CA4
## Step 3: Initialize a Node.js Project
Run the following command to initialize an empty Node.js project:

    npm init -y
## Step 4: Install Required Packages
Install the necessary Node.js packages/modules for the chat application using the following commands (one at a time):

    npm install express
    npm install socket.io
These commands install Express and Socket.io, which are required for the chat application.
## Step 5: Test the Application
In the terminal, run the following command to start the application:

    node index.js
Find the domain name for your Codio box as shown in the Codio interface.

Open a new browser tab, paste the Codio domain URL, and change the port number from -3000 to -8080 (e.g., http://your-codio-domain:8080). This will take you to the index page of the chat application.

Open another browser tab with the same URL and access the chat link to test the chat functionality. Try sending messages between the tabs to ensure they are displayed in both windows.
## Step 6: Stop the Node.js Server
To stop the Node.js server, return to the terminal and press [control] + [c].

Remember to stop and restart the server when making changes to view updates.
