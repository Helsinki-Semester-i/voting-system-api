const axios = require('axios');

// Add okta information in requests
const addHeaders = (req, res, next) => {
  const oktaApiUrl = process.env.API_OKTA;
  const oktaToken = process.env.OKTA_TOKEN;

  req.oktaApi = oktaApiUrl;
  req.oktaHeaders = {
    ContentType: 'application/json',
    Accept: 'application/json',
    Authorization: `SSWS ${oktaToken}`,
  };
  next();
};

const createUser = async (req, res, next) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: `${req.oktaApi}/users`,
      data: req.body,
      params: req.query,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// List all panelists
const getPanelists = async (req, res, next) => {
  const panelistId = process.env.OKTA_PANELIST_GROUP;
  try {
    const { data } = await axios({
      method: 'get',
      url: `${req.oktaApi}/groups/${panelistId}/users`,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Get a sinlge user info
// /users/:login
const getUserByMail = async (req, res, next) => {
  try {
    const { data } = await axios({
      method: 'get',
      url: `${req.oktaApi}/users/${req.params.login}`,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// deactivate user
// user/:id
const deactivateUser = async (req, res, next) => {
  // First deactivate user
  try {
    await axios({
      method: 'post',
      url: `${req.oktaApi}/users/${req.params.userId}/lifecycle/deactivate`,
      headers: req.oktaHeaders,
    });
    next();
  } catch (err) {
    next(err);
  }
};
// delete user
// user/:id
const deleteUser = async (req, res, next) => {
  // Then remove it
  try {
    const { data } = await axios({
      method: 'delete',
      url: `${req.oktaApi}/users/${req.params.userId}`,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const errorHandler = (err, req, res, next) => { // eslint-disable-line
  if (err.response) {
    console.log('Response error data: ', err.response.data); // eslint-disable-line
    console.log('Error Status: ', err.response.status); // eslint-disable-line
    console.log('Error Header: ', err.response.headers); // eslint-disable-line
    res.status(err.response.status).json(err.response.data);
  } else if (err.request) {
    console.log('Request error ', err.request); // eslint-disable-line
    res.json(err.request);
  } else {
    console.log('Error', err.message); // eslint-disable-line
    res.json(err.message);
  }
  console.log('Error config: ', err.config); // eslint-disable-line
};

module.exports = {
  addHeaders, createUser, getPanelists, getUserByMail, deactivateUser, deleteUser, errorHandler,
};
