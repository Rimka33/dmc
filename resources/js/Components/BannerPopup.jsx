import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BannerPopup() {
    const [banner, setBanner] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        fetchPopupBanner();
    }, []);

    const fetchPopupBanner = async () => {
        try {
            const response = await api.get('/banners', {
                params: { type: 'popup', position: 'popup' }
            });
            if (response.data.success && response.data.data.length > 0) {
                const activeBanner = response.data.data[0];
                // Vérifier si la popup a déjà été fermée (localStorage)
                const dismissedBannerId = localStorage.getItem('dismissed_banner_id');
                if (dismissedBannerId !== String(activeBanner.id)) {
                    setBanner(activeBanner);
                    setIsVisible(true);
                    
                    // Auto-fermer après la durée d'affichage si définie
                    if (activeBanner.display_duration) {
                        setTimeout(() => {
                            handleClose();
                        }, activeBanner.display_duration * 1000);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching popup banner:', error);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            if (banner) {
                localStorage.setItem('dismissed_banner_id', String(banner.id));
            }
        }, 300);
    };

    if (!isVisible || !banner) return null;

    const imageUrl = window.innerWidth < 768 && banner.mobile_image 
        ? banner.mobile_image 
        : banner.image;

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Popup Content */}
            <div className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-lg"
                >
                    <X size={20} />
                </button>

                {/* Banner Image/Content */}
                {banner.link ? (
                    <Link to={banner.link} onClick={handleClose}>
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt={banner.title}
                                className="w-full h-auto object-cover"
                                onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                            />
                            {banner.description && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h3 className="text-white font-bold text-xl mb-2">{banner.title}</h3>
                                    <p className="text-white/90 text-sm">{banner.description}</p>
                                </div>
                            )}
                        </div>
                    </Link>
                ) : (
                    <div className="relative">
                        <img
                            src={imageUrl}
                            alt={banner.title}
                            className="w-full h-auto object-cover"
                            onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                        />
                        {banner.description && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <h3 className="text-white font-bold text-xl mb-2">{banner.title}</h3>
                                <p className="text-white/90 text-sm">{banner.description}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Button if provided */}
                {banner.button_text && banner.button_link && (
                    <div className="p-6 bg-white">
                        <Link
                            to={banner.button_link}
                            onClick={handleClose}
                            className="block w-full px-6 py-3 bg-forest-green text-white text-center font-bold rounded-lg hover:bg-dark-green transition-colors"
                        >
                            {banner.button_text}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

