const path = require('path');
const ou = require('node-os-utils');
const { ipcRenderer } = require('electron');

const cpu = ou.cpu;
const mem = ou.mem;
const os = ou.os;

let cpuOverload = 80;

document.getElementById('cpu-model').innerText = cpu.model();
document.getElementById('comp-name').innerText = os.hostname();
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;
mem.info().then((info) => {
  document.getElementById('mem-total').innerText = info.totalMemMb + ' MB';
});

setInterval(() => {
  // Cpu usage
  cpu.usage().then((info) => {
    document.getElementById('cpu-usage').innerText = info + '%';
    document.getElementById('cpu-progress').style.width = info + '%';
    // Make progress bar red
    if (info > cpuOverload) {
      document.getElementById('cpu-progress').style.background = 'red';
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b';
    }
  });

  cpu.free().then((info) => {
    document.getElementById('cpu-free').innerText = info.toFixed(2) + '%';
  });

  // Uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());

  // console.log(os.uptime());
}, 2000);

// Show days, hours, mins, sec
function secondsToDhms(seconds) {
  seconds = +seconds; // make it number
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

function notifyUser(options) {
  ipcRenderer.send('notify', options);
}

notifyUser({
  title: 'CPU overloaded',
  body: `CPU is over ${cpuOverload}%`,
  icon: path.join(__dirname, 'img', 'icon.png'),
});
