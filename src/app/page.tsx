import { readFileSync } from 'fs';
import path from 'path';
import InvitationScript from './InvitationScript';

// Original markup, kept verbatim so the design stays pixel-identical.
const markup = readFileSync(path.join(process.cwd(), 'src/app/invitation.html'), 'utf8');

export default function Page() {
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: markup }} />
      <InvitationScript />
    </>
  );
}
