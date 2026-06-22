function escapeHTML(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripTags(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return div.textContent || div.innerText || '';
}

function updateCounter(inputId, counterId) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  if (input && counter) counter.textContent = input.value.length + ' characters';
}

function copyFrom(id) {
  const el = document.getElementById(id);
  if (!el || !el.value.trim()) { alert('Nothing to copy yet.'); return; }
  navigator.clipboard.writeText(el.value).then(() => alert('Copied!')).catch(() => {
    el.select(); document.execCommand('copy'); alert('Copied!');
  });
}

function downloadText(id, filename, type) {
  const el = document.getElementById(id);
  if (!el || !el.value.trim()) { alert('Nothing to download yet.'); return; }
  const blob = new Blob([el.value], { type: type || 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function clearTool(inputId, outputId, previewId, counterId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  const preview = document.getElementById(previewId);
  if (input) input.value = '';
  if (output) output.value = '';
  if (preview) preview.innerHTML = 'Your preview will appear here...';
  if (counterId) updateCounter(inputId, counterId);
}

function textToHTML(text) {
  const lines = (text || '').split('\n');
  let html = '';
  let inList = false;
  let inOrdered = false;
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (/^###\s+/.test(trimmed)) { if (inList) { html += '</ul>\n'; inList = false; } if (inOrdered) { html += '</ol>\n'; inOrdered = false; } html += '<h3>' + escapeHTML(trimmed.replace(/^###\s+/, '')) + '</h3>\n'; }
    else if (/^##\s+/.test(trimmed)) { if (inList) { html += '</ul>\n'; inList = false; } if (inOrdered) { html += '</ol>\n'; inOrdered = false; } html += '<h2>' + escapeHTML(trimmed.replace(/^##\s+/, '')) + '</h2>\n'; }
    else if (/^#\s+/.test(trimmed)) { if (inList) { html += '</ul>\n'; inList = false; } if (inOrdered) { html += '</ol>\n'; inOrdered = false; } html += '<h1>' + escapeHTML(trimmed.replace(/^#\s+/, '')) + '</h1>\n'; }
    else if (/^[-*]\s+/.test(trimmed)) { if (inOrdered) { html += '</ol>\n'; inOrdered = false; } if (!inList) { html += '<ul>\n'; inList = true; } html += '  <li>' + inlineMarkdown(escapeHTML(trimmed.replace(/^[-*]\s+/, ''))) + '</li>\n'; }
    else if (/^\d+[.)]\s+/.test(trimmed)) { if (inList) { html += '</ul>\n'; inList = false; } if (!inOrdered) { html += '<ol>\n'; inOrdered = true; } html += '  <li>' + inlineMarkdown(escapeHTML(trimmed.replace(/^\d+[.)]\s+/, ''))) + '</li>\n'; }
    else { if (inList) { html += '</ul>\n'; inList = false; } if (inOrdered) { html += '</ol>\n'; inOrdered = false; } html += '<p>' + inlineMarkdown(escapeHTML(trimmed)) + '</p>\n'; }
  });
  if (inList) html += '</ul>\n';
  if (inOrdered) html += '</ol>\n';
  return html;
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function removeChatGPTFormatting(text) {
  return (text || '')
    .replace(/```[\s\S]*?```/g, match => match.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, ''))
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlCleaner(html) {
  return (html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sclass="[^"]*"/gi, '')
    .replace(/\sid="[^"]*"/gi, '')
    .replace(/>\s+</g, '>\n<')
    .trim();
}

function markdownToHTML(md) { return textToHTML(md); }

function htmlToMarkdown(html) {
  let out = html || '';
  out = out.replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/ul>|<ul[^>]*>|<\/ol>|<ol[^>]*>/gi, '\n');
  return stripTags(out).replace(/\n{3,}/g, '\n\n').trim();
}

function buildEmailHTML() {
  const subject = document.getElementById('emailSubject').value || 'Your Email Subject';
  const heading = document.getElementById('emailHeading').value || subject;
  const body = document.getElementById('input').value || '';
  return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>' + escapeHTML(subject) + '</title>\n</head>\n<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">\n  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">\n    <tr>\n      <td align="center" style="padding:24px;">\n        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">\n          <tr><td style="padding:28px 28px 10px;"><h1 style="margin:0;font-size:26px;color:#111827;">' + escapeHTML(heading) + '</h1></td></tr>\n          <tr><td style="padding:10px 28px 28px;color:#374151;font-size:16px;line-height:1.6;">' + textToHTML(body).replace(/\n/g, '') + '</td></tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>';
}

function buildNewsletter() {
  const title = document.getElementById('newsletterTitle').value || 'Weekly Newsletter';
  const intro = document.getElementById('input').value || '';
  return '<h1>' + escapeHTML(title) + '</h1>\n<p><em>Here is your latest update.</em></p>\n' + textToHTML(intro) + '\n<hr>\n<p>Thanks for reading.</p>\n<p><a href="#">Visit our website</a></p>';
}

function buildLinkedInPost(text) {
  return removeChatGPTFormatting(text)
    .replace(/^(.{1,90})(\.|!|\?)\s+/, '$1$2\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n\n#AI #Productivity #ContentCreation';
}

function runTool(type) {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const preview = document.getElementById('preview');
  if (!input || !output) return;
  let result = '';
  if (type === 'text-to-html') result = textToHTML(input.value);
  if (type === 'remove-formatting') result = removeChatGPTFormatting(input.value);
  if (type === 'markdown-to-html') result = markdownToHTML(input.value);
  if (type === 'html-to-markdown') result = htmlToMarkdown(input.value);
  if (type === 'html-cleaner') result = htmlCleaner(input.value);
  if (type === 'email-html') result = buildEmailHTML();
  if (type === 'newsletter') result = buildNewsletter();
  if (type === 'linkedin') result = buildLinkedInPost(input.value);
  output.value = result;
  if (preview) {
    if (['text-to-html','markdown-to-html','html-cleaner','email-html','newsletter'].includes(type)) preview.innerHTML = result || 'Your preview will appear here...';
    else preview.textContent = result || 'Your preview will appear here...';
  }
}

function loadExample(type) {
  const input = document.getElementById('input');
  if (!input) return;
  const examples = {
    'text-to-html': '# Benefits of AI Content Cleanup Tools\n\nAI text often needs formatting before publishing.\n\n## Main Benefits\n\n- Clean headings\n- Better paragraphs\n- Faster publishing',
    'remove-formatting': '# Benefits of AI\n\n- **Faster work**\n- _Better productivity_\n\n`Important:` Use responsibly.',
    'markdown-to-html': '# My Blog Post\n\n## Introduction\n\nThis is a **sample** markdown post.\n\n- First point\n- Second point',
    'html-to-markdown': '<h1>My Blog Post</h1><p>This is a <strong>sample</strong> post.</p><ul><li>First point</li><li>Second point</li></ul>',
    'html-cleaner': '<div class="post" style="color:red" onclick="alert(1)"><h1>Title</h1><p>Clean this HTML.</p><script>alert("bad")</script></div>',
    'email-html': 'Hello,\n\nWe are excited to share our latest update.\n\n- New features\n- Better design\n- Faster workflow\n\nThank you for reading.',
    'newsletter': 'This week we launched new formatting tools for creators, marketers, and bloggers.\n\n- AI Text to HTML\n- HTML Cleaner\n- LinkedIn Post Formatter',
    'linkedin': '# How AI tools save time\n\nAI-generated drafts are useful, but they need cleanup before publishing.\n\n- Make it clear\n- Keep it readable\n- Add a strong ending'
  };
  input.value = examples[type] || '';
  updateCounter('input', 'counter');
  runTool(type);
}

function toggleMenu(){
  const menu=document.getElementById('siteMenu');
  if(menu) menu.classList.toggle('open');
}
