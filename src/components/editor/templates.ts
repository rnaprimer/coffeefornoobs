export const EditorTemplates = {
  blank: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
      },
    ],
  },
  guide: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Introduction' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Start with a compelling introduction about the guide topic.' }],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'What You Will Need' }],
      },
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item 1' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item 2' }] }] },
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Step-by-Step Instructions' }],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Step 1: Preparation' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Describe the first step.' }],
      }
    ],
  },
  comparison: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Overview' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Provide a brief overview of the two items being compared.' }],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Key Differences' }],
      },
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Difference 1' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Difference 2' }] }] },
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Which one should you choose?' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Give a final recommendation based on user needs.' }],
      }
    ]
  }
};
