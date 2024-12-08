import React, { useEffect, useState, useCallback, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import customFetch from "@/utils/customFetch";
import { Link, useParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Article.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <div className="cover-content">
          {props.children}
        </div>
      </div>
    </div>
  );
});

const PageContent = React.forwardRef((props, ref) => {
  return (
    <div className="relative h-full bg-white shadow-md rounded-lg overflow-hidden" ref={ref}>
      {props.children}
    </div>
  );
});

PageContent.displayName = "PageContent";
PageCover.displayName = "PageCover";

const Article = () => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState(null);
  const bookRef = useRef(null);
  const { id: paramId } = useParams();

  const getBookDimensions = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) return { width: 300, height: 400 };
    if (width < 1024) return { width: 400, height: 550 };
    return { width: 500, height: 650 };
  }, []);

  const [dimensions, setDimensions] = useState(getBookDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getBookDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getBookDimensions]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get(`/articles/get-article-with-pages/${paramId}`);
      setArticle(response.data.article);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [paramId]);

  const onDocumentLoadSuccess = ({ numPages: pageCount }) => {
    setNumPages(pageCount);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setError("Failed to load PDF: " + error.message);
  };

  const handlePageFlip = (e) => {
    setCurrentPage(e.data + 1);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading article</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/articles" className="text-primary hover:underline">
            Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  // Render missing PDF state
  if (!article?.pdfPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">PDF not found</div>
          <p className="text-gray-600 mb-4">This article does not have an associated PDF file.</p>
          <Link to="/articles" className="text-primary hover:underline">
            Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Article Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {article?.title}
          </h1>
          {numPages && (
            <p className="text-gray-600">
              Page {currentPage} of {numPages}
            </p>
          )}
        </div>

        <Document
          file={article.pdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading PDF...</p>
              </div>
            </div>
          }
        >
          {numPages && (
            <div className="flex flex-col items-center">
              <HTMLFlipBook
                width={dimensions.width}
                height={dimensions.height}
                size="stretch"
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={900}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handlePageFlip}
                ref={bookRef}
                className="mx-auto"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <PageCover>
                  <div className="front-cover">

                    <h1 className="text-2xl font-bold mb-4">{article?.title}</h1>
                    <div className="author-info">
                      <p className="text-lg mb-2">By {article?.author?.name}</p>
                      <p className="text-sm">Published on {new Date(article?.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-8 text-sm">
                      <p>SukoonSphere Health Mission</p>
                      <p>Mental Health & Wellness</p>
                    </div>
                  </div>
                </PageCover>
                {[...Array(numPages)].map((_, index) => (
                  <PageContent key={index}>
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={dimensions.width}
                      height={dimensions.height}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      loading={
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    />
                  </PageContent>
                ))}
                <PageCover>
                  <div className="back-cover">
                    <h2 className="text-xl font-semibold mb-4">Thank you for reading</h2>
                    <div className="mb-6">
                      <p className="text-lg mb-2">About SukoonSphere</p>
                      <p className="text-sm">
                        Empowering minds, nurturing wellness, and fostering a supportive community
                        for mental health awareness and growth.
                      </p>
                    </div>
                    <div className="contact-info text-sm">
                      <p className="mb-1">Connect with us:</p>
                      <p>www.sukoonsphere.org</p>
                      <p>contact@sukoonsphere.org</p>
                    </div>
                    <div className="mt-6 text-xs">
                      <p> {new Date().getFullYear()} SukoonSphere</p>
                      <p>All rights reserved</p>
                    </div>
                  </div>
                </PageCover>
              </HTMLFlipBook>

              {/* Navigation Buttons */}
              <div className="flex justify-center items-center gap-4 mt-6">
                {currentPage > 1 && (
                  <button
                    onClick={() => bookRef.current?.pageFlip().flipPrev()}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                    aria-label="Previous page"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                    <span>Previous</span>
                  </button>
                )}

                {currentPage < numPages && (
                  <button
                    onClick={() => bookRef.current?.pageFlip().flipNext()}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          )}
        </Document>
      </div>
    </div>
  );
};

export default Article;
