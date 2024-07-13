import path from "path";

export function generateIndex(pages, currentPath) {
  console.log("currentPath", currentPath);

  function createIndexItem(page) {
    const url =
      page.url ||
      `${path.relative("src/pages", page.file).replace(/\.(md|mdx)$/, "")}`;
    return {
      label:
        page.frontmatter.title ||
        path.basename(page.file, path.extname(page.file)),
      url: url === "/index" ? "/" : url,
    };
  }

  function buildStructure(pages) {
    const structure = [];
    const dirMap = new Map();

    pages.forEach((page) => {
      const relPath = path.relative("src/pages", path.dirname(page.file));
      const parts = relPath.split(path.sep);
      let currentLevel = structure;

      parts.forEach((part, index) => {
        if (part === "") return;

        let dirEntry = dirMap.get(part);
        if (!dirEntry) {
          dirEntry = {
            label:
              part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
            url: `${parts.slice(0, index + 1).join("/")}`,
            children: [],
          };
          dirMap.set(part, dirEntry);
          currentLevel.push(dirEntry);
        }
        currentLevel = dirEntry.children;
      });

      const indexItem = createIndexItem(page);
      if (path.basename(page.file) === "index.mdx") {
        const dirEntry =
          parts.length > 0 ? dirMap.get(parts[parts.length - 1]) : null;
        if (dirEntry) {
          dirEntry.label = indexItem.label;
          dirEntry.url = indexItem.url;
        } else if (indexItem.url === "/") {
          structure.unshift(indexItem);
        }
      } else {
        currentLevel.push(indexItem);
      }
    });

    return structure;
  }

  return buildStructure(pages);
}
