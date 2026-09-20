// ══════════════════════════════════════════════════════════════════════
//  ✏️  JANA — PERSONAL CONTENT
//  This is the only file you need to edit to personalize the experience.
//  All text, memories, songs, and messages live here.
// ══════════════════════════════════════════════════════════════════════

export const CONTENT = {

  // ─── Core identity ──────────────────────────────────────────────────
  name:      "Jana",
  birthday:  { month: 9, day: 21 },   // September 21
  age:       20,
  createdBy: "Someone who cares",     // ✏️ Your name goes here


  // ─── Chapter 1 — DATABASE ───────────────────────────────────────────
  database: {
    photo: "assets/images/profile_jana.jpg?v=2",

    fields: [
      { label: "FULL NAME",      value: "Jana Karam Ahmed" },
      { label: "STATUS",         value: "زعلانة مني 😠" },
      { label: "DATE OF BIRTH",  value: "September 21" },
      { label: "CLASSIFICATION", value: "اجمل واحدة في الدنيا 😌" },
      { label: "KNOWN ALIASES",  value: "JoJo" },
      { label: "LAST SEEN",      value: "Opening a suspicious gift" },
    ],

    traits: [
      "The smartest girl out there",
      "Genuine & pure hearted",
      "Kind-hearted",
      "Passionate",
      "Makes everything feel better",
      "Loves taking risks",
      "Resilient & supportive",
    ],

    threatLevel:   "EXTREMELY HIGH (the good kind)",         // ✏️
    dangerWarning: "APPROACH WITH WARMTH AND BIRTHDAY CAKE", // ✏️
  },


  // ─── Chapter 2 — MEMORY ARCHIVE ─────────────────────────────────────
  memories: [
    {
      id: "M001",
      date: "THE BEGINNING",
      icon: "✦",
      title: "The first one",
      description: "This is where you write the first real memory. The one that started everything. It doesn't have to be dramatic — sometimes the most important moments look ordinary from the outside.",
      hiddenNote: "Tap and hold to reveal a hidden note — add something just between you two here ✏️",
    },
    {
      id: "M002",
      date: "SOMETIME AFTER THAT",
      icon: "◈",
      title: "The one that surprised you",
      description: "There's always a moment where you realize something has shifted. Where what was familiar becomes something more. This memory goes here. Replace this with the real one.",
      hiddenNote: null,
    },
    {
      id: "M003",
      date: "YOU'LL KNOW WHICH ONE",
      icon: "◉",
      title: "The one you both remember differently",
      description: "Every story has a moment that both people would describe in completely different ways. This is that moment. Write yours here. Be honest — that's the point.",
      hiddenNote: null,
    },
    {
      id: "M004",
      date: "NOT LONG AGO",
      icon: "⊕",
      title: "The recent one",
      description: "Something fresh. A memory that hasn't settled into the past yet. Something that still feels a little too present to be called a memory at all. Replace with the real thing.",
      hiddenNote: "You can add a hidden note to any memory — just set hiddenNote to a string ✏️",
    },
    {
      id: "M005",
      date: "AND THEN —",
      icon: "✧",
      title: "The one you'd tell anyone",
      description: "The story you always find yourself telling. The one that captures something about her better than anything else could. The one that always gets a reaction. This is where it lives.",
      hiddenNote: null,
    },
  ],


  // ─── Chapter 3 — PHOTO ARCHIVE ───────────────────────────────────────
  // Replace placeholder images with real photos in assets/images/
  photos: [
    { src: "assets/images/photo1_new.jpg", caption: "الفانوس ده كان اول حاجة تعمليها و كان غالي عليكي و قررتي تديهولي و لسا لحد دلوقتي معلقه جمبي و هيفضل معايا علطول❤️", label: "EXHIBIT A" },
    { src: "assets/images/photo2_new.jpg", caption: "الخلفية دي عاملها و كدا بقالها سنة حاطط فيها اسمك و عيد ميلادك و صورة مع احلي هدية جاتلي في حياتي و قلت ايه احلي من اني اشوف اسمك كل ما افتح التلفون", label: "EXHIBIT B" },
    { src: "assets/images/photo3.jpg", caption: "الدبدوب ده كنت جايبهولك و كان نفسي تاخديه بس انتي وقتها قلتيلي هتاخديه لما اجي و اخطبك ف ده اول حاجة هديهالك و هديهالك إن شاء الله ❤️", label: "EXHIBIT C" },
    { src: "assets/images/photo4.jpg", caption: "الصورة دي افتكرتها شكلك هنا كيوت اوييييي😠 فقلت احطها❤️", label: "EXHIBIT D" },
    { src: "assets/images/photo5_new.jpg", caption: "دي كانت أول مرة نقعد مع بعض كلنا في دنيا كانت ميموريزز حلوة اويي❤️( كل ما اشوف الصورة افتكر الي مهند قاله يومها و احنا بنلعب)", label: "EXHIBIT E" },
    { src: "assets/images/photo6_new.jpg", caption: "و دي اخر صورة اخدها معاكي ما بين الصورة دي و التانية حجات كتير اوييي حلوة و خناقات كتيررر اوييي بس بردو بالنسبالي دي احسن فترة ممكن تمر عليا و انتي موجودة فيها❤️", label: "EXHIBIT F" },
  ],


  // ─── Chapter 4 — SONGS ───────────────────────────────────────────────
  songs: [
    {
      title:      "أنا من غيرك",
      artist:     "Bahaa Sultan",
      why:        null,
      spotifyUrl: null,
      audioFile:  "assets/audio/song1.dat",
    },
    {
      title:      "ما بلاش",
      artist:     "Mohamed Hamaki",
      why:        null,
      spotifyUrl: null,
      audioFile:  "assets/audio/song2.dat",
    },
    {
      title:      "ياللي زعلان",
      artist:     "Mohamed Hamaki",
      why:        null,
      spotifyUrl: null,
      audioFile:  "assets/audio/song3.dat",
    },
    {
      title:      "من أول مرة",
      artist:     "Mahmoud El Esseily",
      why:        null,
      spotifyUrl: null,
      audioFile:  "assets/audio/song4.dat",
    },
  ],


  // ─── Chapter 5 — 21 ──────────────────────────────────────────────────
  message21:
`**21**

Two numbers that probably don’t mean much to anyone else.

Just a day. Just another date on the calendar.

But somehow, whenever I see 21 I think of you.

And I think that’s what makes a date special.
Not the numbers themselves, but the person, the memories, and everything that becomes attached to them.

So maybe 21/9 didn’t have any special meaning before.
but you **gave it one.**

And now, whenever I see those numbers, they’ll always remind me of you.`,


  // ─── Chapter 6 — DO NOT OPEN ─────────────────────────────────────────
  vault: {
    title:   "YOU OPENED IT ANYWAY.",
    message:
`Of course you opened it.

The note inside says:

This is the placeholder secret. Replace it with something real — an inside joke, a truth, a promise, something too specific for the memory archive. Something that belongs just here, in the part she wasn't supposed to find.

Make it count.`,  // ✏️
  },


  // ─── Chapter 7 — FINAL LETTER ────────────────────────────────────────
  finalLetter:
`جني كل سنة و انتي طيبة و بخير ❤️

يارب تحققي كل الي نفسك فيه و اشوفك احسن حد في الدنيا و مبسوطة دايما 🙏🏼❤️

welcome to your 20's —
ده تاني عيد ميلاد ليكي و انا موجود، و ده بالذات حبيت انه يكون حاجة special ليكي بسبب كل الي حصل. و ده بردو مش كفاية.

عارفة، في السنتين دول عمري ما كنت هتخيلهم من غير وجودك فيهم.

شكرا علي كل حاجة عملتيهالي،
شكرا انك كنتي جمبي علطول،
شكرا انك خلتيني ابقي نسخة احسن مني.

عارفة يا جني — انتي الشخص الي اي حد ممكن يتمناه يكون في حياته. او علي الاقل بالنسبالي، انتي الشخص الي عايزه يفضل موجود في حياتي علطول. و ده مش هيحصل من غير ما اعمل انا حاجة، و انا دلوقتي بعمل ده عشان ده يتحقق.

الفترة الي احنا مش بنتكلم فيها دي من اصعب الفترات الي عدت علياا. بيجي وقت بقي نفسي اعرف يومك احكيلك انا عملت ايه، لو حتي ٥ دقايق.

كل حاجة انتي قلتيهالي و شايفة انها لازم تتصلح — انا هصلحها.

انا عمري ما فكرت ابعد عنك او اسيبك، ولا هفكر. و انا اسف اني حسستك بكدا. انا وقتها كنت في فترة صعبة اوي، و بالعكس كان كل تفكيري فيكي، بس انا غلطان وانا عارف.

قلتيلي انك عايزاني ابقا عمر الي عرفتيه اول ما تدخلي — فاوعدك اني هبقا ده، بس الاحسن منه. و اوعدك اني عمري ما هحطك في الي انا حطيتك فيه ده تاني أبدأ.

بدعي ربنا كل يوم انك تكوني من نصيبي، و بشتغل علي نفسي. بس لو ده محصلش — انا مش عارف هعمل ايه. بس انا مش هبطل اسعي عشانك.

و أيا يكن الي مستنينا قدام، انتي هتفضلي بالنسبالي اجمل حد دخل حياتي، و مش هفتكرك غير بالخير.

اكتر حاجة نفسي فيها اننا نبقا مع بعض، و نعمل كل حاجة نفسنا فيها مع بعض، و اشوفك بتحققي كل الي نفسك فيه و كل طموحاتك.

الحاجة الوحيدة الي عمرها ما هتتغير —
اني علطول في ضهرك.
علطول موجود لو احتاجتيني.
علطول موجود و انتي متضايقة من حاجة.
علطول عشانك، مهما كانت الحاجة 💓`,

};
