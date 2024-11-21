import React, { useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "../../../src/assets/testing.pdf";
import customFetch from "@/utils/customFetch";
import { useParams } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <p>{props.children}</p>
    </div>
  );
});

Pages.displayName = "Pages";

function Flipbook() {
  const [numPages, setNumPages] = useState();
  const { id: paramId } = useParams();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const [article, setArticle] = useState(null);
  const fetchArticle = async () => {
    const response = await customFetch.get(
      `/articles/get-article-with-pages/${paramId}`
    );
    setArticle(response.data.article);
  };
  useEffect(() => {
    fetchArticle();
  }, [paramId]);
  console.log({ article });
  return (
    <>
      <div className="h-screen w-screen flex flex-col gap-5 justify-center items-center bg-gray-900 overflow-hidden">
        <HTMLFlipBook width={500} height={600}>
          {[...Array(numPages).keys()].map((pNum) => (
            <Pages key={pNum} number={pNum + 1}>
              <Document
                file={article?.pdfPath}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageNumber={pNum}
                  width={500}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
              <p>
                Page {pNum} of {numPages}
              </p>
            </Pages>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  );
}

export default Flipbook;
