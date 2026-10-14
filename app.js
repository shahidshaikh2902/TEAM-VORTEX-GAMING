(() => {
  'use strict';

  const data = vtxData;
  const main = document.getElementById('main-content');
  const page = document.body.dataset.page;
  if (!data || !data.team || !Array.isArray(data.players) || !Array.isArray(data.placementPoints) ||
      !Array.isArray(data.lobbyMatches) || !Array.isArray(data.practiceMatches) || !main) {
    throw new Error('Vortex Gaming page data is missing or invalid.');
  }

  const team = data.team;
  const players = data.players;
  const placementPoints = data.placementPoints;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
  const safeExternalUrl = value => {
    const url = String(value || '').trim();
    return /^https?:\/\//i.test(url) ? url : '';
  };
  const number = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  const totalKills = match => (Array.isArray(match.kills) ? match.kills : []).reduce((sum, kills) => sum + number(kills), 0);
  const placement = match => number(placementPoints[number(match.rank) - 1]);
  const totalPoints = match => placement(match) + totalKills(match);
  const lobby = data.lobbyMatches;
  const practice = data.practiceMatches;
  const statsFor = matches => ({
    games: matches.length,
    wins: matches.filter(match => number(match.rank) === 1).length,
    kills: matches.reduce((sum, match) => sum + totalKills(match), 0),
    placement: matches.reduce((sum, match) => sum + placement(match), 0),
    points: matches.reduce((sum, match) => sum + totalPoints(match), 0),
  });
  const lobbyStats = statsFor(lobby);
  const practiceStats = statsFor(practice);
  const allStats = statsFor([...lobby, ...practice]);
  const section = (title, description, content) => `
    <section class="sec">
      <div class="wrap">
        <div class="sh"><h2>${title}</h2><p>${description}</p></div>
        ${content}
      </div>
    </section>`;
  const statCards = entries => `
    <div class="stats">
      ${entries.map(([value, label]) => `<div class="stat"><b>${escapeHtml(value)}</b><span>${label}</span></div>`).join('')}
    </div>`;
  const empty = (title, copy) => `<div class="empty"><b>${title}</b><p>${copy}</p></div>`;
  const dateLabel = value => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) return '-';
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return '-';
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  const playerTotals = matches => players.map((player, index) => {
    const appearances = matches.filter(match => Array.isArray(match.kills) && match.kills[index] !== undefined);
    const kills = appearances.reduce((sum, match) => sum + number(match.kills[index]), 0);
    return { ...player, played: appearances.length, kills };
  }).sort((first, second) => second.kills - first.kills);
  const table = (headings, rows, emptyMessage) => rows.length
    ? `<div class="table-scroll"><table><thead><tr>${headings.map(heading => `<th scope="col">${heading}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`
    : empty('No matches published yet', emptyMessage);
  const matchTable = (matches, isPractice) => table(
    ['Match', 'Date', 'Rank', 'Kills', isPractice ? 'Points' : 'Prize'],
    [...matches].reverse().map(match => `<tr>
      <th scope="row">${escapeHtml(match.name)}</th>
      <td>${dateLabel(match.date)}</td>
      <td><span class="chip${number(match.rank) === 1 ? ' win' : ''}">#${number(match.rank)}</span></td>
      <td class="k">${totalKills(match)}</td>
      <td>${isPractice ? totalPoints(match) : escapeHtml(match.prize || '-')}</td>
    </tr>`),
    'Match results will appear here when they are added to data.js.'
  );
  const socialLinks = player => {
    const platforms = [['youtube', 'YouTube'], ['instagram', 'Instagram'], ['discord', 'Discord']];
    const links = platforms.map(([key, label]) => {
      const url = safeExternalUrl(player[key]);
      if (!url) return '';
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;
    }).filter(Boolean).join('');
    return links ? `<div class="links">${links}</div>` : '<p class="soon">Social links coming soon</p>';
  };
  const roster = includeLinks => `
    <div class="grid">
      ${players.map(player => `<article class="card pcard">
        <div class="av" aria-hidden="true">${escapeHtml(player.name.replace(/^VTX\./i, '').slice(0, 2))}</div>
        <h3>${escapeHtml(player.name)}</h3>
        <span class="role">${escapeHtml(player.role)}</span>
        ${includeLinks ? socialLinks(player) : ''}
      </article>`).join('')}
    </div>`;
  const rankings = matches => matches.length
    ? table(
      ['Rank', 'Player', 'Role', 'Played', 'Kills', 'Avg. kills'],
      playerTotals(matches).map((player, index) => `<tr>
        <td>${index + 1}</td>
        <th scope="row">${escapeHtml(player.name)}</th>
        <td><span class="role">${escapeHtml(player.role)}</span></td>
        <td>${player.played}</td>
        <td class="k">${player.kills}</td>
        <td>${player.played ? (player.kills / player.played).toFixed(1) : '-'}</td>
      </tr>`),
      'Player rankings will appear after match data is added.'
    )
    : empty('No player stats yet', 'Rankings will appear after match data is added.');

  const pages = {
    index: () => `
      <section class="hero">
        <div class="wrap hero-inner">
          <div>
            <p class="eyebrow">Free Fire esports team</p>
            <h1>${escapeHtml(team.name)}</h1>
            <p class="lead">${escapeHtml(team.description)}</p>
            <div class="btns"><a class="btn" href="lobby.html">Lobby results</a><a class="btn ghost" href="practice.html">Practice stats</a></div>
          </div>
          <img class="hero-logo" src="logo.jpeg" alt="${escapeHtml(team.name)} team logo" width="320" height="320">
        </div>
      </section>
      <div class="wrap">${statCards([[players.length, 'Players'], [allStats.games, 'Matches'], [allStats.wins, 'Wins'], [allStats.kills, 'Total kills']])}</div>
      ${section('Meet the roster', `${players.length} players united by a shared commitment to competitive growth.`, roster(false))}
      ${section('Recent lobby results', 'Review the latest published match results and team performance.', `<div class="card">${matchTable(lobby.slice(-3), false)}</div>`)}
      <section class="sec"><div class="wrap"><div class="cta"><h2>${escapeHtml(team.tagline)}</h2><p>Learn more about the principles and players behind Vortex Gaming.</p><a class="btn" href="about.html">Discover the team</a></div></div></section>`,
    lobby: () => `
      <section class="hero sm"><div class="wrap"><p class="eyebrow">Competitive match record</p><h1>Free Fire lobby <span>results</span></h1><p class="lead">Explore Vortex Gaming's published lobby placements, eliminations, prize results and player statistics.</p></div></section>
      <div class="wrap">${statCards([[lobbyStats.games, 'Lobby games'], [lobbyStats.wins, 'Wins'], [lobbyStats.kills, 'Total kills'], [lobbyStats.games ? (lobbyStats.kills / lobbyStats.games).toFixed(1) : '0.0', 'Kills per game']])}</div>
      ${section('Player performance', 'Total lobby kills by player.', `<div class="card">${rankings(lobby)}</div>`)}
      ${section('Lobby match history', 'The most recent results appear first.', `<div class="card">${matchTable(lobby, false)}</div>`)}`,
    practice: () => `
      <section class="hero sm"><div class="wrap"><p class="eyebrow">Team development</p><h1>Free Fire practice <span>statistics</span></h1><p class="lead">Review practice results, placement points and player performance to follow the team's progress.</p></div></section>
      <div class="wrap">${statCards([[practiceStats.games, 'Matches'], [practiceStats.wins, 'Wins'], [practiceStats.kills, 'Total kills'], [practiceStats.placement, 'Placement points'], [practiceStats.points, 'Total points']])}</div>
      ${section('Player rankings', 'Players ranked by total practice kills.', `<div class="card">${rankings(practice)}</div>`)}
      ${section('Practice match history', 'Points combine placement points and kills.', `<div class="card">${matchTable(practice, true)}</div>`)}`,
    social: () => `
      <section class="hero sm"><div class="wrap"><p class="eyebrow">Team roster</p><h1>Meet the <span>players</span></h1><p class="lead">Get to know the players representing Vortex Gaming and find their social profiles.</p></div></section>
      ${section('Vortex Gaming roster', 'Player profiles and available social links.', roster(true))}`,
    about: () => `
      <section class="hero sm"><div class="wrap"><p class="eyebrow">${escapeHtml(team.tagline)}</p><h1>About ${escapeHtml(team.name)}</h1><p class="lead">${escapeHtml(team.description)}</p></div></section>
      ${section('Our competitive principles', 'The standards that guide how we prepare, communicate and improve.', `<div class="grid">
        <article class="card pad"><h3>Disciplined preparation</h3><p>Structured practice and purposeful preparation support consistent performance.</p></article>
        <article class="card pad"><h3>Coordinated teamwork</h3><p>Clear communication and shared responsibility help the squad make decisions together.</p></article>
        <article class="card pad"><h3>Continuous improvement</h3><p>Reviewing match performance helps identify strengths and opportunities to improve.</p></article>
        <article class="card pad"><h3>Competitive ambition</h3><p>We approach each opportunity with focus and work toward stronger results.</p></article>
      </div>`)}
      ${section('Team roster', 'Meet the players representing Vortex Gaming.', roster(true))}`,
  };

  if (!pages[page]) throw new Error(`Unknown Vortex Gaming page: ${page}`);

  main.innerHTML = pages[page]();
  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  const footer = document.querySelector('.footer-inner');
  const teamLinks = team.links || {};
  const teamSocial = [['youtube', 'YouTube'], ['instagram', 'Instagram'], ['discord', 'Discord']]
    .map(([key, label]) => {
      const url = safeExternalUrl(teamLinks[key]);
      return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : '';
    })
    .filter(Boolean);
  if (footer && teamSocial.length) {
    footer.insertAdjacentHTML('beforeend', `<nav class="team-social" aria-label="Vortex Gaming social media">${teamSocial.join('')}</nav>`);
  }

  const menuButton = document.querySelector('.burger');
  const navigation = document.getElementById('primary-nav');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !expanded);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('open');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('open');
    }
  });
})();
