export const postsListQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  coverImage,
  seoDescription,
  publishedAt
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  coverImage,
  seoDescription,
  publishedAt,
  body
}`;

export const allSlugsQuery = `*[_type == "post" && defined(slug.current)].slug.current`;
