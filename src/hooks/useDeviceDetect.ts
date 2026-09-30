import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';

export interface DeviceInfo {
  deviceType: DeviceType;
  orientation: OrientationType;
  width: number;
  height: number;
  hasTouch: boolean;
  hasKeyboard: boolean;
  dpr: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

export function useDeviceDetect(): DeviceInfo {
  const getDeviceInfo = (): DeviceInfo => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        orientation: 'landscape',
        width: 1440,
        height: 900,
        hasTouch: false,
        hasKeyboard: true,
        dpr: 1,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // User-agent detection aid
    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua);
    const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(ua);

    // Orientation
    const isPortrait = height > width;
    const orientation: OrientationType = isPortrait ? 'portrait' : 'landscape';

    // Device classification based on screen resolution and touch capability
    let deviceType: DeviceType = 'desktop';
    if (width < 768 || (isMobileUA && width < 1024)) {
      deviceType = 'mobile';
    } else if (width >= 768 && width <= 1180 && hasTouch) {
      deviceType = 'tablet';
    } else if (width < 1024 && hasTouch) {
      deviceType = 'tablet';
    } else {
      deviceType = 'desktop';
    }

    // Keyboard capability is generally present on desktop or hybrid
    const hasKeyboard = !isMobileUA && (!hasTouch || width >= 1024);

    return {
      deviceType,
      orientation,
      width,
      height,
      hasTouch,
      hasKeyboard,
      dpr,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isPortrait,
      isLandscape: !isPortrait,
    };
  };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo);

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
