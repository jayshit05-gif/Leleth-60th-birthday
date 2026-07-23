/* Edit this file first. Change eventType to "wedding" or "birthday". */
window.INVITATION_CONFIG = {
  eventType: "birthday", // Change to "wedding" or "birthday"
  guestName: "Dear Jay-ar Guest", // Change to the guest's name
  guestLink: "?guest=Jay-ar%20Guest", // Change the guest query value for each guest link
  enableOpeningScreen: true,
  openingTitle: "You Are Cordially Invited",

  wedding: {
    names: "Leleth's 60th Birthday",
    mainTitle: "Sixty Years of Love, Strength & Grace",
    subtitle: "With grateful hearts, we invite you to celebrate the 60th birthday of our beloved mother as we honor six decades of love, sacrifice, resilience, and unforgettable memories. Your presence will be the greatest gift as we gather to celebrate this remarkable milestone together.",
    introMessage: "For sixty wonderful years, she has lived a life defined by love, compassion, and quiet strength. As a devoted mother, a dedicated teacher, and a guiding light to many, she has touched countless lives with her kindness, wisdom, and unwavering heart.Today, we celebrate not only the years she has lived, but the lives she has inspired, the lessons she has shared, and the love she continues to give so generously. We are truly grateful to have you with us as we honor this remarkable milestone and create new memories together.",
    fullStory: "<p>For sixty wonderful years, she has lived a life defined by love, compassion, and quiet strength. As a devoted mother, a dedicated teacher, and a guiding light to many, she has touched countless lives with her kindness, wisdom, and unwavering heart.</p>",
    storyTimeline: [
      { year: "2019", text: "First meeting and a conversation that lingered." },
      { year: "2021", text: "A season of long walks, family introductions, and shared dreams." },
      { year: "2025", text: "The proposal, the yes, and the start of wedding plans." }
    ],
    dressCode: "Formal / Champagne, black, ivory, or earth tones",
    theme: {
      primaryColor: "#f6efe4",
      secondaryColor: "#1c1712",
      accentColor: "#b48a4d",
      textColor: "#211c17",
      backgroundColor: "#fbf7f0",
      headingFont: "'Cormorant Garamond', Georgia, serif",
      bodyFont: "'Inter', Arial, sans-serif",
      borderRadius: "6px",
      overlayOpacity: "0.48",
      sectionSpacing: "clamp(72px, 10vw, 132px)"
    },
    program: [
      { time: "3:00 PM", title: "Guest Arrival" },
      { time: "4:00 PM", title: "Ceremony" },
      { time: "5:00 PM", title: "Photo Session" },
      { time: "6:30 PM", title: "Dinner and Toasts" },
      { time: "8:00 PM", title: "First Dance" },
      { time: "8:30 PM", title: "Celebration" }
    ],
    gift: {
      enabled: true,
      title: "Your Presence Is Our Gift",
      message: "Your prayers and presence mean the most. For those who wish to give, details are available below.",
      details: "Gift registry: example.com/registry<br>Bank: Sample Bank<br>Account Name: Daniel and Sophia<br>Account Number: 0000-0000-0000"
    },
    images: {
      hero: "assets/images/wedding-hero.jpg",
      mobileHero: "assets/images/wedding-hero.jpg",
      background: "assets/images/texture.jpg",
      profile: "assets/images/wedding-gallery-1.jpg",
      qrCode: "assets/qr/qr-placeholder.svg",
      heroPositionDesktop: "center center",
      heroPositionMobile: "center center",
      gallery: [
        { src: "assets/images/wedding-hero.jpg", alt: "Elegant couple portrait", caption: "A quiet frame of love." },
        { src: "assets/images/wedding-gallery-1.jpg", alt: "Cinematic celebration detail", caption: "The details that remember the day." },
        { src: "assets/images/gallery-2.jpg", alt: "Textured invitation detail", caption: "Soft textures, warm memories." }
      ]
    },
    seo: {
      pageTitle: "Daniel and Sophia | Together, Always",
      description: "A premium cinematic wedding invitation.",
      ogTitle: "Daniel and Sophia",
      ogDescription: "Celebrate the beginning of forever with us.",
      ogImage: "assets/images/wedding-hero.jpg",
      themeColor: "#b48a4d"
    }
  },

  birthday: {
    names: "Leleth's 60th Birthday",
    mainTitle: "Sixty Years of Love, Strength & Grace",
    subtitle: "Join us for an elegant milestone celebration honoring six decades of love, sacrifice, resilience, and beautiful memories.",
    introMessage: "For sixty wonderful years, she has lived a life defined by love, compassion, and quiet strength. As a devoted mother, a dedicated teacher, and a guiding light to many, she has touched countless lives with her kindness, wisdom, and unwavering heart. Today, we celebrate not only the years she has lived, but the lives she has inspired, the lessons she has shared, and the love she continues to give so generously.",
    fullStory: "<p>Leleth's story is one of devotion, resilience, and quiet grace. Through every season, she has carried her family with warmth, faith, and a generous heart.</p><p>This celebration is a tribute to her journey as a mother, teacher, friend, and guiding light. We gather to honor the memories she has created, the people she has inspired, and the love she continues to pour into everyone around her.</p>",
    storyTimeline: [
      { year: "1966", text: "A beautiful life begins." },
      { year: "1990", text: "A new family chapter unfolds." },
      { year: "2026", text: "Sixty years of love, strength, and memories." }
    ],
    dressCode: "Formal or semi-formal",
    guestRules: [
      "Although we love to watch children run and play, this will be an adults-only kind of day.",
      "No plus-one unless personally included in the invitation.",
      "Please come ready to celebrate, share stories, and make the evening meaningful for our beloved celebrant.",
      "Kindly arrive on time and stay with us until the end of the program.",
      "Please follow the black and silver motif.",
      "Confirm your attendance by the RSVP deadline."
    ],
    hashtag: "#TimeLethss@Sixty",
    guestGuide: {
      adultOnly: "Although we love to watch children run and play, this will be an adults-only kind of day.",
      reminders: "We are truly honored to celebrate this special milestone with the people who have been part of Mom's journey through the years. Your presence is the greatest gift we could ask for as we celebrate her 60 wonderful years of love, kindness, and dedication. Please take a moment to confirm your attendance by completing the RSVP form below. We look forward to celebrating this unforgettable day with you!",
      snapShare: "Help us capture the moments. Please share your photos using the birthday hashtag.",
      rsvpNote: "We are looking forward to celebrating with you. Kindly respond by August 3, 2026, so we can prepare your seat with care. If your plans change after submitting your RSVP, we would greatly appreciate it if you could let us know as soon as possible.",
    },
    faqs: [
      {
        question: "When and where is the birthday party again?",
        answer: "The celebration date, time, and venue are listed in the invitation details. You can use the location button for directions through Google Maps."
      },
      {
        question: "What time should I arrive?",
        answer: "Please arrive early to register, find your seat, mingle with guests, and enjoy the photo moments before the program starts."
      },
      {
        question: "What should I wear?",
        answer: "Please wear black and silver formal or semi-formal attire so everyone looks beautifully coordinated for the evening."
      },
      {
        question: "Can I bring someone with me?",
        answer: "Unfortunately, no, unless we have personally confirmed it. Because of venue capacity and seating arrangements, we can only accommodate officially invited guests."
      },
      {
        question: "Can we sit anywhere at the venue?",
        answer: "To make sure everyone is comfortably seated, coordinators or family members may assist with seating arrangements."
      },
      {
        question: "Do you have any gift preference?",
        answer: "Your presence is the greatest gift we could ask for. If you still wish to give, anything heartfelt or monetary would be deeply appreciated."
      },
      {
        question: "What is RSVP, how do I do it, and why is it important?",
        answer: "RSVP means please respond. Kindly confirm whether you can attend so we can finalize the guest list, catering, and seating."
      },
      {
        question: "I initially said no, but my plans changed. What should I do?",
        answer: "Please let us know as soon as possible. We will do our best, but seat availability may no longer be guaranteed."
      },
      {
        question: "When is the appropriate time to leave?",
        answer: "We kindly ask that you stay with us until the end of the program so we can celebrate the full evening together."
      },
      {
        question: "How can I help the celebrant have the best time?",
        answer: "Pray with us for blessings, RSVP on time, follow the attire guide, arrive early, stay until the end, and enjoy the celebration."
      }
    ],
    theme: {
      primaryColor: "#f4f4f1",
      secondaryColor: "#070707",
      accentColor: "#d8842b",
      textColor: "#171717",
      backgroundColor: "#eeeeea",
      headingFont: "'Great Vibes', 'Cormorant Garamond', Georgia, serif",
      bodyFont: "'Inter', Arial, sans-serif",
      borderRadius: "6px",
      overlayOpacity: "0.58",
      sectionSpacing: "clamp(72px, 10vw, 132px)"
    },
    program: [
      { time: "4:00 PM", title: "Guest Arrival" },
      { time: "4:30 PM", title: "Opening Prayer" },
      { time: "4:50 PM", title: "Audio-Visual Presentation" },
      { time: "5:00 PM", title: "Dinner" },
      { time: "5:30 PM", title: "Family Messages" },
      { time: "6:00 PM", title: "Cake Ceremony" },
      { time: "7:15 PM", title: "Thanks giving" },
      { time: "7:25 - 7:50 PM", title: "Games, Performances and Family dance" },
      { time: "7:50 - 8:00 PM", title: "Photo Session and Celebration" }
    ],
    gift: {
      enabled: true,
      title: "Gift Guide",
      message: "Your presence and prayers are the greatest gifts. If you still wish to give a token of love, anything heartfelt will be deeply appreciated.",
      details: "Suggested gifts: <br> Heartfelt letters • Framed family photos • Fresh flowers • Books • Personalized keepsakes • Memory albums • Potted plants • Homemade treats • A simple token of love. <br><span class=\"gift-details-note\">The greatest gift is celebrating this special day with you. Your presence is more than enough.</span>"
    },
    images: {
      hero: "assets/images/mom-60-umbrella-hero.jpg",
      mobileHero: "assets/images/mom-60-umbrella-hero.jpg",
      background: "assets/images/texture.jpg",
      profile: "assets/images/birthday-hero.jpg",
      qrCode: "assets/qr/qr-placeholder.svg",
      heroPositionDesktop: "68% center",
      heroPositionMobile: "70% center",
      photoBreaks: [
        [
          { src: "assets/images/A7P06314.jpg", alt: "", caption: "" },
          { src: "assets/images/A7P06432.jpg", alt: "", caption: "" },
          { src: "assets/images/A7P06547.jpg", alt: "", caption: "" }
        ],
        [
          { src: "assets/images/A7P06650.jpg", alt: "Elegant celebrant portrait", caption: "" },
          { src: "assets/images/A7P06639.jpg", alt: "Celebrant milestone portrait", caption: "" },
          { src: "assets/images/A7P06620.jpg", alt: "Warm celebrant photo", caption: "" }
        ]
      ],
      gallery: [
        { src: "assets/images/A7P06746.jpg", alt: "Warm milestone portrait", caption: "A life beautifully celebrated." },
        { src: "assets/images/A7P06748.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06314.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06374.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06375.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06376.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06420.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06433.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06748.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06750.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06729.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06730.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06732.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06728.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06733.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06712.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06716.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06721.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06710.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06694.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06680.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06681.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06683.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06686.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06678.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06677.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06674.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06671.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06667.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06668.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06669.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06661.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06660.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06653.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06650.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06647.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06646.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06639.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06638.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06636.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06601.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06600.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06598.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06594.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06593.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06430.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06434.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06437.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06489.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06512.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06540.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06547.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06571.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06512.jpg", alt: "Elegant celebration texture", caption: "" },
        { src: "assets/images/A7P06651.jpg", alt: "Family celebration detail", caption: "" }
      ]
    },
    seo: {
      pageTitle: "Leleth's 60th Birthday",
      description: "A premium cinematic birthday invitation.",
      ogTitle: "Leleth's 60th Birthday",
      ogDescription: "Celebrate sixty years of love, strength, and grace with us.",
      ogImage: "assets/images/mom-60-umbrella-hero.jpg",
      themeColor: "#d8842b"
    }
  },

  eventDate: "2026-08-21",
  startTime: "16:00",
  endTime: "20:00",
  timeZone: "Asia/Manila",
  passedMessage: "Thank you for celebrating with us.",
  venueName: "D'Kusinera Cafe-Bistro",
  venueAddress: "2nd Floor (above the 7/11), The Margarette Business Hotel, Sayre Highway, Purok 2, South Poblacion, Maramag, Bukidnon",
  googleMapsLink: "https://maps.app.goo.gl/n11PbqJxX9W7o2uk7",
  rsvpLink: "#rsvp",
  rsvpDeadline: "2026-08-03",
  rsvpInstructions: "Kindly confirm your attendance by the RSVP deadline so we can prepare your seat with care.",
  rsvpConfirmation: {
    title: "Thank You! \uD83C\uDF89",
    message: "Your RSVP has been received. We're truly grateful you'll be celebrating this special milestone with us. We look forward to sharing laughter, memories, and a wonderful evening together.",
    datePrefix: "See you on"
  },
  rsvpTracker: {
    enabled: true,
    totalGuests: 50,
    accepted: 0,
    declined: 0,
    pendingLabel: "Not Yet Responded",
    refreshSeconds: 10,
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbybJZxIR3km5E72781bi_u0y4uIij4gdsT_cL3XXUOtiG9U9IH-_ay9v7ixveKrf7dp/exec",
    note: "Updates automatically when connected to an RSVP response source."
  },
  googleFormEmbedUrl: "",
  contactPerson: "Desiree",
  contactNumber: "+63 975 424 1005",
  email: "",
  socialMediaLink: "https://facebook.com/",
  videoUrl: "",
  backgroundMusicUrl: "assets/music/sugar-maroon5-instrumental.mp3",
  useGeneratedBackgroundMusic: false,
  footerMessage: "Thank you for being part of this meaningful celebration.",
  credit: "Invitation website created by Moumeants and Frames.",

  images: {
    hero: "assets/images/mom-60-umbrella-hero.jpg",
    mobileHero: "assets/images/mom-60-umbrella-hero.jpg",
    background: "assets/images/texture.jpg",
    profile: "assets/images/birthday-hero.jpg",
    qrCode: "assets/qr/qr-placeholder.svg",
    heroPositionDesktop: "68% center",
    heroPositionMobile: "70% center",
    photoBreaks: [
      [
        { src: "assets/images/A7P06571.jpg", alt: "Elegant celebrant portrait", caption: "" },
        { src: "assets/images/A7P06434.jpg", alt: "Celebrant milestone portrait", caption: "" },
        { src: "assets/images/A7P06540.jpg", alt: "Warm celebrant photo", caption: "" }
      ]
    ],
    gallery: [
      { src: "assets/images/A7P06571.jpg", alt: "Warm milestone portrait", caption: "A life beautifully celebrated." },
      { src: "assets/images/A7P06434.jpg", alt: "Elegant celebration texture", caption: "A warm and timeless gathering." },
      { src: "assets/images/A7P06540.jpg", alt: "Family celebration detail", caption: "Love held across generations." }
    ]
  },

  seo: {
    pageTitle: "Leleth's 60th Birthday",
    description: "A premium cinematic birthday invitation.",
    ogTitle: "Leleth's 60th Birthday",
    ogDescription: "Celebrate sixty years of love, strength, and grace with us.",
    ogImage: "assets/images/mom-60-umbrella-hero.jpg",
    themeColor: "#d8842b"
  }
};
