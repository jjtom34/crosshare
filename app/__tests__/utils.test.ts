import cases from 'jest-in-case';

import {
  buildTagIndex,
  checkGrid,
  fnv1a,
  isMetaSolution,
  slugify,
} from '../lib/utils';

cases(
  'fnv1a hash function',
  (opts) => {
    expect(fnv1a(opts.name)).toEqual(opts.hash);
  },
  [
    { name: '', hash: 0x811c9dc5 },
    { name: 'a', hash: 0xe40c292c },
    { name: 'b', hash: 0xe70c2de5 },
    { name: 'c', hash: 0xe60c2c52 },
    { name: 'd', hash: 0xe10c2473 },
    { name: 'e', hash: 0xe00c22e0 },
    { name: 'f', hash: 0xe30c2799 },
    { name: 'fo', hash: 0x6222e842 },
    { name: 'foo', hash: 0xa9f37ed7 },
    { name: 'foob', hash: 0x3f5076ef },
    { name: 'fooba', hash: 0x39aaa18a },
    { name: 'foobar', hash: 0xbf9cf968 },
  ]
);

test('isMetaSolution', () => {
  expect(isMetaSolution('foo', ['FOO'])).toBeTruthy();
  expect(isMetaSolution(' fo  o ', ['FOO'])).toBeTruthy();
  expect(isMetaSolution('foo!', ['FO  O'])).toBeTruthy();
  expect(isMetaSolution('f@o-o!', ['F[OO]'])).toBeTruthy();

  expect(isMetaSolution('bar', ['FOO'])).not.toBeTruthy();
  expect(isMetaSolution('bar!', ['FOO', 'b a r'])).toBeTruthy();
});

cases(
  'slugify',
  (opts) => {
    expect(slugify(opts.input)).toEqual(opts.output);
  },
  [
    { input: '', output: '' },
    { input: 'test', output: 'test' },
    { input: 'TEST', output: 'test' },
    { input: '  te st  ', output: 'te-st' },
    { input: '  te-st  ', output: 'te-st' },
    { input: 'te@st', output: 'test' },
    { input: undefined, output: '' },
    { input: null, output: '' },
    { input: 'tè,é,ê,ëstÑ', output: 'teeeestn' },
    { input: 'what about 😂', output: 'what-about' },
    { input: 'what-----about', output: 'what-about' },
    {
      input:
        'heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one heres a long one ',
      output:
        'heres-a-long-one-heres-a-long-one-heres-a-long-one-heres-a-long-one-heres-a-long-one-heres-a-long-on',
    },
  ]
);

