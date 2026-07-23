# Event Invitation Template

This is a premium static invitation website for weddings and elegant birthday celebrations, including milestone birthdays such as a 60th birthday. It uses plain HTML, CSS, and JavaScript. There is no build step and no backend.

Open `index.html` in a browser to preview it.

If the opening invitation screen disappears while previewing, that means the browser remembers it was already opened in the current session. Add `?resetInvite=1` to the end of the preview URL, or close the tab and open the file again.

## Personalized Guest Names

You do not need to edit `config.js` for every guest. Add the guest name to the invitation link:

```text
index.html?guest=Juan%20and%20Family
```

That shows:

```text
Dear Juan and Family
```

You can also use `to` or `name`:

```text
index.html?to=Maria%20Santos
index.html?name=The%20Reyes%20Family
```

For deployed websites, use the full website link:

```text
https://your-vercel-domain.vercel.app/?guest=Juan%20and%20Family
```

Spaces should be written as `%20`. If you copy a link from a browser after typing spaces, the browser usually converts them automatically.

## Edit These First

Open `config.js` and update these values first:

1. `eventType`: use `"wedding"` or `"birthday"`.
2. `wedding.names` or `birthday.names`.
3. `wedding.mainTitle` / `birthday.mainTitle` and `subtitle`.
4. `eventDate`, `startTime`, and `endTime`.
5. `venueName`, `venueAddress`, and `googleMapsLink`.
6. `rsvpLink`, `rsvpDeadline`, `contactPerson`, `contactNumber`, and `email`.
7. `images.hero`, `images.mobileHero`, `images.profile`, and `images.gallery`.
8. `videoUrl`, `backgroundMusicUrl`, and gift details if needed.
9. `seo.pageTitle`, `seo.description`, `seo.ogTitle`, `seo.ogDescription`, and `seo.ogImage`.

## Switch Event Type

Change only this line in `config.js`:

```js
eventType: "wedding"
```

or:

```js
eventType: "birthday"
```

The headings, story language, program, gift copy, and theme will switch to the matching configuration.

## Edit Names And Event Details

Wedding values live inside the `wedding` object. Birthday values live inside the `birthday` object. Shared event details such as date, time, venue, RSVP, contact, video, and music live below those objects.

## Replace Images

Put new images inside `assets/images/`, then update:

```js
images: {
  hero: "assets/images/your-hero.jpg",
  mobileHero: "assets/images/your-mobile-hero.jpg",
  profile: "assets/images/your-profile.jpg"
}
```

Use portrait images for `profile` and a wide cinematic image for `hero`. You can tune cropping with `heroPositionDesktop` and `heroPositionMobile`.

## Add Gallery Photos

Add photos to `assets/images/`, then edit the `gallery` array:

```js
gallery: [
  {
    src: "assets/images/photo-1.jpg",
    alt: "Couple smiling during golden hour",
    caption: "A quiet frame of love."
  }
]
```

The gallery supports mixed portrait and landscape images, lazy loading, captions, lightbox navigation, keyboard arrows, Escape to close, and mobile swipe.

## Add Google Maps

Search your venue on Google Maps, click Share, copy the link, and paste it into:

```js
googleMapsLink: "https://maps.google.com/..."
```

## Connect Google Forms

This project is already wired to the built-in RSVP flow and Google Sheet tracker through `rsvpTracker.appsScriptUrl` in `config.js`.

Use an external RSVP link only if you want to bypass the built-in flow:

```js
rsvpLink: "https://forms.gle/..."
```

Or paste an embeddable form URL into:

```js
googleFormEmbedUrl: "https://docs.google.com/forms/d/e/.../viewform?embedded=true"
```

Leave `googleFormEmbedUrl` empty to hide the embedded form.

## Add Background Music

Put your music file in `assets/music/`, then set:

```js
backgroundMusicUrl: "assets/music/song.mp3"
```

Browsers do not allow music to autoplay before the guest interacts with the page. This template starts music only after the invitation is opened or after the guest presses the sound button.

If you do not have a music file yet, keep:

```js
useGeneratedBackgroundMusic: true
```

This shows the music button and plays a soft generated ambient background. Set it to `false` when you only want to use your own uploaded MP3.

## Add YouTube, Vimeo, Or MP4 Video

Paste one of these into `videoUrl`:

```js
videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
videoUrl: "https://vimeo.com/VIDEO_ID"
videoUrl: "assets/video/film.mp4"
```

Leave it empty to hide the video section automatically.

## Change Colors And Fonts

Edit the active event theme:

```js
theme: {
  primaryColor: "#f6efe4",
  secondaryColor: "#1c1712",
  accentColor: "#b48a4d",
  textColor: "#211c17",
  backgroundColor: "#fbf7f0",
  headingFont: "'Cormorant Garamond', Georgia, serif",
  bodyFont: "'Inter', Arial, sans-serif"
}
```

You can also adjust `borderRadius`, `overlayOpacity`, and `sectionSpacing`.

## Generate And Replace The QR Code

Deploy the website first so you have the final URL. Generate a QR code using any trusted QR generator, save it into `assets/qr/`, then update:

```js
qrCode: "assets/qr/your-qr-code.png"
```

The included QR is only a placeholder.

## Vercel Deployment

This is a no-build static project. Import the GitHub repository into Vercel with these settings:

- Framework preset: `Other`
- Build command: leave blank
- Output directory: leave blank
- Install command: leave blank
- Environment variables: none required

Run this before committing or deploying:

```bash
npm run check
```

The RSVP form submits directly from the browser to the Google Apps Script URL in `config.js`, so no Vercel serverless route is required.

## Deploy To Netlify

Drag the `event-invitation-template` folder into Netlify Drop, or connect it from Git. Leave the build command blank and set the publish directory to the folder containing `index.html`.

## Deploy To GitHub Pages

Create a new repository, upload all files from this folder, then enable GitHub Pages from the repository settings. Choose the branch and root folder that contain `index.html`.

## Create A New Client Version

Duplicate the whole `event-invitation-template` folder and rename the copy for the client, such as `client-daniel-sophia-wedding`. Edit only the copied folder. Keep the original folder as the clean master template.

## Optional Sections

These sections hide automatically when their config values are empty:

- Video
- RSVP form embed
- Gift details
- Gallery
- Program
- Background music control
- RSVP section, when all RSVP/contact values are empty

## Calendar Buttons

The Google Calendar link and downloadable `.ics` file are generated from `eventDate`, `startTime`, `endTime`, `venueName`, `venueAddress`, and the active event title.
## Google Sheet RSVP setup

1. Create a new Google Sheet.
2. Open `Extensions > Apps Script`.
3. Paste the code from `google-apps-script-rsvp.js`.
4. Change `TOTAL_GUESTS` in the Apps Script file if needed.
5. Click `Deploy > New deployment > Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Copy the Web App URL.
9. Paste it into `config.js`:

```js
rsvpTracker: {
  appsScriptUrl: "PASTE_WEB_APP_URL_HERE"
}
```

The invitation will submit RSVPs to the Sheet and the tracker will refresh from it.

Guest links may use the `Slug` column:

```text
https://your-vercel-domain.vercel.app/?guest=mary-ann-i-flores
```

The website asks the same Apps Script URL for the matching `Guest List` row and displays the exact `Display Name` value. After changing `google-apps-script-rsvp.js`, redeploy the Apps Script web app so the live website can use the updated lookup.
