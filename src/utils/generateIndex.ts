import path from "path";

export function generateIndex(pages, currentPath, showFullIndex = false) {
  function createIndexItem(page) {
    const url =
      page.url ||
      `/${path.relative("src/pages", page.file).replace(/\.(md|mdx)$/, "")}`;
    const item = {
      label: page.frontmatter.title
        ? page.frontmatter.title
        : path.basename(page.file, path.extname(page.file)).toLowerCase(),
      url: url === "/index" ? "/" : url,
    };

    if (page.frontmatter.isEnabled === true) {
      item.isEnabled = true;
    }

    return item;
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
            url: `/${parts.slice(0, index + 1).join("/")}`,
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
          if (indexItem.isEnabled) {
            dirEntry.isEnabled = true;
          }
        } else if (indexItem.url === "/") {
          structure.unshift(indexItem);
        }
      } else {
        currentLevel.push(indexItem);
      }
    });

    return structure;
  }

  function filterStructure(structure, currentPath) {
    if (showFullIndex || currentPath === "/") {
      return structure;
    }

    const parts = currentPath.split("/").filter(Boolean);
    let currentLevel = structure;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const found = currentLevel.find(
        (item) => item.url.split("/").pop() === part
      );
      if (found) {
        if (i === parts.length - 1) {
          return [found];
        }
        if (found.children) {
          currentLevel = found.children;
        } else {
          return [];
        }
      } else {
        return [];
      }
    }

    return currentLevel;
  }

  const fullStructure = buildStructure(pages);
  return filterStructure(fullStructure, currentPath);
}