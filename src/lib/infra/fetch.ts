/**
 * Fetch abstraction used throught the project.
 * Throws an error when server responses is not in 200-300 range.
 * to standardize error responses and make it exception handling more lean.
 */

import stripJsonComments from 'strip-json-comments';

export const fetch = (url: string, options: RequestInit = {}) => {
  return window.fetch(url, options).then(async (response) => {
    // only ok when response.status in 200-300 range
    if (response.ok) {
      /**
       * API returns JSON with comments? 😤
       * So we cant use naive JSON.parse and we treat it here.
       */
      const dataResponse = await response.text();
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        return JSON.parse(stripJsonComments(dataResponse));
      }
      return dataResponse;
    } else {
      // Threat exception case by case, start safely by threating as text
      let errorResponse = await response.text();
      if (errorResponse) {
        // It may be a JSON, try to parse it
        try {
          return Promise.reject(JSON.parse(stripJsonComments(errorResponse)));
        } catch (e) {
          return Promise.reject(errorResponse);
        }
      } else {
        // This error is really weird and not a standard
        return Promise.reject(response.statusText);
      }
    }
  });
};
