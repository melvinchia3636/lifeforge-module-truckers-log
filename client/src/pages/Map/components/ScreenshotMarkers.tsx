import { useQuery } from '@tanstack/react-query';
import { Marker } from 'react-map-gl/maplibre';

import { Box, Icon, Tooltip, useModalStore } from '@lifeforge/ui';

import { forgeAPI } from '@/manifest';

import ScreenshotViewerModal from '@/pages/Gallery/components/ScreenshotViewerModal';
import {
  SCREENSHOT_THUMB,
  screenshotUrl,
} from '@/pages/Gallery/components/utils';

const MARKER_COLOR = '#8b5cf6';
const TOOLTIP_ID = 'screenshot-marker-tooltip';

/** Camera markers for recorded screenshots, optionally scoped to one job. */
export function ScreenshotMarkers(props: {
  jobId?: string;
  refetchInterval?: number | false;
}) {
  const { open } = useModalStore();

  const screenshotsQuery = useQuery({
    ...forgeAPI.screenshots.list
      .input({ jobId: props.jobId, perPage: '1000' })
      .queryOptions(),
    refetchInterval: props.refetchInterval ?? false,
  });

  const items = (screenshotsQuery.data?.items ?? []).filter(
    (item) => item.lon != null && item.lat != null,
  );

  return (
    <>
      {items.map((item) => (
        <Marker
          key={item.id}
          anchor="center"
          latitude={item.lat ?? 0}
          longitude={item.lon ?? 0}
        >
          <button
            data-tooltip-content={item.id}
            data-tooltip-id={TOOLTIP_ID}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              padding: 0,
              borderRadius: '9999px',
              background: MARKER_COLOR,
              color: '#fff',
              border: '2px solid #fff',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
            }}
            type="button"
            onClick={() => open(ScreenshotViewerModal, { screenshot: item })}
          >
            <Icon icon="tabler:camera" />
          </button>
        </Marker>
      ))}
      <Tooltip
        id={TOOLTIP_ID}
        place="top"
        render={({ content }) => {
          const item = items.find((entry) => entry.id === content);

          const url = item ? screenshotUrl(item, SCREENSHOT_THUMB) : undefined;

          return url ? (
            <Box
              shadow
              bg={{ base: 'bg-50', dark: 'bg-700' }}
              p="sm"
              r="md"
            >
              <img
                alt={item?.filename}
                src={url}
                style={{
                  display: 'block',
                  width: 180,
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            </Box>
          ) : null;
        }}
      />
    </>
  );
}
