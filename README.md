# Facebook Graph API Website

## Project Description

This website allows users to interact with the Facebook Graph API by providing their access token. Users can fetch and display their profile information, user posts, and user photos. The website features an Apple-inspired user interface design with a clean and modern look. The application uses 90% of the viewport width for optimal display and includes loading indicators to prevent double-clicking during API requests. The code is organized into separate modules for API logic, DOM manipulation, and utility functions to ensure maintainability and reusability.

## Base URL

The main API root URL for Facebook Graph API is:
https://graph.facebook.com/v24.0

## Endpoints

The website uses three main endpoints from the Facebook Graph API:

Endpoint 1: /me
This endpoint retrieves the authenticated user's profile information. It returns comprehensive user data including user ID, name, email address, location, hometown, age range, birthday, gender, and profile picture. The endpoint uses the fields parameter to specify which data fields should be returned in the response.

Endpoint 2: /me/posts
This endpoint retrieves posts created by the authenticated user. It returns an array of post objects containing post ID, message content, story content, and creation timestamp. The endpoint includes a limit parameter to control the number of posts returned per request.

Endpoint 3: /me/photos
This endpoint retrieves photos uploaded by the authenticated user. It returns an array of photo objects containing photo ID, creation timestamp, and image URLs in various sizes. The endpoint uses the images field to get different resolutions of each photo.

## Required Parameters

All endpoints require the access_token parameter as a query parameter. The access token must be a valid Facebook access token with appropriate permissions.

For the /me endpoint, the fields parameter is required to specify which user data fields to retrieve. The value used is id,name,email,location,age_range,gender,birthday,hometown,picture.

For the /me/posts endpoint, the fields parameter specifies which post data fields to retrieve. The value used is id,message,created_time,story. The limit parameter is optional and set to 10 to limit the number of posts returned.

For the /me/photos endpoint, the fields parameter specifies which photo data fields to retrieve. The value used is id,created_time,images. The limit parameter is optional and set to 12 to limit the number of photos returned.

## Authentication

The website uses Token-based authentication. Users must provide a Facebook access token to authenticate API requests. The access token is passed as a query parameter named access_token in each API request. The token must have the necessary permissions to read user profile data, user posts, and user photos. Tokens can be obtained from the Facebook Graph API Explorer or by creating a Facebook App and generating an access token with the required permissions.

## Sample JSON Response

Profile Endpoint Response:
{
  "id": "123456789",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "location": {
    "name": "Manila, Philippines"
  },
  "hometown": {
    "name": "Quezon City, Philippines"
  },
  "age_range": {
    "min": 25,
    "max": 34
  },
  "birthday": "01/15/1990",
  "gender": "male",
  "picture": {
    "data": {
      "url": "https://example.com/profile.jpg"
    }
  }
}

The fields displayed on the UI from this response are: id (shown as ID), name (shown as Name), email (shown as Email), location.name (shown as Location), hometown.name (shown as Hometown), age_range (shown as Age Range), birthday (shown as Birthday), gender (shown as Gender), and picture.data.url (shown as profile image).

Posts Endpoint Response:
{
  "data": [
    {
      "id": "post123",
      "message": "Sample post message",
      "story": "John Doe shared a post",
      "created_time": "2024-01-15T10:30:00+0000"
    }
  ]
}

The fields displayed on the UI from this response are: message or story (shown as post content) and created_time (shown as formatted date).

Photos Endpoint Response:
{
  "data": [
    {
      "id": "photo123",
      "created_time": "2024-01-15T10:30:00+0000",
      "images": [
        {
          "source": "https://example.com/photo.jpg"
        }
      ]
    }
  ]
}

The fields displayed on the UI from this response are: images[0].source (shown as photo image) and created_time (shown as formatted date).

## API Testing Using POSTMAN

Before implementing the JavaScript code, all endpoints were tested using Postman. The testing demonstrated proper authentication setup by including the access_token in the query parameters. Headers were set to accept JSON responses. Parameters including fields and limit were tested with various values. Successful responses returned status code 200 with valid JSON data. Error responses were tested including 401 Unauthorized for invalid tokens, 403 Forbidden for insufficient permissions, 404 Not Found for invalid endpoints, and 429 Too Many Requests for rate limiting. The Postman testing results will be shown in the demo video.

## Instructions to Run the Project

Step 1: Ensure you have a web server running. You can use XAMPP, WAMP, or any local development server. Place the project files in the htdocs directory if using XAMPP.

Step 2: Open the project folder in your web server directory. The main file is index.html located in the fb_graph folder.

Step 3: Open your web browser and navigate to the project URL. 

Step 4: Obtain a Facebook access token. You can get this from the Facebook Graph API Explorer at https://developers.facebook.com/tools/explorer or by creating a Facebook App and generating an access token with the required permissions including user_profile, user_posts, and user_photos.

Step 5: Paste your Facebook access token into the input field on the website. The token will be automatically trimmed of whitespace.

Step 6: Click the Fetch Profile button to retrieve and display your profile information, click the Fetch Posts button to retrieve and display your recent posts, or click the Fetch Photos button to retrieve and display your photos.

Step 7: The results will be displayed below the input section. If there are any errors, they will be shown in a red error message box with appropriate error messages for different error codes.

## Screenshots Included
<img width="1798" height="951" alt="image" src="https://github.com/user-attachments/assets/47b59d0e-89b8-4617-9f6e-e36f7875622a" />
<img width="1641" height="1001" alt="image" src="https://github.com/user-attachments/assets/c362083c-8ad8-4b30-815a-313ea7bb5c16" />
<img width="943" height="942" alt="image" src="https://github.com/user-attachments/assets/c21e9867-aa1f-4f78-a822-689c115af12f" />



## Members Listed & Roles

-API & Authentication Handler: Moises Urbano

-JavaScript Logic / Data Processing: Moises Urbano

-UI & CSS Designer: Tyron Aromin & Angelo Mandasig

-GitHub & Documentation Manager: John Alfred O. Ventura
