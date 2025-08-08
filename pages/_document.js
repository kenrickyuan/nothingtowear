import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name='application-name' content='Nothing To Wear' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='Nothing To Wear' />
          <meta name='description' content='Best Nothing To Wear in the world' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='msapplication-config' content='/icons/browserconfig.xml' />
          <meta name='msapplication-TileColor' content='#2B5797' />
          <meta name='msapplication-tap-highlight' content='no' />
          <meta name='theme-color' content='#FFFFFF' />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />

          <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' />
          <link rel='apple-touch-icon' sizes='152x152' href='/icons/apple-touch-icon-152x152.png' />
          <link rel='apple-touch-icon' sizes='167x167' href='/icons/apple-touch-icon-167x167.png' />
          <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon-180x180.png' />

          <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
          <link rel='manifest' href='/manifest.json' />
          <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' />
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap' />

          <meta name='twitter:card' content='summary' />
          <meta name='twitter:url' content='https://ihavetoomanyshoes.com' />
          <meta name='twitter:title' content='Nothing To Wear' />
          <meta name='twitter:description' content='Best Nothing To Wear in the world' />
          <meta name='twitter:image' content='https://ihavetoomanyshoes.com/icons/android-chrome-192x192.png' />
          <meta name='twitter:creator' content='@KenrickYuan' />
          <meta property='og:type' content='website' />
          <meta property='og:title' content='Nothing To Wear' />
          <meta property='og:description' content='Best Nothing To Wear in the world' />
          <meta property='og:site_name' content='Nothing To Wear' />
          <meta property='og:url' content='https://ihavetoomanyshoes.com' />
          <meta property='og:image' content='https://ihavetoomanyshoes.com/icons/apple-touch-icon.png' />

          <link rel='apple-touch-startup-image' href='/splashscreens/ipadpro2_splash.png' sizes='2048x2732' />
          <link rel='apple-touch-startup-image' href='/splashscreens/ipadpro1_splash.png' sizes='1668x2224' />
          <link rel='apple-touch-startup-image' href='/splashscreens/ipad_splash.png' sizes='1536x2048' />
          <link rel='apple-touch-startup-image' href='/splashscreens/iphonex_splash.png' sizes='1125x2436' />
          <link rel='apple-touch-startup-image' href='/splashscreens/iphoneplus_splash.png' sizes='1242x2208' />
          <link rel='apple-touch-startup-image' href='/splashscreens/iphone6_splash.png' sizes='750x1334' />
          <link rel='apple-touch-startup-image' href='/splashscreens/iphone5_splash.png' sizes='640x1136' />

          {/* <link href="/splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
          <link href="/splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;