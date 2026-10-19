/* Content only. Edit questions here without touching the logic. */
window.PJ = {
  acts: [
    { id: 'catch',   cat: 'Play',  icon: '🎀', title: 'Catch the Pink',  max: 100, desc: 'Tap the pink items for 30 seconds. Avoid the grey ones.' },
    { id: 'memory',  cat: 'Play',  icon: '🃏', title: 'Pink Memory',     max: 50,  desc: 'Find all the matching pairs.' },
    { id: 'reaction',cat: 'Play',  icon: '⚡', title: 'Pink Reaction',   max: 50,  desc: 'Be ready. The screen will turn pink.' },
    { id: 'myth',    cat: 'Learn', icon: '💬', title: 'Myth or Fact',    max: 80,  desc: 'Is the statement a myth or a fact?' },
    { id: 'choice',  cat: 'Learn', icon: '⭐', title: 'Quick Choice',    max: 60,  desc: 'Pick the best answer.' },
    { id: 'tf',      cat: 'Learn', icon: '❓', title: 'True or False',   max: 60,  desc: 'Is the statement true or false?' },
    { id: 'wall',    cat: 'Share', icon: '💗', title: 'Pink Wall',       max: 20,  desc: 'Leave a message of hope.' }
  ],
  // a = true when the statement is a fact / true
  myth: [
    { q: 'Breast cancer only affects people with a family history of it.', a: false, e: 'Most people diagnosed have no family history. Anyone can be affected.' },
    { q: 'Breast cancer awareness matters throughout the year, not only in October.', a: true, e: 'October is a spotlight, but staying informed is useful all year.' },
    { q: 'Men can get breast cancer too.', a: true, e: 'It is rare, but men have breast tissue and can be affected.' },
    { q: 'Breast cancer cannot occur without noticeable symptoms.', a: false, e: 'Breast cancer can develop without causing noticeable symptoms, especially in its early stages. This is why regular screening and recommended mammograms are important for early detection.' },
    { q: 'Finding cancer early generally gives more treatment options.', a: true, e: 'Early detection is one of the main reasons awareness matters.' },
    { q: 'A lump in the breast is always cancer.', a: false, e: 'Most lumps are not cancer, but any new change should be checked by a health professional.' },
    { q: 'Only older people can get breast cancer.', a: false, e: 'Risk increases with age, but younger adults can be affected too.' },
    { q: 'Deodorant causes breast cancer.', a: false, e: 'Research has not shown a link between deodorants and breast cancer.' }
  ],
  // c = index of the correct option
  choice: [
    { q: 'Which action can contribute to better awareness?', o: ['Ignoring unusual changes.', 'Checking reliable information and asking a health professional when needed.', 'Avoiding any discussion about health.', 'Relying only on social media rumours.'], c: 1, e: 'Reliable sources and professional advice are the safest path.' },
    { q: 'If you notice an unusual change in your body, what is the best step?', o: ['Wait and hope it disappears.', 'Talk to a health professional.', 'Ask only on forums.', 'Keep it secret.'], c: 1, e: 'Only a professional can assess a change. Do not wait.' },
    { q: 'What does the pink ribbon symbolise?', o: ['Breast cancer awareness', 'World peace', 'Clean water', 'Heart health'], c: 0, e: 'The pink ribbon is the international symbol of breast cancer awareness.' },
    { q: 'Which source is the most reliable for health information?', o: ['An anonymous social post', 'A rumour from a friend', 'Health professionals and official health organisations', 'An advert'], c: 2, e: 'Check who wrote the information and whether it is backed by evidence.' },
    { q: 'How can you support someone facing breast cancer?', o: ['Listen and be present.', 'Avoid the subject.', 'Tell them what to do.', 'Pretend nothing happened.'], c: 0, e: 'Listening and kindness often mean more than advice.' },
    { q: 'Which month is dedicated to breast cancer awareness?', o: ['March', 'July', 'October', 'December'], c: 2, e: 'Octobre Rose is celebrated every year in many countries.' }
  ],
  tf: [
    { q: 'Regular physical activity can help reduce the risk of breast cancer.', a: true, e: 'An active lifestyle is associated with a lower risk.' },
    { q: 'Only women need to know about breast cancer.', a: false, e: 'Everyone can help by sharing reliable information and supporting others.' },
    { q: 'Knowing what is normal for your body helps you notice changes.', a: true, e: 'Body awareness helps you act quickly and talk to a professional.' },
    { q: 'Sharing unverified health rumours helps awareness.', a: false, e: 'Rumours spread fear and false information. Check sources first.' },
    { q: 'A kind message can make a difference to someone going through a hard time.', a: true, e: 'Small gestures of support matter.' },
    { q: 'Awareness is only the job of doctors.', a: false, e: 'Awareness is a shared effort: students, families and communities all play a role.' }
  ],
  seed: ['You are stronger than you think.', 'Together, we spread awareness.', 'Never lose hope.', 'Small kindness, big difference.', 'Keep going. We are with you.']
};