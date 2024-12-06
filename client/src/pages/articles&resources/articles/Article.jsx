import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import customFetch from "@/utils/customFetch";
import { useParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import * as pdfjsLib from 'pdfjs-dist';
import './Article.css';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    const renderPage = async () => {
      if (!pdfDoc) return;
      
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pageNumber, pdfDoc]);

  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <canvas ref={canvasRef} className="page-canvas" />
      </div>
    </div>
  );
});

const Article = () => {
  const { id } = useParams();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const flipBookRef = React.useRef();

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const response = await customFetch.get(`/api/v1/articles/${id}`);
        const pdfUrl = response.data.pdfPath;
        
        // Load the PDF document with additional configuration
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/standard_fonts/'
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load article');
        console.error('Error loading PDF:', err);
        setLoading(false);
      }
    };

    loadPdf();
  }, [id]);

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

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div className="loading">Loading PDF...</div>;

  return (
    <div className="flipbook-container">
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        ref={flipBookRef}
        onFlip={onPageChange}
        className="demo-book"
      >
        <PageCover>
          <h2>Article</h2>
        </PageCover>

        {Array.from(new Array(numPages), (el, index) => (
          <PageContent 
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            pdfDoc={pdfDoc}
          />
        ))}

        <PageCover>The End</PageCover>
      </HTMLFlipBook>

      <div className="controls">
        <button onClick={prevPage} className="nav-button">
          <FiChevronLeft />
        </button>
        <span className="page-info">
          Page {currentPage} of {numPages}
        </span>
        <button onClick={nextPage} className="nav-button">
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Article;
