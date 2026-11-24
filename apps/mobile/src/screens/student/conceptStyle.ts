import { colors } from '../../theme/colors';
import type { Concept } from '../../data/studentMock';

export const conceptStyle: Record<Concept, { bg: string; fg: string }> = {
  'Muy Bueno': { bg: colors.emeraldLight, fg: colors.emeraldDark },
  Bueno: { bg: colors.celesteLight, fg: colors.celesteDark },
  Regular: { bg: colors.amberLight, fg: colors.amberDark },
  'En proceso': { bg: colors.accentRedLight, fg: colors.accentRedText },
};
