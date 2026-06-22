// Replace G-XXXXXXXXXX with your real Google Analytics 4 Measurement ID.
window.AI_FORMAT_TOOLS_GA_ID = 'G-XXXXXXXXXX';
(function () {
  var id = window.AI_FORMAT_TOOLS_GA_ID;
  if (!id || id === 'G-XXXXXXXXXX') return;
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);
})();
