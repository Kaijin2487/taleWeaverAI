import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import type { StoryPage } from '../types';

interface FlipBookProps {
  pages: StoryPage[];
}

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>(({ children, number }, ref) => {
  return (
    <div className="bg-white shadow-md flex items-center justify-center p-2" ref={ref} data-density="hard">
      <div className="w-full h-full border-4 border-amber-100 rounded-lg p-4 flex flex-col justify-between">
        {children}
        <div className="text-center text-sm text-slate-400 mt-2">{number}</div>
      </div>
    </div>
  );
});

const FlipBookComponent: React.FC<FlipBookProps> = ({ pages }) => {
  const bookRef = useRef(null);

  // FIX: Suppress TypeScript error from react-pageflip due to incorrect prop types by casting to `any`.
  const FlipBook: any = HTMLFlipBook;

  return (
    <div className="flex justify-center items-center py-5">
      <div style={{ width: '90vw', maxWidth: '1024px', height: 'auto', aspectRatio: '2 / 1' }}>
        <FlipBook
          width={512}
          height={512}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="mx-auto shadow-2xl rounded-lg"
          ref={bookRef}
        >
          {/* Cover Page */}
          <Page number={0}>
             <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-blue-100 rounded-md">
                <img src={pages[0]?.imageUrl} alt="Story cover" className="w-48 h-48 object-cover rounded-lg shadow-lg mb-4" />
                <h1 className="font-display text-2xl font-bold text-slate-800">{pages.length > 0 ? 'A Story For You' : 'Your Story'}</h1>
                <p className="text-slate-600 mt-2">Click or drag the corner to turn the page!</p>
             </div>
          </Page>

          {pages.map((page) => (
            <Page key={page.pageNumber} number={page.pageNumber}>
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-shrink-0 flex items-center justify-center pt-2">
                  {page.imageUrl ? (
                    <img src={page.imageUrl} alt={`Illustration for page ${page.pageNumber}`} className="max-h-[250px] w-auto object-contain rounded-lg shadow-sm" />
                  ) : (
                    <div className="w-full h-[250px] bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                      <p className="text-slate-500">Loading image...</p>
                    </div>
                  )}
                </div>
                <div className="flex-grow overflow-y-auto mt-4 px-2 text-center">
                    <p className="text-base text-slate-700">{page.text}</p>
                </div>
              </div>
            </Page>
          ))}

          {/* Back Cover */}
           <Page number={pages.length + 1}>
             <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-blue-100 rounded-md">
                <h2 className="font-display text-3xl font-bold text-slate-800">The End</h2>
                <p className="text-slate-600 mt-4">We hope you enjoyed the story!</p>
                <p className="text-lg mt-4 font-bold text-blue-600">Made with TaleWeaver AI</p>
             </div>
           </Page>

        </FlipBook>
      </div>
    </div>
  );
};

export default FlipBookComponent;