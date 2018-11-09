const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.ISSUER,
  clientId: process.env.CLIENT_ID
});

// verify JWT token middleware
module.exports = async (req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'));
  }
  let parts = req.headers.authorization.trim().split(' ');
  let accessToken = parts.pop();
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub,
      }
      if (!jwt.claims.scp.includes(process.env.SCOPE)) {
        return next(new Error('Could not verify the proper scope'));
      }
      next();
    })
    .catch(next);
}