import { motion } from 'framer-motion';

interface RevenueChartProps {
  graphique: Array<{ mois: string; revenu: number; profit: number }>;
  maxVal: number;
}

const RevenueChart = ({ graphique, maxVal }: RevenueChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
    className="lg:col-span-2 rounded-2xl p-6"
    style={{
      background: '#FFFFFF',
      boxShadow: '0 2px 24px rgba(99,102,241,0.08)',
      border: '1.5px solid #EEF2FF',
    }}
  >
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: '#A5B4FC', letterSpacing: '0.14em' }}>
          Analyse financière mensuelle
        </p>
        <h3 className="text-xl font-extrabold tracking-tight" style={{ color: '#1E1B4B' }}>
          Revenus vs Profits
        </h3>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: '#C7D2FE' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6366F1' }}>Revenus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: '#6366F1' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6366F1' }}>Profits</span>
        </div>
      </div>
    </div>

    {/* Chart — no overflow, single view */}
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 220, position: 'relative' }}>

        {/* Y-axis labels */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          height: 180, width: 44, paddingRight: 8, flexShrink: 0, paddingBottom: 20,
          fontSize: 10, fontWeight: 700, color: '#A5B4FC', textAlign: 'right',
          borderRight: '1px solid #EEF2FF',
        }}>
          <span>{Math.round(maxVal / 1000)}k</span>
          <span>{Math.round(maxVal * 0.75 / 1000)}k</span>
          <span>{Math.round(maxVal * 0.5 / 1000)}k</span>
          <span>{Math.round(maxVal * 0.25 / 1000)}k</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div style={{ position: 'absolute', left: 44, right: 0, top: 0, height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ borderTop: '1px dashed #EEF2FF', width: '100%' }} />
          ))}
        </div>

        {/* Bars */}
        {graphique.map((m, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', zIndex: 10 }}>

            {/* Price labels — always visible, not hidden */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, marginBottom: 2 }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#818CF8', whiteSpace: 'nowrap' }}>
                {(m.revenu / 1000).toFixed(0)}k
              </span>
              <span style={{ fontSize: 8, fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>
                {(m.profit / 1000).toFixed(0)}k
              </span>
            </div>

            {/* Bar pair */}
            <div style={{ display: 'flex', gap: 3, height: 140, alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${(m.revenu / maxVal) * 100}%` }}
                transition={{ duration: 0.7, delay: idx * 0.05, ease: [0.4, 0, 0.2, 1] }}
                style={{ width: 14, borderRadius: '6px 6px 2px 2px', background: '#C7D2FE', flexShrink: 0 }}
              />
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${(m.profit / maxVal) * 100}%` }}
                transition={{ duration: 0.7, delay: idx * 0.05 + 0.08, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: 14, borderRadius: '6px 6px 2px 2px', flexShrink: 0,
                  background: 'linear-gradient(180deg, #818CF8 0%, #4F46E5 100%)',
                  boxShadow: '0 -2px 10px rgba(99,102,241,0.3)',
                }}
              />
            </div>

            {/* Month label */}
            <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {m.mois}
            </span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default RevenueChart;