const MEDIUM_USERNAME = "@im_50316";
const FEED_URL = `https://medium.com/feed/${MEDIUM_USERNAME}`;

const postsContainer = document.getElementById("posts");
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

const endpoints = [
  `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`,
  `https://api.allorigins.win/get?url=${encodeURIComponent(FEED_URL)}`,
];

function extractImage(item) {
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;

  const match = item.description?.match(/<img[^>]+src=\"([^\">]+)\"/i);
  return match?.[1] || "";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function postTemplate(post) {
  const image = extractImage(post);
  const safeTitle = post.title || "Untitled";

  return `
    <article class="card post-card">
      ${
        image
          ? `<img src="${image}" alt="${safeTitle}" style="width:100%;height:170px;object-fit:cover;border-radius:12px;margin-bottom:0.9rem;" loading="lazy" />`
          : ""
      }
      <a href="${post.link}" target="_blank" rel="noreferrer">
        <h3>${safeTitle}</h3>
      </a>
      <p>${(post.description || "")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 130)}...</p>
      <div class="post-meta">${formatDate(post.pubDate)}</div>
    </article>
  `;
}

async function fetchWithFallback() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) continue;

      const data = await res.json();

      if (data.items && Array.isArray(data.items)) {
        return data.items;
      }

      if (data.contents) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const items = [...xml.querySelectorAll("item")].map((item) => ({
          title: item.querySelector("title")?.textContent || "Untitled",
          link: item.querySelector("link")?.textContent || "#",
          pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
          description: item.querySelector("description")?.textContent || "",
        }));
        return items;
      }
    } catch (_) {
      // try next endpoint
    }
  }
  throw new Error("Unable to load feed");
}

async function loadPosts() {
  try {
    const posts = await fetchWithFallback();
    const topPosts = posts.slice(0, 6);

    if (!topPosts.length) {
      postsContainer.innerHTML = `<div class="card loading">No posts found yet.</div>`;
      return;
    }

    postsContainer.innerHTML = topPosts.map(postTemplate).join("");
  } catch (error) {
    postsContainer.innerHTML = `
      <div class="card loading">
        Couldn't load Medium posts right now. <br />
        <a class="sub-link" href="https://medium.com/${MEDIUM_USERNAME}" target="_blank" rel="noreferrer">Open Medium profile</a>
      </div>
    `;
  }
}

loadPosts();