cases(
  'buildTagIndex',
  (opts) => {
    expect(buildTagIndex(opts.userTags, opts.autoTags)).toEqual(opts.output);
  },
  [
    { userTags: undefined, autoTags: undefined, output: [] },
    { userTags: [], autoTags: undefined, output: [] },
    { userTags: undefined, autoTags: [], output: [] },
    { userTags: ['test'], autoTags: undefined, output: ['test'] },
    { userTags: undefined, autoTags: ['TEST'], output: ['test'] },
    { userTags: [], autoTags: [], output: [] },
    {
      userTags: ['TEST', 'test', '#', 'mike'],
      autoTags: ['mini', 'featured'],
      output: [
        'featured',
        'mike',
        'featured mike',
        'mini',
        'featured mini',
        'mike mini',
        'featured mike mini',
        'test',
        'featured test',
        'mike test',
        'featured mike test',
        'mini test',
        'featured mini test',
        'mike mini test',
      ],
    },
    {
      userTags: [
        'themeless',
        'BLAST',
        'superman',
        'hereisaverylongtagname',
        'here is one with spaces',
        'dummy##foo',
      ],
      autoTags: ['midi', 'featured', 'meta', 'rating-sub-1000'],
      output: [
        'blast',
        'dummyfoo',
        'blast dummyfoo',
        'featured',
        'blast featured',
        'dummyfoo featured',
        'blast dummyfoo featured',
        'here-is-one-with-spa',
        'blast here-is-one-with-spa',
        'dummyfoo here-is-one-with-spa',
        'blast dummyfoo here-is-one-with-spa',
        'featured here-is-one-with-spa',
        'blast featured here-is-one-with-spa',
        'dummyfoo featured here-is-one-with-spa',
        'hereisaverylongtagna',
        'blast hereisaverylongtagna',
        'dummyfoo hereisaverylongtagna',
        'blast dummyfoo hereisaverylongtagna',
        'featured hereisaverylongtagna',
        'blast featured hereisaverylongtagna',
        'dummyfoo featured hereisaverylongtagna',
        'here-is-one-with-spa hereisaverylongtagna',
        'blast here-is-one-with-spa hereisaverylongtagna',
        'dummyfoo here-is-one-with-spa hereisaverylongtagna',
        'featured here-is-one-with-spa hereisaverylongtagna',
        'meta',
        'blast meta',
        'dummyfoo meta',
        'blast dummyfoo meta',
        'featured meta',
        'blast featured meta',
        'dummyfoo featured meta',
        'here-is-one-with-spa meta',
        'blast here-is-one-with-spa meta',
        'dummyfoo here-is-one-with-spa meta',
        'featured here-is-one-with-spa meta',
        'hereisaverylongtagna meta',
        'blast hereisaverylongtagna meta',
        'dummyfoo hereisaverylongtagna meta',
        'featured hereisaverylongtagna meta',
        'here-is-one-with-spa hereisaverylongtagna meta',
        'midi',
        'blast midi',
        'dummyfoo midi',
        'blast dummyfoo midi',
        'featured midi',
        'blast featured midi',
        'dummyfoo featured midi',
        'here-is-one-with-spa midi',
        'blast here-is-one-with-spa midi',
        'dummyfoo here-is-one-with-spa midi',
        'featured here-is-one-with-spa midi',
        'hereisaverylongtagna midi',
        'blast hereisaverylongtagna midi',
        'dummyfoo hereisaverylongtagna midi',
        'featured hereisaverylongtagna midi',
        'here-is-one-with-spa hereisaverylongtagna midi',
        'meta midi',
        'blast meta midi',
        'dummyfoo meta midi',
        'featured meta midi',
        'here-is-one-with-spa meta midi',
        'hereisaverylongtagna meta midi',
        'rating-sub-1000',
        'blast rating-sub-1000',
        'dummyfoo rating-sub-1000',
        'blast dummyfoo rating-sub-1000',
        'featured rating-sub-1000',
        'blast featured rating-sub-1000',
        'dummyfoo featured rating-sub-1000',
        'here-is-one-with-spa rating-sub-1000',
        'blast here-is-one-with-spa rating-sub-1000',
        'dummyfoo here-is-one-with-spa rating-sub-1000',
        'featured here-is-one-with-spa rating-sub-1000',
        'hereisaverylongtagna rating-sub-1000',
        'blast hereisaverylongtagna rating-sub-1000',
        'dummyfoo hereisaverylongtagna rating-sub-1000',
        'featured hereisaverylongtagna rating-sub-1000',
        'here-is-one-with-spa hereisaverylongtagna rating-sub-1000',
        'meta rating-sub-1000',
        'blast meta rating-sub-1000',
        'dummyfoo meta rating-sub-1000',
        'featured meta rating-sub-1000',
        'here-is-one-with-spa meta rating-sub-1000',
        'hereisaverylongtagna meta rating-sub-1000',
        'midi rating-sub-1000',
        'blast midi rating-sub-1000',
        'dummyfoo midi rating-sub-1000',
        'featured midi rating-sub-1000',
        'here-is-one-with-spa midi rating-sub-1000',
        'hereisaverylongtagna midi rating-sub-1000',
        'meta midi rating-sub-1000',
        'superman',
        'blast superman',
        'dummyfoo superman',
        'blast dummyfoo superman',
        'featured superman',
        'blast featured superman',
        'dummyfoo featured superman',
        'here-is-one-with-spa superman',
        'blast here-is-one-with-spa superman',
        'dummyfoo here-is-one-with-spa superman',
        'featured here-is-one-with-spa superman',
        'hereisaverylongtagna superman',
        'blast hereisaverylongtagna superman',
        'dummyfoo hereisaverylongtagna superman',
        'featured hereisaverylongtagna superman',
        'here-is-one-with-spa hereisaverylongtagna superman',
        'meta superman',
        'blast meta superman',
        'dummyfoo meta superman',
        'featured meta superman',
        'here-is-one-with-spa meta superman',
        'hereisaverylongtagna meta superman',
        'midi superman',
        'blast midi superman',
        'dummyfoo midi superman',
        'featured midi superman',
        'here-is-one-with-spa midi superman',
        'hereisaverylongtagna midi superman',
        'meta midi superman',
        'rating-sub-1000 superman',
        'blast rating-sub-1000 superman',
        'dummyfoo rating-sub-1000 superman',
        'featured rating-sub-1000 superman',
        'here-is-one-with-spa rating-sub-1000 superman',
        'hereisaverylongtagna rating-sub-1000 superman',
        'meta rating-sub-1000 superman',
        'midi rating-sub-1000 superman',
        'themeless',
        'blast themeless',
        'dummyfoo themeless',
        'blast dummyfoo themeless',
        'featured themeless',
        'blast featured themeless',
        'dummyfoo featured themeless',
        'here-is-one-with-spa themeless',
        'blast here-is-one-with-spa themeless',
        'dummyfoo here-is-one-with-spa themeless',
        'featured here-is-one-with-spa themeless',
        'hereisaverylongtagna themeless',
        'blast hereisaverylongtagna themeless',
        'dummyfoo hereisaverylongtagna themeless',
        'featured hereisaverylongtagna themeless',
        'here-is-one-with-spa hereisaverylongtagna themeless',
        'meta themeless',
        'blast meta themeless',
        'dummyfoo meta themeless',
        'featured meta themeless',
        'here-is-one-with-spa meta themeless',
        'hereisaverylongtagna meta themeless',
        'midi themeless',
        'blast midi themeless',
        'dummyfoo midi themeless',
        'featured midi themeless',
        'here-is-one-with-spa midi themeless',
        'hereisaverylongtagna midi themeless',
        'meta midi themeless',
        'rating-sub-1000 themeless',
        'blast rating-sub-1000 themeless',
        'dummyfoo rating-sub-1000 themeless',
        'featured rating-sub-1000 themeless',
        'here-is-one-with-spa rating-sub-1000 themeless',
        'hereisaverylongtagna rating-sub-1000 themeless',
        'meta rating-sub-1000 themeless',
        'midi rating-sub-1000 themeless',
        'superman themeless',
        'blast superman themeless',
        'dummyfoo superman themeless',
        'featured superman themeless',
        'here-is-one-with-spa superman themeless',
        'hereisaverylongtagna superman themeless',
        'meta superman themeless',
        'midi superman themeless',
        'rating-sub-1000 superman themeless',
      ],
    },
  ]
);

