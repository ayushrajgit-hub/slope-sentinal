import { useEffect, useRef } from 'react';

export default function SystemLog({ entries = [] }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="system-log">
      <div className="system-log__header">
        <div className="system-log__dots">
          <span className="system-log__dot system-log__dot--red" />
          <span className="system-log__dot system-log__dot--yellow" />
          <span className="system-log__dot system-log__dot--green" />
        </div>
        <span className="system-log__title">System Decisions Log</span>
      </div>
      <div className="system-log__body" ref={logRef}>
        {entries.length === 0 && (
          <div className="system-log__line system-log__line--muted">
            <span className="system-log__prompt">&gt;</span>
            Awaiting simulation input...
          </div>
        )}
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`system-log__line ${
              entry.type === 'warning' ? 'system-log__line--warning' :
              entry.type === 'critical' ? 'system-log__line--critical' :
              entry.type === 'success' ? 'system-log__line--success' :
              ''
            }`}
          >
            <span className="system-log__timestamp">[{entry.time}]</span>
            <span className="system-log__prompt">&gt;</span>
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
}
