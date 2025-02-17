import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

export default function CreateEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [seats, setSeats] = useState(10);
  const [message, setMessage] = useState("");

  const createEventMutation = useMutation(async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, date, location, seats }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create event");
    return data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("events");
      router.push("/");
    },
    onError: (err: any) => {
      setMessage(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate();
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border p-2 w-full mb-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full mb-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Seats"
          className="border p-2 w-full mb-2"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full"
        >
          Create Event
        </button>
      </form>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
}
