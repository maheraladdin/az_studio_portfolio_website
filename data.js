/**
 * AZ STUDIO — Portfolio content
 * ---------------------------------------------------------------------------
 * Everything the site renders (projects, videos, services, Q&A) lives here so
 * it can be edited without touching layout code.
 *
 * Video item formats:
 *   ['DRIVE_FILE_ID', 'Title', 'Optional subtitle']             -> Google Drive video
 *   { type: 'image', id: 'DRIVE_FILE_ID', title, sub }          -> Google Drive still
 *   { type: 'instagram', id: 'REEL_CODE', title, sub, badge }   -> Instagram reel
 *   { type: 'local', src: 'assets/x.mp4', poster, title, sub }  -> self-hosted video
 */
(function () {
  'use strict';

  const PROJECTS = [
    {
      slug: 'the-12-gate',
      title: 'Turning Real-Estate Advice Into Binge-Worthy Reels',
      client: 'The 12 Gate · Dubai, UAE',
      tag: 'Real Estate',
      cover: 'assets/thumbs/drive/1RVU4RgCVU4TRbG_1q5kFFxmKXJIm1sdl.jpg',
      metric: '100K+ organic impressions',
      description:
        'An episodic advisory series for a Dubai real-estate group. Animated metric overlays, kinetic data callouts and multi-track sound mixes turned dense investment topics into vertical reels people actually finish — delivered on 48-hour turnarounds.',
      videos: [
        { type: 'instagram', id: 'DK9nd-DiNAu', title: 'Market Stability & Acquisitions', sub: 'Published reel', badge: '100K+ views' },
        ['1RVU4RgCVU4TRbG_1q5kFFxmKXJIm1sdl', 'Investing in Dubai', 'الاستثمار في دبي'],
        ['1WNFAeYeItwoBWTejjbxL5TaxJKIemtDb', 'What Is a Real-Estate Bubble?', 'ما هي الفقاعة العقارية؟'],
        ['14jiMQlXQQFhoxThUEewLQlT0Bm4fLb31', 'How to Buy a Property', 'ازاي تشتري عقار'],
        ['1242YTcXDqIIPcTdgEaWh7nsn94EibThq', '5 Tips Before You Buy', '5 نصائح وانت بتشتري عقار'],
        ['1ej4TwGaj_nNzQa1l6fS9Q3VnZMjx1O_4', 'Hamdy Real Estate — Master Ad', 'Commercial master'],
        ['17H2oPhPRIJTvm5i_gToksB-cQ8VJthZB', 'Episode 5 — Master Cut', 'Advisory series'],
        ['1-D_sf5kKF-Xupgl3PMG1G7zQLUxYIQn2', 'Market Summary Reel', 'Advisory series'],
        ['1OBMACMHYYQdvm17aT_i1Cs_F2Fbfd3iY', 'Motion Sequence', 'Animated overlays'],
        ['1C5MPNrDc8IPAQPYiSHOH-PcEFR_e5JoP', 'Corporate B-Roll & Advisory Cut', 'Advisory series'],
        ['1aCdvMbSx0ma4c9Wt3cz0_qyTNx7YllMV', 'Advisory Cut 2', 'Advisory series'],
        ['1N5JXycX-WuI2Flxtv5QYP6rrImdZwPZi', 'Real-Estate Promo — Cut 2', 'Promo'],
        ['1p9kKd_0nDCcpEyoEJHeyxWngWSp8paFx', 'Episode 2', 'Advisory series'],
        ['1HB9J8h95Fe_JaIKQ95OVnnZoDUX3CfXX', 'Episode 2 — Alternate Cut', 'Advisory series'],
        ['1lWHskNOlZJdDU5-7bUh9BO4xEQZU1zgw', 'Episode 5 — Alternate Cut', 'Advisory series'],
        ['1-fpdVOy1gN9aCbNhVltqYSnGSk5Sg2e9', 'How to Buy — Alternate Cut', 'Advisory series'],
        ['1f2cHEaR-zevxY0AgVAec1yRI8hqe3P6N', 'Hook Short', 'Short-form hook'],
        ['1hf_r7sYAUke9yGuHYPO9JJn_R7oe4hbj', 'Hook Snippet', 'Short-form hook'],
        ['1TWa6yjFUfpF-ooqb9l46pgvbN11-kl9d', 'Segment Clip 1', 'Cut-down'],
        ['1PjJK4CIOWltYtFKwxsdETj8pAiKJqSkj', 'Segment Clip 2', 'Cut-down'],
        ['1GZ8btznnUby0hlb71OICyr29NiFrxKYh', 'Quick Callout Reel', 'Short-form'],
        ['1XFH9rAjqjOd33isyyX2gOMMV4S6s6hKX', 'Influencer Hook — “Hi There!”', 'Creator-style test']
      ]
    },
    {
      slug: 'manarat-almadinah',
      title: 'The Student Story That Reached 950,000 People',
      client: 'Manarat AlMadinah · Saudi Arabia',
      tag: 'Education',
      cover: 'assets/thumbs/drive/1sF3NOTRWxYYbwW3ZLHFEAKHS0DeVMdpA.jpg',
      metric: '950K+ views on one reel',
      description:
        'Recruitment films, testimonials and founder stories for a Saudi educational network. Fast narrative rhythm and early visual hooks kept retention in the top quartile — the flagship feature passed 950K organic views, with 290K+ more across the campaign.',
      videos: [
        { type: 'instagram', id: 'DX3si2Cqs-j', title: 'Student Founder Feature', sub: 'Published reel', badge: '950K+ views' },
        { type: 'instagram', id: 'DTzi-oWChLD', title: 'Recruitment & Campus Campaign', sub: 'Published reel', badge: '290K+ views' },
        ['1sF3NOTRWxYYbwW3ZLHFEAKHS0DeVMdpA', 'Student Testimonial Interview', 'Studio interview'],
        ['13KkUthuII4sr7j67Ciq5j3W-YpLhiEUk', 'Student Narrative Feature', 'Story-driven reel'],
        ['12ly7Nq3tyZ9QKxzxV5JBU-uGyNvnTWm5', 'Al Madina International School', 'Campus promo'],
        ['1AnjhGTI7zN2TeUVScm4UwOyZVmI_aQYj', 'Behind the Scenes — Student Shoot', 'برومو كواليس تصوير الطلاب'],
        ['1pgigBZMKNpWKllPLVGXXQ-EqXCfHqJcU', 'Ibdaa Students — Airport Reception', 'استقبال طلاب إبداع'],
        ['1rWn4417MQuqoCHt_yTuaEEtL38d3ffGn', 'Graduation Celebration', 'حفلة مدرسة الصفوة'],
        ['1TiM2xBCnFDePVb0y34xUvnekQ0-XEJpB', 'English Curriculum Feature', 'Academic feature']
      ]
    },
    {
      slug: 'food-fashion-retail',
      title: 'Appetite & Style: Ads That Make People Hungry to Buy',
      client: 'STENG · B.Laban · Chef & Chef · more',
      tag: 'Commercial',
      cover: 'assets/thumbs/drive/1klGxSqdNfjLzkVCFMbbv2VH8Ml4oQQcw.jpg',
      metric: '11 brand campaigns',
      description:
        'Commercials for restaurants, fashion and retail brands across Egypt and KSA — beat-driven cuts, appetising colour and clean product moments built for both 16:9 screens and 9:16 social feeds.',
      videos: [
        ['1klGxSqdNfjLzkVCFMbbv2VH8Ml4oQQcw', 'STENG Fashion — Store Launch', 'Produced with HT Media'],
        ['1QoDXye-bYuXQs-d5CPKFxfoiHNNlIAMv', 'Chef & Chef — BBQ Campaign', 'Food commercial'],
        ['1AEiDItT09SmdP56agtUk6b19hI3Zv-Su', 'B.Laban — Social Food Campaign', 'بلبن'],
        ['1TN6PUSe422VhMmPNrGTeplcW16_37at3', 'Gourmet Burger Promo', 'Food commercial'],
        ['1gtiry890oFOaxDI0Fp1E0jo5a12r7MU4', 'ALEX — Master Commercial', 'Brand campaign'],
        ['1WC9Se3LNpbGH0UfV8bWvAjrOneFoUpn2', 'Waves — Brand Commercial', 'Brand campaign'],
        ['1YUwsGBEduuyAhOInqz4-RGfC4ne6QC3i', 'Formal Menswear — Suits', 'Fashion commercial'],
        ['1tP9kJFfLZAN1XGLP1rGv_yJx47gCB_WN', 'Car Wash & Detailing', 'Automotive commercial'],
        ['1BxOVUC4p5zBOuZEd6loylTiEJUcomAIw', 'Deem — Brand Commercial', 'ديم'],
        ['1yHjLtNNjd_Sm9iI4uNGDInqEFj0SNzjv', 'Scripted Narrative Commercial', 'Script-to-screen'],
        ['1XDptBvwXWB4uN4zPmKPzhZoIdDwP6m-6', 'Voice-Over Intro Spot', 'VO-led commercial']
      ]
    },
    {
      slug: 'aveda-clinic',
      title: 'Aveda Clinic: Clinical Precision, Confident Skin Tones',
      client: 'Aveda Clinic · Healthcare & Aesthetics',
      tag: 'Healthcare',
      cover: 'assets/thumbs/drive/1D4WLPCKR-cTriTVMm0SJbIjLvelCEf7Z.jpg',
      metric: 'Broadcast-ready masters',
      description:
        'Dermatology and body-sculpting promos where trust is everything. Careful skin-tone calibration in DaVinci Resolve and calm, premium pacing make results feel credible — never cheap.',
      videos: [
        ['1D4WLPCKR-cTriTVMm0SJbIjLvelCEf7Z', 'Clinic Commercial', 'Revision 2 master'],
        ['16cA2Pra66lsp1sAA45e-XFPxTtTKcC2L', 'Aesthetic Dermatology Ad', 'Final master'],
        ['1W1fAW_upmWGfsTlEzF1s-yNHJFAigTvf', 'Body Sculpting Promo', 'Broadcast export']
      ]
    },
    {
      slug: 'tamer-hosny-live',
      title: 'Tamer Hosny Live: A Stadium Night, Felt in Minutes',
      client: 'Tamer Hosny · Live Concert',
      tag: 'Concert',
      cover: null,
      metric: 'Delivered in 7 days',
      description:
        'A complete multi-camera concert highlight package: synced angles, speed-ramped energy, balanced crowd audio and a vibrant stage-light grade — delivered inside a strict 7-day deadline.',
      videos: [
        ['1_0AhmnycFKjktyIUY4lHYz-G2fwphFOy', 'Tamer Hosny — Live Concert Package', 'Multi-cam highlight film']
      ]
    },
    {
      slug: 'delta-festivals',
      title: 'Delta Festival Nights: Five Days, One Unbroken Vibe',
      client: 'Delta Festival · Mostafa Hagag',
      tag: 'Festival',
      cover: 'assets/thumbs/drive/1bZSicWMYRiZZtXoqQxFJL0Kx7zCZ74hk.jpg',
      metric: '7 festival films',
      description:
        'Multi-day festival coverage headlined by Mostafa Hagag — opening nights, stage highlights and honours ceremonies cut fast enough to publish while the crowd is still talking about it.',
      videos: [
        ['11puWrgE694AXWH5Ug3m87X2f8MVdi7tN', 'Mostafa Hagag Live — Sept 17', 'Concert cut 1'],
        ['1bXIQ6ZbEnYQ0JsujiZQVcSJzoAJYP648', 'Mostafa Hagag Live — Sept 17', 'Concert cut 2'],
        ['1lQo9QyN3t_UH7LD4gIXppKoaVrb0hBfw', 'Mostafa Hagag — Solo Reel', 'Artist reel'],
        ['1bZSicWMYRiZZtXoqQxFJL0Kx7zCZ74hk', 'Opening Day — Sept 13', 'Festival recap'],
        ['11Foe9Ju4UjJ7O6mmn0p1ocw-pu_ASj_E', 'Day 2 — Stage Highlights', 'Festival recap'],
        ['1oM8LMMJvxaxDsSImpAtWychP11pNa3XV', 'Day 2 — Short Reel', 'Social cut-down'],
        ['1RDmy1wL66xA55x04Lj3ldCHd2x-kyRV0', 'Honours & Certificates Ceremony', 'Ceremony film']
      ]
    },
    {
      slug: 'saudi-leadership-summit',
      title: 'Saudi Leadership Summit: Executives, Made Unmissable',
      client: 'Pixomia · Saudi Leadership Summit',
      tag: 'Corporate',
      cover: 'assets/thumbs/drive/14Xw8B91zTOLEXn-7bCOofc0OxcFFccld.jpg',
      metric: '8 keynote films',
      description:
        'Keynote films for C-level speakers. Custom kinetic typography, restored executive audio and a consistent brand system across every talk — so a full summit looks like one premium series.',
      videos: [
        ['14Xw8B91zTOLEXn-7bCOofc0OxcFFccld', 'Rami Harfouch', 'SLS executive talk'],
        ['1uh0qOEWlnS1guD-nVVLS0fdUI5HMZK_J', 'Bassam Bahous', 'SLS executive talk'],
        ['1EiJjUDyxfRjqwySigB0J3pafhox4Iqjq', 'Khalid Abdulrahman Alghamdi', 'SLS executive talk'],
        ['1f79xhh4m-hMSD2Ia8h3z9lg-TmDIfDZP', 'Elie Battah', 'SLS executive talk'],
        ['1VS0_dg6-bN3KmMW7SmxE8mrA-8fkVoVs', 'Zuhair Sarhani', 'SLS executive talk'],
        ['18a4ut2a1Ni3qMqj3ckdVYnS7_0A9UBFo', 'Abdulmomen Ghandour', 'SLS executive talk'],
        ['14l6e_o9TqejV4eAQIcDq5WmOtufBafiN', 'Alaa Kobeissi', 'SLS executive talk'],
        ['1n3uKIuhmED2QI-LsDtRKxUH7pwFDp1Qt', 'Keichou Lee', 'SLS executive talk']
      ]
    },
    {
      slug: 'saudi-vip-galas',
      title: 'VIP Galas & Summits: Prestige, Delivered on Deadline',
      client: 'Pixomia · SEA · Hajj & Umrah Summit',
      tag: 'Corporate',
      cover: 'assets/thumbs/drive/1K8gSOR0LIPJ39DMvd7LHtIPI6PVmasf5.jpg',
      metric: '40+ VIP event assets',
      description:
        'Honouring galas, innovation summits and VIP speaker films for high-tier Saudi clients — from raw ingest to broadcast master, using standardised node trees and motion templates that cut turnaround by 25%.',
      videos: [
        ['1ULMFtWyFJ0ug71Vv-ew-2ohONkIlJrP-', 'Hajj & Umrah Innovation Summit', 'الابتكار والاستدامة في خدمة ضيوف الرحمن'],
        ['1K8gSOR0LIPJ39DMvd7LHtIPI6PVmasf5', 'Riad Al-Zahrani Honouring Gala', 'حفل تكريم رياض الزهراني'],
        ['1HwytaXpoke85WU6WAmfLM3qJxDEDcmrN', 'Strategic Resource Program', 'Keynote film'],
        ['1t4mItuHkMqz1y5TxljeTw-0eD3oKC5sQ', 'Amin Rashmani', 'SEA speaker film'],
        ['1zXpmXAq3aMDXL-U99JUVnbO9JnCeBktS', 'Menna El Zeiny', 'SEA speaker film'],
        ['1kqqbRO2oDNWpx7snqEMyzE9K7WE6Ft-5', 'Karel Dubois', 'SEA speaker film'],
        ['1YF985EsQf4fAzUqNPE413FgL5hYgqOIX', 'Mohamed Abo Zeinab', 'Speaker film'],
        ['13Toq_rlHqWUCAGA-HAlTFCJ9dTj4VMLZ', 'Mohammed Al-Juhaili', 'محمد الحجيلي'],
        ['1ymKbT0CJy3P85OUYfzWPjor_o5N46TBX', 'Abdulaziz Al-Jarbou', 'عبد العزيز الجربوع'],
        ['1uNmYxIK9CJlJy3z6K98H3Y-g1EioDljD', 'Abdulaziz Al-Jarbou — First Cut', 'Speaker film'],
        ['1M42edwmw0FnoPwkRYhCeUcsnopWMgwbj', 'Abdulaziz Al-Juaid', 'عبد العزيز الجعيد'],
        ['1J2DKgC041WC1PvS_Xvlf7htxZgIlAvAy', 'Pixomia — PIX', 'Event film'],
        ['1_7p5DUow4jEWMpNykFpH18a-zhttjn2Z', 'Pixomia — PIX 2', 'Event film · A'],
        ['10D9-aSYheYUU2iKsebW9o6Hsx76bFADX', 'Pixomia — PIX 2', 'Event film · B'],
        ['1QVEvMs_cPNgRhru4-6iquV7ZDUor4VZ8', 'Pixomia — PIX 3', 'Event film · A'],
        ['1KxvJoK9CBwwsIEa8m8g6-8fFSsav8OL-', 'Pixomia — PIX 3', 'Event film · B'],
        ['1OT9ys1wb8ko6vdhEe8jh3dUAGI9YZ-19', 'Pixomia — PIX 4', 'Event film']
      ]
    },
    {
      slug: 'color-3d-ai',
      title: 'Colour Science, 3D & AI: The Look Lab',
      client: 'AZ Studio · In-house',
      tag: 'Colour · VFX · AI',
      cover: 'assets/thumbs/drive/cover_earth.jpg',
      metric: 'DaVinci · Blender · Veo',
      description:
        'Where the signature look is built: node-based DaVinci Resolve grades, Blender 3D camera moves, Earth-zoom VFX and generative-AI spots made with Veo 3, Google Flow, Higgsfield and ElevenLabs.',
      videos: [
        { type: 'local', src: 'assets/preview.mp4', poster: 'assets/images/preview_poster.jpg', title: 'AI Cinema Showcase', sub: 'Higgsfield · Google Flow · ElevenLabs' },
        ['1F4DofmWGSNjlaFDgy9Vre7OKqWIAwZYI', '3D Earth Orbit — Sequence 1', 'Blender VFX'],
        ['14T9UkxZwVUZtsdjUcKZu9ED6hpfMUOXX', '3D Earth Orbit — Sequence 2', 'Blender VFX'],
        ['1fujiu4_ty0mD4fCi3GYTDc1_aUQ6i6hn', 'Blender 3D Camera Move', '3D animation'],
        ['1of1edmNUv6S37GsSseq-rpXoKgneycqk', 'ALEX — Colour Grade Pass', 'Before / after'],
        { type: 'image', id: '1c9C5h97aEq5hRpp3aZ4jR3nOfHauAd_H', title: 'Low-Saturation Look Development', sub: 'Grade still' },
        { type: 'image', id: '1nsve-MDlOtz4tAmcHw1ogNiz_RrG3iuL', title: 'Scopes & Graded Reference', sub: 'Grade still' },
        { type: 'image', id: '1o-kicIMnD6Fd8tJhslawG160H1LM5bCx', title: 'Commercial Finishing Frame', sub: 'Grade still' },
        { type: 'image', id: '1m6VM6bDtwzziSESdWdTLoJx7c9Rd1fjA', title: 'Storyboard & Grade Still 03', sub: 'Grade still' },
        { type: 'image', id: '1RePlTYCItfqnZovLtBt09LqCbYFPPn0j', title: 'Storyboard & Grade Still 04', sub: 'Grade still' }
      ]
    },
    {
      slug: 'festivals-lifestyle',
      title: 'Live Energy: Motorsport, Festivals & Lifestyle Reels',
      client: 'Formula 1 · Alamein Festival · Creators',
      tag: 'Lifestyle',
      cover: 'assets/thumbs/drive/1xpSWnzOQ2ExcJ_6BKw_trSf8mKfLzIMC.jpg',
      metric: '8 high-energy edits',
      description:
        'Speed-ramped motorsport, sunset festival recaps, travel vlogs and nature reels — rhythm-first editing that makes viewers feel they were there.',
      videos: [
        ['1xpSWnzOQ2ExcJ_6BKw_trSf8mKfLzIMC', 'Formula 1 — Motorsport Highlight', 'Sports edit'],
        ['1Ms4JCXe5ZqHsYluFEcuuBwnw2D_CtZhu', 'New Alamein Festival Highlights', 'Festival recap'],
        ['1mYrX56r7-GoSTLqG6IEHKB7YQJhykz4b', 'Shaman Outdoor Festival', 'شمن بارتي'],
        ['1GS5r1HfB7APp8L9YzGqdXd-w1UWS2uto', 'Festival Day 01 Recap', 'Event recap'],
        ['1TSHskArRP-rxo851OnqasmceRPGh1rDh', 'Event Highlight Film', 'Event recap'],
        ['1HV4N2iUX8U_VVcH6ktUH1rk45fqZ2YNc', 'Tonight — Nightlife Cut', 'Social reel'],
        ['1yEpWnHL2_pH9eOGljm70zzKkY32KEoaA', 'Travel Reel with Nadeen', 'Creator vlog'],
        ['1wNV4iNgPxOvPZQubbYVGNAVIclkB6KP7', 'Morning Mist — Nature Reel', 'Cinematic reel']
      ]
    },
    {
      slug: 'cinematic-weddings',
      title: 'Cinematic Weddings: The Day, Exactly as It Felt',
      client: 'Private clients · Egypt',
      tag: 'Weddings',
      cover: 'assets/thumbs/drive/1rSP6GKcZ8XoGg4d3GpQ-57Sa0vdjaL_5.jpg',
      metric: '4 wedding films',
      description:
        'Emotional montage storytelling for couples — music-led pacing, warm natural skin tones and reception moments that families replay for years.',
      videos: [
        ['17n4DEAOUty-j0giHlfjIfqX4KV90wcFV', 'Wedding 4 — Master Finish', 'Wedding film'],
        ['1R4Uw1K3RfhhS0xRpuSnwbWs_KagHG8To', 'Wedding Highlights — Film 1', 'Highlight film'],
        ['1rSP6GKcZ8XoGg4d3GpQ-57Sa0vdjaL_5', 'Wedding Highlights — Film 3', 'Highlight film'],
        ['15q6EScfNHMb9VOCc_8bYBqW6YDnRjqkU', 'Wedding Ceremony Edit', 'Ceremony film']
      ]
    }
  ];

  const SERVICES = [
    {
      slug: 'short-form-reels',
      icon: 'reel',
      title: 'Short-Form Reels That Hold Attention',
      outcome: 'More watch time, more followers, more leads',
      description:
        'TikTok, Reels and Shorts engineered around the first 3 seconds: scroll-stopping hooks, tight pacing, animated captions and sound design that keeps thumbs still.',
      deliverables: ['9:16 masters + captions', 'Hook & thumbnail frames', 'Batch or monthly delivery'],
      projects: ['manarat-almadinah', 'the-12-gate', 'festivals-lifestyle'],
      qa: [
        ['How do you keep people watching past the first seconds?', 'Every edit opens with the strongest moment, not the intro. Dead air is cut, captions are animated to the voice, and sound accents land on the visual beats — the same approach that took a Manarat AlMadinah reel past 950K organic views.'],
        ['Can you edit a full month of content at once?', 'Yes. Send footage in batches and receive a consistent series with a shared caption style, colour and branding — ideal for creators and brands posting several times a week.'],
        ['Do you write the hooks or follow my script?', 'Both. Bring a script and it will be followed precisely, or send raw talking-head footage and the strongest hook lines will be selected and restructured for retention.']
      ]
    },
    {
      slug: 'commercial-ads',
      icon: 'megaphone',
      title: 'Commercials & Brand Ads',
      outcome: 'Ads that look premium and convert',
      description:
        'Restaurant, fashion, retail, real-estate and clinic ads that make products look irresistible — built in 16:9 for screens plus 9:16 and 1:1 cut-downs for paid social.',
      deliverables: ['Master + social cut-downs', 'Licensed music & SFX mix', 'Brand-safe colour & type'],
      projects: ['food-fashion-retail', 'aveda-clinic', 'the-12-gate'],
      qa: [
        ['Can one shoot become several ads?', 'Yes. A hero master is cut first, then reformatted into 15s, 30s and vertical versions so you can test multiple ads from one production.'],
        ['Will the ad match our brand guidelines?', 'Fonts, colours, logo animation and tone are locked into a template on the first video, so every later ad stays perfectly on-brand.'],
        ['Do you handle music and voice-over?', 'Music selection, SFX, dialogue clean-up and mixing are included. AI voice-over (ElevenLabs) can be produced when you do not have a voice artist.']
      ]
    },
    {
      slug: 'color-grading',
      icon: 'palette',
      title: 'Colour Grading in DaVinci Resolve',
      outcome: 'A cinematic, consistent signature look',
      description:
        'Node-based grading in a colour-managed pipeline (DaVinci Wide Gamut / ACES). Mixed cameras matched, skin tones protected and a look that makes your footage feel expensive.',
      deliverables: ['Shot matching across cameras', 'Custom look / LUT creation', 'Rec.709 & HDR deliverables'],
      projects: ['color-3d-ai', 'aveda-clinic', 'food-fashion-retail'],
      qa: [
        ['Can you grade footage I already edited?', 'Yes. Send an XML/AAF or a flattened export and receive a fully graded master, or a project file if your team finishes in-house.'],
        ['Which cameras and log formats do you handle?', 'RED R3D, Nikon N-Log, Sony, Canon, DJI drones and smartphone footage — all transformed into one managed colour space so every shot matches.'],
        ['Can you create a LUT we can reuse?', 'Yes — a custom look can be exported as a LUT for your future shoots and social content, keeping the brand look consistent.']
      ]
    },
    {
      slug: 'events-concerts',
      icon: 'stage',
      title: 'Event, Concert & Summit Films',
      outcome: 'Relive the night — and sell the next one',
      description:
        'Multi-camera concerts, festivals, galas and weddings: synced angles, crowd-audio balancing, speed ramps and same-week delivery while the moment is still trending.',
      deliverables: ['Multi-cam sync & audio mix', 'Highlight film + social teasers', 'Fast post-event delivery'],
      projects: ['tamer-hosny-live', 'delta-festivals', 'saudi-vip-galas', 'cinematic-weddings'],
      qa: [
        ['How fast can I get an event highlight?', 'Social teasers can be delivered within 24–48 hours after footage arrives; full highlight films typically within a week — the Tamer Hosny package was delivered inside 7 days.'],
        ['How many cameras can you sync?', 'Multi-camera timelines are synced to the soundboard or best audio source regardless of the number of angles, then cut live-style for energy.'],
        ['Do you also shoot events?', 'Yes, in Egypt — filming with a Nikon ZR 6K cinema camera and DJI Ronin gimbal, so production and post come from one team.']
      ]
    },
    {
      slug: 'corporate-interviews',
      icon: 'mic',
      title: 'Corporate Talks & Executive Interviews',
      outcome: 'Leaders who look and sound world-class',
      description:
        'Keynotes, speaker films and testimonials with restored audio, animated lower-thirds and kinetic typography — packaged as a consistent series for summits and brands.',
      deliverables: ['Dialogue restoration', 'Lower-thirds & title packs', 'Series-wide brand template'],
      projects: ['saudi-leadership-summit', 'saudi-vip-galas', 'manarat-almadinah'],
      qa: [
        ['Can you clean up bad conference audio?', 'Yes. Spectral noise suppression, EQ and levelling in Adobe Audition make speakers clear even from noisy halls and lapel mics.'],
        ['We have 30+ speakers — can you keep them consistent?', 'Standardised node trees and motion templates (MOGRTs) keep every talk identical in style, which cut client turnaround by 25% on Pixomia summit work.'],
        ['Do you deliver subtitles?', 'Yes — burned-in or separate SRT subtitle files in English and Arabic.']
      ]
    },
    {
      slug: 'motion-3d-ai',
      icon: 'spark',
      title: 'Motion Graphics, 3D & AI Video',
      outcome: 'Visuals your competitors cannot copy',
      description:
        'Kinetic typography, animated data overlays, Blender 3D camera moves and generative-AI scenes (Veo 3, Google Flow, Higgsfield) with ElevenLabs voice and Topaz upscaling.',
      deliverables: ['Motion packs & animated logos', '3D shots & Earth zooms', 'AI scenes, voice & upscaling'],
      projects: ['color-3d-ai', 'the-12-gate', 'saudi-leadership-summit'],
      qa: [
        ['Can you make a full ad with AI and no shoot?', 'Yes. Concept, AI-generated scenes, AI voice-over and a professional edit and grade — as in the AI Cinema Showcase on this page.'],
        ['Can you animate charts and numbers?', 'Yes. Financial figures and data are turned into animated callouts and overlays, as used across The 12 Gate real-estate series.'],
        ['Can you make old or low-res footage sharper?', 'Topaz Video AI upscaling and enhancement can rescue older or low-resolution clips for modern 4K deliveries.']
      ]
    }
  ];

  window.AZ_DATA = Object.freeze({ PROJECTS, SERVICES });
})();
