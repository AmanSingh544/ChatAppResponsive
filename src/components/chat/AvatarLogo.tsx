import React from 'react';

interface AvatarLogoProps {
  tooltipTitle?: string;
  avatarText: string;
  index: number;
  clickFn?: () => void;
}

const colors = ['#FF5722', '#673AB7', '#4CAF50', '#2196F3', '#009688'];

const avatarStyle = (bgColor: string, isClickable: boolean): React.CSSProperties => ({
  backgroundColor: bgColor,
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: isClickable ? 'pointer' : 'default',
  userSelect: 'none',
});

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
};

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '110%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#333',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  whiteSpace: 'nowrap',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  pointerEvents: 'none',
};

export const AvatarLogo: React.FC<AvatarLogoProps> = ({
  tooltipTitle = '',
  avatarText,
  index,
  clickFn,
}) => {
  const bgColor = colors[index % colors.length];
  const isClickable = typeof clickFn === 'function';

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLDivElement;
    if (tooltip) tooltip.style.opacity = '1';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLDivElement;
    if (tooltip) tooltip.style.opacity = '0';
  };

  return (
    <div
      style={wrapperStyle}
      onClick={clickFn}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={avatarStyle(bgColor, isClickable)}>{avatarText.toUpperCase()}</div>
      {tooltipTitle && <div className="tooltip" style={tooltipStyle}>{tooltipTitle}</div>}
    </div>
  );
};

export default AvatarLogo;
