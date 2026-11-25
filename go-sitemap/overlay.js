const sitemapOverlay = document.querySelector('.sitemap-overlay');
const restoreButton = document.createElement('button');
restoreButton.type = 'button';
restoreButton.className = 'sitemap-restore';
restoreButton.setAttribute('aria-label', 'Restore site map');
restoreButton.hidden = true;
restoreButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>';
document.body.append(restoreButton);

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.source !== sitemapOverlay.contentWindow || event.data !== 'minimize-sitemap') return;
  sitemapOverlay.hidden = true;
  restoreButton.hidden = false;
  restoreButton.focus();
});

restoreButton.addEventListener('click', () => {
  sitemapOverlay.hidden = false;
  restoreButton.hidden = true;
  sitemapOverlay.focus();
});
