// data/family.ts
// 虛構的林氏家族，跨五代（曾祖父母 → 祖父母 → 父母 → 本代 → 孫子女）
// 共 23 位成員、9 個 Family

import type { Person, Family, PersonId, FamilyId } from '@/types/family'

// ─── 第一代（曾祖父母） ───────────────────────────────────────────────────────

const p001: Person = {
  id: 'p-001',
  surname: '林',
  givenName: '福全',
  fullName: '林福全',
  gender: 'male',
  birthDate: '1895',
  birthPlace: '福建省泉州府',
  deathDate: '1968-03-12',
  deathPlace: '台灣台北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=1',
  biography:
    '林福全生於清末福建泉州，二十歲渡海來台，定居台北從事南北雜貨貿易。\n他白手起家，以誠信立身，逐漸建立起林家在大稻埕的商業根基。\n晚年熱心公益，出資修建地方廟宇，為鄉里所敬重。',
  events: [
    { id: 'e-001', type: 'birth', date: '1895', place: '福建省泉州府', description: '出生於泉州府晉江縣' },
    { id: 'e-002', type: 'migration', date: '1915', place: '台灣台北市大稻埕', description: '渡海來台，落腳大稻埕' },
    { id: 'e-003', type: 'marriage', date: '1918', place: '台北市', description: '與陳月梅成婚' },
    { id: 'e-004', type: 'career', date: '1920', place: '台北市大稻埕', description: '創立「林記南北雜貨行」' },
    { id: 'e-005', type: 'death', date: '1968-03-12', place: '台灣台北市', description: '辭世，享年七十三歲' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-001'],
  tags: ['族長', '創業先祖'],
}

const p002: Person = {
  id: 'p-002',
  surname: '陳',
  givenName: '月梅',
  fullName: '陳月梅（林陳氏）',
  gender: 'female',
  birthDate: '1900',
  birthPlace: '台灣台北縣',
  deathDate: '1972-07-05',
  deathPlace: '台灣台北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=2',
  biography:
    '陳月梅出生於台北縣望族，嫁入林家後操持家務、撫育五子，是林家凝聚力的核心。\n她精通女紅，亦善於料理，鄰里皆稱「林嫂」，子孫對她的懷念代代相傳。',
  events: [
    { id: 'e-006', type: 'birth', date: '1900', place: '台灣台北縣', description: '出生於台北縣' },
    { id: 'e-007', type: 'marriage', date: '1918', place: '台北市', description: '嫁入林家' },
    { id: 'e-008', type: 'death', date: '1972-07-05', place: '台灣台北市', description: '辭世，享年七十二歲' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-001'],
}

// ─── 第二代（祖父母） ─────────────────────────────────────────────────────────

const p003: Person = {
  id: 'p-003',
  surname: '林',
  givenName: '文雄',
  fullName: '林文雄',
  gender: 'male',
  birthDate: '1920-05-15',
  birthPlace: '台灣台北市大稻埕',
  deathDate: '1990-11-22',
  deathPlace: '台灣台北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=3',
  biography:
    '林文雄為林福全長子，自幼聰穎，就讀台北第二中學，後考入台北帝國大學附屬農林專門部。\n戰後投入地方政治，曾任台北市議員三屆，力促地方教育建設。\n退休後樂於垂釣，與老友品茗論古，是家族中的精神領柱。',
  events: [
    { id: 'e-009', type: 'birth', date: '1920-05-15', place: '台灣台北市大稻埕', description: '長子誕生' },
    { id: 'e-010', type: 'education', date: '1934', place: '台北市', description: '就讀台北第二中學' },
    { id: 'e-011', type: 'education', date: '1940', place: '台北市', description: '台北帝國大學附屬農林專門部畢業' },
    { id: 'e-012', type: 'marriage', date: '1946-09', place: '台北市', description: '與黃秀蘭成婚' },
    { id: 'e-013', type: 'career', date: '1954', place: '台北市', description: '當選台北市議員（第一屆）' },
    { id: 'e-014', type: 'death', date: '1990-11-22', place: '台灣台北市', description: '辭世，享年七十歲' },
  ],
  parentFamilyId: 'f-001',
  spouseFamilyIds: ['f-002'],
  tags: ['長子', '市議員'],
}

const p004: Person = {
  id: 'p-004',
  surname: '黃',
  givenName: '秀蘭',
  fullName: '黃秀蘭（林黃氏）',
  gender: 'female',
  birthDate: '1924-02-08',
  birthPlace: '台灣基隆市',
  deathDate: '1998-04-30',
  deathPlace: '台灣台北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=4',
  biography:
    '黃秀蘭出身基隆漁商家庭，嫁給林文雄後全心投入家庭。\n她擅長刺繡，曾獲地方手工藝展覽獎項，作品至今仍保存在家族相冊中。',
  events: [
    { id: 'e-015', type: 'birth', date: '1924-02-08', place: '台灣基隆市', description: '出生於基隆市' },
    { id: 'e-016', type: 'marriage', date: '1946-09', place: '台北市', description: '嫁入林家' },
    { id: 'e-017', type: 'death', date: '1998-04-30', place: '台灣台北市', description: '辭世，享年七十四歲' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-002'],
}

const p005: Person = {
  id: 'p-005',
  surname: '林',
  givenName: '文成',
  fullName: '林文成',
  gender: 'male',
  birthDate: '1923-08-01',
  birthPlace: '台灣台北市大稻埕',
  deathDate: '1975-12-03',
  deathPlace: '台灣台中市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=5',
  biography:
    '林文成為林福全次子，個性務實，戰後南遷台中從事建築業，是林家在中部的開枝散葉者。\n他英年早逝，留下妻兒，但其子女皆承父志，在台中各有成就。',
  events: [
    { id: 'e-018', type: 'birth', date: '1923-08-01', place: '台灣台北市大稻埕', description: '次子誕生' },
    { id: 'e-019', type: 'migration', date: '1950', place: '台灣台中市', description: '南遷台中，從事建築業' },
    { id: 'e-020', type: 'marriage', date: '1952-03', place: '台中市', description: '與吳美珠成婚' },
    { id: 'e-021', type: 'death', date: '1975-12-03', place: '台灣台中市', description: '因心臟病辭世，享年五十二歲' },
  ],
  parentFamilyId: 'f-001',
  spouseFamilyIds: ['f-003'],
  tags: ['次子'],
}

const p006: Person = {
  id: 'p-006',
  surname: '吳',
  givenName: '美珠',
  fullName: '吳美珠（林吳氏）',
  gender: 'female',
  birthDate: '1928-06-20',
  birthPlace: '台灣彰化縣',
  deathDate: '2005-09-14',
  deathPlace: '台灣台中市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=6',
  biography:
    '吳美珠出身彰化農家，嫁給林文成後隨夫定居台中。\n丈夫早逝後，她獨力撫養三名子女，辛苦持家，晚年被子女奉養，頤養天年。',
  events: [
    { id: 'e-022', type: 'birth', date: '1928-06-20', place: '台灣彰化縣', description: '出生於彰化縣' },
    { id: 'e-023', type: 'marriage', date: '1952-03', place: '台中市', description: '嫁入林家' },
    { id: 'e-024', type: 'death', date: '2005-09-14', place: '台灣台中市', description: '辭世，享年七十七歲' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-003'],
}

// ─── 第三代（父母輩） ─────────────────────────────────────────────────────────

const p007: Person = {
  id: 'p-007',
  surname: '林',
  givenName: '建國',
  fullName: '林建國',
  gender: 'male',
  birthDate: '1948-10-10',
  birthPlace: '台灣台北市',
  deathDate: '2015-02-14',
  deathPlace: '台灣台北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=7',
  biography:
    '林建國是林文雄與黃秀蘭的長子，畢業於台灣大學法律系，後進入政府機關擔任公務員，以嚴謹著稱。\n他退休後筆耕不輟，撰寫家族史，其手稿成為本網站資料的重要來源。',
  events: [
    { id: 'e-025', type: 'birth', date: '1948-10-10', place: '台灣台北市', description: '出生於台北市' },
    { id: 'e-026', type: 'education', date: '1970', place: '台北市', description: '台灣大學法律系畢業' },
    { id: 'e-027', type: 'career', date: '1971', place: '台北市', description: '進入行政院法務部任職' },
    { id: 'e-028', type: 'marriage', date: '1975-08', place: '台北市', description: '與王淑華成婚' },
    { id: 'e-029', type: 'career', date: '2008', place: '台北市', description: '自法務部退休' },
    { id: 'e-030', type: 'death', date: '2015-02-14', place: '台灣台北市', description: '辭世，享年六十六歲' },
  ],
  parentFamilyId: 'f-002',
  spouseFamilyIds: ['f-004'],
  tags: ['長子', '法學家'],
}

const p008: Person = {
  id: 'p-008',
  surname: '王',
  givenName: '淑華',
  fullName: '王淑華（林王氏）',
  gender: 'female',
  birthDate: '1952-03-22',
  birthPlace: '台灣新竹市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=8',
  biography:
    '王淑華出身新竹書香世家，畢業於師範大學中文系，曾任國中國文教師逾三十年。\n丈夫過世後定居台北，與子女同住，熱愛園藝與書法，至今仍定期與舊友茶敘。',
  events: [
    { id: 'e-031', type: 'birth', date: '1952-03-22', place: '台灣新竹市', description: '出生於新竹市' },
    { id: 'e-032', type: 'education', date: '1974', place: '台北市', description: '師範大學中文系畢業' },
    { id: 'e-033', type: 'career', date: '1975', place: '台北市', description: '擔任國中國文教師' },
    { id: 'e-034', type: 'marriage', date: '1975-08', place: '台北市', description: '嫁入林家' },
    { id: 'e-035', type: 'career', date: '2005', place: '台北市', description: '自教職退休' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-004'],
}

const p009: Person = {
  id: 'p-009',
  surname: '林',
  givenName: '建志',
  fullName: '林建志',
  gender: 'male',
  birthDate: '1952-06-18',
  birthPlace: '台灣台北市',
  deathDate: '2010-07-07',
  deathPlace: '台灣台北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=9',
  events: [
    { id: 'e-036', type: 'birth', date: '1952-06-18', place: '台灣台北市', description: '出生於台北市' },
    { id: 'e-037', type: 'education', date: '1974', place: '台北市', description: '政治大學企業管理系畢業' },
    { id: 'e-038', type: 'marriage', date: '1980-05', place: '台北市', description: '與蔡惠玲成婚' },
    { id: 'e-039', type: 'career', date: '1985', place: '台北市', description: '創立「建林企業有限公司」' },
    { id: 'e-040', type: 'death', date: '2010-07-07', place: '台灣台北市', description: '因肝癌辭世，享年五十八歲' },
  ],
  parentFamilyId: 'f-002',
  spouseFamilyIds: ['f-005'],
  tags: ['次子', '企業家'],
}

const p010: Person = {
  id: 'p-010',
  surname: '蔡',
  givenName: '惠玲',
  fullName: '蔡惠玲（林蔡氏）',
  gender: 'female',
  birthDate: '1955-11-30',
  birthPlace: '台灣台南市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=10',
  biography:
    '蔡惠玲出身台南，大學就讀文化大學大眾傳播系，畢業後從事廣告業。\n嫁入林家後半途離開職場照顧家庭，丈夫林建志過世後繼承公司，以堅毅的個性重整家族事業。',
  events: [
    { id: 'e-041', type: 'birth', date: '1955-11-30', place: '台灣台南市', description: '出生於台南市' },
    { id: 'e-042', type: 'education', date: '1977', place: '台北市', description: '文化大學大眾傳播系畢業' },
    { id: 'e-043', type: 'marriage', date: '1980-05', place: '台北市', description: '嫁入林家' },
    { id: 'e-044', type: 'career', date: '2010', place: '台北市', description: '接管建林企業有限公司' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-005'],
}

const p011: Person = {
  id: 'p-011',
  surname: '林',
  givenName: '美華',
  fullName: '林美華',
  gender: 'female',
  birthDate: '1955-04-03',
  birthPlace: '台灣台北市',
  deathDate: '2020-01-01',
  deathPlace: '台灣新北市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=11',
  biography:
    '林美華是林文雄的么女，個性開朗，擅長音樂，曾在國立藝專（今台藝大）就讀音樂科。\n她嫁給鄭俊傑後定居新北市，後因癌症辭世。',
  events: [
    { id: 'e-045', type: 'birth', date: '1955-04-03', place: '台灣台北市', description: '么女誕生' },
    { id: 'e-046', type: 'education', date: '1975', place: '台北縣', description: '國立藝專音樂科就讀' },
    { id: 'e-047', type: 'marriage', date: '1980-10', place: '新北市', description: '嫁給鄭俊傑' },
    { id: 'e-048', type: 'death', date: '2020-01-01', place: '台灣新北市', description: '因乳癌辭世，享年六十四歲' },
  ],
  parentFamilyId: 'f-002',
  spouseFamilyIds: ['f-006'],
  tags: ['么女'],
}

const p012: Person = {
  id: 'p-012',
  surname: '鄭',
  givenName: '俊傑',
  fullName: '鄭俊傑',
  gender: 'male',
  birthDate: '1950-09-15',
  birthPlace: '台灣新北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=12',
  events: [
    { id: 'e-049', type: 'birth', date: '1950-09-15', place: '台灣新北市', description: '出生於新北市' },
    { id: 'e-050', type: 'marriage', date: '1980-10', place: '新北市', description: '與林美華成婚' },
    { id: 'e-051', type: 'career', date: '1985', place: '新北市', description: '擔任建築師事務所合夥人' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-006'],
}

const p013: Person = {
  id: 'p-013',
  surname: '林',
  givenName: '志成',
  fullName: '林志成',
  gender: 'male',
  birthDate: '1954-07-25',
  birthPlace: '台灣台中市',
  deathDate: '2000-03-18',
  deathPlace: '台灣台中市',
  isLiving: false,
  photoUrl: 'https://i.pravatar.cc/300?img=13',
  biography:
    '林志成為林文成長子，台中工業職校機械科畢業，繼承父親建築事業，在台中頗具聲名。\n英年因車禍早逝，留下妻兒，令族人扼腕。',
  events: [
    { id: 'e-052', type: 'birth', date: '1954-07-25', place: '台灣台中市', description: '出生於台中市' },
    { id: 'e-053', type: 'education', date: '1972', place: '台中市', description: '台中工業職校機械科畢業' },
    { id: 'e-054', type: 'marriage', date: '1978-04', place: '台中市', description: '與張麗雲成婚' },
    { id: 'e-055', type: 'career', date: '1980', place: '台中市', description: '接管父親建築公司' },
    { id: 'e-056', type: 'death', date: '2000-03-18', place: '台灣台中市', description: '因車禍辭世，享年四十五歲' },
  ],
  parentFamilyId: 'f-003',
  spouseFamilyIds: ['f-007'],
  tags: ['長子'],
}

const p014: Person = {
  id: 'p-014',
  surname: '張',
  givenName: '麗雲',
  fullName: '張麗雲（林張氏）',
  gender: 'female',
  birthDate: '1957-12-05',
  birthPlace: '台灣台中縣',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=14',
  events: [
    { id: 'e-057', type: 'birth', date: '1957-12-05', place: '台灣台中縣', description: '出生於台中縣' },
    { id: 'e-058', type: 'marriage', date: '1978-04', place: '台中市', description: '嫁入林家' },
    { id: 'e-059', type: 'career', date: '2001', place: '台中市', description: '自行開設服裝設計工作室' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-007'],
}

// ─── 第四代（本代） ───────────────────────────────────────────────────────────

const p015: Person = {
  id: 'p-015',
  surname: '林',
  givenName: '宗翰',
  fullName: '林宗翰',
  gender: 'male',
  birthDate: '1978-03-08',
  birthPlace: '台灣台北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=15',
  biography:
    '林宗翰為林建國長子，畢業於台大資訊工程系，旅美取得電腦科學碩士後返台，現任職於台北某科技公司。\n他熱愛登山，每年固定與家人安排一次家族旅遊，是家族聚會的主要推手。',
  events: [
    { id: 'e-060', type: 'birth', date: '1978-03-08', place: '台灣台北市', description: '出生於台北市' },
    { id: 'e-061', type: 'education', date: '2001', place: '台北市', description: '台灣大學資訊工程系畢業' },
    { id: 'e-062', type: 'education', date: '2004', place: '美國加州', description: '美國加州大學電腦科學碩士' },
    { id: 'e-063', type: 'marriage', date: '2008-11', place: '台北市', description: '與陳思穎成婚' },
    { id: 'e-064', type: 'career', date: '2010', place: '台北市', description: '加入某科技新創公司擔任資深工程師' },
  ],
  parentFamilyId: 'f-004',
  spouseFamilyIds: ['f-008'],
  tags: ['長子'],
}

const p016: Person = {
  id: 'p-016',
  surname: '陳',
  givenName: '思穎',
  fullName: '陳思穎（林陳氏）',
  gender: 'female',
  birthDate: '1980-07-14',
  birthPlace: '台灣高雄市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=16',
  biography:
    '陳思穎出身高雄，台大商學系畢業後進入金融業，現任某銀行企金部門主管。\n她與林宗翰育有兩子，在工作與家庭之間取得平衡，是家族中公認的「能人」。',
  events: [
    { id: 'e-065', type: 'birth', date: '1980-07-14', place: '台灣高雄市', description: '出生於高雄市' },
    { id: 'e-066', type: 'education', date: '2003', place: '台北市', description: '台灣大學商學系畢業' },
    { id: 'e-067', type: 'marriage', date: '2008-11', place: '台北市', description: '嫁入林家' },
    { id: 'e-068', type: 'career', date: '2015', place: '台北市', description: '升任某銀行企金部門主管' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-008'],
}

const p017: Person = {
  id: 'p-017',
  surname: '林',
  givenName: '宗育',
  fullName: '林宗育',
  gender: 'male',
  birthDate: '1982-11-20',
  birthPlace: '台灣台北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=17',
  biography:
    '林宗育為林建國次子，個性灑脫，走藝文路線，就讀台南藝術大學音像紀錄研究所，後成為獨立紀錄片導演。\n其作品多次入選台灣國際紀錄片影展，以記錄偏鄉社區為主題。',
  events: [
    { id: 'e-069', type: 'birth', date: '1982-11-20', place: '台灣台北市', description: '出生於台北市' },
    { id: 'e-070', type: 'education', date: '2008', place: '台南市', description: '台南藝術大學音像紀錄研究所畢業' },
    { id: 'e-071', type: 'career', date: '2009', place: '台北市', description: '成立「宗育影像工作室」' },
  ],
  parentFamilyId: 'f-004',
  spouseFamilyIds: [],
  tags: ['次子', '導演'],
}

const p018: Person = {
  id: 'p-018',
  surname: '林',
  givenName: '雅婷',
  fullName: '林雅婷',
  gender: 'female',
  birthDate: '1981-09-02',
  birthPlace: '台灣台北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=18',
  biography:
    '林雅婷是林建志與蔡惠玲之女，就讀輔仁大學法律系後轉往商界，現任職於台北某外商公司。\n她是家族中最早接觸網路的一代，積極推動建立本家族族譜網站。',
  events: [
    { id: 'e-072', type: 'birth', date: '1981-09-02', place: '台灣台北市', description: '出生於台北市' },
    { id: 'e-073', type: 'education', date: '2004', place: '台北市', description: '輔仁大學法律系畢業' },
    { id: 'e-074', type: 'career', date: '2005', place: '台北市', description: '加入外商公司擔任法務' },
  ],
  parentFamilyId: 'f-005',
  spouseFamilyIds: [],
  tags: ['長女'],
}

const p019: Person = {
  id: 'p-019',
  surname: '林',
  givenName: '俊宏',
  fullName: '鄭俊宏（林俊宏）',
  gender: 'male',
  birthDate: '1983-05-10',
  birthPlace: '台灣新北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=19',
  biography:
    '林俊宏（隨母姓改名鄭俊宏）為林美華與鄭俊傑之子，現任職於建築師事務所，子承父業。\n他熱衷古蹟保存，曾參與多項台灣歷史建築修復計畫。',
  events: [
    { id: 'e-075', type: 'birth', date: '1983-05-10', place: '台灣新北市', description: '出生於新北市' },
    { id: 'e-076', type: 'education', date: '2007', place: '台北市', description: '淡江大學建築系畢業' },
    { id: 'e-077', type: 'career', date: '2008', place: '台北市', description: '任職建築師事務所' },
  ],
  parentFamilyId: 'f-006',
  spouseFamilyIds: [],
}

const p020: Person = {
  id: 'p-020',
  surname: '林',
  givenName: '志豪',
  fullName: '林志豪',
  gender: 'male',
  birthDate: '1980-02-28',
  birthPlace: '台灣台中市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=20',
  biography:
    '林志豪為林志成長子，繼承祖父林文成的建築事業，是台中林家第三代掌門人。\n他將家族建設公司轉型為現代化建設集團，業務擴及全台。',
  events: [
    { id: 'e-078', type: 'birth', date: '1980-02-28', place: '台灣台中市', description: '出生於台中市' },
    { id: 'e-079', type: 'education', date: '2003', place: '台中市', description: '逢甲大學土木工程系畢業' },
    { id: 'e-080', type: 'marriage', date: '2007-06', place: '台中市', description: '與許雅芳成婚' },
    { id: 'e-081', type: 'career', date: '2008', place: '台中市', description: '接管林氏建設集團' },
  ],
  parentFamilyId: 'f-007',
  spouseFamilyIds: ['f-009'],
  tags: ['長子', '企業家'],
}

const p021: Person = {
  id: 'p-021',
  surname: '許',
  givenName: '雅芳',
  fullName: '許雅芳（林許氏）',
  gender: 'female',
  birthDate: '1983-08-17',
  birthPlace: '台灣台中市',
  deathDate: undefined,
  isLiving: true,
  events: [
    { id: 'e-082', type: 'birth', date: '1983-08-17', place: '台灣台中市', description: '出生於台中市' },
    { id: 'e-083', type: 'education', date: '2006', place: '台中市', description: '東海大學社會工作學系畢業' },
    { id: 'e-084', type: 'marriage', date: '2007-06', place: '台中市', description: '嫁入林家' },
  ],
  parentFamilyId: undefined,
  spouseFamilyIds: ['f-009'],
}

// ─── 第五代（孫子女） ─────────────────────────────────────────────────────────

const p022: Person = {
  id: 'p-022',
  surname: '林',
  givenName: '子恩',
  fullName: '林子恩',
  gender: 'male',
  birthDate: '2010-04-15',
  birthPlace: '台灣台北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=22',
  events: [
    { id: 'e-085', type: 'birth', date: '2010-04-15', place: '台灣台北市', description: '出生於台北市' },
    { id: 'e-086', type: 'education', date: '2016', place: '台北市', description: '就讀台北市某國小' },
  ],
  parentFamilyId: 'f-008',
  spouseFamilyIds: [],
}

const p023: Person = {
  id: 'p-023',
  surname: '林',
  givenName: '子涵',
  fullName: '林子涵',
  gender: 'female',
  birthDate: '2013-09-22',
  birthPlace: '台灣台北市',
  deathDate: undefined,
  isLiving: true,
  photoUrl: 'https://i.pravatar.cc/300?img=23',
  events: [
    { id: 'e-087', type: 'birth', date: '2013-09-22', place: '台灣台北市', description: '出生於台北市' },
  ],
  parentFamilyId: 'f-008',
  spouseFamilyIds: [],
}

// ─── 彙整所有人物 ─────────────────────────────────────────────────────────────

export const persons: Record<PersonId, Person> = {
  'p-001': p001,
  'p-002': p002,
  'p-003': p003,
  'p-004': p004,
  'p-005': p005,
  'p-006': p006,
  'p-007': p007,
  'p-008': p008,
  'p-009': p009,
  'p-010': p010,
  'p-011': p011,
  'p-012': p012,
  'p-013': p013,
  'p-014': p014,
  'p-015': p015,
  'p-016': p016,
  'p-017': p017,
  'p-018': p018,
  'p-019': p019,
  'p-020': p020,
  'p-021': p021,
  'p-022': p022,
  'p-023': p023,
}

// ─── 家庭結構 ─────────────────────────────────────────────────────────────────

// f-001：林福全 × 陳月梅（第一代 → 子女：林文雄、林文成）
const f001: Family = {
  id: 'f-001',
  husbandId: 'p-001',
  wifeId: 'p-002',
  marriageDate: '1918',
  marriagePlace: '台北市',
  childrenIds: ['p-003', 'p-005'],
}

// f-002：林文雄 × 黃秀蘭（第二代 → 子女：林建國、林建志、林美華）
const f002: Family = {
  id: 'f-002',
  husbandId: 'p-003',
  wifeId: 'p-004',
  marriageDate: '1946-09',
  marriagePlace: '台北市',
  childrenIds: ['p-007', 'p-009', 'p-011'],
}

// f-003：林文成 × 吳美珠（第二代 → 子女：林志成）
const f003: Family = {
  id: 'f-003',
  husbandId: 'p-005',
  wifeId: 'p-006',
  marriageDate: '1952-03',
  marriagePlace: '台中市',
  childrenIds: ['p-013'],
}

// f-004：林建國 × 王淑華（第三代 → 子女：林宗翰、林宗育）
const f004: Family = {
  id: 'f-004',
  husbandId: 'p-007',
  wifeId: 'p-008',
  marriageDate: '1975-08',
  marriagePlace: '台北市',
  childrenIds: ['p-015', 'p-017'],
}

// f-005：林建志 × 蔡惠玲（第三代 → 子女：林雅婷）
const f005: Family = {
  id: 'f-005',
  husbandId: 'p-009',
  wifeId: 'p-010',
  marriageDate: '1980-05',
  marriagePlace: '台北市',
  childrenIds: ['p-018'],
}

// f-006：鄭俊傑 × 林美華（第三代 → 子女：林俊宏）
const f006: Family = {
  id: 'f-006',
  husbandId: 'p-012',
  wifeId: 'p-011',
  marriageDate: '1980-10',
  marriagePlace: '新北市',
  childrenIds: ['p-019'],
}

// f-007：林志成 × 張麗雲（第三代（台中支） → 子女：林志豪）
const f007: Family = {
  id: 'f-007',
  husbandId: 'p-013',
  wifeId: 'p-014',
  marriageDate: '1978-04',
  marriagePlace: '台中市',
  childrenIds: ['p-020'],
}

// f-008：林宗翰 × 陳思穎（第四代 → 子女：林子恩、林子涵）
const f008: Family = {
  id: 'f-008',
  husbandId: 'p-015',
  wifeId: 'p-016',
  marriageDate: '2008-11',
  marriagePlace: '台北市',
  childrenIds: ['p-022', 'p-023'],
}

// f-009：林志豪 × 許雅芳（第四代台中支 → 無子女記錄）
const f009: Family = {
  id: 'f-009',
  husbandId: 'p-020',
  wifeId: 'p-021',
  marriageDate: '2007-06',
  marriagePlace: '台中市',
  childrenIds: [],
}

export const families: Record<FamilyId, Family> = {
  'f-001': f001,
  'f-002': f002,
  'f-003': f003,
  'f-004': f004,
  'f-005': f005,
  'f-006': f006,
  'f-007': f007,
  'f-008': f008,
  'f-009': f009,
}

export const rootPersonId: PersonId = 'p-001'
