import Script from 'next/script';

const GA_ID = 'G-D51NTR6JSG';

// Google tag (gtag.js). Loaded the same way as the Meta Pixel (via next/script)
// so it runs on every page. Browser-history navigation is tracked automatically
// by Google Analytics' enhanced measurement.
export function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
