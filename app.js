const TASKS = ['semantic', 'speech', 'music', 'sound'];
const LABELS = {semantic:'Semantic', speech:'Speech Attributes', music:'Music Attributes', sound:'General Sound Attributes'};
const DESCRIPTIONS = {
  semantic:'Identify and isolate a source through semantic understanding.',
  speech:'Follow comparative instructions about voice identity and delivery.',
  music:'Reason over perceptual and acoustic qualities of musical sources.',
  sound:'Separate everyday sounds through their temporal and acoustic attributes.'
};
const CATEGORY_LABELS = {
  Semantic:'Category Reasoning', Gender:'Gender', Age:'Age', Speed:'Speed', Pitch:'Pitch', Energy:'Energy',
  bandwidth_level:'Bandwidth', pitch_level:'Pitch', loudness_level:'Loudness', reverb:'Reverberation',
  continuity:'Continuity', pitch_hz:'Pitch', bandwidth_hz:'Bandwidth', loudness_db:'Loudness'
};

fetch('data.json?v=20260723-11', {cache:'no-store'})
  .then(r => r.json())
  .then(data => {
    document.querySelector('#stats').innerHTML = `<span><b>${data.length}</b> cases</span><span><b>${data.length * 6}</b> audio clips</span><span><b>4</b> task families</span>`;
    render(data);
  });

function audioUnit(name, audio, spectrum, kind='model') {
  const el = document.createElement('div');
  const isThinkSep = name === 'ThinkSep';
  el.className = `audio-unit ${kind} ${isThinkSep ? 'thinksep' : ''}`;
  el.innerHTML = `
    <div class="unit-head"><span>${name}</span>${isThinkSep ? '<small>OUR METHOD</small>' : ''}</div>
    <div class="spectrum-wrap"><img loading="lazy" src="${spectrum}" alt="${name} spectrogram"><span class="scanline"></span></div>
    <audio controls preload="none" src="${audio}"></audio>`;
  return el;
}

function render(data) {
  const app = document.querySelector('#app');
  TASKS.forEach((task, taskIndex) => {
    const taskRows = data.filter(x => x.task === task);
    const section = document.createElement('section');
    section.className = 'task-section'; section.id = task;
    section.innerHTML = `<div class="task-heading"><div class="task-index">0${taskIndex + 1}</div><div><span>TASK FAMILY</span><h2>${LABELS[task]}</h2><p>${DESCRIPTIONS[task]}</p></div></div>`;
    const categories = [...new Set(taskRows.map(x => x.category))];
    categories.forEach((category, categoryIndex) => {
      const group = document.createElement('section');
      group.className = 'category-group';
      group.innerHTML = `<div class="category-heading"><span>${String(categoryIndex + 1).padStart(2,'0')}</span><h3>${CATEGORY_LABELS[category] || category}</h3><i></i><small>2 CASES</small></div>`;
      taskRows.filter(x => x.category === category).forEach((sample, sampleIndex) => {
        const fragment = document.querySelector('#sample-template').content.cloneNode(true);
        fragment.querySelector('.case-id').textContent = `CASE ${String(sampleIndex + 1).padStart(2,'0')}`;
        fragment.querySelector('h4').textContent = sample.question;
        const grid = fragment.querySelector('.audio-grid');
        grid.append(audioUnit('Mixture', sample.mixture, sample.mixtureSpec, 'mixture'));
        sample.models.forEach(m => grid.append(audioUnit(m.name, m.audio, m.spec)));
        group.append(fragment);
      });
      section.append(group);
    });
    app.append(section);
  });
}
