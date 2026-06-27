import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Realistic typewriter with typos ─── */
function useTypewriter(lines, active) {
  const [output, setOutput] = useState([]);
  const timerRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setOutput([]);

    let cumDelay = 300;
    lines.forEach((line) => {
      cumDelay += line.delay ?? 600;
      const t = setTimeout(() => {
        if (line.cmd) {
          const chars = line.text.split('');
          chars.forEach((ch, ci) => {
            const speed = 32 + Math.random() * 42;
            const typo  = Math.random() < 0.04 && ci > 2 && ch !== ' ';
            const t2 = setTimeout(() => {
              if (typo) {
                setOutput(prev => {
                  const c = [...prev];
                  const l = c[c.length - 1];
                  if (l?.cmd) c[c.length - 1] = { ...l, text: l.text + 'x' };
                  return c;
                });
                setTimeout(() => setOutput(prev => {
                  const c = [...prev];
                  const l = c[c.length - 1];
                  if (l?.cmd) c[c.length - 1] = { ...l, text: l.text.slice(0, -1) + ch };
                  return c;
                }), 120);
              } else {
                setOutput(prev => {
                  const c = [...prev];
                  const l = c[c.length - 1];
                  if (l?.cmd) c[c.length - 1] = { ...l, text: l.text + ch };
                  else c.push({ ...line, text: ch });
                  return c;
                });
              }
            }, ci * speed);
            timerRef.current.push(t2);
          });
        } else {
          setOutput(prev => [...prev, line]);
        }
      }, cumDelay);
      timerRef.current.push(t);
    });
    return () => timerRef.current.forEach(clearTimeout);
  }, [active]);

  return output;
}

