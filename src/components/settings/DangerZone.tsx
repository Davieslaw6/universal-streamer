'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_PREFIX } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastProvider';

export function DangerZone() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const clearAll = () => {
    storage.clearPrefix(STORAGE_PREFIX);
    if (typeof document !== 'undefined') {
      document.cookie = 'us:region=; path=/; max-age=0; samesite=lax';
    }
    setOpen(false);
    toast('All local data cleared.', 'success');
    router.refresh();
  };

  return (
    <section aria-labelledby="danger-heading" className="flex flex-col gap-3">
      <h2 id="danger-heading" className="text-base font-semibold text-text-primary">
        Local data
      </h2>
      <p className="text-sm text-text-secondary">
        Removes your theme choice, enabled services, watchlist, and region from
        this browser. Nothing on any server is affected, because nothing about
        you is stored on a server.
      </p>
      <div>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Clear local data
        </Button>
      </div>

      <ConfirmDialog
        open={open}
        title="Clear all local data?"
        description="Your watchlist, enabled services, region, and theme preference will be removed from this browser. This cannot be undone."
        confirmLabel="Clear everything"
        onConfirm={clearAll}
        onCancel={() => setOpen(false)}
      />
    </section>
  );
}
