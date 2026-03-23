import type { Episode, Question } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildQuestions(
  episodeNumber: number,
  episodeTitle: string,
  episodeSlug: string,
  phase: string,
  phaseNumber: number,
  texts: string[],
): Question[] {
  return texts.map((text, i) => ({
    id: `ep${episodeNumber}-q${i + 1}`,
    text,
    slug: slugify(text),
    episodeSlug,
    episodeNumber,
    episodeTitle,
    phase,
    phaseNumber,
  }));
}

// ---------------------------------------------------------------------------
// Phase 1 — Foundation
// ---------------------------------------------------------------------------

const ep1Slug = 'is-scripture-sufficient';
const ep1Questions = buildQuestions(1, 'Is Scripture Sufficient?', ep1Slug, 'Foundation', 1, [
  'What does it mean to say Scripture is \'sufficient\'?',
  'How do we know the Bible is actually reliable?',
  'What about the parts of the Bible that seem to contradict?',
  'Is it fair to call the Bible \'inerrant\'?',
  'How should we handle passages that feel outdated or offensive?',
  'What role does the Holy Spirit play in understanding Scripture?',
  'Can Scripture be sufficient if we need pastors to explain it?',
  'How do we avoid proof-texting while still using individual verses?',
  'What\'s the difference between reading the Bible and studying it?',
]);

const ep2Slug = 'the-character-of-god';
const ep2Questions = buildQuestions(2, 'The Character of God', ep2Slug, 'Foundation', 1, [
  'How do we reconcile a loving God with the God of the Old Testament?',
  'What does it actually mean that God is \'holy\'?',
  'If God is love, why does He allow so much pain?',
  'Is God\'s wrath compatible with His love?',
  'How do we understand God\'s sovereignty without making Him seem controlling?',
  'What does it mean that God is jealous?',
  'Can we really know God\'s character, or just what He reveals?',
  'How does Jesus change our understanding of who God is?',
  'What\'s the difference between God being good and God being nice?',
]);

const ep3Slug = 'the-trinity';
const ep3Questions = buildQuestions(3, 'The Trinity', ep3Slug, 'Foundation', 1, [
  'How do you explain the Trinity without using a bad analogy?',
  'Where does the concept of the Trinity appear in Scripture?',
  'Why does the Trinity matter for everyday faith?',
  'Is the Holy Spirit a person or a force?',
  'How do Father, Son, and Spirit relate to each other?',
  'Did early Christians believe in the Trinity, or was it invented later?',
  'What heresies about the Trinity still show up today?',
  'How does the Trinity shape how we understand community?',
  'If Jesus is God, who was He praying to?',
]);

// ---------------------------------------------------------------------------
// Phase 2 — The Fall
// ---------------------------------------------------------------------------

const ep4Slug = 'why-does-sin-separate-us-from-god';
const ep4Questions = buildQuestions(4, 'Why Does Sin Separate Us from God?', ep4Slug, 'The Fall', 2, [
  'What actually happened in the Garden of Eden?',
  'Is original sin fair?',
  'Why can\'t a good God just overlook sin?',
  'What\'s the difference between sin as an act and sin as a condition?',
  'How does sin affect our relationship with God specifically?',
  'Are some sins worse than others?',
  'What does it mean to be \'dead in sin\'?',
  'How does sin distort the way we see God?',
  'Can someone be \'good enough\' without dealing with sin?',
]);

// ---------------------------------------------------------------------------
// Phase 3 — Redemption
// ---------------------------------------------------------------------------

const ep5Slug = 'is-jesus-really-god';
const ep5Questions = buildQuestions(5, 'Is Jesus Really God?', ep5Slug, 'Redemption', 3, [
  'What evidence supports Jesus being divine?',
  'Did Jesus ever explicitly claim to be God?',
  'How do we handle the passages where Jesus seems limited?',
  'What does the incarnation actually mean?',
  'Why does it matter that Jesus was both fully God and fully human?',
  'How did first-century Jews understand Jesus\' claims?',
  'What makes Jesus different from other religious leaders?',
  'How do we respond to scholars who deny Jesus\' divinity?',
  'What does Jesus\' divinity mean for how we pray?',
]);

