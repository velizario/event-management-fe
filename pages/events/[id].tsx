import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const { data: event, isLoading, error } = useQuery(
    ["event", id],
    async () => {
      const res = await fetch(`http://localhost:3001/events/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error fetching event");
      }
      return res.json();
    }, 
    {
      enabled: !!id,
    }
  );

  const bookMutation = useMutation(
    async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/bookings/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      return data;
    },
    {
      onSuccess: () => {
        setMessage("Successfully booked!");
        queryClient.invalidateQueries(["event", id]);
      },
      onError: (err: any) => {
        setMessage(err.message);
      },
    }
  );

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      await bookMutation.mutateAsync();
    } catch (error) {
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading event: {(error as Error).message}</div>;
  if (!event) return <div>Event not found</div>;

  const availableSeats = event.seats - event.bookings.length;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>Location: {event.location}</p>
      <p>Available seats: {availableSeats}</p>

      <button
        onClick={handleBooking}
        className="bg-green-500 text-white mt-4 p-2"
        disabled={availableSeats <= 0 || isBooking}
      >
        {isBooking ? "Booking..." : availableSeats <= 0 ? "No Seats Available" : "Book a Seat"}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}