import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const pandaApi = axios.create({
  baseURL: API_BASE_URL,
});

function getRequestErrorMessage(error) {
  const status = error.response?.status;
  const message = error.response?.data?.message;

  if (message) {
    return message;
  }

  if (status) {
    return `요청 실패. 에러 코드 : ${status}`;
  }

  return error.message || '요청에 실패했습니다.';
}

async function request(config) {
  try {
    const response = await pandaApi.request(config);
    return response.data === '' ? null : response.data;
  } catch (error) {
    throw new Error(getRequestErrorMessage(error));
  }
}

export function getProductList({ page = 1, pageSize = 15, keyword = '' } = {}) {
  return request({
    url: '/products',
    method: 'GET',
    params: {
      offset: Math.max(0, (page - 1) * pageSize),
      limit: pageSize,
      orderBy: 'recent',
      ...(keyword ? { keyword } : {}),
    },
  });
}

export function getProduct(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'GET',
  });
}

export function createProduct(product) {
  return request({
    url: '/products',
    method: 'POST',
    data: product,
  });
}

export function patchProduct(productId, product) {
  return request({
    url: `/products/${productId}`,
    method: 'PATCH',
    data: product,
  });
}

export function deleteProduct(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'DELETE',
  });
}
