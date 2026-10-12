import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <CheckCircle size={64} className="text-green-600 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-8 max-w-lg">
        Thank you for your purchase. We've received your order and will begin processing it right away.
      </p>
      <Link to="/" className="bg-primary-teal text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-secondary-teal transition-colors inline-block">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
