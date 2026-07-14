export default function Logo({ variant = 'header' }) {
  const isFooter = variant === 'footer'
  const height = isFooter ? 62 : 52

  return (
    <a href="./index.html" className={`logo logo--${variant}`} aria-label="Total Service 24H">
      <svg
        className="logo__mark"
        viewBox="0 0 240 72"
        height={height}
        role="img"
        aria-labelledby="logo-title"
      >
        <title id="logo-title">Total Service 24H</title>

        <g transform="translate(68 0)">
          <rect x="6" y="20" width="24" height="20" rx="3" fill="#b8c8da" />
          <path
            d="M11 20v-7a7 7 0 0114 0v7"
            stroke="#b8c8da"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="18" cy="30" r="2.8" fill="#1e242d" />

          <path
            d="M32 38h12c4.5 0 8-3.5 8-8s-3.5-8-8-8h-5"
            stroke="#0077c8"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M44 22v16M40 22h8" stroke="#0077c8" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="52" cy="17" r="4.5" fill="#0077c8" />
          <path d="M52 21.5v5.5" stroke="#0077c8" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M48 38h8" stroke="#0077c8" strokeWidth="2.8" strokeLinecap="round" />
        </g>

        <text
          x="120"
          y="66"
          textAnchor="middle"
          fontFamily="Source Sans 3, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          letterSpacing="0.5"
        >
          <tspan fill="#ffffff">TOTAL</tspan>
          <tspan fill="#0077c8">SERVICE</tspan>
          <tspan fill="#8fa3bf" fontSize="13" fontWeight="600">
            24H
          </tspan>
        </text>
      </svg>
    </a>
  )
}