/* ─── Terminal window — anchored to bottom-left, draggable ─── */
function TermWindow({ title, icon, children, bottomOffset, width = 260, zBase = 7500 }) {
  const [minimized, setMinimized] = useState(true); // start minimized!

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.4 }}
      style={{
        position: 'fixed',
        bottom: bottomOffset,
        left: 16,
        zIndex: zBase,
        width: minimized ? 230 : width,
        background: 'rgba(5,9,10,0.96)',
        border: '1px solid rgba(57,255,20,0.22)',
        backdropFilter: 'blur(14px)',
        userSelect: 'none',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(57,255,20,0.04)',
        transition: 'width 0.2s ease',
      }}
      whileDrag={{ boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 24px rgba(0,240,255,0.12)', scale: 1.01 }}
    >
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 8px',
        background: 'rgba(57,255,20,0.05)',
        borderBottom: minimized ? 'none' : '1px solid rgba(57,255,20,0.12)',
        cursor: 'grab',
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', display: 'inline-block', boxShadow: minimized ? 'none' : '0 0 5px #28c840' }} />
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#39ff14', letterSpacing: '0.09em', opacity: 0.8, flex: 1, textAlign: 'center' }}>
          {icon} {title}
        </span>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={() => setMinimized(m => !m)}
          style={{ background: 'none', border: 'none', color: '#556070', cursor: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', padding: 0, flexShrink: 0 }}
        >
          {minimized ? '[+]' : '[−]'}
        </button>
      </div>

      {/* Body */}
      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Nmap terminal ─── */
const NMAP_LINES = [
  { text: 'root@kali:~# nmap -sV -A -T4 svkaushik.dev', cmd: true, delay: 0 },
  { text: 'Starting Nmap 7.94 ( https://nmap.org )', color: '#556070', delay: 700 },
  { text: 'Scanning target host...', color: '#556070', delay: 300 },
  { text: '', delay: 200 },
  { text: 'PORT     STATE  SERVICE    VERSION', color: '#ffcc00', delay: 400 },
  { text: '22/tcp   open   ssh        OpenSSH 8.9p1', color: '#39ff14', delay: 250 },
  { text: '80/tcp   open   http       nginx 1.24.0', color: '#39ff14', delay: 200 },
  { text: '443/tcp  open   ssl/https  TLSv1.3', color: '#39ff14', delay: 200 },
  { text: '3000/tcp open   nodejs     Express 4.x', color: '#39ff14', delay: 200 },
  { text: '', delay: 200 },
  { text: 'OS: Linux 5.15.0 (Ubuntu 22.04)', color: '#00f0ff', delay: 400 },
  { text: 'Uptime: 14.2 days | MAC: 02:42:AC:11:00:02', color: '#556070', delay: 200 },
  { text: 'Nmap done: 1 IP (2.43s)', color: '#39ff14', delay: 400 },
];

function NmapTerminal() {
  const output = useTypewriter(NMAP_LINES, true);
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [output]);

  return (
    <TermWindow title="nmap-scanner" icon="◎" bottomOffset={114} width={275} zBase={7500}>
      <div ref={bodyRef} style={{ padding: '7px 10px', maxHeight: 190, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#39ff1422 transparent' }}>
        {output.map((line, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.61rem', color: line.color || '#c0ccd8', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line.cmd
              ? <><span style={{ color: '#ff003c' }}>root@kali</span><span style={{ color: '#445566' }}>:~#</span> <span style={{ color: '#e6e6e6' }}>{line.text.replace('root@kali:~# ', '')}</span></>
              : line.text}
          </div>
        ))}
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.61rem', color: '#39ff14', animation: 'ftBlink 0.8s step-end infinite' }}>█</span>
      </div>
      <style>{`@keyframes ftBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </TermWindow>
  );
}

/* ─── Metasploit terminal ─── */
const MSF_LINES = [
  { text: '  =[ metasploit v6.3.44-dev  ]', color: '#ff003c', delay: 0 },
  { text: '+ -- =[  2373 exploits · 1242 aux ]', color: '#ff003c', delay: 200 },
  { text: '', delay: 300 },
  { text: 'msf6 > use exploit/multi/handler', cmd: true, delay: 400 },
  { text: 'msf6 exploit(handler) > set PAYLOAD generic/shell_reverse_tcp', cmd: true, delay: 700 },
  { text: 'PAYLOAD => generic/shell_reverse_tcp', color: '#39ff14', delay: 250 },
  { text: 'msf6 exploit(handler) > set LHOST 0.0.0.0', cmd: true, delay: 500 },
  { text: 'LHOST => 0.0.0.0', color: '#39ff14', delay: 200 },
  { text: 'msf6 exploit(handler) > run', cmd: true, delay: 500 },
  { text: '[*] Started reverse TCP handler...', color: '#556070', delay: 600 },
  { text: '[*] Sending stage (175174 bytes)', color: '#556070', delay: 700 },
  { text: '[*] Meterpreter session 1 opened ✓', color: '#39ff14', delay: 900 },
  { text: '', delay: 200 },
  { text: 'meterpreter > sysinfo', cmd: true, delay: 500 },
  { text: '  Computer: SVK-PORTFOLIO-SRV', color: '#00f0ff', delay: 350 },
  { text: '  OS      : Linux Ubuntu 22.04', color: '#00f0ff', delay: 200 },
  { text: '', delay: 200 },
  { text: 'meterpreter > hashdump', cmd: true, delay: 600 },
  { text: 'admin:$2b$12$xKm3...:[EXTRACTED]', color: '#ff003c', delay: 700 },
];

function MsfTerminal() {
  const output = useTypewriter(MSF_LINES, true);
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [output]);

  return (
    <TermWindow title="msf-session-1" icon="⚡" bottomOffset={62} width={300} zBase={7490}>
      <div ref={bodyRef} style={{ padding: '7px 10px', maxHeight: 190, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ff003c22 transparent' }}>
        {output.map((line, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.61rem', color: line.color || '#c0ccd8', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line.cmd
              ? line.text.startsWith('meterpreter')
                ? <><span style={{ color: '#ff003c' }}>meterpreter</span><span style={{ color: '#445566' }}> &gt;</span> <span style={{ color: '#e6e6e6' }}>{line.text.replace('meterpreter > ', '')}</span></>
                : <><span style={{ color: '#ffcc00' }}>{line.text.split('>')[0].trim()}&gt;</span> <span style={{ color: '#e6e6e6' }}>{line.text.split('> ').slice(1).join('> ')}</span></>
              : line.text}
          </div>
        ))}
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.61rem', color: '#ff003c', animation: 'ftBlink 0.8s step-end infinite' }}>█</span>
      </div>
    </TermWindow>
  );
}

/* ─── Wireshark-style live packet capture ─── */
const PROTOS = ['TCP','UDP','HTTP','TLS','DNS','SSH','ICMP'];
const IPS    = ['192.168.1.1','10.0.0.45','172.16.0.2','203.0.113.4','198.51.100.7'];
const mkRow  = (no) => ({
  no, src: IPS[Math.floor(Math.random()*IPS.length)],
  proto: PROTOS[Math.floor(Math.random()*PROTOS.length)],
  len: 40 + Math.floor(Math.random()*1400),
  info: ['SYN','ACK','SYN-ACK','PSH ACK','FIN','RST'][Math.floor(Math.random()*6)],
});

function WiresharkTerminal() {
  const [rows, setRows] = useState(() => Array.from({length:12},(_,i)=>mkRow(i+1)));
  const [sel, setSel] = useState(2);
  const bodyRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setRows(r => {
        const next = mkRow(r[r.length-1].no + 1);
        const updated = [...r.slice(-20), next];
        return updated;
      });
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, 420);
    return () => clearInterval(t);
  }, []);

  const pc = { TCP:'#39ff14', UDP:'#ffcc00', HTTP:'#00f0ff', TLS:'#ff003c', DNS:'#c084fc', SSH:'#f97316', ICMP:'#8b949e' };

  return (
    <TermWindow title="wireshark-live" icon="📡" bottomOffset={28} width={340} zBase={7480}>
      <div style={{ display:'flex', padding:'3px 8px', background:'rgba(57,255,20,0.05)', borderBottom:'1px solid rgba(57,255,20,0.1)', gap:4 }}>
        {['No.','Source','Proto','Len','Info'].map(h => (
          <span key={h} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.54rem', color:'#556070', flex: h==='Source'?2:h==='Info'?1.5:1 }}>{h}</span>
        ))}
      </div>
      <div ref={bodyRef} style={{ maxHeight:130, overflowY:'auto', scrollbarWidth:'thin', scrollbarColor:'#39ff1422 transparent' }}>
        {rows.map((row,i)=>(
          <div key={row.no} onClick={()=>setSel(i)} style={{ display:'flex', padding:'1.5px 8px', gap:4, background: sel===i?'rgba(0,240,255,0.07)':'transparent', borderLeft: sel===i?'2px solid #00f0ff':'2px solid transparent', cursor:'none' }}>
            {[row.no, row.src, row.proto, row.len, row.info].map((v,vi)=>(
              <span key={vi} style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.54rem', color: vi===2?pc[row.proto]:'#7a8898', flex: vi===1?2:vi===4?1.5:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:'2px 8px', borderTop:'1px solid rgba(57,255,20,0.1)', fontFamily:'JetBrains Mono, monospace', fontSize:'0.54rem', color:'#39ff14', opacity:0.55 }}>
        ● LIVE — {rows.length} packets captured
      </div>
    </TermWindow>
  );
}

export default function FloatingTerminals() {
  return (
    <>
      <NmapTerminal />
      <MsfTerminal />
      <WiresharkTerminal />
    </>
  );
}
