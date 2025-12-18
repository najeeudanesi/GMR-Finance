import toast from "react-hot-toast";
import { logout } from "./auth";

const paths = {
  login: "login-path",
};

async function fetchBackend(endpoint, method, auth, body, params) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const fetchObject = { method, headers };
  const path = paths[endpoint] || endpoint;
  // let url = `${process.env.REACT_APP_BACKEND_URL}${path}`;
  // let url = `https://edogoverp.com/healthfinanceapi/api${path}`;
  let url = `https://api.greenzonetechnologies.com.ng/pharmacyapi/api${path}`;

  if (body) {
    fetchObject.body = JSON.stringify(body);
  }

  if (params) {
    const paramsArray = Object.keys(params).map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );

    url += `?${paramsArray.join("&")}`;
  }

  if (auth) {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers.Authorization = `${token}`;
    }
  }

  try {
    const response = await fetch(url, fetchObject);

    if (!response.ok) {
      // Try to parse error JSON, fallback to statusText if parsing fails
      let errorResponseData;
      try {
        errorResponseData = await response.json();
      } catch {
        errorResponseData = { message: response.statusText };
      }
      const errorText =
        (errorResponseData.errorData && errorResponseData.errorData[0]) ||
        errorResponseData.message ||
        response.statusText ||
        "Unknown Error";

      const customError = new Error(errorText);
      customError.response = response;
      customError.serverErrorData = errorResponseData;

      throw customError;
    }

    return response.json();
  } catch (error) {
    // Show specific validation error if present (but not for GET requests)
    if (
      error.serverErrorData &&
      error.serverErrorData.errorData &&
      Array.isArray(error.serverErrorData.errorData) &&
      error.serverErrorData.errorData.length > 0
    ) {
      if (method !== "GET") {
        toast.error(error.serverErrorData.errorData[0]);
      }
      console.error(
        "API Validation Error:",
        error.serverErrorData.errorData[0]
      );
    } else if (error.serverErrorData && error.serverErrorData.message) {
      if (method !== "GET") {
        toast.error(error.serverErrorData.message);
      }
      console.error("General Server Message:", error.serverErrorData.message);
    } else if (error.response) {
      if (method !== "GET") {
        toast.error(
          `Server Error: ${error.response.status} ${error.response.statusText}`
        );
      }
      console.error(
        "Non-JSON error response from server:",
        error.response.status,
        error.response.statusText
      );
    } else if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      if (method !== "GET") {
        toast.error("Network error: Could not connect to the server.");
      }
      console.error("Network or CORS error: Unable to connect to backend.");
    } else {
      if (method !== "GET") {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("An unexpected error occurred:", error.message);
    }
    // Optionally, rethrow or return a structured error object
    // throw error;
  }

  // return fetch(url, fetchObject)
  //   .then(checkHttpStatus)
  //   .then(parseJSON);
}

export const get = (endpoint, params, auth = true) =>
  fetchBackend(endpoint, "GET", auth, null, params);

export const post = (endpoint, body, auth = true) =>
  fetchBackend(endpoint, "POST", auth, body);

export const put = (endpoint, body, auth = true) =>
  fetchBackend(endpoint, "PUT", auth, body);

export const del = (endpoint, body, auth = true) =>
  fetchBackend(endpoint, "DELETE", auth, body);

function checkHttpStatus(response) {
  if (response && response.ok) {
    return response;
  }

  const errorText =
    response && response.statusText
      ? response.statusText
      : response?.errorData
      ? response?.errorData
      : "Unknown Error";
  const error = new Error(errorText);
  error.response = response;

  throw error;
}

function parseJSON(response) {
  return response.json();
}
