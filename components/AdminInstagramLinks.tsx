"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaInstagram } from "react-icons/fa";
import { Trash2, Pencil, Plus } from "lucide-react";

interface InstagramLink {
  id: number;
  url: string;
  published: boolean | number; // Corrected: MySQL often returns 0/1 for booleans
}

export default function AdminInstagramLinks() {
  const [links, setLinks] = useState<InstagramLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [url, setUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!links.length) return;

    const loadInstagram = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    };

    if (!(window as any).instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = loadInstagram;
      document.body.appendChild(script);
    } else {
      loadInstagram();
    }
  }, [links]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      // MISTAKE FIXED: Use relative path to Next.js API, not port 5000
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch links");
    }
    setLoading(false);
  };

  const instagramRegex =
    /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_\-]+\/?/;

  const handleSubmit = async () => {
    if (!url) return toast.error("URL required");
    if (!instagramRegex.test(url))
      return toast.error("Invalid Instagram URL");

    try {
      if (editId !== null) {
        // MISTAKE FIXED: Point to your new Next.js API route
        await fetch(`/api/links/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, published }),
        });
        toast.success("Updated");
      } else {
        // MISTAKE FIXED: Point to your new Next.js API route
        await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, published }),
        });
        toast.success("Added");
      }

      closeModal();
      fetchLinks();
    } catch {
      toast.error("Error occurred");
    }
  };

  const handleEdit = (link: InstagramLink) => {
    setEditId(link.id);
    setUrl(link.url);
    setPublished(Boolean(link.published)); // Mistake fix: Ensure it's a boolean for the toggle
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return; // Added safety check
    try {
      await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });
      toast.success("Deleted");
      fetchLinks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const closeModal = () => {
    setEditId(null);
    setUrl("");
    setPublished(true);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50 space-y-8 text-black"> 
      {/* Added text-black because default Tailwind v4 might inherit dark mode */}
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-orange-600">
          <FaInstagram size={28} />
          Instagram Feed
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {links.map((link) => (
          <div
            key={link.id}
            className="min-w-[350px] bg-white rounded-xl shadow-md p-2 snap-center border border-gray-100"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={link.url}
              data-instgrm-version="14"
            ></blockquote>

            <div className="flex justify-between mt-2 px-2 pb-2">
              <button onClick={() => handleEdit(link)} className="text-gray-600 hover:text-blue-500">
                <Pencil size={18} />
              </button>

              <button onClick={() => handleDelete(link.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-2xl border border-gray-200">
            <h2 className="font-bold text-xl text-black border-b pb-2">
              {editId ? "Edit Instagram Post" : "Add New Post"}
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Post URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="w-full border border-gray-300 p-2 rounded-lg text-black focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <button
                onClick={() => setPublished(!published)}
                className={`px-4 py-1 rounded-full text-xs font-bold transition ${
                  published ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                }`}
              >
                {published ? "PUBLIC" : "HIDDEN"}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition"
              >
                {editId ? "Update Post" : "Save Post"}
              </button>

              <button
                onClick={closeModal}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}