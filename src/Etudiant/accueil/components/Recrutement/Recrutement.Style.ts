export const RecruitmentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  .recr-root { font-family: 'Outfit', sans-serif; }
  .recr-root h2 { font-family: 'Playfair Display', serif; }

  .recr-img-frame {
    clip-path: polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%);
    transition: clip-path 0.5s ease;
  }
  .recr-img-frame:hover {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  .postuler-btn {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .postuler-btn::before {
    content: '';
    position: absolute;
    left: -100%;
    top: 0; bottom: 0;
    width: 100%;
    background: rgba(255,255,255,0.15);
    transition: left 0.35s ease;
  }
  .postuler-btn:hover::before { left: 100%; }
  .postuler-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(84,87,212,0.45);
  }

  .field-base {
    width: 100%;
    padding: 12px 16px;
    background: #fff;
    border: 1.5px solid #e0e3ff;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    color: #1a1a2e;
  }
  .field-base:focus {
    border-color: #5457d4;
    box-shadow: 0 0 0 3px rgba(84,87,212,0.1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .slide-up { animation: slideUp 0.6s cubic-bezier(.22,1,.36,1) both; }
  .slide-up-d1 { animation-delay: 0.1s; }
  .slide-up-d2 { animation-delay: 0.22s; }
  .slide-up-d3 { animation-delay: 0.34s; }
  .slide-up-d4 { animation-delay: 0.46s; }
`;