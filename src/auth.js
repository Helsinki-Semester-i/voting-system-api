const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.ISSUER,
  clientId: process.env.CLIENT_ID,
});

// verify JWT token middleware
// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'));
  }
  const parts = req.headers.authorization.trim().split(' ');
  const accessToken = parts.pop();
  oktaJwtVerifier.verifyAccessToken(accessToken)
    // eslint-disable-next-line consistent-return
    .then((jwt) => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub,
      };
      if (!jwt.claims.scp.includes(process.env.SCOPE)) {
        return next(new Error('Could not verify the proper scope'));
      }
      next();
    })
    .catch(next);
};
