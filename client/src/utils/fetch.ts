const prefix = '/client';

interface errorType {
  message: string;
}

const request = async <T>(url: string = '', method: string = '', data: object = {}): Promise<T> => {
  const response = await fetch(prefix + url, {
    method: method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem('token') || '',
},
    body: (method === 'GET' || method === 'DELETE') ? null : JSON.stringify(data)
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/signin';
    return Promise.reject(new Error('Unauthorized'));
  }

  if (!response.ok) {
    const msg: errorType = await response.json() as errorType;
    console.error(msg)
    return Promise.reject(new Error(msg.message || response.statusText));
  }

  return await response.json() as Promise<T>;
};

export const getRequest = <T>(url: string): Promise<T> => {
  return request<T>(url, 'GET');
};

export const postRequest = <T>(url: string, data: object = {}): Promise<T> => {
  return request<T>(url, 'POST', data);
};

export const putRequest = <T>(url: string, data: object): Promise<T> => {
  return request<T>(url, 'PUT', data);
};

export const patchRequest = <T>(url: string, data: object): Promise<T> => {
  return request<T>(url, 'PATCH', data);
};

export const deleteRequest = <T>(url: string): Promise<T> => {
  return request<T>(url, 'DELETE');
};