cases(
  'checkGrid',
  (opts) => {
    expect(checkGrid(opts.grid, opts.answers, opts.alts)).toEqual(opts.res);
  },
  [
    { grid: [], answers: [], alts: [], res: [true, true] },
    { grid: ['', 'B'], answers: ['A', 'B'], alts: [], res: [false, false] },
    { grid: ['B', 'B'], answers: ['A', 'B'], alts: [], res: [true, false] },
    { grid: ['A', 'B'], answers: ['A', 'B'], alts: [], res: [true, true] },
    {
      grid: ['B', 'B'],
      answers: ['A', 'B'],
      alts: [[<[number, string]>[0, 'C']]],
      res: [true, false],
    },
    {
      grid: ['B', 'B'],
      answers: ['A', 'B'],
      alts: [[<[number, string]>[0, 'B']]],
      res: [true, true],
    },
    {
      grid: ['B', 'B', 'C', 'C'],
      answers: ['A', 'B', 'C', 'D'],
      alts: [[<[number, string]>[0, 'B']]],
      res: [true, false],
    },
    {
      grid: ['B', 'B', 'C', 'C'],
      answers: ['A', 'B', 'C', 'D'],
      alts: [[<[number, string]>[0, 'B'], <[number, string]>[3, 'C']]],
      res: [true, true],
    },
    {
      grid: ['B', 'B', 'C', 'C'],
      answers: ['A', 'B', 'C', 'D'],
      alts: [[<[number, string]>[0, 'D'], <[number, string]>[3, 'C']]],
      res: [true, false],
    },
    {
      grid: ['B', 'B', 'C', 'C'],
      answers: ['A', 'B', 'C', 'D'],
      alts: [[<[number, string]>[0, 'B'], <[number, string]>[3, 'A']]],
      res: [true, false],
    },
    {
      grid: ['B', 'B', 'C', 'C'],
      answers: ['A', 'B', 'C', 'D'],
      alts: [
        [<[number, string]>[0, 'D']],
        [<[number, string]>[0, 'B'], <[number, string]>[3, 'C']],
      ],
      res: [true, true],
    },
    {
      grid: ['B', 'B', 'C', 'C'],
      answers: ['A', 'B', 'C', 'D'],
      alts: [[<[number, string]>[0, 'B']], [<[number, string]>[3, 'C']]],
      res: [true, true],
    },
  ]
);
