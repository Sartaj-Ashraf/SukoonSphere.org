import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import {
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { LuTableOfContents } from "react-icons/lu";
import "./Article.css";
import { FaVolumeUp, FaVolumeMute, FaMale, FaFemale } from "react-icons/fa";
import { FaArrowTrendDown } from "react-icons/fa6";

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voiceGender, setVoiceGender] = useState('female'); // default to female
  const { id } = useParams();
  const [toc, setToc] = useState([]);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`articles/${id}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load article. Please try again later.");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(".article-body h1, .article-body h2")
    );
    const newToc = headings.map((heading) => ({
      text: heading.innerText,
      slug: heading.id,
    }));
    setToc(newToc);
  }, [article]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    return () => {
      if (utterance) {
        synth.cancel();
      }
    };
  }, [utterance]);

  const cleanContent = (content) => {
    try {
      return content
        .replace(
          /<div class="flex-shrink-0 flex flex-col relative items-end">[\s\S]*?<div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">/,
          ""
        )
        .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>$/, "")
        .trim();
    } catch (err) {
      console.error("Error cleaning content:", err);
      return content;
    }
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    const voices = synth.getVoices();
    // Prioritized list of male voices
    const maleVoicePreferences = [
      'Microsoft David Desktop',
      'Google UK English Male',
      'Microsoft David',
      'en-GB-Standard-B',
      'en-US-Standard-B'
    ];

    // Find appropriate voice based on selected gender
    const selectedVoice = voices.find(voice => {
      const voiceName = voice.name.toLowerCase();
      if (voiceGender === 'male') {
        // First try to find from preferred list
        return maleVoicePreferences.some(preferred => 
          voiceName.includes(preferred.toLowerCase())
        );
      } else {
        return voiceName.includes('female') || 
               voiceName.includes('zira') || 
               voiceName.includes('helena');
      }
    }) || voices.find(voice => {
      // Fallback to any gender-matching voice
      const voiceName = voice.name.toLowerCase();
      return voiceGender === 'male' 
        ? (voiceName.includes('male') || voiceName.includes('david'))
        : (voiceName.includes('female') || voiceName.includes('zira'));
    }) || voices[0];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanContent(article.content);
    const cleanText = tempDiv.textContent || tempDiv.innerText || "";
    const chunks = cleanText.match(/[^.!?]+[.!?]+/g) || [];
    
    let currentChunk = 0;
    
    const speakNextChunk = () => {
      if (currentChunk < chunks.length) {
        const newUtterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
        if (selectedVoice) {
          newUtterance.voice = selectedVoice;
        }

        // Optimized voice parameters
        if (voiceGender === 'male') {
          newUtterance.pitch = 0.85;  // Deeper voice
          newUtterance.rate = 0.92;   // Slightly slower for authority
          newUtterance.volume = 1;    // Full volume
        } else {
          newUtterance.pitch = 1.1;   // Higher pitch for female
          newUtterance.rate = 0.95;   // Slightly faster for female
          newUtterance.volume = 1;    // Full volume
        }
        
        newUtterance.onend = () => {
          currentChunk++;
          if (currentChunk < chunks.length) {
            setTimeout(() => speakNextChunk(), 200); // Add small pause between chunks
          } else {
            setIsPlaying(false);
          }
        };

        newUtterance.onerror = () => {
          console.error('Speech synthesis error');
          setIsPlaying(false);
        };

        synth.speak(newUtterance);
      }
    };

    setIsPlaying(true);
    speakNextChunk();
  };

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
          <p className="text-lg font-medium mb-2">Article Not Found</p>
          <p>
            The article you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(article.content);

  return (
    <div className="relative bg-[var(--white-color)]">
      {/* Mobile TOC Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleToc}
            className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--ternery)] transition-colors duration-200"
            aria-label="Toggle Table of Contents"
          >
            <FaBars className="w-5 h-5" />
            <span className="font-medium">Contents</span>
          </button>
          <h3 className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
            {article.title}
          </h3>
        </div>
      </div>

      {/* Mobile TOC Dropdown */}
      <div 
        className={`
          lg:hidden fixed top-[60px] left-0 right-0 
          bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isTocOpen ? 'translate-y-0' : '-translate-y-full'}
          z-40 max-h-[70vh] overflow-y-auto
        `}
      >
        <div className="p-6">
          <div className="table-of-contents">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between gap-3 text-[var(--primary)]">
              <div className="flex items-center gap-3">
                <LuTableOfContents className="text-[var(--ternery)]" />
                Quick Navigation
              </div>
            </h2>
            <nav className="toc-nav">
              <ol className="space-y-4">
                {toc.map((item, index) => (
                  <li 
                    key={index} 
                    className="group"
                  >
                    <a
                      href={`#${item.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.slug);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                          setIsTocOpen(false);
                        }
                      }}
                    >
                      <FaArrowTrendDown className="text-[var(--ternery)] w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="text-gray-700 group-hover:text-[var(--ternery)] transition-colors duration-200 font-medium">
                        {item.text}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile TOC Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          isTocOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleToc}
      />

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 lg:gap-12">
          <article className="col-span-12 lg:col-span-8 order-2 lg:order-1 mt-16 lg:mt-0">
            <header className="relative article-header space-y-6 mb-8">
              <div className="meta-item flex items-center justify-center gap-2 ">
                {article.authorAvatar ? (
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="meta-icon" />
                )}
                <span>{article.authorName || "Anonymous"}</span>
              </div>
              <h2 className=" md:text-[1.75rem] font-bold sm:leading-[2.5rem] text-var(--primary)">
                {article.title}
              </h2>
              <div className="article-meta flex items-center justify-center">
                <div className="meta-separator" />
                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="meta-separator" />
                <div className="meta-item">
                  <FaClock className="meta-icon" />
                  <span>{readingTime} min read</span>
                </div>
                <div className="meta-separator" />
                <div className="meta-item">
                  <div className="inline-flex items-center bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 p-1">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setVoiceGender('female')}
                        className={`flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 ${
                          voiceGender === 'female'
                            ? 'bg-pink-500 text-white scale-110'
                            : 'text-pink-500 hover:bg-pink-50'
                        }`}
                        title="Female Voice"
                      >
                        <FaFemale className={`w-4 h-4 ${voiceGender === 'female' ? 'animate-pulse' : ''}`} />
                      </button>
                      <button
                        onClick={() => setVoiceGender('male')}
                        className={`flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 ${
                          voiceGender === 'male'
                            ? 'bg-blue-500 text-white scale-110'
                            : 'text-blue-500 hover:bg-blue-50'
                        }`}
                        title="Male Voice"
                      >
                        <FaMale className={`w-4 h-4 ${voiceGender === 'male' ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <div className="w-[1px] bg-gray-200 mx-1 h-6 self-center"></div>
                    <button
                      onClick={handleTextToSpeech}
                      className={`flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                      title={isPlaying ? 'Stop Reading' : 'Start Reading'}
                    >
                      <div className="flex items-center gap-2">
                        {isPlaying ? (
                          <>
                            <FaVolumeMute className="w-4 h-4" />
                            <span className="text-sm font-medium">Stop</span>
                          </>
                        ) : (
                          <>
                            <FaVolumeUp className={`w-4 h-4 ${!isPlaying && voiceGender ? 'animate-bounce' : ''}`} />
                            <span className="text-sm font-medium">Listen</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div
              className="article-body prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: cleanContent(article.content) }}
            />

            <footer className="article-footer mt-8">
              <div className="article-tags">
                {article.tags &&
                  article.tags.map((tag, index) => (
                    <span key={index} className="article-tag">
                      {tag}
                    </span>
                  ))}
              </div>
            </footer>
          </article>

          {/* Desktop Table of Contents */}
          <section className="hidden lg:block col-span-12 lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-24 bg-white rounded-xl shadow-md p-6">
              <div className="table-of-contents">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--primary)]">
                  <LuTableOfContents className="text-[var(--ternery)]" />
                  Quick Navigation
                </h2>
                <nav className="toc-nav">
                  <ol className="space-y-3">
                    {toc.map((item, index) => (
                      <li 
                        key={index} 
                        className="group"
                      >
                        <a
                          href={`#${item.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(item.slug);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          <FaArrowTrendDown className="text-[var(--ternery)] w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="text-gray-700 group-hover:text-[var(--ternery)] transition-colors duration-200 font-medium">
                            {item.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Article;
