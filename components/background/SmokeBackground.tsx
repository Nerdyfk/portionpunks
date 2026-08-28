'use client';

import React from 'react';
import PortionPunksAtmosphere from './PortionPunksAtmosphere';
import { AtmosphereConfig } from '@/lib/atmosphereConfig';

interface SmokeBackgroundProps {
  config?: Partial<AtmosphereConfig>;
}

export default function SmokeBackground({ config }: SmokeBackgroundProps) {
  return <PortionPunksAtmosphere config={config} />;
}
