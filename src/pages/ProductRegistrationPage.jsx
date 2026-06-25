import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import useProductRegistrationValidation from '../hooks/useProductRegistrationValidation.js';
import { createProduct } from '../services/pandaApi.js';

const initialValues = {
  name: '',
  description: '',
  price: '',
};

function ProductRegistrationPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useProductRegistrationValidation({ values, tags, tagInput });
  const isSubmitDisabled = !validation.requiredFieldsFilled || !validation.isValid || isSubmitting;

  const visibleErrors = useMemo(() => ({
    name: touched.name ? validation.errors.name : '',
    description: touched.description ? validation.errors.description : '',
    price: touched.price ? validation.errors.price : '',
    tagInput: touched.tagInput ? validation.errors.tagInput : '',
    tags: touched.tags ? validation.errors.tags : '',
  }), [touched, validation.errors]);

  const updateField = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
  };

  const touchField = (name) => () => {
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const addTag = () => {
    const nextTag = tagInput.trim();
    const tagValidation = validation.validateTag(nextTag);

    setTouched((current) => ({ ...current, tagInput: true, tags: true }));

    if (!tagValidation.isValid || tags.includes(nextTag)) {
      return;
    }

    setTags((current) => [...current, nextTag]);
    setTagInput('');
    setTouched((current) => ({ ...current, tagInput: false, tags: true }));
  };

  const handleTagKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    addTag();
  };

  const removeTag = (targetTag) => {
    setTags((current) => current.filter((tag) => tag !== targetTag));
    setTouched((current) => ({ ...current, tags: true }));
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setTouched({
      name: true,
      description: true,
      price: true,
      tagInput: Boolean(tagInput.trim()),
      tags: true,
    });
    setSubmitError('');

    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const product = await createProduct({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        tags,
      });

      navigate(`/items/${product.id}`);
    } catch (error) {
      setSubmitError(error.message || '상품 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <Header logoMode="market" />
      <main className="registration-main">
        <form className="registration-form" onSubmit={submitProduct} noValidate>
          <div className="registration-title-row">
            <h1>상품 등록하기</h1>
            <button className="registration-submit-button" type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? '등록 중' : '등록'}
            </button>
          </div>

          <label className="registration-field">
            <span className="registration-label">상품명</span>
            <input
              className={`registration-input ${visibleErrors.name ? 'is-error' : ''}`}
              type="text"
              value={values.name}
              onChange={updateField('name')}
              onBlur={touchField('name')}
              placeholder="상품명을 입력해주세요"
              maxLength={30}
            />
            {visibleErrors.name ? <span className="registration-error">{visibleErrors.name}</span> : null}
          </label>

          <label className="registration-field">
            <span className="registration-label">상품 소개</span>
            <textarea
              className={`registration-textarea ${visibleErrors.description ? 'is-error' : ''}`}
              value={values.description}
              onChange={updateField('description')}
              onBlur={touchField('description')}
              placeholder="상품 소개를 입력해주세요"
              maxLength={150}
            />
            {visibleErrors.description ? <span className="registration-error">{visibleErrors.description}</span> : null}
          </label>

          <label className="registration-field">
            <span className="registration-label">판매가격</span>
            <input
              className={`registration-input ${visibleErrors.price ? 'is-error' : ''}`}
              type="text"
              inputMode="numeric"
              value={values.price}
              onChange={updateField('price')}
              onBlur={touchField('price')}
              placeholder="판매 가격을 입력해주세요"
            />
            {visibleErrors.price ? <span className="registration-error">{visibleErrors.price}</span> : null}
          </label>

          <div className="registration-field">
            <label className="registration-label" htmlFor="product-tag">태그</label>
            <input
              id="product-tag"
              className={`registration-input ${(visibleErrors.tagInput || visibleErrors.tags) ? 'is-error' : ''}`}
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onBlur={touchField('tagInput')}
              onKeyDown={handleTagKeyDown}
              placeholder="태그를 입력해주세요"
            />
            {visibleErrors.tagInput ? <span className="registration-error">{visibleErrors.tagInput}</span> : null}
            {!visibleErrors.tagInput && visibleErrors.tags ? (
              <span className="registration-error">{visibleErrors.tags}</span>
            ) : null}
            <div className="registration-tags" aria-label="입력된 태그">
              {tags.map((tag) => (
                <span className="registration-tag" key={tag}>
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} aria-label={`${tag} 태그 삭제`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {submitError ? <p className="registration-submit-error">{submitError}</p> : null}
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default ProductRegistrationPage;