const ep6Slug = 'the-resurrection';
const ep6Questions = buildQuestions(6, 'The Resurrection', ep6Slug, 'Redemption', 3, [
  'What is the historical evidence for the resurrection?',
  'How do we respond to alternative theories about the empty tomb?',
  'Why does Paul say our faith is \'in vain\' without the resurrection?',
  'What does a resurrected body actually look like?',
  'How does the resurrection change how we view death?',
  'What did the resurrection mean to the first disciples?',
  'How does the resurrection validate everything Jesus taught?',
  'Can you be a Christian and doubt the physical resurrection?',
  'What does the resurrection promise for our future?',
]);

const ep7Slug = 'what-is-the-gospel';
const ep7Questions = buildQuestions(7, 'What Is the Gospel?', ep7Slug, 'Redemption', 3, [
  'Can you define the gospel in one sentence?',
  'Is the gospel just about getting to heaven?',
  'What does \'saved by grace through faith\' actually mean?',
  'How do grace and works relate to each other?',
  'What is the gospel\'s answer to guilt and shame?',
  'How do different traditions define the gospel differently?',
  'Is repentance part of the gospel or a response to it?',
  'What does the gospel say about justice and restoration?',
  'How do we share the gospel without reducing it to a formula?',
]);

// ---------------------------------------------------------------------------
// Phase 4 — The Christian Life
// ---------------------------------------------------------------------------

const ep8Slug = 'the-holy-spirit';
const ep8Questions = buildQuestions(8, 'The Holy Spirit', ep8Slug, 'The Christian Life', 4, [
  'Who is the Holy Spirit?',
  'What does the Holy Spirit actually do in a believer\'s life?',
  'How do we know if something is the Holy Spirit or just emotion?',
  'What are the gifts of the Spirit and are they for today?',
  'What does it mean to be \'filled\' with the Spirit?',
  'How does the Spirit guide us in decision-making?',
  'Can a Christian grieve or quench the Holy Spirit?',
  'What\'s the difference between the fruit of the Spirit and the gifts?',
  'How do we pursue the Spirit without becoming weird about it?',
]);

const ep9Slug = 'the-church';
const ep9Questions = buildQuestions(9, 'The Church', ep9Slug, 'The Christian Life', 4, [
  'Why does God use the church instead of just working through individuals?',
  'What did the early church actually look like?',
  'How do we stay in a church that has hurt us?',
  'Is church attendance really necessary for faith?',
  'What\'s the difference between the universal church and a local church?',
  'How should the church handle disagreement?',
  'What does healthy church leadership look like?',
  'How do we rebuild trust after church hurt?',
  'What role does the church play in the world today?',
]);

// ---------------------------------------------------------------------------
// Phase 5 — Hard Questions
// ---------------------------------------------------------------------------

const ep10Slug = 'can-you-lose-your-salvation';
const ep10Questions = buildQuestions(10, 'Can You Lose Your Salvation?', ep10Slug, 'Hard Questions', 5, [
  'What does the Bible say about the security of salvation?',
  'How do we interpret the \'warning passages\' in Hebrews?',
  'What\'s the difference between assurance and presumption?',
  'Can someone walk away from faith and still be saved?',
  'How do Calvinism and Arminianism approach this differently?',
  'What does Jesus mean by \'no one can snatch them out of my hand\'?',
  'How should doubt about salvation be handled pastorally?',
  'What role does perseverance play in salvation?',
  'How do we hold tension between God\'s sovereignty and human responsibility?',
]);

const ep11Slug = 'why-does-god-allow-suffering';
const ep11Questions = buildQuestions(11, 'Why Does God Allow Suffering?', ep11Slug, 'Hard Questions', 5, [
  'If God is good and powerful, why does suffering exist?',
  'Does God cause suffering or just allow it?',
  'How do we comfort someone who is suffering without clichés?',
  'What does the book of Job actually teach about suffering?',
  'Is suffering ever redemptive?',
  'How do we hold faith and lament at the same time?',
  'What does the cross say about God\'s relationship to suffering?',
  'How do we respond when suffering feels meaningless?',
  'Can suffering actually deepen faith?',
]);

