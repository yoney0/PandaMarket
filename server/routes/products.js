import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = Router();

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, '유효하지 않은 상품 id입니다.');
  }
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
}

function serializeProduct(product) {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function pickProductPayload(body, { partial = false } = {}) {
  const payload = {};
  const fields = ['name', 'description', 'price', 'tags'];

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = field === 'tags' ? normalizeTags(body[field]) : body[field];
    }
  });

  if (!partial) {
    ['name', 'description', 'price'].forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(payload, field)) {
        throw createHttpError(400, `${field} 필드는 필수입니다.`);
      }
    });
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'price')) {
    const price = Number(payload.price);

    if (!Number.isFinite(price)) {
      throw createHttpError(400, '판매 가격은 숫자로 입력해주세요.');
    }

    payload.price = price;
  }

  return payload;
}

router.get('/', async (req, res, next) => {
  try {
    const offset = Math.max(0, Number(req.query.offset || 0));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const keyword = String(req.query.keyword || '').trim();
    const orderBy = req.query.orderBy || 'recent';
    const filter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};
    const sort = orderBy === 'recent' ? { createdAt: -1 } : { createdAt: -1 };

    const [totalCount, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .select('name price createdAt')
        .lean(),
    ]);

    res.status(200).json({
      list: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        createdAt: product.createdAt,
      })),
      totalCount,
      offset,
      limit,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = pickProductPayload(req.body);
    const product = await Product.create(payload);

    res.status(201).json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
});

router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    assertValidObjectId(productId);

    const product = await Product.findById(productId).select('name description price tags createdAt');

    if (!product) {
      throw createHttpError(404, '상품을 찾을 수 없습니다.');
    }

    res.status(200).json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    assertValidObjectId(productId);

    const payload = pickProductPayload(req.body, { partial: true });
    const product = await Product.findByIdAndUpdate(productId, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw createHttpError(404, '상품을 찾을 수 없습니다.');
    }

    res.status(200).json(serializeProduct(product));
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    assertValidObjectId(productId);

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw createHttpError(404, '상품을 찾을 수 없습니다.');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
