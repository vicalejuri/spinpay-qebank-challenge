/**
 * Fetch abstraction used throught the project.
 * Also Throws an error when server responses is not in 200-300 range.
 * to avoid extra-try/catch blocks
 */

export const fetch = (url: string, options: RequestInit = {}) => {
  return window.fetch(url, options).then(async (response) => {
    // only ok when response.status in 200-300 range
    if (response.ok) {
      if (response.headers.get('Content-Type')?.startsWith('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } else {
      return Promise.reject(response.text());
    }
  });
};
