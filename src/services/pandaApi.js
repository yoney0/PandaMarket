import axios from 'axios';

const BASE_URL = 'https://panda-market-api.vercel.app';

const pandaApi = axios.create({
  baseURL: BASE_URL,
});

function buildListParams({ page = 1, pageSize = 15, keyword = '', orderBy = '' } = {}) {
  const params = { page, pageSize };

  if (keyword) {
    params.keyword = keyword;
  }

  if (orderBy) {
    params.orderBy = orderBy;
  }

  return params;
}

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

export function getProductList(params) {
  return request({
    url: '/products',
    method: 'GET',
    params: buildListParams(params),
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

export function getArticleList(params) {
  return request({
    url: '/articles',
    method: 'GET',
    params: buildListParams(params),
  });
}

export function getArticle(articleId) {
  return request({
    url: `/articles/${articleId}`,
    method: 'GET',
  });
}

export function createArticle(article) {
  return request({
    url: '/articles',
    method: 'POST',
    data: article,
  });
}

export function patchArticle(articleId, article) {
  return request({
    url: `/articles/${articleId}`,
    method: 'PATCH',
    data: article,
  });
}

export function deleteArticle(articleId) {
  return request({
    url: `/articles/${articleId}`,
    method: 'DELETE',
  });
}
