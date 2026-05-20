import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import AddEventModal from "../features/calendar/components/AddEventModal";
import EventDetailModal from "../features/calendar/components/EventDetailModal";

import { CircularProgress } from "@mui/material";
import { fetchAllEvents, addEvent, deleteEvent, updateEvent, getLocalDateString } from "../util/EventsServices.js";
import "../styles/calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

function makeEventTile(view) {
  return function EventTile({ event }) {
    const timeLabel = event.start
      ? event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : null;
    return (
      <div className="calendar-event-tile">
        <div className="calendar-event-name">{event.name}</div>
        {view === "month" && timeLabel && (
          <div className="calendar-event-sub">{timeLabel}</div>
        )}
      </div>
    );
  };
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [prefillDate, setPrefillDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllEvents();
        const mapped = data.map((e) => ({
          ...e,
          title: e.name,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(mapped);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = useCallback(async (id) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelected(null);
  }, []);

  const components = useMemo(() => ({ event: makeEventTile(currentView) }), [currentView]);

  return (
    <main className="calendar-main">
      <div className="calendar-header-row">
        <button className="btn-action" onClick={() => { setPrefillDate(""); setAddOpen(true); }}>
          + Add Event
        </button>
      </div>

      <div className="calendar-wrapper">
        {loading ? (
          <CircularProgress />
        ) : (
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            date={currentDate}
            view={currentView}
            onNavigate={setCurrentDate}
            onView={setCurrentView}
            selectable
            onSelectSlot={(slot) => {
              setPrefillDate(getLocalDateString(slot.start));
              setAddOpen(true);
            }}
            onSelectEvent={(evt) => setSelected(evt)}
            components={components}
          />
        )}
      </div>

      <AddEventModal 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        prefillDate={prefillDate}
        setEvents={setEvents}
      />

      <EventDetailModal 
        selected={selected} 
        onClose={() => setSelected(null)} 
        onDelete={handleDelete}
        setEvents={setEvents}
      />
    </main>
  );
}
