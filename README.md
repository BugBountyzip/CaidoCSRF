<div align="center">
  <img width="1000" alt="image" src="https://user-images.githubusercontent.com/6225588/211916659-567751d1-0225-402b-9141-4145c18b0834.png">
  <br />
  <br />
  <a href="https://caido.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://dashboard.caido.io/">Dashboard</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.caido.io/" target="_blank">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://links.caido.io/roadmap">Roadmap</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/caido/caido/tree/main/brand">Branding</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://links.caido.io/www-discord" target="_blank">Discord</a>
  <br />
  <hr />
</div>

# Advanced CSRF PoC Generator Plugin

A powerful CSRF (Cross-Site Request Forgery) proof of concept generator plugin for Caido. This plugin helps security researchers and penetration testers quickly generate various types of CSRF payloads.

## Features

The plugin supports multiple CSRF payload types:
- Standard HTML Form
- URL-encoded form
- Multipart form
- Plain text form
- SVG-based CSRF
- XHR-based CSRF
- Iframe-based CSRF
- Meta Refresh CSRF
- WebSocket CSRF
- Data URI CSRF

## Usage

1. Install the plugin from Caido's plugin store
2. Select a request in Caido
3. Click on the CSRF Generator button
4. Choose your desired CSRF payload type from the dropdown
5. The plugin will automatically generate the appropriate CSRF proof of concept code

## Output Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>CSRF PoC</title>
</head>
<body>
    <h3>Standard CSRF PoC</h3>
    <form action="https://caido.io/" method="get">
        <!-- Form parameters will be automatically populated -->
    </form>
</body>
</html>
