const ResponseStatus = {
  SUCCESS: {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  },
  ERROR: {
    status: 500,
    headers: {
      'Content-type': 'application/json'
    }
  },
  NOT_FOUND: {
    status: 404,
    headers: {
      'Content-type': 'application/json'
    }
  },
  FORBIDDEN: {
    status: 400,
    headers: {
      'Content-type': 'application/json'
    }
  }
};

const jsonResponse = (body: any, headers: Record<string, any>) => {
  return Promise.resolve(new Response(JSON.stringify(body), headers)).then(async (res) => {
    const isSuccess = res.status >= 200 && res.status < 300;
    if (!isSuccess) {
      const responseAsText = await res.text();
      throw Error(responseAsText);
    }
    return res;
  });
};

export const success = (body: any) => jsonResponse(body, ResponseStatus.SUCCESS);
export const error = (body: any) => jsonResponse(body, ResponseStatus.ERROR);
export const notFound = (body: any) => jsonResponse(body, ResponseStatus.NOT_FOUND);
export const forbidden = (body: any) => jsonResponse(body, ResponseStatus.FORBIDDEN);

export default {
  success,
  error,
  notFound,
  forbidden
};
