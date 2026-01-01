const hierarchyLevels = [
  {
    level: 1,
    title: 'Primary Emails',
    description: 'Initial, non-intrusive reminders sent directly to your inbox.',
  },
  {
    level: 2,
    title: 'Backup Emails',
    description: 'We will escalate to your secondary email addresses if there is no response.',
  },
  {
    level: 3,
    title: 'SMS',
    description: 'If there is still no response, we escalate to sending text messages to your primary phone number.',
  },
  {
    level: 4,
    title: 'Emergency Contacts',
    description: 'Optionally, we can send additional email or SMS notifications to your trusted emergency contacts.',
  },
  {
    level: 5,
    title: 'Socials',
    description: "If all else fails, admin will reach out to you manually via any social media platforms that you provided.",
  }
];

export const ProductCarousel = () => {
  return (
    <div className="w-full py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-primary-foreground mb-2">The <span className= "font-bold italic underline">FutureReminder</span> System</h2>
        <p className="text-lg text-primary-foreground text-center mb-8">
          Define how long before your event we begin to try and reach you. Then get repeating email notifications, text-messages notifications and outreach via emergency contacts and/or social media.
        </p>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {hierarchyLevels.map((item) => (
            <div key={item.level} className="flex-shrink-0 w-72 bg-white border rounded-xl shadow-md p-6 transform transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <span className="text-xl font-bold text-black">{item.level}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
