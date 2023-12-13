import fs from "fs"
import { compileMDX } from "next-mdx-remote/rsc"
import path from "path"

import { ProjectFrontmatter, SnippetFrontmatter } from "../../types/content"

const projectsRootDirectory = path.join(
  process.cwd(),
  "src",
  "content",
  "projects"
)
const snippetsRootDirectory = path.join(
  process.cwd(),
  "src",
  "content",
  "snippets"
)

export const getProjectBySlug = async (slug: string) => {
  const realSlug = slug.replace(/\.mdx$/, "")
  const filePath = path.join(projectsRootDirectory, `${realSlug}.mdx`)

  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" })

  const {
    frontmatter,
    content,
  }: { frontmatter: ProjectFrontmatter; content: any } = await compileMDX({
    source: fileContent,
    options: { parseFrontmatter: true },
  })

  return { meta: { ...frontmatter, slug: realSlug }, content }
}

export const getAllProjectsMeta = async () => {
  const files = fs.readdirSync(projectsRootDirectory)

  let projects: ProjectFrontmatter[] = []

  for (const file of files) {
    const { meta } = await getProjectBySlug(file)
    projects.push(meta)
  }

  return projects
}

export const getSnippetBySlug = async (slug: string) => {
  const realSlug = slug.replace(/\.mdx$/, "")
  const filePath = path.join(snippetsRootDirectory, `${realSlug}.mdx`)

  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" })

  const {
    frontmatter,
    content,
  }: { frontmatter: SnippetFrontmatter; content: any } = await compileMDX({
    source: fileContent,
    options: { parseFrontmatter: true },
  })

  return { meta: { ...frontmatter, slug: realSlug }, content }
}

export const getAllSnippetsMeta = async () => {
  const files = fs.readdirSync(snippetsRootDirectory)

  let snippets: SnippetFrontmatter[] = []

  for (const file of files) {
    const { meta } = await getSnippetBySlug(file)
    snippets.push(meta)
  }

  return snippets
}

// // import chalk from 'chalk';
// // import fs from 'fs';
// // import md5 from 'md5';
// // import path from 'path';
// // // import config from '~site/config';

// // export interface Project {
// //   metadata: Metadata;
// //   slug: string;
// //   content: string;
// // }

// // export interface Metadata {
// //   title: string;
// //   date: string;
// //   summary?: string;
// //   image?: string;
// //   password?: string;
// //   draft?: boolean | string;
// // }

// // const getDefaultDate = (filePath: string): string => {
// //   const stats = fs.statSync(filePath);
// //   return new Date(stats.birthtime).toLocaleString();
// // };

// // const parseDate = (dateString: string): string | number => {
// //   const parsedDate = Date.parse(dateString);
// //   return isNaN(parsedDate) ? dateString : parsedDate;
// // };
// // const parseFrontmatter = (
// //   fileContent: string,
// //   fileName: string,
// //   filePath: string,
// // ) => {
// //   const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
// //   const match = frontmatterRegex.exec(fileContent);
// //   const defaultDate = getDefaultDate(filePath);
// //   const defaultTitle = fileName.replace(/\.mdx?$/, ''); // Use file name as the default title

// //   if (match) {
// //     const frontMatterBlock = match[1];
// //     const content = fileContent.replace(frontmatterRegex, '').trim();
// //     const frontMatterLines = frontMatterBlock.trim().split('\n');
// //     const metadata: Partial<Metadata> = {};

// //     frontMatterLines.forEach((line) => {
// //       const [key, ...valueArr] = line.split(': ');
// //       let value: any = valueArr.join(': ').trim();
// //       value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
// //       if (value === 'true') {
// //         value = true;
// //       } else if (value === 'false') {
// //         value = false;
// //       }
// //       if (key.trim() === 'date') {
// //         value = parseDate(value);
// //       }
// //       metadata[key.trim() as keyof Metadata] = value;
// //       if (!metadata.date) {
// //         metadata.date = defaultDate;
// //       }
// //     });

// //     return { metadata: metadata as Metadata, content };
// //   } else {
// //     // No frontmatter found, use default values
// //     const defaultFrontmatter = `---\ntitle: ${defaultTitle}\ndate: ${defaultDate}\n---`;
// //     const updatedContent = `${defaultFrontmatter}\n\n${fileContent.trim()}`;
// //     // Write the updated content back to the file
// //     fs.writeFileSync(filePath, updatedContent);
// //     console.log(
// //       chalk.red(`检测到 ${filePath} 没有frontmatter`, '已经自动更新'),
// //     );
// //     return {
// //       metadata: {
// //         title: defaultTitle,
// //         date: defaultDate,
// //       },
// //       content: fileContent.trim(),
// //     };
// //   }
// // };

// // const getMDXFilesRecursive = (dir: string): string[] => {
// //   let mdxFiles: string[] = [];
// //   const files = fs.readdirSync(dir);

// //   files.forEach((file) => {
// //     const filePath = path.join(dir, file);
// //     const isDirectory = fs.statSync(filePath).isDirectory();

// //     if (isDirectory) {
// //       // Recursively get MDX files from subdirectories
// //       mdxFiles = mdxFiles.concat(getMDXFilesRecursive(filePath));
// //     } else if (path.extname(file) === '.mdx') {
// //       mdxFiles.push(filePath);
// //     }
// //   });

// //   return mdxFiles;
// // };

// // const readMDXFile = (filePath: string) => {
// //   const rawContent = fs.readFileSync(filePath, 'utf-8');
// //   return parseFrontmatter(rawContent, path.basename(filePath), filePath);
// // };
// // const getMDXData = (dir: string): Project[] => {
// //   const mdxFiles = getMDXFilesRecursive(dir);
// //   return mdxFiles.map((filePath) => {
// //     const { metadata, content } = readMDXFile(filePath);
// //     const filename = path.basename(filePath, path.extname(filePath));
// //     const slug = md5(filename);
// //     return {
// //       metadata,
// //       slug,
// //       content,
// //     };
// //   });
// // };

// // export const getBlogPosts = () => {
// //   return getMDXData(path.join(process.cwd(), config.content));
// // };

// // export const getPostFromParams = (slug: string) =>
// //   getBlogPosts().find((post) => post.slug === slug);