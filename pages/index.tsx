import { useQuery } from "react-query";
import Link from "next/link";

export default function Home() {
  const { data: events, isLoading, error } = useQuery("events", async () => {
    const res = await fetch("http://localhost:3001/events");
    return res.json();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Upcoming Events</h1>
      <Link href="/events/create">
        <button className="bg-blue-500 text-white p-2 mb-4">
          Create New Event
        </button>
      </Link>
      {events.map((event: any) => (
        <div key={event.id} className="border rounded p-4 mb-4">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <p>{event.description}</p>
          <p>{new Date(event.date).toLocaleString()}</p>
          <Link href={`/events/${event.id}`}>
            <button className="bg-blue-500 text-white mt-2 p-2">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
