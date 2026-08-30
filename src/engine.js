import { achievements, audiences, cases, competitors, employeePool, equipment, genres, hookWords, issuePool, marketNews, mechanics, platforms, publishers, research, roles, scopes, settings, traits } from './data.js?v=4';

const STORAGE_KEY = 'studio-404-save-v4';
const clone = (value) => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const id = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export function formatMoney(value) {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(value)).toLocaleString('en-US')}`;
}

export function refreshRating(state) {
  const prev = {}; (state.rating || []).forEach((entry, index) => { prev[entry.name] = index + 1; });
  (state.competitors || []).forEach((c) => { if (c.capital === undefined) c.capital = c.strength * 320 + Math.random() * 12000; c.capital = Math.max(6000, Math.round(c.capital + c.strength * 80 + (Math.random() - 0.42) * 900)); });
  const entries = (state.competitors || []).map((c) => ({ name: c.name, cap: c.capital, isUs: false, icon: c.icon, color: c.color, note: c.style }));
  entries.push({ name: state.studioName || 'Studio 404', cap: state.stats.revenue, isUs: true, icon: state.logo || '404', color: 'var(--accent)', note: 'твоя студия' });
  entries.sort((a, b) => b.cap - a.cap);
  state.rating = entries.map((entry, index) => ({ ...entry, rank: index + 1, move: ((prev[entry.name] === undefined ? index + 1 : prev[entry.name]) - (index + 1)) }));
  return state.rating;
}

export function makeInitialState() {
  const state = {
    version: 4, year: 2000, month: 1, week: 1, money: 9000, reputation: 8, screen: 'dashboard', paused: false, tutorialStep: 0, tutorialCompleted: false,
    studioName: 'Studio 404', logo: '404', branded: false, officeStage: 1, officeUpgradeCost: 12000, currentProject: null, projects: [],
    team: [{ id: 'founder', name: 'Ты', role: 'designer', trait: 'ambitious', level: 1, skills: { programming: 18, design: 72, art: 29, audio: 12, writing: 46, management: 32 }, morale: 86, burnout: 0, loyalty: 100, isFounder: true }],
    recruitment: clone(employeePool.slice(0, 3)).map((candidate, index) => ({ ...candidate, id: `candidate-${index}`, skills: clone(roles.find((role) => role.id === candidate.role).skills) })),
    research: [], market: Object.fromEntries(genres.map((genre) => [genre.id, genre.demand])), competitors: clone(competitors),
    events: [{ id: id('event'), year: 2000, month: 1, tone: 'info', title: 'Комната с видом на будущее', text: 'Аренда дешёвая, компьютер старый, а идея принадлежит тебе. Этого достаточно, чтобы начать.' }],
    news: [{ id: id('news'), year: 2000, month: 1, title: 'Рынок ждёт новых голосов', text: 'Игровая индустрия входит в новое десятилетие. Маленьким студиям ещё есть место.' }],
    history: [{ year: 2000, title: 'Студия основана', text: 'Studio 404 открыла свою первую комнату.' }], achievements: [],
    unlocks: { genres: ['rpg', 'strategy', 'shooter'], settings: ['fantasy', 'sci-fi', 'modern'], platforms: ['pc', 'console'] },
    equipment: [],
    loans: [], creditLimit: 12000, creditUsed: 0, pendingCredit: null, timeLocked: false, monthlyReport: null,
    rating: [], earnedAchievements: [],
    stats: { released: 0, revenue: 0, crunchMonths: 0, noCrunch: true, peakReputation: 8 }, lastRelease: null, bankrupt: false,
    settings: { sound: true, tutorial: true }
  };
  state.competitors.forEach((c) => { c.capital = Math.round(c.strength * 320 + Math.random() * 12000); });
  refreshRating(state);
  return state;
}

export class GameEngine {
  constructor() {
    this.state = this.load() || makeInitialState();
    this.listeners = new Set();
    this.sdk = null;
    this.initSdk();
    this.clockTimer = null;
    this.startClock();
  }

  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  emit() { this.listeners.forEach((listener) => listener(this.state)); }
  getState() { return this.state; }
  update(mutator) { mutator(this.state); this.state.stats.peakReputation = Math.max(this.state.stats.peakReputation, this.state.reputation); this.state.saveNotice = Date.now(); this.save(); this.emit(); }

  async initSdk() {
    try {
      if (window.YaGames?.init) {
        this.sdk = await window.YaGames.init();
        this.sdk.features?.LoadingAPI?.ready?.();
        if (!this.state.paused) this.sdk.features?.GameplayAPI?.start?.();
      }
    } catch (error) { this.sdk = null; }
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const initial = makeInitialState(); const saved = JSON.parse(raw);
      const merged = { ...initial, ...saved, settings: { ...initial.settings, ...(saved.settings || {}) }, unlocks: { ...initial.unlocks, ...(saved.unlocks || {}) } };
      (merged.projects || []).forEach((game) => {
        if (game && game.phase === 'released') {
          if (typeof game.salesRemaining !== 'number') game.salesRemaining = Math.max(0, (game.salesPotential || 0) - (game.sales || 0));
          if (typeof game.salesMonth !== 'number') game.salesMonth = 1;
          if (!Array.isArray(game.salesTrend)) game.salesTrend = [];
          if (typeof game.revenue !== 'number') game.revenue = 0;
          game.scores = game.scores || {};
        }
      });
      if (!Array.isArray(merged.rating)) merged.rating = initial.rating;
      if (!Array.isArray(merged.earnedAchievements)) merged.earnedAchievements = [];
      return merged;
    } catch (error) { return null; }
  }

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (error) { /* Private mode can reject storage. */ }
  }

  reset() { this.stopClock(); this.state = makeInitialState(); this.save(); this.emit(); }
  setScreen(screen) { this.state.screen = screen; this.emit(); }
  setTutorialStep(step) { this.update((state) => { state.tutorialStep = Math.max(0, Math.min(5, step)); state.tutorialCompleted = state.tutorialStep >= 5; }); }
  togglePause() {
    this.update((state) => { state.paused = !state.paused; });
    if (this.state.paused) this.sdk?.features?.GameplayAPI?.stop?.();
    else this.sdk?.features?.GameplayAPI?.start?.();
  }
  setWorkMode(mode) { if (!['proper', 'normal', 'fast', 'crunch'].includes(mode)) return; this.update((state) => { state.workMode = mode; }); }
  setBrand(name, logo) { const clean = String(name || '').trim().slice(0, 24); if (!clean) return false; this.update((state) => { state.branded = true; state.studioName = clean; state.logo = logo || '404'; state.history.unshift({ year: state.year, title: `Основана студия ${clean}`, text: `${clean} выбрала имя, логотип и открыла первую комнату.` }); }); this.startClock(); return true; }
  startClock() { if (this.clockTimer || this.state.bankrupt || this.state.timeLocked || !this.state.branded) return; this.clockTimer = setInterval(() => { if (this.state.bankrupt || this.state.timeLocked) { this.stopClock(); return; } this.advanceWeek(this.state.workMode || 'normal'); }, 6000); this.clockTimer.unref?.(); }
  stopClock() { if (this.clockTimer) { clearInterval(this.clockTimer); this.clockTimer = null; } }
  lockTime() { this.update((state) => { state.timeLocked = true; }); this.stopClock(); }
  unlockTime() { this.update((state) => { state.timeLocked = false; }); this.startClock(); }
  clearReport() { this.update((state) => { state.monthlyReport = null; }); this.startClock(); }
  toggleSetting(key) { this.update((state) => { if (Object.prototype.hasOwnProperty.call(state.settings, key)) state.settings[key] = !state.settings[key]; }); }
  unlockContent(kind, contentId) {
    this.update((state) => {
      const list = kind === 'genres' ? genres : kind === 'settings' ? settings : platforms;
      const item = list.find((entry) => entry.id === contentId); const unlocked = state.unlocks?.[kind] || [];
      if (!item || unlocked.includes(contentId) || !item.unlockCost || state.money < item.unlockCost) return;
      state.money -= item.unlockCost; if (!state.unlocks[kind]) state.unlocks[kind] = []; state.unlocks[kind].push(contentId); this.addEvent(state, 'success', `Открыто: ${item.label}`, 'Новый вариант теперь доступен при создании игры.');
    });
  }

  getOptionData() { return { genres, settings, mechanics, platforms, cameras: ['Вид сверху', 'Вид сбоку', 'Изометрия', 'От первого лица', 'От третьего лица'], audiences, scopes, roles, traits, research, publishers }; }

  previewProject(form) {
    const genre = genres.find((entry) => entry.id === form.genre) || genres[0];
    const setting = settings.find((entry) => entry.id === form.setting) || settings[0];
    const mechanic = mechanics.find((entry) => entry.id === form.mechanic) || mechanics[0];
    const scope = scopes.find((entry) => entry.id === form.scope) || scopes[1];
    const platform = platforms.find((entry) => entry.id === form.platform) || platforms[0];
    const market = this.state.market[genre.id] || genre.demand;
    const hook = hookWords[mechanic.id]?.[Math.floor(Math.random() * hookWords[mechanic.id].length)] || 'система, которая помнит каждое решение';
    const miniBonus = Number(form.miniGameScore || 0);
    const innovation = clamp(42 + mechanic.innovation + setting.freshness + (form.audience === 'Хардкорная' ? 5 : 0) + miniBonus * 5, 0, 98);
    const appeal = clamp(Math.round((genre.baseAppeal + market + setting.freshness + (form.camera === 'Изометрия' ? 4 : 0)) / 2), 0, 99);
    const risk = clamp(Math.round(mechanic.difficulty + scope.months / 2 + (scope.id === 'huge' ? 10 : 0) - (this.state.research.includes('optimization') ? 6 : 0)), 1, 99);
    const ratingLow = clamp(5.1 + (appeal + innovation) / 55 - risk / 40, 3.5, 8.2);
    const ratingHigh = clamp(ratingLow + 1.5 + (this.state.research.includes('analytics') ? 0.3 : 0), ratingLow + 0.4, 9.8);
    const copies = clamp(Number(form.copies || 1000), 100, 100000);
    const startCost = Math.round(scope.cost * 0.35 + platform.cost + copies * 0.12);
    return { genre, setting, mechanic, platform, scope, hook, innovation, appeal, risk, cost: scope.cost, startCost, months: scope.months, audience: Math.round(12000 * scope.multiplier * platform.audience * (appeal / 70)), ratingLow, ratingHigh };
  }

  createProject(form) {
    if (!form.name?.trim() || this.state.currentProject || this.state.bankrupt) return false;
    if (!this.state.unlocks?.genres?.includes(form.genre) || !this.state.unlocks?.settings?.includes(form.setting) || !this.state.unlocks?.platforms?.includes(form.platform || 'pc')) return false;
    const selectedPlatform = platforms.find((entry) => entry.id === (form.platform || 'pc')); if (!selectedPlatform || this.state.year < selectedPlatform.availableFrom) return false;
    const forecast = this.previewProject(form);
    if (this.state.money < forecast.startCost) return false;
    this.update((state) => {
      state.currentProject = {
        id: id('project'), name: form.name.trim().slice(0, 32), platform: form.platform || 'pc', genre: form.genre, setting: form.setting, mechanic: form.mechanic,
        camera: form.camera, audience: form.audience, scope: form.scope, copies: Number(form.copies || 1000), price: Number(form.price || 14.99), trailer: form.trailer === 'on', demo: form.demo === 'on', hook: forecast.hook, forecast,
        progress: { programming: 0, design: 0, art: 0, audio: 0, writing: 0, qa: 0 }, monthsSpent: 0, debt: 0, issues: [], decisions: [],
        marketing: (form.trailer === 'on' ? 6 : 0) + (form.demo === 'on' ? 8 : 0), marketingUsed: [form.trailer === 'on' ? 'trailer' : '', form.demo === 'on' ? 'demo' : ''].filter(Boolean), phase: 'development', delayed: false, qualityPenalty: 0, publisher: null
      };
      state.money -= forecast.startCost;
      if (state.tutorialStep === 0) state.tutorialStep = 1;
      state.history.unshift({ year: state.year, title: `Начата разработка: ${forecast.genre.label}`, text: `${form.name.trim()} перешла в разработку с масштабом «${forecast.scope.label.toLowerCase()}».` });
      state.screen = 'dashboard';
    });
    this.startClock();
    return true;
  }

  skillAverage(skill) {
    const people = this.state.team;
    if (!people.length) return 10;
    return people.reduce((sum, member) => {
      const role = roles.find((entry) => entry.id === member.role);
      const base = member.skills?.[skill] || role?.skills?.[skill] || 10;
      const traitBoost = member.trait === 'ambitious' ? member.level * 2 : member.trait === 'perfectionist' && skill !== 'management' ? 4 : 0;
      return sum + base + member.level * 4 + traitBoost;
    }, 0) / people.length;
  }

  advanceWeek(mode = 'normal') {
    const project = this.state.currentProject;
    if (this.state.paused || this.state.bankrupt) return;
    if (this.state.pendingCredit || this.state.timeLocked || this.state.monthlyReport) return;
    this.update((state) => {
      if (project && (project.phase === 'development' || project.phase === 'release-ready')) {
        const speed = mode === 'crunch' ? 1.35 : mode === 'fast' ? 1.15 : mode === 'proper' ? 0.86 : 1;
        const optimization = state.research.includes('optimization') ? 0.25 : 0;
        const disciplines = ['programming', 'design', 'art', 'audio', 'writing', 'qa'];
        disciplines.forEach((discipline) => {
          const base = this.skillAverage(discipline);
          const debtDrag = project.debt * 0.11 * (1 - optimization);
          const teamFocus = discipline === 'qa' ? this.skillAverage('programming') * 0.55 + this.skillAverage('design') * 0.25 : base;
          const eq = discipline === 'programming' && state.equipment.includes('server') ? 3 : discipline === 'qa' && state.equipment.includes('server') ? 2 : discipline === 'audio' && state.equipment.includes('audio-booth') ? 5 : discipline === 'art' && state.equipment.includes('render-farm') ? 4 : 0;
          project.progress[discipline] = clamp(project.progress[discipline] + Math.max(0.4, (teamFocus / 28 + 2 - debtDrag) * speed / 4) + eq / 4, 0, 100);
        });
        if (mode === 'fast') project.debt += 1.75;
        if (mode === 'proper') project.debt = clamp(project.debt - 0.75, 0, 100);
        if (mode === 'crunch') { project.debt += 2.25; state.stats.crunchMonths += 0.25; state.stats.noCrunch = false; }
        state.team.forEach((member) => {
          member.burnout = clamp(member.burnout + (mode === 'crunch' ? 3 : mode === 'fast' ? 1.5 : -1), 0, 100);
          member.morale = clamp(member.morale + (mode === 'crunch' ? -1.75 : mode === 'proper' ? 0.75 : 0.25) - (project.debt > 45 ? 0.5 : 0), 0, 100);
        });
        const bugRiskReduction = state.equipment.includes('debug-kit') ? 0.35 : 0;
        const averageBurnout = state.team.reduce((sum, member) => sum + member.burnout, 0) / Math.max(1, state.team.length);
        const issueChance = mode === 'crunch' ? 0.19 : mode === 'fast' ? 0.13 : 0.06;
        if (Math.random() < (issueChance + project.debt * 0.001 + averageBurnout * 0.00025) * (1 - bugRiskReduction)) this.spawnIssue(state);
        if (state.tutorialStep === 1) state.tutorialStep = 2;
      }
      state.week += 1;
      if (state.week > 4) {
        state.week = 1;
        if (project && (project.phase === 'development' || project.phase === 'release-ready')) {
          project.monthsSpent += 1;
          if (mode === 'fast') project.decisions.push({ month: state.month, week: 4, type: 'FAST', text: 'Быстрый путь сохранил срок, но добавил долга.' });
          if (mode === 'proper') project.decisions.push({ month: state.month, week: 4, type: 'PROPER', text: 'Команда заплатила временем за более надёжную основу.' });
          if (mode === 'crunch') project.decisions.push({ month: state.month, week: 4, type: 'CRUNCH', text: 'Команда работала дольше обычного.' });
        }
        this.settleMonth(state);
      }
      if (project && project.phase === 'development' && (project.monthsSpent >= project.forecast.months || Object.values(project.progress).every((value) => value >= 82))) { project.phase = 'release-ready'; }
      if (state.money < -5000 && !state.pendingCredit) { state.bankrupt = true; this.addEvent(state, 'danger', 'Запас денег закончился', 'У Studio 404 больше нет средств. Возьми кредит или начни новую историю.'); }
      if (state.monthlyReport) this.stopClock();
    });
  }

  settleMonth(state) {
    const salesFlow = this.processSales(state);
    const loansFlow = this.processLoans(state);
    const officeCost = this.monthlyCost(state);
    state.money -= officeCost;
    const income = salesFlow.income;
    const expenses = Math.round(officeCost + loansFlow.interest);
    const net = income - expenses;
    const endedYear = state.year;
    const endedMonth = state.month;
    state.monthlyReport = { year: endedYear, month: endedMonth, income, salesCount: salesFlow.count, interest: loansFlow.interest, office: officeCost, expenses, net, money: state.money };
    this.tickCalendar(state);
    refreshRating(state);
    this.checkAchievements(state);
    this.offerCredit(state);
  }

  tickCalendar(state) {
    state.month += 1;
    if (state.month > 12) { state.month = 1; state.year += 1; }
    state.recruitment = this.generateRecruitment();
    const bulletin = pick(marketNews);
    state.market[bulletin.genre] = clamp((state.market[bulletin.genre] || 50) + bulletin.delta, 18, 94);
    const newsItem = { id: id('news'), year: state.year, month: state.month, title: bulletin.title, text: bulletin.text };
    state.news.unshift(newsItem); state.news = state.news.slice(0, 18);
    this.addEvent(state, 'info', `Новости рынка: ${bulletin.title}`, bulletin.text);
    if (state.month % 3 === 0) {
      Object.keys(state.market).forEach((key) => { state.market[key] = clamp(state.market[key] + Math.round((Math.random() - 0.45) * 18), 18, 94); });
      const competitor = pick(state.competitors);
      this.addEvent(state, 'info', `${competitor.name} сделала ход`, `${competitor.name} анонсировала новую игру в жанре «${genres.find((genre) => genre.id === competitor.genre)?.label || 'игра'}» — ${competitor.style}.`);
    }
    if (state.currentProject?.debt >= 45 && state.month % 2 === 0) this.addEvent(state, 'warning', 'Долг тормозит комнату', 'Команда тратит больше времени на стабилизацию старого кода, чем на новые функции.');
    const averageBurnout = state.team.reduce((sum, member) => sum + member.burnout, 0) / Math.max(1, state.team.length);
    if (averageBurnout >= 55) this.addEvent(state, 'danger', 'Комната перегревается', 'Команда говорит, что следующий рывок обойдётся дороже, чем сэкономит.');
  }

  monthlyCost(state) { return Math.max(200, Math.round(800 + state.team.reduce((sum, member) => sum + (roles.find((role) => role.id === member.role)?.salary || 1000), 0) * 0.24 - (state.equipment.includes('router') ? 120 : 0))); }

  generateRecruitment() {
    return employeePool.map((candidate) => {
      const role = roles.find((entry) => entry.id === candidate.role); const skills = Object.fromEntries(Object.entries(role.skills).map(([skill, value]) => [skill, clamp(value + Math.round((Math.random() - 0.5) * 16), 8, 96)]));
      return { ...clone(candidate), id: id('candidate'), skills };
    }).sort(() => Math.random() - 0.5).slice(0, 3);
  }

  offerCredit(state) {
    if (state.money >= 0 || state.pendingCredit || state.creditUsed >= state.creditLimit) return;
      state.pendingCredit = Math.min(state.creditLimit - state.creditUsed, Math.max(3000, Math.ceil(-state.money + 2500)));
      this.addEvent(state, 'warning', 'Банк предлагает кредит', `Можно взять ${formatMoney(state.pendingCredit)}, чтобы продолжить работу и вернуть долг позже.`);
    this.stopClock();
  }

  takeCredit() {
    this.update((state) => {
      if (!state.pendingCredit) return;
      const amount = state.pendingCredit;
      state.money += amount; state.creditUsed += amount; state.loans.push({ id: id('loan'), principal: amount, remaining: amount, interest: 0.035 }); state.pendingCredit = null;
      this.addEvent(state, 'info', 'Кредит оформлен', `Студия получила ${formatMoney(amount)}. Проценты будут начисляться каждый месяц.`);
    });
    this.startClock();
  }

  declineCredit() { this.update((state) => { state.pendingCredit = null; if (state.money < -5000) { state.bankrupt = true; this.addEvent(state, 'danger', 'Студия закрыта', 'Без кредита запас денег закончился.'); } }); this.stopClock(); }

  repayCredit(amount = null) {
    this.update((state) => {
      const loan = state.loans.find((entry) => entry.remaining > 0); if (!loan || state.money <= 0) return;
      const payment = Math.min(loan.remaining, amount || 3000, state.money); state.money -= payment; loan.remaining -= payment; state.creditUsed = Math.max(0, state.creditUsed - payment); state.loans = state.loans.filter((entry) => entry.remaining > 0);
      this.addEvent(state, 'success', 'Часть кредита погашена', `Студия вернула ${formatMoney(payment)}.`);
    });
  }

  processLoans(state) { let interest = 0; state.loans.forEach((loan) => { const i = Math.ceil(loan.remaining * loan.interest); interest += i; loan.remaining += i; loan.principal += i; state.creditUsed += i; state.money -= i; }); return { interest }; }

  processSales(state) { let income = 0; let count = 0; state.projects.filter((game) => game.salesRemaining > 0).forEach((game) => {
      const market = state.market[game.genre] || 50; const base = game.salesRemaining * (game.scores?.quality > 75 ? 0.22 : 0.14); const monthly = Math.max(25, Math.min(game.salesRemaining, Math.round(base * (0.65 + market / 150)))); const revenue = Math.round(monthly * ((game.price || 14.99) * 0.55 + (game.rating || 6) / 2) * (game.publisher ? 1 - game.publisher.royalty / 100 : 1));
      game.salesRemaining -= monthly; game.sales += monthly; game.revenue += revenue; game.salesTrend = [...(game.salesTrend || []), monthly]; state.money += revenue; state.stats.revenue += revenue; game.salesMonth = (game.salesMonth || 1) + 1; income += revenue; count += 1;
      if (game.salesMonth <= 3) this.addEvent(state, 'info', `${game.name}: новые продажи`, `${monthly.toLocaleString('ru-RU')} игроков купили игру в этом месяце.`);
    }); return { income, count }; }

  spawnIssue(state) {
    const project = state.currentProject;
    if (!project || project.issues.length >= 3) return;
    const available = issuePool.filter((issue) => !project.issues.some((entry) => entry.id === issue.id));
    const issue = clone(pick(available));
    project.issues.push({ ...issue, status: 'open' });
    this.addEvent(state, 'warning', issue.title, issue.detail);
  }

  resolveIssue(issueId, action) {
    const project = this.state.currentProject;
    if (!project) return;
    this.update((state) => {
      const issue = project.issues.find((entry) => entry.id === issueId && entry.status === 'open');
      if (!issue) return;
      if (action === 'fix') { state.money -= issue.cost; project.debt = clamp(project.debt - 2, 0, 100); project.qualityPenalty += issue.quality; }
      if (action === 'workaround') { state.money -= Math.round(issue.cost * 0.4); project.debt += 4; project.qualityPenalty += Math.round(issue.quality * 0.55); }
      if (action === 'ignore') { project.debt += issue.debt + 4; project.qualityPenalty += issue.quality; }
      if (action === 'postpone') { project.debt += 2; project.qualityPenalty += Math.round(issue.quality * 0.35); }
      issue.status = action === 'ignore' ? 'ignored' : 'resolved';
      const actionLabels = { fix: 'исправление', workaround: 'обходной путь', postpone: 'отложено', ignore: 'проигнорировано' };
      this.addEvent(state, action === 'fix' ? 'success' : 'warning', `${issue.title}: ${actionLabels[action]}`, action === 'fix' ? 'Команда закрыла проблему правильно.' : 'Это решение теперь стало частью истории проекта.');
    });
    if (this.state.currentProject?.phase === 'development' && !this.state.currentProject.issues.some((issue) => issue.status === 'open')) this.startClock();
  }

  addMarketing(type) {
    const prices = { trailer: 1800, screenshots: 900, demo: 3200, press: 4500, influencer: 6500, community: 2800, ads: 9000 };
    this.update((state) => {
      const project = state.currentProject;
      if (!project || project.phase === 'released' || project.marketingUsed?.includes(type) || project.marketing >= 100 || state.money < prices[type]) return;
      state.money -= prices[type]; project.marketing = clamp(project.marketing + ({ trailer: 7, screenshots: 3, demo: 10, press: 12, influencer: 16, community: 8, ads: 20 }[type] || 0), 0, 100);
      project.marketingUsed = [...(project.marketingUsed || []), type];
      const labels = { trailer: 'Трейлер', screenshots: 'Скриншоты', demo: 'Демо', press: 'Пресс-показ', influencer: 'Кампания у блогера', community: 'Камьюнити-кампания', ads: 'Реклама' };
      this.addEvent(state, 'info', `${labels[type] || 'Маркетинговая'} кампания запущена`, 'У аудитории появилась более ясная причина следить за проектом.');
    });
  }

  publisherAvailable(publisher, project = this.state.currentProject) {
    if (!publisher || !project || this.state.reputation < publisher.requirement) return false;
    if (publisher.id === 'northline' && !['medium', 'large', 'huge'].includes(project.scope)) return false;
    if (publisher.id === 'silver-pine' && !this.state.research.includes('online')) return false;
    return true;
  }

  releaseProject(publisherId = null) {
    const project = this.state.currentProject;
    if (!project || project.phase !== 'release-ready') return null;
    let result;
    this.update((state) => {
      const p = state.currentProject;
      const technical = clamp(Math.round(p.progress.programming * 0.58 + p.progress.qa * 0.3 + (100 - p.debt) * 0.12), 0, 100);
      const graphics = clamp(Math.round(p.progress.art * 0.8 + p.progress.design * 0.2 + (state.research.includes('better-rendering') ? 8 : 0)), 0, 100);
      const content = clamp(Math.round(p.progress.writing * 0.55 + p.progress.design * 0.45), 0, 100);
      const audio = clamp(Math.round(p.progress.audio), 0, 100);
      const innovation = clamp(Math.round(p.forecast.innovation + (state.research.includes('advanced-ai') && ['combat', 'exploration'].includes(p.mechanic) ? 8 : 0) + (state.research.includes('vr') ? 3 : 0)), 0, 100);
      const quality = clamp(Math.round(technical * 0.28 + graphics * 0.18 + content * 0.18 + audio * 0.1 + innovation * 0.18 + p.marketing * 0.08 + p.qualityPenalty), 0, 100);
      const market = state.market[p.genre] || 50;
      const publisher = publishers.find((entry) => entry.id === publisherId && this.publisherAvailable(entry, p)) || null;
      const trendAlignment = clamp(Math.round(market * 0.72 + p.forecast.appeal * 0.28), 0, 100);
      const trendModifier = (market - 50) / 35 + (innovation - 60) / 65;
      const viable = quality >= 20 && technical >= 18;
      const rating = viable ? clamp(Math.round((4.4 + quality / 18 + trendModifier) * 10) / 10, 3.2, 9.8) : clamp(Math.round((3.2 + quality / 22 + trendModifier / 2) * 10) / 10, 1.8, 5.1);
      const publisherBoost = publisher ? publisher.appeal : 0;
      const trendFactor = clamp(0.7 + market / 170 + innovation / 450, 0.55, 1.5);
      const floorAudience = Math.max(60, Math.round(p.forecast.audience * 0.06));
      const audience = viable ? Math.round(p.forecast.audience * (0.52 + quality / 125) * trendFactor * (1 + state.reputation / 250) * (1 + (p.marketing + publisherBoost) / 180)) : floorAudience;
      const launchSales = viable ? Math.max(30, Math.round(audience * 0.08)) : Math.max(4, Math.round(floorAudience * 0.05));
      const grossRevenue = Math.round(launchSales * ((p.price || 14.99) * 0.55 + rating / 2));
      const revenue = Math.round(grossRevenue * (publisher ? 1 - publisher.royalty / 100 : 1) + (publisher ? publisher.upfront : 0));
      const reviews = this.makeReviews(p, { technical, graphics, content, audio, innovation, quality, rating, market, trendAlignment, viable });
      const outcome = rating >= 8.7 && audience < p.forecast.audience * 1.3 ? 'Культовая игра' : rating >= 8.5 && audience > p.forecast.audience * 1.8 ? 'Коммерческий хит' : rating >= 8.4 ? 'Хит у критиков' : audience > p.forecast.audience * 2.4 ? 'Долгий продавец' : rating < 5.2 ? 'Провал' : 'Крепкий релиз';
      const released = { ...clone(p), phase: 'released', year: state.year, rating, sales: launchSales, salesRemaining: audience - launchSales, salesPotential: audience, salesMonth: 1, revenue, outcome, publisher: publisher ? { id: publisher.id, name: publisher.name, royalty: publisher.royalty } : null, dlcMade: false, scores: { quality, technical, graphics, content, audio, innovation, marketing: p.marketing, trend: trendAlignment }, reviews, salesTrend: [launchSales] };
      state.projects.unshift(released); state.lastRelease = released; state.money += revenue; state.reputation = clamp(state.reputation + Math.round((rating - 6.4) * 2.3), 0, 100); state.stats.released += 1; state.stats.revenue += revenue;
      state.history.unshift({ year: state.year, title: `${p.name} вышла`, text: `${outcome}. Игру нашли ${audience.toLocaleString()} игроков${publisher ? ` благодаря издателю ${publisher.name}` : ''}.` });
      state.currentProject = null;
      if (state.tutorialStep < 4) state.tutorialStep = 4;
      this.addEvent(state, rating >= 8 ? 'success' : rating < 5.5 ? 'danger' : 'info', `${p.name} вышла в свет`, `Средняя оценка первой волны отзывов — ${rating.toFixed(1)}.`);
      if (state.stats.released === 1) this.unlock(state, 'Первый релиз');
      if (rating >= 9) this.unlock(state, 'Идеальная оценка');
      if (outcome === 'Культовая игра') this.unlock(state, 'Культовая игра');
      if (state.stats.noCrunch) this.unlock(state, 'Без переработок');
      this.checkAchievements(state);
      refreshRating(state);
      result = released;
    });
    return result;
  }

  makeReviews(project, scores) {
    const starKey = (delta) => clamp(Math.round(scores.rating / 2) + delta, 1, 5);
    const reviews = [];
    const push = (delta, text) => reviews.push({ text, stars: starKey(delta) });
    if (scores.technical < 55) push(-1, 'Идея хорошая, но просадки кадров постоянно мешают сильным моментам.');
    if (scores.content < 55) push(-1, 'Мне хотелось ещё одной главы. Финал наступает раньше, чем успевает раскрыться концепция.');
    if (scores.innovation >= 80) push(1, `Необычный взгляд на жанр «${genres.find((genre) => genre.id === project.genre)?.label || 'игр'}».`);
    if (scores.graphics >= 78) push(1, 'У визуального стиля есть характер, но он не мешает ясности.');
    if (scores.audio < 50) push(-1, 'Важным сценам, особенно финалу, не хватило звукового оформления.');
    if (project.debt >= 50) push(-1, 'Под поверхностью чувствуются быстрые и болезненные компромиссы.');
    if (scores.market < 40 && scores.innovation < 75) push(-1, 'Игра вышла не в своё время: рынок уже смотрит в другую сторону.');
    if (scores.market >= 75) push(1, 'Релиз очень точно попал в настроение этого года.');
    if (scores.market < 40 && scores.innovation >= 75) push(0, 'Рынок уже остыл, но смелая идея всё ещё удерживает внимание.');
    if (!scores.viable) push(-1, 'Игра почти не нашла аудиторию: качество не выдержало собственных обещаний.');
    if (!reviews.length) push(0, 'Собранный релиз с ясным авторским голосом.');
    return reviews.slice(0, 4);
  }

  unlock(state, achievement) { if (!state.achievements.includes(achievement)) state.achievements.push(achievement); }
  addEvent(state, tone, title, text) { state.events.unshift({ id: id('event'), year: state.year, month: state.month, tone, title, text }); state.events = state.events.slice(0, 24); }

  checkAchievements(state) {
    const earned = new Set((state.earnedAchievements || []).map((entry) => entry.id));
    achievements.forEach((achievement) => {
      if (earned.has(achievement.id)) return;
      let done = false;
      try { done = achievement.test(state); } catch (error) { done = false; }
      if (!done) return;
      state.money += achievement.reward;
      state.earnedAchievements.push({ id: achievement.id, year: state.year, month: state.month, reward: achievement.reward });
      state.history.unshift({ year: state.year, title: `Достижение: ${achievement.name}`, text: `${achievement.desc}. Премия ${formatMoney(achievement.reward)}.` });
      this.addEvent(state, 'success', `Достижение: ${achievement.name}`, `${achievement.desc}. +${formatMoney(achievement.reward)}.`);
    });
  }

  hire(candidateKey) {
    this.update((state) => {
      const candidate = typeof candidateKey === 'number' ? employeePool[candidateKey] : state.recruitment.find((entry) => entry.id === candidateKey); const role = roles.find((entry) => entry.id === candidate?.role);
      if (!candidate || !role || state.team.some((member) => member.name === candidate.name) || state.money < role.salary * 2) return;
      state.money -= role.salary * 2; state.team.push({ id: id('employee'), ...clone(candidate), morale: 80, burnout: 0, loyalty: 72 }); state.recruitment = state.recruitment.filter((entry) => entry.id !== candidate.id);
      this.addEvent(state, 'success', `${candidate.name} присоединился к студии`, `${role.label} готов к следующему проекту.`);
      if (state.team.length === 2) { this.unlock(state, 'Первый сотрудник'); state.tutorialStep = 5; state.tutorialCompleted = true; }
    });
  }

  fire(memberId) { this.update((state) => { const member = state.team.find((entry) => entry.id === memberId); if (!member || member.isFounder || state.team.length <= 1) return; state.team = state.team.filter((entry) => entry.id !== memberId); this.addEvent(state, 'warning', `${member.name} покинул студию`, 'Команде придётся перераспределить его обязанности.'); }); }
  upgradeOffice() { this.update((state) => { if (state.officeStage < 5 && state.money >= state.officeUpgradeCost) { state.money -= state.officeUpgradeCost; state.officeStage += 1; state.officeUpgradeCost = Math.round(state.officeUpgradeCost * 2.15); state.history.unshift({ year: state.year, title: `Офис расширен до стадии ${state.officeStage}`, text: 'Комната выросла вместе с работой.' }); this.addEvent(state, 'success', 'Комната стала больше', 'Теперь здесь есть место для новых людей и больших амбиций.'); } }); }
  buyEquipment(equipmentId) { this.update((state) => { const item = equipment.find((entry) => entry.id === equipmentId); if (!item || state.equipment.includes(equipmentId) || state.money < item.cost) return; state.money -= item.cost; state.equipment.push(equipmentId); this.addEvent(state, 'success', `Оборудование куплено: ${item.label}`, item.description); }); }
  fundResearch(techId) { this.update((state) => { const tech = research.find((entry) => entry.id === techId); if (!tech || state.research.includes(techId) || !tech.requires.every((requirement) => state.research.includes(requirement)) || state.money < tech.cost) return; state.money -= tech.cost; state.research.push(techId); this.addEvent(state, 'success', `Исследование завершено: ${tech.label}`, tech.description); }); }
  createDlc(projectId) { this.update((state) => { const game = state.projects.find((entry) => entry.id === projectId); if (!game || game.dlcMade || state.money < 7000) return; state.money -= 7000; const newPlayers = Math.round(game.sales * 0.18); const revenue = Math.round(newPlayers * (2.8 + game.rating / 4.2)); state.money += revenue; game.sales += newPlayers; game.revenue += revenue; state.stats.revenue += revenue; game.dlcMade = true; state.reputation = clamp(state.reputation + 1, 0, 100); this.addEvent(state, 'success', `Дополнение для ${game.name}`, `${newPlayers.toLocaleString()} новых игроков вернулись в игру.`); }); }
  rollCase(caseId) { let outcome = null; this.update((state) => { const item = cases.find((entry) => entry.id === caseId); if (!item || state.money < item.price) return; const totalWeight = item.loot.reduce((sum, loot) => sum + loot.weight, 0); let roll = Math.random() * totalWeight; let won = item.loot[item.loot.length - 1]; for (const loot of item.loot) { roll -= loot.weight; if (roll <= 0) { won = loot; break; } } const amount = Math.round(won.min + Math.random() * (won.max - won.min)); const net = amount - item.price; state.money += net; if (!state.stats.luck) state.stats.luck = { opened: 0, spent: 0, won: 0 }; state.stats.luck.opened += 1; state.stats.luck.spent += item.price; state.stats.luck.won += amount; state.history.unshift({ year: state.year, title: `Кейс «${item.name}»`, text: `Выпало «${won.label}» на ${formatMoney(amount)}. Разница ${net >= 0 ? '+' : ''}${formatMoney(net)}.` }); this.addEvent(state, net >= 0 ? 'success' : 'info', `Кейс «${item.name}» открыт`, `Выпало «${won.label}» на ${formatMoney(amount)}.`); outcome = { caseId, item: won, amount, net }; }); return outcome; }
}