const ep12Slug = 'the-ultimate-hope';
const ep12Questions = buildQuestions(12, 'The Ultimate Hope', ep12Slug, 'Hard Questions', 5, [
  'What does the Bible say about heaven?',
  'Is heaven a place or a state of being?',
  'What is the new creation and how is it different from \'going to heaven\'?',
  'What happens when we die?',
  'Will we recognize people in the new creation?',
  'How does ultimate hope affect how we live now?',
  'What does the Bible say about hell?',
  'How do we talk about eternity without manipulation?',
  'What is the relationship between hope and grief?',
  'How does Revelation end the story that Genesis started?',
]);

// ---------------------------------------------------------------------------
// All Episodes
// ---------------------------------------------------------------------------

export const episodes: Episode[] = [
  // Phase 1 — Foundation
  {
    number: 1,
    title: 'Is Scripture Sufficient?',
    slug: ep1Slug,
    subtitle: 'Can we trust a 2,000-year-old book with our lives?',
    description:
      'We open the series by tackling the bedrock question: is the Bible actually enough? We explore what sufficiency means, how we know Scripture is reliable, how to handle apparent contradictions, and why studying the Bible is different from just reading it.',
    phase: 'Foundation',
    phaseNumber: 1,
    questions: ep1Questions,
    scripture: {
      reference: '2 Timothy 3:16-17',
      text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work.',
    },
  },
  {
    number: 2,
    title: 'The Character of God',
    slug: ep2Slug,
    subtitle: 'Is God actually good — or just powerful?',
    description:
      'Who is God, really? We dig into His holiness, His love, His wrath, and His jealousy — and wrestle with whether a God who allows pain can truly be called good. This episode lays the foundation for understanding everything else.',
    phase: 'Foundation',
    phaseNumber: 1,
    questions: ep2Questions,
    scripture: {
      reference: 'Psalm 145:8',
      text: 'The LORD is gracious and compassionate, slow to anger and rich in love.',
    },
  },
  {
    number: 3,
    title: 'The Trinity',
    slug: ep3Slug,
    subtitle: 'Three persons, one God — and why it matters more than you think.',
    description:
      'The Trinity is the most foundational and most misunderstood doctrine in Christianity. We explore where it appears in Scripture, why bad analogies do more harm than good, and how the relationship between Father, Son, and Spirit shapes everything from prayer to community.',
    phase: 'Foundation',
    phaseNumber: 1,
    questions: ep3Questions,
    scripture: {
      reference: 'Matthew 28:19',
      text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',
    },
  },

  // Phase 2 — The Fall
  {
    number: 4,
    title: 'Why Does Sin Separate Us from God?',
    slug: ep4Slug,
    subtitle: 'We all know something is broken. But what — and why?',
    description:
      'Something is fundamentally wrong with the world and with us. We explore what actually happened in Eden, whether original sin is fair, why a good God can\'t just overlook sin, and whether anyone can be "good enough" on their own.',
    phase: 'The Fall',
    phaseNumber: 2,
    questions: ep4Questions,
    scripture: {
      reference: 'Romans 3:23',
      text: 'For all have sinned and fall short of the glory of God.',
    },
  },

  // Phase 3 — Redemption
  {
    number: 5,
    title: 'Is Jesus Really God?',
    slug: ep5Slug,
    subtitle: 'The claim that changes everything — if it\'s true.',
    description:
      'Christianity stands or falls on the divinity of Jesus. We examine the evidence, explore what the incarnation means, wrestle with passages where Jesus seems limited, and ask what His divinity means for how we actually live and pray.',
    phase: 'Redemption',
    phaseNumber: 3,
    questions: ep5Questions,
    scripture: {
      reference: 'John 1:1',
      text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    },
  },
  {
    number: 6,
    title: 'The Resurrection',
    slug: ep6Slug,
    subtitle: 'If this didn\'t happen, none of it matters.',
    description:
      'Paul said it plainly: without the resurrection, our faith is in vain. We walk through the historical evidence, respond to alternative theories, explore what a resurrected body looks like, and ask what the resurrection promises for our future.',
    phase: 'Redemption',
    phaseNumber: 3,
    questions: ep6Questions,
    scripture: {
      reference: 'Luke 24:6',
      text: 'He is not here; he has risen!',
    },
  },
  {
    number: 7,
    title: 'What Is the Gospel?',
    slug: ep7Slug,
    subtitle: 'It\'s the best news ever told — but do we actually know what it says?',
    description:
      'The gospel is the center of everything — but can we actually define it? We explore what "saved by grace through faith" really means, how grace and works relate, what the gospel says about guilt and shame, and how to share it without reducing it to a formula.',
    phase: 'Redemption',
    phaseNumber: 3,
    questions: ep7Questions,
    scripture: {
      reference: 'Ephesians 2:8',
      text: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.',
    },
  },

  // Phase 4 — The Christian Life
  {
    number: 8,
    title: 'The Holy Spirit',
    slug: ep8Slug,
    subtitle: 'The most misunderstood person of the Trinity.',
    description:
      'The Holy Spirit is a person, not a force — but what does He actually do? We explore His role in a believer\'s life, how to distinguish His voice from emotion, the difference between gifts and fruit, and how to pursue the Spirit without becoming weird about it.',
    phase: 'The Christian Life',
    phaseNumber: 4,
    questions: ep8Questions,
    scripture: {
      reference: 'Romans 8:16',
      text: 'The Spirit himself testifies with our spirit that we are God\'s children.',
    },
  },
  {
    number: 9,
    title: 'The Church',
    slug: ep9Slug,
    subtitle: 'It\'s messy, it\'s broken, and it\'s the plan.',
    description:
      'The church has hurt people. It has also been the primary vehicle for the gospel for two thousand years. We explore why God chose the church, what it should look like, how to stay when it\'s hard, and how to rebuild trust after it breaks.',
    phase: 'The Christian Life',
    phaseNumber: 4,
    questions: ep9Questions,
    scripture: {
      reference: 'Hebrews 10:24-25',
      text: 'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.',
    },
  },

  // Phase 5 — Hard Questions
  {
    number: 10,
    title: 'Can You Lose Your Salvation?',
    slug: ep10Slug,
    subtitle: 'The question that keeps people up at night.',
    description:
      'Few questions cause more anxiety than this one. We walk through the security of the believer, the warning passages in Hebrews, the tension between Calvinism and Arminianism, and how to handle doubt about salvation with honesty and pastoral care.',
    phase: 'Hard Questions',
    phaseNumber: 5,
    questions: ep10Questions,
    scripture: {
      reference: 'John 10:27-28',
      text: 'My sheep listen to my voice; I know them, and they follow me. I give them eternal life, and they shall never perish; no one will snatch them out of my hand.',
    },
  },
  {
    number: 11,
    title: 'Why Does God Allow Suffering?',
    slug: ep11Slug,
    subtitle: 'The question that has broken more faith than any other.',
    description:
      'If God is good and powerful, why does suffering exist? We wrestle with the problem of evil, what Job actually teaches, whether suffering can be redemptive, and how to hold faith and lament at the same time without resorting to clichés.',
    phase: 'Hard Questions',
    phaseNumber: 5,
    questions: ep11Questions,
    scripture: {
      reference: 'John 16:33',
      text: 'In this world you will have trouble. But take heart! I have overcome the world.',
    },
  },
  {
    number: 12,
    title: 'The Ultimate Hope',
    slug: ep12Slug,
    subtitle: 'What are we actually waiting for?',
    description:
      'We close the series by looking forward. What does the Bible actually say about heaven, hell, the new creation, and what happens when we die? We explore how ultimate hope shapes present living and how Revelation finishes the story Genesis started.',
    phase: 'Hard Questions',
    phaseNumber: 5,
    questions: ep12Questions,
    scripture: {
      reference: 'Revelation 21:4',
      text: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.',
    },
  },
];
