import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CharacterAvatar from './CharacterAvatar';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaTimes } from 'react-icons/fa';

const OPTIONS = {
    skinColor: [
        { label: 'فاتح 1', value: '#ffdcb5' },
        { label: 'فاتح 2', value: '#e2b999' },
        { label: 'حنطي', value: '#c79269' },
        { label: 'أسمر 1', value: '#8a5c3c' },
        { label: 'أسمر 2', value: '#5c3922' }
    ],
    hairColor: [
        { label: 'أسود', value: '#111111' },
        { label: 'بني داكن', value: '#3e2723' },
        { label: 'بني فاتح', value: '#795548' },
        { label: 'أشقر', value: '#f4a460' },
        { label: 'رمادي', value: '#9e9e9e' },
        { label: 'أحمر', value: '#d84315' },
        { label: 'أزرق', value: '#1565c0' },
        { label: 'وردي', value: '#e91e63' }
    ],
    color: [
        { label: 'بنفسجي', value: '#6c5ce7' },
        { label: 'أزرق', value: '#0984e3' },
        { label: 'أخضر', value: '#00b894' },
        { label: 'أحمر', value: '#d63031' },
        { label: 'برتقالي', value: '#e17055' },
        { label: 'ذهبي', value: '#fdcb6e' }
    ],
    hair: [
        { label: 'قصير', value: 'short' },
        { label: 'طويل', value: 'long' },
        { label: 'شائك', value: 'spiky' },
        { label: 'أصلع', value: 'bald' }
    ],
    outfit: [
        { label: 'عادي', value: 'casual' },
        { label: 'بدلة', value: 'suit' },
        { label: 'نينجا', value: 'ninja' },
        { label: 'رائد فضاء', value: 'astronaut' }
    ],
    accessory: [
        { label: 'بدون', value: 'none' },
        { label: 'نظارات', value: 'glasses' },
        { label: 'نظارات شمسية', value: 'sunglasses' },
        { label: 'قبعة', value: 'hat' }
    ]
};

function CharacterBuilder({ currentAvatar, onClose }) {
    const { updateContextUser } = useAuth();
    const [avatar, setAvatar] = useState(currentAvatar || {
        body: 'default',
        hair: 'short',
        outfit: 'casual',
        accessory: 'none',
        color: '#6c5ce7',
        skinColor: '#ffdcb5',
        hairColor: '#111111'
    });
    const [loading, setLoading] = useState(false);

    const handleUpdate = (category, value) => {
        setAvatar(prev => ({ ...prev, [category]: value }));
    };

    const saveAvatar = async () => {
        setLoading(true);
        try {
            const response = await userService.updateAvatar(avatar);
            if (response.success) {
                updateContextUser(response.user);
                if (onClose) onClose();
            }
        } catch (error) {
            console.error('Failed to save avatar', error);
            alert('فشل حفظ الشخصية');
        } finally {
            setLoading(false);
        }
    };

    // Render color swatches
    const renderColorOptions = (category, title) => (
        <div className="builder-section">
            <h4 className="builder-subtitle">{title}</h4>
            <div className="color-swatches">
                {OPTIONS[category].map(opt => (
                    <button
                        key={opt.value}
                        className={`color-swatch ${avatar[category] === opt.value ? 'active' : ''}`}
                        style={{ backgroundColor: opt.value }}
                        onClick={() => handleUpdate(category, opt.value)}
                        title={opt.label}
                    />
                ))}
            </div>
        </div>
    );

    // Render text options
    const renderTextOptions = (category, title) => (
        <div className="builder-section">
            <h4 className="builder-subtitle">{title}</h4>
            <div className="text-options">
                {OPTIONS[category].map(opt => (
                    <button
                        key={opt.value}
                        className={`text-option ${avatar[category] === opt.value ? 'active' : ''}`}
                        onClick={() => handleUpdate(category, opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="character-builder glass">
            <div className="builder-header">
                <h3>صمم شخصيتك</h3>
                {onClose && (
                    <button className="builder-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className="builder-layout">
                <div className="builder-preview">
                    <motion.div
                        key={JSON.stringify(avatar)}
                        initial={{ scale: 0.9, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <CharacterAvatar avatar={avatar} size={250} />
                    </motion.div>
                </div>

                <div className="builder-controls">
                    {renderTextOptions('hair', 'تسريحة الشعر')}
                    {renderTextOptions('outfit', 'الزي')}
                    {renderTextOptions('accessory', 'الملحقات')}
                    <div className="builder-colors-row">
                        {renderColorOptions('skinColor', 'لون البشرة')}
                        {renderColorOptions('hairColor', 'لون الشعر')}
                        {renderColorOptions('color', 'اللون المميز')}
                    </div>
                </div>
            </div>

            <div className="builder-actions">
                <button className="btn-save-avatar" onClick={saveAvatar} disabled={loading}>
                    <FaSave /> {loading ? 'جاري الحفظ...' : 'حفظ الشخصية'}
                </button>
            </div>

            <style jsx>{`
        .character-builder {
          padding: 2rem;
          border-radius: 20px;
          background: var(--bg-card);
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .builder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 1rem;
        }
        .builder-header h3 {
          margin: 0;
          color: white;
          font-size: 1.5rem;
        }
        .builder-layout {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .builder-preview {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 250px;
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          padding: 2rem;
        }
        .builder-controls {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 300px;
        }
        .builder-colors-row {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .builder-subtitle {
          color: var(--text-muted);
          margin: 0 0 0.8rem 0;
          font-size: 0.9rem;
        }
        .color-swatches {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .color-swatch {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .color-swatch:hover {
          transform: scale(1.1);
        }
        .color-swatch.active {
          border-color: white;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
          transform: scale(1.15);
        }
        .text-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .text-option {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .text-option:hover {
          background: rgba(255,255,255,0.1);
        }
        .text-option.active {
          background: var(--primary);
          border-color: var(--primary-glow);
          box-shadow: 0 0 15px rgba(108, 92, 231, 0.4);
        }
        .builder-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1.5rem;
        }
        .btn-save-avatar {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-glow));
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-save-avatar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(108,92,231,0.4);
        }
        .btn-save-avatar:disabled {
          opacity: 0.7;
          cursor: wait;
        }
        .builder-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }
        .builder-close-btn:hover {
          color: #ff6b6b;
        }
        @media (max-width: 768px) {
          .builder-layout { flex-direction: column; }
          .builder-colors-row { flex-direction: column; gap: 1rem; }
        }
      `}</style>
        </div>
    );
}

export default CharacterBuilder;
