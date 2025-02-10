const MarkdownRenderer = ({ html }: { html: string }) => {
  return (
    <div className="prose dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default MarkdownRenderer;
