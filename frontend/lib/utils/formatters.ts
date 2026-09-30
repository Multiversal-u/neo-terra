export function formatCapital(n: number): string {
  if (n >= 1e9) {
    return `$${(n / 1e9).toFixed(1)}B`;
  }
  if (n >= 1e6) {
    return `$${(n / 1e6).toFixed(1)}M`;
  }
  if (n >= 1e3) {
    return `$${(n / 1e3).toFixed(1)}K`;
  }
  return `$${n.toFixed(2)}`;
}

export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

export function getVariableColor(value: number): string {
  if (value < 0.3) {
    return 'text-neoterra-red'; // danger
  } else if (value < 0.7) {
    return 'text-neoterra-gold'; // warning/medium
  } else {
    return 'text-neoterra-green'; // success
  }
}

export function getArchetypeColor(archetype: string): string {
  const lowerArch = archetype.toLowerCase();
  switch (lowerArch) {
    case 'cybernetic':
    case 'hacker':
      return 'text-neoterra-cyan';
    case 'mystic':
    case 'psionic':
      return 'text-neoterra-purple';
    case 'mercenary':
    case 'enforcer':
      return 'text-neoterra-red';
    case 'merchant':
    case 'broker':
      return 'text-neoterra-gold';
    case 'bio-engineer':
    case 'healer':
      return 'text-neoterra-green';
    default:
      return 'text-white';
  }
}

export function getArchetypeIcon(archetype: string): string {
  const lowerArch = archetype.toLowerCase();
  switch (lowerArch) {
    case 'cybernetic':
    case 'hacker':
      return '💻';
    case 'mystic':
    case 'psionic':
      return '🔮';
    case 'mercenary':
    case 'enforcer':
      return '⚔️';
    case 'merchant':
    case 'broker':
      return '💰';
    case 'bio-engineer':
    case 'healer':
      return '🧬';
    default:
      return '👤';
  }
}
