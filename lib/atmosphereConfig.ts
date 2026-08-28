export interface AtmosphereConfig {
  smokeEnabled: boolean;
  smokeIntensity: number; // 0.5 to 1.5
  leafParticlesEnabled: boolean;
  leafCountDesktop: number;
  leafCountMobile: number;
  ambientParticlesEnabled: boolean;
  particleCountDesktop: number;
  particleCountMobile: number;
  parallaxEnabled: boolean;
  parallaxStrength: number;
  gridEnabled: boolean;
  vignetteEnabled: boolean;
}

export const defaultAtmosphereConfig: AtmosphereConfig = {
  smokeEnabled: true,
  smokeIntensity: 1.0,
  leafParticlesEnabled: true,
  leafCountDesktop: 16,
  leafCountMobile: 6,
  ambientParticlesEnabled: true,
  particleCountDesktop: 45,
  particleCountMobile: 15,
  parallaxEnabled: true,
  parallaxStrength: 1.0,
  gridEnabled: true,
  vignetteEnabled: true,
};
