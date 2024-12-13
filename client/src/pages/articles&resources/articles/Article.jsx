import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import HTMLFlipBook from "react-pageflip";
import customFetch from "@/utils/customFetch";
import { useParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiEye, FiDownload } from "react-icons/fi";
import * as pdfjsLib from 'pdfjs-dist';
import './Article.css';

// Initialize PDF.js worker
const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <div className="cover-content">{props.children}</div>
      </div>
    </div>
  );
});

const PageContent = React.forwardRef(({ pageNumber, pdfDoc }, ref) => {
  const [pageContent, setPageContent] = useState(null);
  const canvasRef = React.useRef(null);

  useEffect(() => {
    let isMounted = true;
    const renderPage = async () => {
      if (!pdfDoc || !isMounted) return;
      
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: window.devicePixelRatio || 1.5 });
        const canvas = canvasRef.current;
        if (!canvas || !isMounted) return;

        const context = canvas.getContext('2d');
        
        // Set the actual size of the canvas
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Set the display size of the canvas
        canvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;
        canvas.style.width = `${viewport.width / (window.devicePixelRatio || 1)}px`;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          enableWebGL: true
        };

        await page.render(renderContext).promise;
        
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
    return () => {
      isMounted = false;
    };
  }, [pageNumber, pdfDoc]);

  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <canvas ref={canvasRef} className="page-canvas" />
      </div>
    </div>
  );
});

PageContent.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  pdfDoc: PropTypes.object
};

const Article = () => {
  const { id } = useParams();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articleInfo, setArticleInfo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const flipBookRef = React.useRef();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await customFetch.get(`/articles/get-article-cover-page/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setArticleInfo(data);
        
        // Set PDF URL separately
        const pdfResponse = await customFetch.get(`${data.coverPage.pdfPath}`);
        if (!pdfResponse.ok) throw new Error('Failed to load PDF');
        const pdfBlob = await pdfResponse.blob();
        setPdfUrl(URL.createObjectURL(pdfBlob));
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
    return () => {
      // Cleanup URL object on unmount
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    let loadingTask = null;

    const loadPdf = async () => {
      try {
        if (!pdfUrl) return;
        loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/standard_fonts/'
        });

        loadingTask.onProgress = (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
        };
        
        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load article');
        console.error('Error loading PDF:', err);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (loadingTask) {
        loadingTask.destroy();
      }
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [pdfUrl]);

  const nextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const onPageChange = (e) => {
    setCurrentPage(e.data + 1);
  };

  const handleDownload = async () => {
    if (!articleInfo) return;
    
    try {
      const response = await customFetch.get(`${articleInfo.coverPage.pdfPath}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${articleInfo.title || 'article'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download the PDF. Please try again later.');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  if (!articleInfo) return <div className="loading">Loading article information...</div>;

  if (isLoading) return (
    <div className="flipbook-container">
      <div className="loading">Loading PDF viewer...</div>
      <div className="controls">
        <button onClick={handleDownload} className="nav-button download-btn" title="Download PDF">
          <FiDownload />
        </button>
      </div>
    </div>
  );

  if (error) return (
    <div className="flipbook-container">
      <div className="error-message">{error}</div>
      <div className="controls">
        <button onClick={handleDownload} className="nav-button download-btn" title="Download PDF">
          <FiDownload />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flipbook-container">
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={window.innerWidth <= 768 ? 300 : 400}
        maxHeight={window.innerWidth <= 768 ? 800 : 1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        ref={flipBookRef}
        onFlip={onPageChange}
        className="demo-book"
        usePortrait={window.innerWidth <= 768}
      >
        <PageCover>
          <div className="cover-content">
            <h2 className="title">{articleInfo?.title}</h2>
            <div className="meta-info">
              <div className="date-views">
                <span><FiCalendar className="icon" /> {new Date(articleInfo?.createdAt).toLocaleDateString()}</span>
                <span><FiEye className="icon" /> {articleInfo?.views?.length || 0} views</span>
              </div>
            </div>
          </div>
        </PageCover>

        {Array.from(new Array(numPages), (el, index) => (
          <PageContent 
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            pdfDoc={pdfDoc}
          />
        ))}

        <PageCover className="back-cover">
          <div className="cover-content">
            <h3 className="thank-you">Thank you for reading</h3>
            <p className="footer-text">We hope you enjoyed this article</p>
          </div>
        </PageCover>
      </HTMLFlipBook>

      <div className="controls">
        <button onClick={prevPage} className="nav-button">
          <FiChevronLeft />
        </button>
        <span className="page-info">
          Page {currentPage} of {numPages + 2}
        </span>
        <button onClick={nextPage} className="nav-button">
          <FiChevronRight />
        </button>
        <button onClick={handleDownload} className="nav-button download-btn" title="Download PDF">
          <FiDownload />
        </button>
      </div>
    </div>
  );
};

export default Article;
