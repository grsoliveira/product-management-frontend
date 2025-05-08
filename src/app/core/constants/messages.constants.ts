export const APP_MESSAGES = {
  success: {
    created: 'Product successfully created!',
    updated: 'Product successfully updated!',
    deleted: 'Product successfully deleted!'
  },
  error: {
    default: 'An error has occurred',
    create: {
      default: 'Error creating product',
      forbidden: 'You do not have permission to create products',
      invalidData: 'Invalid product data',
      conflict: 'A product with this name already exists',
      server: 'Internal server error'
    },
    update: {
      default: 'Error updating product',
      notFound: 'Product not found',
      forbidden: 'You do not have permission to update this product',
      invalidData: 'Invalid product data',
      conflict: 'Update conflict - product may have been modified',
      server: 'Internal server error'
    },
    delete: {
      default: 'Error deleting product',
      notFound: 'Product not found',
      forbidden: 'You do not have permission to delete this product',
      conflict: 'Delete conflict - product may have been modified',
      server: 'Internal server error'
    }
  }
};

export type AppMessages = typeof APP_MESSAGES;
