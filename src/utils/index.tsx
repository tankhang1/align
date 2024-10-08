import axios from "axios";

export const FETCHApi = <H, P, D>(
  baseURL: string,
  path: string,
  method: string,
  options: {
    headers?: H;
    params?: P;
    data?: D;
    timeout?: number;
  }
) => {
  const { headers, params = {}, data = undefined, timeout = 60000 } = options;

  // Retrieve the token from local storage
  return new Promise((resolve, reject) =>
    axios({
      url: path,
      method,
      baseURL: baseURL,
      params,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      data,
      timeout: timeout, // Use the provided timeout or default to 60000ms
    })
      .then((response) => {
        console.log(
          `>>>>>>${path} - ${method} response >>>>>> `,
          response.data
        );
        const { data } = response;
        resolve(data);
      })
      .catch((err) => {
        console.log(`>>>>${path} - ${method}>>>> [error]`, { err });
        resolve(err);
      })
  );
};
