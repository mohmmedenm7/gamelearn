import React from 'react';

// A simple SVG-based character generator based on avatar props
function CharacterAvatar({ avatar, size = 150 }) {
    if (!avatar) {
        avatar = {
            body: 'default',
            hair: 'short',
            outfit: 'casual',
            accessory: 'none',
            color: '#6c5ce7',
            skinColor: '#f5cba7',
            hairColor: '#2d3436'
        };
    }

    return (
        <div
            className="character-avatar-wrapper"
            style={{
                width: size,
                height: size,
                backgroundColor: `${avatar.color}33`, // 33 is 20% opacity hex
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: `3px solid ${avatar.color}`
            }}
        >
            <svg
                viewBox="0 0 100 100"
                width="80%"
                height="80%"
                style={{ position: 'absolute', bottom: '-10%' }}
            >
                {/* Body/Head base */}
                <circle cx="50" cy="40" r="25" fill={avatar.skinColor} />
                <rect x="35" y="60" width="30" height="40" rx="10" fill={avatar.skinColor} />

                {/* Outfits */}
                {avatar.outfit === 'casual' && (
                    <path d="M30 65 Q50 90 70 65 L75 100 L25 100 Z" fill={avatar.color} />
                )}
                {avatar.outfit === 'suit' && (
                    <g>
                        <path d="M30 65 Q50 90 70 65 L75 100 L25 100 Z" fill="#2d3436" />
                        <path d="M45 65 L50 80 L55 65 Z" fill="#fff" />
                        <path d="M50 80 L48 90 L52 90 Z" fill="#e74c3c" />
                    </g>
                )}
                {avatar.outfit === 'ninja' && (
                    <g>
                        <path d="M30 65 Q50 90 70 65 L75 100 L25 100 Z" fill="#111" />
                        <path d="M40 68 L60 68" stroke="#e74c3c" strokeWidth="3" />
                        {/* Ninja mask over face */}
                        <path d="M25 45 Q50 65 75 45 L75 60 Q50 80 25 60 Z" fill="#111" />
                    </g>
                )}
                {avatar.outfit === 'astronaut' && (
                    <g>
                        <path d="M25 65 Q50 80 75 65 L80 100 L20 100 Z" fill="#fff" stroke="#dfe6e9" strokeWidth="2" />
                        <circle cx="50" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
                        <rect x="40" y="70" width="20" height="15" rx="3" fill="#0984e3" />
                        <circle cx="45" cy="77" r="3" fill="#00b894" />
                        <circle cx="55" cy="77" r="3" fill="#d63031" />
                    </g>
                )}

                {/* Eyes (Hide if astronaut/ninja sometimes, but let's keep them for simplicity) */}
                {avatar.outfit !== 'astronaut' && (
                    <g>
                        <circle cx="40" cy="35" r="3" fill="#2d3436" />
                        <circle cx="60" cy="35" r="3" fill="#2d3436" />
                        {/* Smile */}
                        <path d="M42 45 Q50 52 58 45" stroke="#2d3436" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                )}

                {/* Hair Styles */}
                {avatar.hair === 'short' && (
                    <path d="M 25 35 C 25 10, 75 10, 75 35 C 75 25, 60 15, 50 15 C 40 15, 25 25, 25 35 Z" fill={avatar.hairColor} />
                )}
                {avatar.hair === 'long' && (
                    <path d="M 25 35 C 25 5, 75 5, 75 35 L 75 60 C 65 60, 50 20, 50 20 C 50 20, 35 60, 25 60 Z" fill={avatar.hairColor} />
                )}
                {avatar.hair === 'spiky' && (
                    <path d="M 25 30 L 35 15 L 45 25 L 55 10 L 65 25 L 75 15 L 75 35 C 60 40, 40 40, 25 35 Z" fill={avatar.hairColor} />
                )}
                {avatar.hair === 'bald' && null}

                {/* Accessories */}
                {avatar.accessory === 'glasses' && (
                    <g stroke="#111" strokeWidth="2" fill="rgba(255,255,255,0.3)">
                        <rect x="32" y="30" width="14" height="10" rx="2" />
                        <rect x="54" y="30" width="14" height="10" rx="2" />
                        <line x1="46" y1="35" x2="54" y2="35" />
                    </g>
                )}
                {avatar.accessory === 'sunglasses' && (
                    <g fill="#111">
                        <rect x="30" y="30" width="18" height="12" rx="3" />
                        <rect x="52" y="30" width="18" height="12" rx="3" />
                        <line x1="48" y1="35" x2="52" y2="35" stroke="#111" strokeWidth="3" />
                    </g>
                )}
                {avatar.accessory === 'hat' && (
                    <g fill={avatar.color}>
                        <ellipse cx="50" cy="20" rx="30" ry="8" />
                        <path d="M 35 20 L 40 5 L 60 5 L 65 20 Z" />
                    </g>
                )}
            </svg>
        </div>
    );
}

export default CharacterAvatar;
