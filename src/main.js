// main.js — Página: Contato

// ── NÚMEROS DE LINHA DINÂMICOS ──
function gerarLinhas() {
  var el = document.getElementById('line-numbers');
  var codeView = document.querySelector('.code-view');
  if (!el || !codeView) return;
  
  var quantidade = codeView.querySelectorAll('.code-line').length;
  var html = '';
  for (var i = 1; i <= quantidade; i++) {
    html += '<div>' + i + '</div>';
  }
  el.innerHTML = html;
}

// ── RASTREAR CURSOR ──
function rastrearCursor() {
  var editor = document.getElementById('editor-content');
  if (!editor) return;
  editor.addEventListener('click', function (e) {
    var rect = this.getBoundingClientRect();
    var y = e.clientY - rect.top;
    var linha = Math.max(1, Math.floor(y / 23.8) + 1);
    var totalLinhas = document.querySelectorAll('.code-line').length;
    if (linha > totalLinhas) linha = totalLinhas;
    document.getElementById('status-ln').textContent = 'Ln ' + linha + ', Col 1';
  });
}

// ── HOVER NOS LINKS ──
function configurarLinks() {
  var links = document.querySelectorAll('.contact-link');
  links.forEach(function (link) {
    link.addEventListener('mouseenter', function () { this.style.letterSpacing = '0.5px'; });
    link.addEventListener('mouseleave', function () { this.style.letterSpacing = ''; });
  });
}

// ── MODAL DE BUSCA (Ctrl+P) ──
var arquivos = [
  { nome: 'sobre-mim.js',    icone: '🟡', path: './', url: 'sobre.html' },
  { nome: 'habilidades.css', icone: '🟣', path: './', url: 'habilidades.html' },
  { nome: 'contato.json',    icone: '🟠', path: './', url: 'index.html' },
  { nome: 'README.md',       icone: '🔵', path: './', url: '#' },
];
var selectedIndex = 0;

function abrirBusca() {
  var modal = document.getElementById('search-modal');
  modal.classList.add('open');
  document.getElementById('search-input').value = '';
  document.getElementById('search-input').focus();
  renderArquivos('');
  selectedIndex = 0;
}

function fecharBusca() {
  document.getElementById('search-modal').classList.remove('open');
}

function renderArquivos(filtro) {
  var lista = document.getElementById('search-list');
  var filtrados = arquivos.filter(function (a) {
    return a.nome.toLowerCase().includes(filtro.toLowerCase());
  });
  lista.innerHTML = filtrados.map(function (a, i) {
    return '<div class="search-item' + (i === 0 ? ' selected' : '') + '" data-url="' + a.url + '" onclick="irPara(\'' + a.url + '\')">' +
      '<span class="search-item-icon">' + a.icone + '</span>' +
      '<span class="search-item-name">' + a.nome + '</span>' +
      '<span class="search-item-path">' + a.path + '</span>' +
    '</div>';
  }).join('');
  selectedIndex = 0;
}

function irPara(url) {
  if (url !== '#') window.location.href = url;
  fecharBusca();
}

function navegarBusca(direcao) {
  var items = document.querySelectorAll('.search-item');
  if (!items.length) return;
  items[selectedIndex].classList.remove('selected');
  selectedIndex = (selectedIndex + direcao + items.length) % items.length;
  items[selectedIndex].classList.add('selected');
  items[selectedIndex].scrollIntoView({ block: 'nearest' });
}

function confirmarBusca() {
  var items = document.querySelectorAll('.search-item');
  if (items[selectedIndex]) irPara(items[selectedIndex].getAttribute('data-url'));
}

// ── TRAFFIC LIGHTS ──
function configurarTrafficLights() {
  document.getElementById('tl-red').addEventListener('click', function () {
    mostrarNotificacao(':C');
  });
  document.getElementById('tl-yellow').addEventListener('click', function () {
    mostrarNotificacao('🟡 Minimizando... mas onde você vai?');
  });
  document.getElementById('tl-green').addEventListener('click', function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      mostrarNotificacao('🟢 Modo tela cheia ativado');
    } else {
      document.exitFullscreen();
      mostrarNotificacao('🟢 Saindo do modo tela cheia');
    }
  });
}

// ── NOTIFICAÇÃO ──
function mostrarNotificacao(msg) {
  var el = document.getElementById('notification');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(function () { el.classList.remove('show'); }, 2500);
}

// ── TERMINAL ──
var terminalAberto = false;
var historicoTerminal = [];
var indiceHistorico = -1;

