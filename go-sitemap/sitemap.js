const map = document.querySelector('.map');
const originalMap = map.innerHTML;
const toggleButtons = document.querySelectorAll('.version-toggle button');

function showVersion(version) {
  sessionStorage.setItem('go-sitemap-version', version);
  map.innerHTML = originalMap;
  if (version === '2') {
    map.querySelector('.landing').remove();
    const goals = map.querySelector('.goals');
    goals.href = 'goals-landing-v2.html';
    goals.innerHTML = '<span>Goals Tab and G&amp;O Landing</span><span>-outcome visualizations &amp; reporting</span><span>-browse, search &amp; filter goals</span><span>-recs entry point</span>';
    const recs = map.querySelector('.recs');
    recs.href = 'recs-landing-v2.html';
    recs.insertAdjacentHTML('beforeend', '<span>-goals entry point</span>');
    const svgGroup = map.querySelector('.connections g');
    svgGroup.innerHTML = '<path d="M 298 145 H 63 Q 48 145 48 160 V 226" /><path d="M 444 145 H 466 Q 481 145 481 160 V 218" /><path d="M 465 145 H 764" marker-start="url(#arrow)" /><path d="M 768 145 H 745 Q 730 145 730 160 V 218" /><path d="M 914 145 H 935 Q 950 145 950 160 V 218" /><path d="M 98 256 H 116" /><path d="M 214 256 H 235" /><path d="M 334 256 H 405" /><path d="M 556 256 H 653" marker-start="url(#arrow)" /><path d="M 878 256 H 805" /><path d="M 730 291 V 345" />';
  }
  toggleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.version === version)));
  const sitemapLink = document.querySelector('.overlay-sitemap-link');
  sitemapLink.href = `sitemap.html?version=${version}`;
  sitemapLink.setAttribute('aria-label', `Open sitemap ${version}`);
  sitemapLink.querySelector('span').textContent = version;
}

toggleButtons.forEach(button => button.addEventListener('click', () => {
  showVersion(button.dataset.version);
  const url = new URL(location.href);
  url.searchParams.set('version', button.dataset.version);
  history.replaceState(null, '', url);
}));
const requestedVersion = new URLSearchParams(location.search).get('version');
showVersion(requestedVersion === '1' || requestedVersion === '2' ? requestedVersion : sessionStorage.getItem('go-sitemap-version') === '2' ? '2' : '1');
