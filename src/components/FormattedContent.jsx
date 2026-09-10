import React from 'react';

const ALLOWED_TAGS = new Set([
  'A', 'B', 'BR', 'EM', 'H2', 'H3', 'H4', 'I', 'LI', 'OL', 'P', 'SMALL',
  'SPAN', 'STRONG', 'U', 'UL'
]);
const ALLOWED_ATTRIBUTES = new Set(['class', 'href', 'rel', 'target', 'title']);

function sanitizeHtml(value) {
  if (typeof document === 'undefined') return String(value || '');

  const template = document.createElement('template');
  template.innerHTML = String(value || '');

  template.content.querySelectorAll('*').forEach((element) => {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK'].includes(element.tagName)) {
        element.remove();
      } else {
        element.replaceWith(...Array.from(element.childNodes));
      }
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      const isSafeUrl = /^(https?:|mailto:|tel:|\/|#)/i.test(value);

      if (name.startsWith('on') || !ALLOWED_ATTRIBUTES.has(name) || ((name === 'href') && !isSafeUrl)) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === 'A' && element.getAttribute('target') === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return template.innerHTML;
}

export default function FormattedContent({
  as = 'div',
  value,
  format = 'plain',
  className,
  style,
  ...props
}) {
  const Tag = as;
  const content = value || '';
  const commonProps = { ...props, className, style };

  if (format === 'html') {
    return <Tag {...commonProps} dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
  }

  return (
    <Tag {...commonProps} style={{ whiteSpace: 'pre-line', ...style }}>
      {content}
    </Tag>
  );
}
