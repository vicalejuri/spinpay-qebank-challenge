# Spinpay challenge Box

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

The browser emit actions to the store, that forward to the appropriate handler,
that change the global app state, that causes another render.
