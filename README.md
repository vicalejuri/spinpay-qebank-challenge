# Spinpay challenge Box

[![Netlify Status](https://api.netlify.com/api/v1/badges/9ec664d8-86cb-456a-aca4-6f5f029ca720/deploy-status)](https://app.netlify.com/sites/hungry-davinci-ab2eb4/deploys)

The {name} is next-gen atm client for {bank} client, that allows
clients to manage their money.

It has the features:
"account balance", "deposit", "withdraw" and "statement"

The application is a standalone web app built with React,
communicating with {bank service} REST api.

##

The architecture follows a SPA architecture, that requires javascript
enabled on the client-devices, for the client routing and react runtime.

BOX follows SOLID convention, and is divided in two "processes",
the `render`, that do the rendering and input handling()
and the `store`, that talks to the bank services and store the session state.

The browser emit actions to the store, that forward to the appropriate service and change the global app state, that causes another render, and so on.
