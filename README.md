# Vortex Gaming website

A responsive, static website for the Vortex Gaming Free Fire esports team.

## Pages and files

- `index.html` - team homepage and overview.
- `lobby.html` - lobby match history and player statistics.
- `practice.html` - practice results, placement points and player rankings.
- `social.html` - player profiles and social links.
- `about.html` - team information and values.
- `data.js` - team details, roster, links and match records.
- `app.js` - shared page rendering and statistics calculations.
- `style.css` - responsive site styles.
- `logo.jpeg` - team logo used for the site identity.
- `robots.txt` - permits public search crawlers.

## Updating team data

Edit `data.js`; do not add match totals by hand because the site calculates them from match records.

Add a match to `lobbyMatches` or `practiceMatches` in this format:

```js
{
  name: 'Lobby 1',
  date: '2026-10-20',
  rank: 3,
  prize: 'No',
  kills: [4, 2, 1, 3],
}
```

The `kills` array must follow the same order as the `players` array. Use a date in `YYYY-MM-DD` format. The `prize` field is displayed for lobby matches. Practice match points are calculated from placement points plus kills. Edit `placementPoints` if the tournament uses different scoring.

For social links, add full `https://` URLs to the relevant player's `youtube`, `instagram` or `discord` field. Blank fields are not shown.

## Search engine setup

Page titles and descriptions, social sharing descriptions, structured team data, semantic headings, crawlable links and `robots.txt` are included. Before publishing, add the real domain's canonical URLs, an absolute social preview image URL and a sitemap, then submit the sitemap in Google Search Console. These absolute URLs are intentionally not guessed because the production domain has not been supplied.

## Preview

Open `index.html` in a browser. For deployment, publish all files in this folder together so the relative page, stylesheet, script and logo paths continue to resolve.
