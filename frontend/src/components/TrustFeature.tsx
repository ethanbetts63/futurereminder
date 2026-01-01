import React from 'react';
import letterLasers from '../assets/lasers.webp';

const TrustFeature: React.FC = () => {
  return (
    <div className="bg-primary rounded-none sm:rounded-lg shadow-md overflow-hidden">
      <div className="lg:grid lg:grid-cols-2">
        {/* Image Section */}
        <div 
          className="min-h-64 max-h-32 lg:min-h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${letterLasers})` }}
        >
           {/* This div is for the background image */}
        </div>
        
        {/* Text Section */}
        <div className="pt-4 pb-0 px-4 sm:p-4 md:p-6 lg:p-8">
          <h2 className="text-4xl lg:text-4xl font-bold mb-8 text-center">Built on reputation, not <span className="italic">data.</span></h2>
          <ul className="list-disc list-inside text-lg">
            <li className="mb-4"><strong>True Deletion:</strong> Industry standard account deletion means just disabling your account not deleting it. We cryptographically erase your data.</li>
            <li className="mb-4"><strong>No Ads, No Selling:</strong> Your contact info is used for one thing: finding you when it matters. We do not sell data.</li>
            <li className="mb-4"><strong>Full-control:</strong> Events timelines and contact methods are editable even after creation and stopping further notifications is just as easy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrustFeature;
