const axios = require('axios');

// Add okta information in requests
const addHeaders = (req, res, next) => {
    let oktaApiUrl = process.env.API_OKTA;
    let oktaToken = process.env.OKTA_TOKEN;
  
    req.oktaApi = oktaApiUrl;
    req.oktaHeaders = {
      ContentType: 'application/json',
      Accept: 'application/json',
      Authorization: 'SSWS ' + oktaToken,
    };
    next();
}

const createUser = async (req, res, next) => {
    try {
      const { data } = await axios ({
        method: 'post',
        url: req.oktaApi + '/users',
        data: req.body,
        params: req.query,
        headers: req.oktaHeaders,
      });
      res.json(data);
    } catch (err) {
      next(err)
    }
}

// List all panelists
const getPanelists = async (req, res, next) => {
    let panelistId = process.env.OKTA_PANELIST_GROUP;
    try {
      const { data } = await axios ({
        method: 'get',
        url: req.oktaApi + '/groups/' + panelistId + '/users',
        headers: req.oktaHeaders,
      });
      res.json(data);
      next();
    } catch (err) {
      next(err);
    }
}

// Get a sinlge user info
///users/:login
const getUserByMail = async (req, res, next) => {
  try {
    const { data } = await axios ({
      method: 'get',
      url: req.oktaApi + '/users/' + req.params.login,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

//deactivate user
//user/:id
const deactivateUser = async (req, res, next) => {
  // First deactivate user
  try {
    const { data } = await axios ({
      method: 'post',
      url: req.oktaApi + '/users/' + req.params.userId + '/lifecycle/deactivate',
      headers: req.oktaHeaders,
    });
    next();
  } catch (err) {
    next(err);
  }
}
//delete user
//user/:id
const deleteUser = async (req, res, next) => {
  // Then remove it
  try {
    const { data } = await axios ({
      method: 'delete',
      url: req.oktaApi + '/users/' + req.params.userId,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
    addHeaders, createUser, getPanelists, getUserByMail, deactivateUser, deleteUser
}