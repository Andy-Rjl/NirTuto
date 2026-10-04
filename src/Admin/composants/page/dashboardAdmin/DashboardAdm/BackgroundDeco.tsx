const BackgroundBlobs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: '#6366f1' }} />
    <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: '#ec4899' }} />
    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: '#10b981' }} />
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: '#f59e0b' }} />
  </div>
);

export default BackgroundBlobs;