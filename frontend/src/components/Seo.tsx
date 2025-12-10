import React from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
}

const Seo: React.FC<SeoProps> = ({ title, description, canonicalPath, ogType = 'website', ogImage, noindex }) => {
  const siteUrl = 'https://www.futurereminder.app'; // This should ideally come from an environment variable
  const canonicalUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : undefined;
  const imageUrl = ogImage ? `${siteUrl}${ogImage}` : undefined;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
    </>
  );
};

export default Seo;
