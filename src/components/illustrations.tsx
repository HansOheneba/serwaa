// Flat brand illustrations: simple geometric scenes in aubergine and saffron.

const C = {
  aub: "#3A1846",
  plum: "#6B3A7D",
  lilac300: "#B48FC6",
  lilac100: "#EADFF0",
  lilac50: "#F6F1F8",
  saffron: "#F2A900",
  saffron300: "#FAC63F",
  saffron100: "#FEEDBF",
  green: "#1F8A5B",
  white: "#FFFFFF",
  ink: "#2A2530",
};

type IllustrationProps = { className?: string; title?: string };

function Svg({ viewBox, className, title, children }: IllustrationProps & { viewBox: string; children: React.ReactNode }) {
  return (
    <svg viewBox={viewBox} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** A simple standing figure. (x, y) is the point between the feet. */
function Person({ x, y, skin, top, bottom = C.ink, hair = C.ink, wrap = false, armUp = false }: {
  x: number; y: number; skin: string; top: string; bottom?: string; hair?: string; wrap?: boolean; armUp?: boolean;
}) {
  return (
    <g>
      <rect x={x - 11} y={y - 46} width="9" height="46" rx="4" fill={bottom} />
      <rect x={x + 2} y={y - 46} width="9" height="46" rx="4" fill={bottom} />
      <path d={`M${x - 20} ${y - 44} Q${x - 22} ${y - 92} ${x} ${y - 94} Q${x + 22} ${y - 92} ${x + 20} ${y - 44} Z`} fill={top} />
      {armUp ? (
        <path d={`M${x + 16} ${y - 86} L${x + 34} ${y - 112}`} stroke={top} strokeWidth="9" strokeLinecap="round" />
      ) : (
        <path d={`M${x + 17} ${y - 84} L${x + 24} ${y - 56}`} stroke={top} strokeWidth="9" strokeLinecap="round" />
      )}
      <path d={`M${x - 17} ${y - 84} L${x - 24} ${y - 56}`} stroke={top} strokeWidth="9" strokeLinecap="round" />
      <rect x={x - 4} y={y - 102} width="8" height="10" fill={skin} />
      <circle cx={x} cy={y - 112} r="13" fill={skin} />
      {wrap ? (
        <path d={`M${x - 15} ${y - 114} Q${x - 14} ${y - 136} ${x + 2} ${y - 134} Q${x + 18} ${y - 132} ${x + 15} ${y - 113} Q${x} ${y - 124} ${x - 15} ${y - 114} Z`} fill={hair} />
      ) : (
        <path d={`M${x - 13} ${y - 114} Q${x - 12} ${y - 128} ${x} ${y - 127} Q${x + 12} ${y - 128} ${x + 13} ${y - 114} Q${x} ${y - 120} ${x - 13} ${y - 114} Z`} fill={hair} />
      )}
    </g>
  );
}

function Coin({ cx, cy, r = 11 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.saffron} />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={C.saffron100} strokeWidth="1.5" />
    </g>
  );
}

/** Small woven-S mark used as a motif inside scenes. */
function MiniMark({ x, y, s = 1, bar = C.aub }: { x: number; y: number; s?: number; bar?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="0" width="16" height="4" fill={bar} />
      <rect x="0" y="4" width="4" height="3.5" fill={C.saffron} />
      <rect x="0" y="7.5" width="16" height="3" fill={bar} />
      <rect x="12" y="10.5" width="4" height="3.5" fill={C.saffron} />
      <rect x="0" y="14" width="16" height="4" fill={bar} />
    </g>
  );
}

/** A shop owner and an investor, joined by a woven bridge that carries money across. */
export function BridgeIllustration({ className, title = "A business and an investor connected by Serwaa" }: IllustrationProps) {
  return (
    <Svg viewBox="0 0 480 300" className={className} title={title}>
      <ellipse cx="240" cy="268" rx="225" ry="18" fill={C.lilac100} />
      {/* shop */}
      <rect x="36" y="118" width="138" height="146" rx="6" fill={C.lilac50} stroke={C.lilac100} strokeWidth="2" />
      <rect x="44" y="96" width="122" height="22" rx="4" fill={C.plum} />
      <rect x="70" y="103" width="70" height="4" rx="2" fill={C.lilac300} />
      <path d="M36 118 h138 v14 q-11.5 12 -23 0 q-11.5 12 -23 0 q-11.5 12 -23 0 q-11.5 12 -23 0 q-11.5 12 -23 0 q-11.5 12 -23 0 Z" fill={C.saffron} />
      <rect x="52" y="150" width="58" height="56" rx="3" fill={C.white} stroke={C.lilac100} strokeWidth="2" />
      <rect x="58" y="168" width="46" height="4" fill={C.lilac300} />
      <rect x="58" y="186" width="46" height="4" fill={C.lilac300} />
      <rect x="61" y="156" width="10" height="12" rx="1" fill={C.saffron300} />
      <rect x="75" y="158" width="8" height="10" rx="1" fill={C.plum} />
      <rect x="87" y="174" width="12" height="12" rx="1" fill={C.saffron} />
      <rect x="64" y="174" width="9" height="12" rx="1" fill={C.lilac300} />
      <rect x="122" y="168" width="38" height="96" rx="3" fill={C.plum} />
      <circle cx="152" cy="216" r="2.5" fill={C.saffron300} />
      <Person x={108} y={264} skin="#7A4A2A" top={C.saffron} bottom={C.aub} hair="#3A1846" wrap />
      {/* bridge */}
      <path d="M176 156 Q256 46 336 156" fill="none" stroke={C.lilac300} strokeWidth="14" strokeLinecap="round" />
      <path d="M176 156 Q256 46 336 156" fill="none" stroke={C.aub} strokeWidth="14" strokeLinecap="butt" strokeDasharray="10 8" />
      <Coin cx={215} cy={112} />
      <Coin cx={256} cy={100} r={13} />
      <Coin cx={297} cy={112} />
      {/* investor phone */}
      <rect x="340" y="62" width="104" height="196" rx="16" fill={C.aub} />
      <rect x="348" y="74" width="88" height="172" rx="10" fill={C.white} />
      <MiniMark x={356} y={84} s={0.7} />
      <rect x="352" y="104" width="80" height="34" rx="6" fill={C.lilac50} />
      <rect x="358" y="111" width="38" height="4" rx="2" fill={C.lilac300} />
      <rect x="358" y="121" width="56" height="8" rx="2" fill={C.aub} />
      <rect x="356" y="196" width="10" height="34" rx="2" fill={C.lilac300} />
      <rect x="371" y="184" width="10" height="46" rx="2" fill={C.plum} />
      <rect x="386" y="172" width="10" height="58" rx="2" fill={C.aub} />
      <rect x="401" y="164" width="10" height="66" rx="2" fill={C.saffron} />
      <rect x="352" y="148" width="40" height="12" rx="6" fill={C.saffron100} />
      <Person x={318} y={264} skin="#5C3A21" top={C.plum} bottom={C.ink} armUp />
      {/* accents */}
      <rect x="196" y="214" width="10" height="10" fill={C.saffron300} transform="rotate(45 201 219)" />
      <circle cx="456" cy="44" r="6" fill={C.saffron300} />
      <circle cx="28" cy="70" r="5" fill={C.lilac300} />
    </Svg>
  );
}

/** Documents being checked: a certificate, an ID card, a magnifier and a verified badge. */
export function VerifyIllustration({ className, title = "Business documents being verified" }: IllustrationProps) {
  return (
    <Svg viewBox="0 0 360 260" className={className} title={title}>
      <ellipse cx="180" cy="236" rx="150" ry="14" fill={C.lilac100} />
      <g transform="rotate(-6 140 120)">
        <rect x="70" y="40" width="140" height="180" rx="10" fill={C.white} stroke={C.lilac100} strokeWidth="3" />
        <MiniMark x={86} y={56} s={0.9} />
        <rect x="86" y="90" width="108" height="6" rx="3" fill={C.aub} />
        {[108, 122, 136, 150].map((y) => (
          <rect key={y} x="86" y={y} width={y === 150 ? 70 : 108} height="5" rx="2.5" fill={C.lilac100} />
        ))}
        <circle cx="178" cy="190" r="14" fill={C.saffron100} stroke={C.saffron} strokeWidth="2" />
      </g>
      <rect x="168" y="118" width="130" height="84" rx="10" fill={C.aub} />
      <circle cx="198" cy="152" r="16" fill={C.lilac300} />
      <circle cx="198" cy="146" r="7" fill="#7A4A2A" />
      <path d="M186 164 q12 -12 24 0" fill="#7A4A2A" />
      <rect x="222" y="138" width="60" height="6" rx="3" fill={C.white} />
      <rect x="222" y="152" width="44" height="5" rx="2.5" fill={C.lilac300} />
      <rect x="182" y="182" width="100" height="5" rx="2.5" fill={C.plum} />
      <circle cx="122" cy="168" r="30" fill={C.white} fillOpacity="0.5" stroke={C.plum} strokeWidth="8" />
      <path d="M100 190 L76 214" stroke={C.plum} strokeWidth="10" strokeLinecap="round" />
      <circle cx="288" cy="78" r="30" fill={C.green} />
      <path d="M274 78 l10 10 l18 -20" fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M322 40 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 Z" fill={C.saffron} />
      <circle cx="44" cy="70" r="5" fill={C.saffron300} />
    </Svg>
  );
}

/** Money moving from a phone into a protected custodian vault. */
export function CustodyIllustration({ className, title = "Investor money held safely by a licensed custodian" }: IllustrationProps) {
  return (
    <Svg viewBox="0 0 360 260" className={className} title={title}>
      <ellipse cx="180" cy="236" rx="150" ry="14" fill={C.lilac100} />
      <rect x="34" y="70" width="78" height="150" rx="14" fill={C.aub} />
      <rect x="41" y="82" width="64" height="126" rx="8" fill={C.white} />
      <rect x="49" y="96" width="48" height="10" rx="5" fill={C.saffron} />
      <rect x="49" y="116" width="36" height="5" rx="2.5" fill={C.lilac300} />
      <rect x="49" y="128" width="44" height="5" rx="2.5" fill={C.lilac100} />
      <rect x="49" y="176" width="48" height="18" rx="6" fill={C.aub} />
      <path d="M120 140 C150 110, 170 110, 196 128" fill="none" stroke={C.lilac300} strokeWidth="3" strokeDasharray="6 7" strokeLinecap="round" />
      <Coin cx={142} cy={122} r={9} />
      <Coin cx={170} cy={114} r={10} />
      <path d="M248 40 L314 64 V128 C314 176 284 206 248 222 C212 206 182 176 182 128 V64 Z" fill={C.aub} />
      <path d="M248 56 L300 75 V128 C300 168 277 193 248 207 C219 193 196 168 196 128 V75 Z" fill={C.plum} />
      <rect x="226" y="122" width="44" height="38" rx="6" fill={C.saffron} />
      <path d="M234 122 v-10 a14 14 0 0 1 28 0 v10" fill="none" stroke={C.saffron300} strokeWidth="6" />
      <circle cx="248" cy="138" r="5" fill={C.aub} />
      <rect x="246" y="140" width="4" height="10" rx="2" fill={C.aub} />
      <rect x="226" y="214" width="78" height="22" rx="11" fill={C.white} stroke={C.lilac100} strokeWidth="2" />
      <circle cx="240" cy="225" r="4" fill={C.aub} />
      <rect x="250" y="222" width="42" height="6" rx="3" fill={C.lilac300} />
      <circle cx="328" cy="44" r="6" fill={C.saffron300} />
      <rect x="150" y="54" width="9" height="9" fill={C.lilac300} transform="rotate(45 154.5 58.5)" />
    </Svg>
  );
}

/** A portfolio dashboard: bars, a trend line and labelled money states. */
export function TrackIllustration({ className, title = "A dashboard tracking repayments" }: IllustrationProps) {
  return (
    <Svg viewBox="0 0 360 260" className={className} title={title}>
      <ellipse cx="180" cy="236" rx="150" ry="14" fill={C.lilac100} />
      <rect x="40" y="34" width="250" height="186" rx="14" fill={C.white} stroke={C.lilac100} strokeWidth="3" />
      <rect x="40" y="34" width="250" height="28" rx="14" fill={C.lilac50} />
      <rect x="40" y="48" width="250" height="14" fill={C.lilac50} />
      {[58, 72, 86].map((x) => (
        <circle key={x} cx={x} cy="48" r="4" fill={C.lilac300} />
      ))}
      <rect x="58" y="78" width="70" height="6" rx="3" fill={C.lilac300} />
      <rect x="58" y="90" width="96" height="12" rx="3" fill={C.aub} />
      {[
        [62, 150, C.lilac300],
        [92, 132, C.plum],
        [122, 140, C.lilac300],
        [152, 116, C.plum],
        [182, 124, C.lilac300],
        [212, 100, C.aub],
        [242, 88, C.aub],
      ].map(([x, y, fill]) => (
        <rect key={x as number} x={x as number} y={y as number} width="18" height={(200 - (y as number)) as number} rx="3" fill={fill as string} />
      ))}
      <path d="M70 136 L100 120 L130 126 L160 104 L190 110 L220 86 L250 72" fill="none" stroke={C.saffron} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="250" cy="72" r="7" fill={C.saffron} stroke={C.white} strokeWidth="3" />
      <rect x="236" y="140" width="98" height="78" rx="12" fill={C.aub} />
      {[
        [158, C.green],
        [178, C.saffron],
        [198, C.lilac300],
      ].map(([y, fill]) => (
        <g key={y as number}>
          <circle cx="252" cy={y as number} r="5" fill={fill as string} />
          <rect x="264" y={(y as number) - 3} width="54" height="6" rx="3" fill={C.lilac100} />
        </g>
      ))}
      <Coin cx={318} cy={110} r={13} />
      <circle cx="26" cy="120" r="5" fill={C.saffron300} />
    </Svg>
  );
}
