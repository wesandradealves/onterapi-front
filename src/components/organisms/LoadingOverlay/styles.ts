import type { SxProps, Theme } from '@mui/material';

export const overlayContainerSx: SxProps<Theme> = theme => ({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(31, 84, 98, 0.45)',
  backdropFilter: 'blur(6px)',
  color: '#ffffff',
  zIndex: theme.zIndex.modal + 1
});

export const spinnerSx: SxProps<Theme> = {
  width: 56,
  height: 56
};