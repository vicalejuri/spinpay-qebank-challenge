/**
 * Fetch abstraction used throught the project.
 * Also Throws an error when server responses is not in 200-300 range.
 * to avoid extra-try/catch blocks
 */

export const fetch = (url: string, options: RequestInit = {}) => {
  return window.fetch(url, options).then((response) => {
    if (response.ok) {
      try {
        return response.json();
      } catch (e) {
        return response.text();
      }
    } else {
      return Promise.reject(response.text());
    }
  });
};
