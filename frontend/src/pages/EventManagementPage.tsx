// src/pages/EventManagementPage.tsx
import { useState, useEffect } from "react";
...
...
...
import type { Event } from "@/types";
import { formatDate } from "@/utils/utils";


function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
...
...
...
      </AlertDialog>
    </div>
  );
}

export default EventManagementPage;
