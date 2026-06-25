import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '상품명을 입력해주세요.'],
      trim: true,
      minlength: [1, '상품명은 1자 이상이어야 합니다.'],
      maxlength: [10, '상품명은 10자 이내여야 합니다.'],
    },
    description: {
      type: String,
      required: [true, '상품 소개를 입력해주세요.'],
      trim: true,
      minlength: [10, '상품 소개는 10자 이상이어야 합니다.'],
      maxlength: [100, '상품 소개는 100자 이내여야 합니다.'],
    },
    price: {
      type: Number,
      required: [true, '판매 가격을 입력해주세요.'],
      min: [0, '판매 가격은 0 이상이어야 합니다.'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(tags) {
          return tags.every((tag) => tag.length <= 5);
        },
        message: '태그는 5글자 이내여야 합니다.',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
