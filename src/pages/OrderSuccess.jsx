import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <CheckCircle size={64} className="text-[#344B38] mb-6" />
      <h1 className="text-4xl font-bold text-[#292923] mb-4">Order Placed Successfully!</h1>
      <p className="text-[#829078] mb-8 max-w-lg font-medium">
        Thank you for your purchase. We've received your order and will begin processing it right away.
      </p>
      <Link to="/" className="bg-[#344B38] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-[#829078] transition-colors inline-block shadow-md">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
