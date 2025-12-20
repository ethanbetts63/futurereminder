import React from 'react';
import logo from '../assets/logo.webp';

const TrustFeature: React.FC = () => {
  return (
    <div className="bg-primary p-6 rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/3 pb-2 flex justify-center">
          <img src={logo} alt="FutureReminder logo" className="w-full h-auto rounded-md max-h-32 object-contain" />
        </div>
        <div className="w-full lg:w-2/3 lg:pl-4">
          <h2 className="text-2xl font-bold mb-2">Built on trust, not data.</h2>
          <p className="mb-4">When you secure an event with FutureReminder, we take your trust seriously.</p>
          <ul className="list-disc list-inside">
            <li className="mb-2"><strong>True Deletion:</strong> We go beyond industry-standard hashing to ensure that when you delete your data, it stays gone.</li>
            <li className="mb-2"><strong>No Ads, No Selling:</strong> Your contact info is used for one thing: finding you when it matters. We do not sell data.</li>
            <li><strong>One-Click Stop:</strong> You are always in control. A link is present in all notifications to stop reminder sequence instantly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrustFeature;
