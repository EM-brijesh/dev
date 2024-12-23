interface Event {
    id: string;
    title: string;
    description: string;
    time: string;
    location: string;
    capacity: number;
    participants: { name: string }[];
  }
  