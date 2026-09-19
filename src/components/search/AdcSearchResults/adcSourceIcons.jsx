const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  'aria-hidden': true,
};

export function getAdcSourceMeta(sourceType) {
  const key = (sourceType || 'Other').toLowerCase();
  const map = {
    adc: { label: 'ADC', className: 'adc', color: '#0d9488' },
    antibody: { label: 'Antibody', className: 'antibody', color: '#ea580c' },
    payload: { label: 'Payload', className: 'payload', color: '#2563eb' },
    linker: { label: 'Linker', className: 'linker', color: '#dc2626' },
    other: { label: 'Other', className: 'other', color: '#64748b' },
  };
  return map[key] || map.other;
}

export function AdcSourceIcon({ sourceType }) {
  const type = (sourceType || 'Other').toLowerCase();

  if (type === 'adc') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      </svg>
    );
  }
  if (type === 'antibody') {
    return (
      <svg {...iconProps}>
        <path d="M12 3c-2 3-4 5-4 8a4 4 0 0 0 8 0c0-3-2-5-4-8z" />
        <path d="M8 21h8M10 17v4M14 17v4" />
      </svg>
    );
  }
  if (type === 'payload') {
    return (
      <svg {...iconProps}>
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="12" r="2" />
        <path d="M10 12h4M8 12l-2 4M16 12l2 4" />
      </svg>
    );
  }
  if (type === 'linker') {
    return (
      <svg {...iconProps}>
        <path d="M8 12h8" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
        <path d="M12 8v8" />
      </svg>
    );
  }
  return (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 12h8" />
    </svg>
  );
}
