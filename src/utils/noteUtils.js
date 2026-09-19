export function extractChecklistItems(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const items = doc.querySelectorAll('li[data-type="taskItem"]')
  return Array.from(items)
    .filter((item) => item.getAttribute('data-checked') !== 'true')
    .map((item) => item.textContent.trim())
    .filter((text) => text !== '')
}
