import "./CaseEventCard.css";
import type { CaseEvent } from "../../services/caseService";

type Props = {
  event: CaseEvent;
  index?: number; // for stagger animation
};

export default function CaseEventCard({ event, index = 0 }: Props) {
  const getTypeClass = () => {
    switch (event.event_type) {
      case "status_change":
        return "event-status";
      case "comment":
        return "event-comment";
      default:
        return "event-default";
    }
  };

  return (
    <div
      className="timeline-item"
      style={{ animationDelay: `${index * 0.08}s` }} // stagger
    >
      {/* DOT */}
      <div className={`timeline-dot ${getTypeClass()}`} />

      {/* CONTENT */}
      <div className="timeline-content">
        <div className="timeline-header">
          <span className="timeline-actor">
            {event.actor_name ?? "Ukjent bruker"}
          </span>

          <span className="timeline-date">
            {event.created_at
              ? new Date(event.created_at).toLocaleString("no-NO")
              : ""}
          </span>
        </div>

        <p className="timeline-description">
          {event.description ?? "Ingen beskrivelse"}
        </p>
      </div>
    </div>
  );
}