'use client';

import { useEffect } from 'react';
import { initInvitation } from './invitation';

export default function InvitationScript() {
  useEffect(initInvitation, []);
  return null;
}
