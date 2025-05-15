import React from 'react';
import Container from '../components/common/Container';
import CategoryManager from '../components/categories/CategoryManager';

const Categories: React.FC = () => {
  return (
    <Container>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Categories</h1>
      <CategoryManager />
    </Container>
  );
};

export default Categories;