var comandos = {
  'help': function () {
    return [
      '<span class="term-output">Comandos disponíveis:</span>',
      '<span class="term-output">  ls          — listar arquivos</span>',
      '<span class="term-output">  cd sobre    — ir para Sobre Mim</span>',
      '<span class="term-output">  cd habilidades — ir para Habilidades</span>',
      '<span class="term-output">  whoami      — info do desenvolvedor</span>',
      '<span class="term-output">  clear       — limpar terminal</span>',
    ];
  },
  'ls': function () {
    return ['<span class="term-output">sobre-mim.js &nbsp; habilidades.css &nbsp; contato.json &nbsp; README.md</span>'];
  },
  'whoami': function () {
    return [
      '<span class="term-output">Enrique Fernandes Alves Rodrigues</span>',
      '<span class="term-output">Engenharia de Software — UniFil, Londrina PR</span>',
    ];
  },
  'clear': function () {
    document.getElementById('terminal-body').innerHTML = '';
    return [];
  },
  'cd sobre': function () {
    setTimeout(function () { window.location.href = 'sobre.html'; }, 300);
    return ['<span class="term-output">Navegando para sobre-mim.js...</span>'];
  },
  'cd habilidades': function () {
    setTimeout(function () { window.location.href = 'habilidades.html'; }, 300);
    return ['<span class="term-output">Navegando para habilidades.css...</span>'];
  },
};

function abrirTerminal() {
  var panel = document.getElementById('terminal-panel');
  terminalAberto = !terminalAberto;
  panel.classList.toggle('open', terminalAberto);
  if (terminalAberto) document.getElementById('term-input').focus();
}

function fecharTerminal() {
  document.getElementById('terminal-panel').classList.remove('open');
  terminalAberto = false;
}

function executarComando(cmd) {
  var body = document.getElementById('terminal-body');
  var cmdLimpo = cmd.trim().toLowerCase();
  var linhaCmd = document.createElement('span');
  linhaCmd.className = 'term-line';
  linhaCmd.innerHTML =
    '<span class="term-prompt">enrique</span>' +
    '<span style="color:var(--fg-muted)">@</span>' +
    '<span class="term-path">portfolio</span>' +
    '<span style="color:var(--fg-muted)"> $ </span>' +
    '<span class="term-cmd">' + cmd + '</span>';
  body.appendChild(linhaCmd);

  var fn = comandos[cmdLimpo];
  var linhas = fn ? fn() : (cmdLimpo === '' ? [] :
    ['<span class="term-error">comando não encontrado: ' + cmd + '</span>',
     '<span class="term-output">Digite "help" para ver os comandos.</span>']);

  linhas.forEach(function (l) {
    var el = document.createElement('span');
    el.className = 'term-line';
    el.innerHTML = l;
    body.appendChild(el);
  });
  body.scrollTop = body.scrollHeight;
  historicoTerminal.unshift(cmd);
  indiceHistorico = -1;
}

function configurarTerminal() {
  var input = document.getElementById('term-input');
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      executarComando(this.value);
      this.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (indiceHistorico < historicoTerminal.length - 1) {
        indiceHistorico++;
        this.value = historicoTerminal[indiceHistorico];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (indiceHistorico > 0) { indiceHistorico--; this.value = historicoTerminal[indiceHistorico]; }
      else { indiceHistorico = -1; this.value = ''; }
    }
  });
}

function configurarEventos() {
  document.getElementById('search-overlay').addEventListener('click', fecharBusca);
  document.getElementById('search-input').addEventListener('input', function () {
    renderArquivos(this.value);
  });
  document.getElementById('search-input').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); navegarBusca(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); navegarBusca(-1); }
    if (e.key === 'Enter')     { confirmarBusca(); }
    if (e.key === 'Escape')    { fecharBusca(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); abrirBusca(); }
    if ((e.ctrlKey || e.metaKey) && e.key === '`') { e.preventDefault(); abrirTerminal(); }
    if (e.key === 'Escape') fecharBusca();
  });
  document.getElementById('btn-terminal').addEventListener('click', abrirTerminal);
}

function toggleSidebarMobile() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('mobile-open');
  overlay.classList.toggle('open');
}

function configurarResizeTerminal() {
  var handle = document.getElementById('terminal-resize-handle');
  if (!handle) return;
  var panel = document.getElementById('terminal-panel');
  var startY, startH;

  handle.addEventListener('mousedown', function(e) {
    startY = e.clientY;
    startH = panel.offsetHeight;
    document.body.style.userSelect = 'none';

    function onMove(e) {
      var delta = startY - e.clientY;
      var newH = Math.min(Math.max(startH + delta, 120), window.innerHeight * 0.6);
      panel.style.height = newH + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

window.addEventListener('DOMContentLoaded', function() {
  gerarLinhas();
  rastrearCursor();
  configurarLinks();
  configurarTrafficLights();
  configurarTerminal();
  configurarEventos();
  configurarResizeTerminal();
});