import axios from "axios";
import { getLinkPreview } from "link-preview-js";
import Blog from "../model/blog.model.js";

// Detect Platform
const detectPlatform = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter";
  if (url.includes("instagram.com")) return "Instagram";
  return "Website";
};

const fetchMetadata = async (url, platform) => {
  try {
    if (platform === "YouTube") {
      let videoId = null;

      if (url.includes("v=")) {
        videoId = new URL(url).searchParams.get("v");
      } else {
        videoId = url.split("/").pop().split("?")[0];
      }

      return {
        title: "YouTube Video",
        description: "Watch on YouTube",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        siteName: "YouTube",
      };
    }

    // Quick fix - just replace the Twitter section in your existing code

    if (platform === "Twitter") {
      const tweetId = url.match(/status\/(\d+)/)?.[1];

      try {
        const previewData = await getLinkPreview(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
          },
          timeout: 15000,
        });

        // Better thumbnail logic
        let thumbnail =
          "https://abs.twimg.com/icons/apple-touch-icon-192x192.png";

        if (previewData.images && previewData.images.length > 0) {
          // Filter out emoji and small images
          const validImage = previewData.images.find(
            (img) =>
              !img.includes("emoji") &&
              !img.includes("abs-0.twimg.com/emoji") &&
              !img.includes("twemoji")
          );

          if (validImage) {
            thumbnail = validImage;
          }
        }

        return {
          title:
            previewData.title && previewData.title !== "Tweet"
              ? previewData.title
              : "Twitter Post",
          description: previewData.description || "View on Twitter",
          thumbnail: thumbnail,
          siteName: "Twitter (X)",
        };
      } catch (err) {
        console.error("Twitter fetch error:", err.message);

        // Enhanced fallback with better thumbnail
        return {
          title: "Twitter Post",
          description: "View on Twitter",
          thumbnail: tweetId
            ? `https://unavatar.io/twitter/${tweetId}?fallback=https://abs.twimg.com/icons/apple-touch-icon-192x192.png`
            : "https://abs.twimg.com/icons/apple-touch-icon-192x192.png",
          siteName: "Twitter (X)",
        };
      }
    }

    if (platform === "Instagram") {
      const response = await axios.get(
        `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`
      );
      return {
        title: "Instagram Post",
        description: response.data.author_name,
        thumbnail: response.data.thumbnail_url,
        siteName: "Instagram",
      };
    }

    // Default: Generic Website
    const previewData = await getLinkPreview(url);
    return {
      title: previewData.title || "Untitled Post",
      description: previewData.description || "No description available",
      thumbnail:
        previewData.images && previewData.images.length > 0
          ? previewData.images[0]
          : "https://via.placeholder.com/300x200.png?text=No+Thumbnail",
      siteName: previewData.siteName || "Website",
    };
  } catch (error) {
    console.error("Metadata Fetch Error:", error.message);
    return null;
  }
};

// Create Blog
export const createBlog = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required!" });
    }

    const platform = detectPlatform(url);
    const metadata = await fetchMetadata(url, platform);

    if (!metadata) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to fetch metadata." });
    }

    const newBlog = await Blog.create({
      title: metadata.title,
      description: metadata.description,
      platform: metadata.siteName,
      url,
      thumbnail: metadata.thumbnail,
      author: req.user._id, // make sure auth middleware sets req.user
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog: newBlog,
      redirectLink: newBlog.url,
    });
  } catch (error) {
    console.error("Create Blog Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  } 
};
