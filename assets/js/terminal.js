(function() {
  'use strict';

  // === TYPEWRITER ===
  const terminalText = document.querySelector('.terminal-text');
  const welcomeMsg = '> system access // authorized // welcome //';

  function typeWriter(element, text, speed = 80) {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  if (terminalText) {
    setTimeout(() => {
      typeWriter(terminalText, welcomeMsg, 80);
    }, 500);
  }

  // === COMMAND SYSTEM ===
  const terminalInput = document.querySelector('.terminal-input');
  const terminalDisplay = document.querySelector('.terminal-display');
  const terminalPrompt = document.querySelector('.terminal-prompt');

  const commands = {
    whoami: () => 'guest@nyx5yn3',
    help: () => 'Comandos: whoami, help, ls, matrix, clear, about, cat whoami.md',
    ls: () => 'whoami.md  dockerlabs/  hackthebox/',
    matrix: () => {
      window.matrixRain.toggle();
      return 'Matrix rain ' + (window.matrixRain.isActive() ? 'ON' : 'OFF');
    },
    clear: () => {
      document.querySelectorAll('.terminal-output').forEach(el => el.remove());
      return '';
    },
    about: () => 'NYX5YN3 // writeup_dump // cybersecurity repository',
    'cat whoami.md': () => 'Me gradue de informatica en 2023, me atrajo el mundo del hacking.',
  };

  function parseCommand(input) {
    const [cmd, ...args] = input.trim().split(' ');
    if (commands[cmd]) {
      return commands[cmd](args);
    } else if (cmd.startsWith('cat ')) {
      const file = cmd.substring(4);
      if (file === 'whoami.md') return commands['cat whoami.md']();
      return 'archivo no encontrado: ' + file;
    } else {
      return "comando no encontrado: " + cmd + ". Escribe 'help'.";
    }
  }

  function executeCommand(input) {
    if (!input.trim()) return;

    const line = document.createElement('div');
    line.className = 'terminal-output';
    line.textContent = 'guest@Nyx5yn3:~$ ' + input;
    terminalPrompt.parentNode.insertBefore(line, terminalPrompt.nextSibling);

    const response = parseCommand(input);
    if (response) {
      const resLine = document.createElement('div');
      resLine.className = 'terminal-output response';
      resLine.textContent = response;
      terminalPrompt.parentNode.insertBefore(resLine, terminalPrompt.nextSibling);
    }

    if (terminalDisplay) terminalDisplay.textContent = '';
    terminalInput.value = '';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  // Click terminal to focus input
  if (terminalPrompt) {
    terminalPrompt.style.cursor = 'text';
    terminalPrompt.addEventListener('click', () => {
      if (terminalInput) terminalInput.focus();
    });
  }

  // Echo typed characters
  if (terminalInput && terminalDisplay) {
    terminalInput.addEventListener('input', (e) => {
      terminalDisplay.textContent = e.target.value;
    });
  }

  // Enter key
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(terminalInput.value);
      }
    });
  }

  // Focus on load
  window.addEventListener('DOMContentLoaded', () => {
    if (terminalInput) setTimeout(() => terminalInput.focus(), 2500);
  });
})();