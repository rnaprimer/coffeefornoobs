// src/lib/content/index.ts

/**
 * Extracts plain text from a Tiptap JSON content object.
 */
export function extractText(contentJson: any): string {
  if (!contentJson) return '';
  if (typeof contentJson === 'string') {
    try {
      contentJson = JSON.parse(contentJson);
    } catch {
      return contentJson; // Not JSON, might be raw text
    }
  }

  let text = '';

  if (contentJson.text) {
    text += contentJson.text;
  }

  if (contentJson.content && Array.isArray(contentJson.content)) {
    contentJson.content.forEach((node: any) => {
      text += extractText(node) + ' ';
    });
  }

  return text.trim();
}

/**
 * Calculates reading time in minutes based on word count.
 * Average reading speed is ~200 words per minute.
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Calculates word count from a Tiptap JSON content object.
 */
export function calculateWordCount(contentJson: any): number {
  const text = extractText(contentJson);
  if (!text) return 0;
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts headings (h2, h3) to generate a Table of Contents.
 * Mutates the JSON to add IDs to headings if they don't exist.
 */
export function generateTOC(contentJson: any): { toc: TOCHeading[], updatedContent: any } {
  if (!contentJson) return { toc: [], updatedContent: contentJson };
  
  let jsonStr = typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson);
  let parsedContent;
  try {
    parsedContent = JSON.parse(jsonStr);
  } catch {
    return { toc: [], updatedContent: contentJson };
  }

  const toc: TOCHeading[] = [];

  const traverse = (node: any) => {
    if (node.type === 'heading' && (node.attrs?.level === 2 || node.attrs?.level === 3)) {
      const text = extractText(node);
      if (text) {
        // Generate a slug-friendly ID
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Ensure attrs exists
        if (!node.attrs) node.attrs = {};
        
        // Always assign the generated ID to the node so the renderer can use it
        node.attrs.id = id;

        toc.push({
          id,
          text,
          level: node.attrs.level,
        });
      }
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };

  if (parsedContent.type === 'doc') {
    traverse(parsedContent);
  }

  return { toc, updatedContent: parsedContent };
}
