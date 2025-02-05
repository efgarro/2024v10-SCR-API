import CognitoExpress from "cognito-express";


//Initializing CognitoExpress constructor
export const cognitoExpress = new CognitoExpress({
  region: "us-east-1",
  cognitoUserPoolId: "us-east-1_Sb6WG6oQB",
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000, //Up to default expiration of 1 hour (3600000 ms)
});