export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function extractTOC(content: any): TOCItem[] {
  const items: TOCItem[] = [];

  if (!content || !content.content) {
    return items;
  }

  const traverse = (node: any) => {
    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const text = node.content?.map((n: any) => n.text).join('') || '';
      if (text) {
        // Generate a slug-like ID if not present
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, text, level });
      }
    }

    if (node.content) {
      node.content.forEach(traverse);
    }
  };

  traverse(content);

  return items;
}
