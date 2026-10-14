/**
 * Vortex Gaming site content.
 * Update this file to change team details, player links, or match results.
 */
const vtxData = {
  team: {
    name: 'Vortex Gaming',
    tagline: 'Focused preparation. Unified performance.',
    description:
      'Vortex Gaming is a Free Fire esports team committed to disciplined preparation, coordinated play and continuous improvement.',
    links: { youtube: '', instagram: '', discord: '' },
  },

  players: [
    { name: 'VTX.LIMIT', role: 'Player', youtube: '', instagram: '', discord: '' },
    { name: 'VTX.SAHIL', role: 'Player', youtube: '', instagram: '', discord: '' },
    { name: 'VTX.AYUSH', role: 'Player', youtube: '', instagram: '', discord: '' },
    { name: 'VTX.NOBITA', role: 'Player', youtube: '', instagram: '', discord: '' },
  ],

  // Placement points for ranks 1 through 12. Update to match tournament rules.
  placementPoints: [12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0],

  // Add matches as: { name, date: 'YYYY-MM-DD', rank, prize, kills: [player kills in roster order] }
  lobbyMatches: [],
  practiceMatches: [],
};
