import React from 'react';
import letterLasers from '../assets/lasers.webp';

const TrustFeature: React.FC = () => {
  return (
    <div className="bg-primary rounded-lg shadow-md overflow-hidden">
      <div className="lg:grid lg:grid-cols-2">
        {/* Image Section */}
        <div 
          className="min-h-64 max-h-32 lg:min-h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${letterLasers})` }}
        >
           {/* This div is for the background image */}
        </div>
        
        {/* Text Section */}
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-4xl lg:text-4xl font-bold mb-8 text-center">Built on reputation, not <span className="italic">data.</span></h2>
          <ul className="list-disc list-inside text-lg">
            <li className="mb-4"><strong>True Deletion:</strong> We go beyond industry-standard hashing to ensure that when you delete your data, it stays gone.</li>
            <li className="mb-4"><strong>No Ads, No Selling:</strong> Your contact info is used for one thing: finding you when it matters. We do not sell data.</li>
            <li className="mb-4"><strong>One-Click Stop:</strong> A link is present in all notifications to stop reminder sequences instantly. Events timelines and contact methods are manageable editable even after creation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrustFeature;
