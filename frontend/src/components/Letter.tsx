import React from 'react';

export const Letter: React.FC = () => {
  return (
    <section>
      <div className="">
        <h2 className="text-center text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
          Forgetfulness is <span className= "italic underline font-bold">expensive</span>.
        </h2>
        <p className="italic text-center text-xl text-primary-foreground mb-8"> 
          FutureReminder isn't.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 text-lg text-primary-foreground">
          <div className="flex flex-col gap-4">
            <p>
              We all have obligations that matter far more than calendar reminders were ever designed to handle. Visa or IUD expiries, trademark or domain renewals and even warranties, patents or business licences. Things that are harmless today but catastrophic when the deadline quietly slips by.
            </p>
            <p>
              <span className="font-bold italic underline">Calendar apps are for dentists appointments.</span> Not high-consequence events. That gap costs people real money, real stress, and real consequences. Worst of all, it usually happens silently. You don’t realize what you forgot until the fallout arrives.
            </p>
            <p>
               FutureReminder exists to eliminate that silence.
            </p>
            <p>
              It’s a <span className="font-bold italic underline">set-and-forget</span> system. You add something once, then forget about us. That’s the point. 
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              We won’t bother you until the date you tell us to. But once that date arrives, we won't stop until you acknowledge us.
            </p>
            <p>
              <span className="font-bold italic underline">Single notifications get missed.</span> So we repeat them on a structured schedule. Emails change. Phone numbers change. People change. So we collect backups. Sometimes everything goes wrong at once. That’s why we include emergency contacts. It’s our absolute last resort.
            </p>
            <p>
              It’s not complicated or bloated—it’s a safety net for your long-memory. Feel free to poke around, set up your first reminder, and see how it feels to finally <span className="font-bold italic underline">offload the “don’t forget”</span> part of your brain.
            </p>
            <div>
              <p>Ethan Betts, <a href="mailto:ethanbetts63@gmail.com" className="font-bold italic hover:underline">ethanbetts63@gmail.com</a></p>
              <p className="italic text-sm">Founder and Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
