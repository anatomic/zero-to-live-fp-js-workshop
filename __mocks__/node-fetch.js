const fetch = jest.genMockFromModule('node-fetch');

let _response = {
  status: 200,
  json: jest.fn(() => Promise.resolve(true)),
};

fetch.mockImplementation((url, options) => Promise.resolve(_response));

/**
 *
 * @param status {number}
 * @param payload {Promise<any>}
 * @param fail {boolean}
 * @return {{status: number, json: *}}
 */
const setResponse = ({
  status = 200,
  payload = Promise.resolve(true),
  fail = false,
} = {}) => {
  fetch.mockReset();
  _response.status = status;
  _response.json.mockClear();
  _response.json.mockImplementation(() => payload);
  fetch.mockImplementation(
    (url, options) =>
      fail ? Promise.reject(_response) : Promise.resolve(_response)
  );
  return _response;
};

fetch.setResponse = setResponse;
fetch.response = _response;

module.exports = fetch;
