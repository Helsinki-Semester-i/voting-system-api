const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INT_SERV_ERR: 500,
  FORBIDDEN: 403,
};

const MSG = {
  INT_SERV_ERR: 'Error conecting to DB',
};

module.exports = {
  STATUS,
  MSG,
};
