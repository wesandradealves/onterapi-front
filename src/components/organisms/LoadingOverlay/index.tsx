import { Box, CircularProgress, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import type { LoadingOverlayProps } from './interfaces';
import { overlayContainerSx, spinnerSx } from './styles';

const MotionBox = motion.create(Box);

export const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => (
  <AnimatePresence>
    {isVisible && (
      <MotionBox
        aria-live="assertive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        sx={overlayContainerSx}
      >
        <CircularProgress color="inherit" sx={spinnerSx} />
        <Typography mt={2} variant="body2">
          Carregando...
        </Typography>
      </MotionBox>
    )}
  </AnimatePresence>
);

export default LoadingOverlay;
