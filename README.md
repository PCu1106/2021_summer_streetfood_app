# 2021_summer_streetfood_app
Web application to find information of restaurant using photos of shops taken by smartphones . Datasets(pictures of shops) are collected from the street near NCKU. Train a machine learning model by the feature points of photos. Users can build their account using this app to record their favorite restaurants.

## Development Environment
Pug+Sass+JavaScript

PWA

Python

SQLite3

node.js
## Abstract
The biggest feature of this app is that the operation steps are very streamlined. You can search for the store in the photo with one click. You don’t need to input to find it. It is not only fast and convenient, but also very friendly to people who are not good at using mobile phones.
In addition, the app can identify multiple stores in the photo. Our machine learning model uses the SIFT algorithm to capture the features of the training and test data, and then the two features are used as a FLANN match. The training data set is added to the mobile phone in addition to the image data. The assistance of GPS and azimuth makes the prediction results more accurate.
In the store list, we list the basic information of the store, such as store name, phone number, rating, etc. In addition, additional functions have been added. Users can directly make calls and link to the store website without opening other applications. And press the save button to add the store to favorites to meet the user's personal needs.
In the backend, we use a database system to manage user information. From registration, login, access to user history, favorites list, data is stored through the database, even if you can see your own on different devices History and preference record.
In terms of architecture, we use pug, sass, JavaScript to write the front-end interface, run the server-side code on Node.js, use the Python shell to communicate the front-end and back-end, and set up the SQLite3 database management system and machine learning model on the back-end. Finally, using the new app architecture of PWA, its cross-platform, no need to install and other advantages can make the app use more smoothly, and then bring a better user experience.
## Flow chart
<img src=./demo/1.png width=80% />

## System design
1. Machine Learning
  Use Sift to get the feature points of picture, then use Matching algorithm to match the shop.

<img src=./demo/2.png width=80% />

2. Structure
  client: PWA
  Server: Use Python shell to call back-end function. Use SQLite3 to manage database. So that shop             recognizing can be executed
  
<img src=./demo/3.png width=80% />

3. Process

<img src=./demo/4.png width=80% />

## UI

<img src=./demo/5.png width=80% />
<img src=./demo/6.png width=80% />
<img src=./demo/7.png width=80% />
<img src=./demo/8.png width=80% />
<img src=./demo/9.png width=80% />
<img src=./demo/10.png width=80% />
<img src=./demo/11.png width=80% />
<img src=./demo/12.png width=80% />
