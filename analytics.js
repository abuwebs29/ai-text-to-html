// Google Analytics placeholder for AI Format Tools.
// Replace G-XXXXXXXXXX with your real GA4 Measurement ID, for example G-ABC123XYZ.
(function(){
  var measurementId = 'G-XXXXXXXXXX';
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
})();
