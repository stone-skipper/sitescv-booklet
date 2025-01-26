"use client";

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { combineCollections, RichText } from 'readcv';
import { motion, useScroll, useSpring, useTransform, useAnimate } from 'framer-motion';
import '@fontsource-variable/inter';
import '@fontsource/anton';
import {useSwipeable} from 'react-swipeable'


// some shared properties between components
const paperAnim ={type:'spring', bounce:0.05}
const noAnim = {duration:0}
const paperPadding= '3vw'
const mobilePaperPadding = '3vh'
const defaultPaletteSize = 24
const mobilePaletteSize = 8


import cv from './cv';

function App() {
  const isDesktop = useDesktopDetect();
  const [current, setCurrent] = useState(0);

  const [swipe, setSwipe] = useState("");
  const config = {
    delta: 10, // min distance(px) before a swipe starts. *See Notes*
    preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
    trackTouch: true, // track touch input
    trackMouse: false, // track mouse input
    rotationAngle: 0, // set a rotation angle
    swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
    touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
  };

  
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (isDesktop === false) {
        setSwipe("left");
      }
    },
    onSwipedRight: (eventData) => {
      if (isDesktop === false) {
        setSwipe("right");
      }
    },
    ...config,
  });

 const projects = combineCollections(
    cv.projects,
    cv.workExperience,
    cv.sideProjects,
  ).filter((x) => x.attachments.length > 0);

 const [allColorsReady, setAllColorsReady] = useState(false);
  
  return (
    <div style={{ background: "black", width:'100vw', height:isDesktop === true? 'fit-content':'100dvh', display:'flex', flexDirection:'column', justifyContent:isDesktop === true? 'flex-start': 'center', alignItems:isDesktop === true? 'center':'flex-start', overflowY: isDesktop === true?'scroll':'hidden' }} {...handlers}>
      <ColorPapers swipe={swipe} setSwipe={setSwipe} current={current} setCurrent={setCurrent} projects={projects} allColorsReady={allColorsReady} setAllColorsReady={setAllColorsReady}/>
      {isDesktop === true &&   <Scroll num={projects.length} current={current}
          setCurrent={setCurrent} allColorsReady={allColorsReady}/>}

     
      {isDesktop === true && <Footer />}
    </div>
  );
}


function ColorPapers({ swipe, setSwipe, current, setCurrent, projects, allColorsReady, setAllColorsReady }) {

  
  const [attachments, setAttachments] = useState([]);
  const [paletteSize, setPaletteSize] = useState(4);
 
  
  const colorReadyCount = useRef(0);

  useEffect(() => {
    projects.forEach((project) => {
      let link = project.url;
      project.attachments.forEach((attachment) => {
        let newAttachment = attachment;
        if (link) {
          newAttachment.link = link;
        }
        setAttachments((attachments) => [...attachments, newAttachment]);
      });
    });
  }, []);

  const handleSwipe = async () => {
    if (swipe === "right" && current > 0 && isDesktop === false && allColorsReady === true) {
      await setCurrent(current - 1);
      setSwipe("");
    } else if (
      swipe === "left" &&
      isDesktop === false && allColorsReady === true
    ) {
      await setCurrent(current + 1);
      setSwipe("");
    } else if (
      swipe === "left" &&
      current === projects.length &&
      isDesktop === false && allColorsReady === true
    ) {
      await setCurrent(0);
      setSwipe("");
    }
  };

  useEffect(() => {
    handleSwipe();
  }, [swipe, allColorsReady]);

    const isDesktop = useDesktopDetect();

  const handleColorReady = useCallback(() => {
    colorReadyCount.current += 1;
    if (colorReadyCount.current === projects.length) {
      setAllColorsReady(true);
    }
  }, [projects.length]);

  useEffect(() => {
    if (allColorsReady === true && isDesktop === true) {
      setPaletteSize(defaultPaletteSize);
    } else if (allColorsReady === true && isDesktop === false) {
      setPaletteSize(mobilePaletteSize);
    }
  }, [allColorsReady, isDesktop]);

  const totalRotations = Math.floor(current / (projects.length+1));
    const currentIndex = current % (projects.length+1);
  return (
    <div
      style={{
        perspective: 2800,
        position: "fixed",
        width:
          isDesktop === true
            ? `calc(100vw - ${paperPadding} * 2)`
            : `calc(100vw - ${mobilePaperPadding})`,
        height:
          isDesktop === true
            ? `calc(100dvh - ${paperPadding})`
            : `calc(100dvh - ${mobilePaperPadding} * 2)`,
        overflow: "visible",
        zIndex:10
      }}
    >
            <motion.div 
              // shadow
              style={{
     height:
            isDesktop === true
              ? `calc(100dvh - ${paperPadding} - ${projects.length * paletteSize}px)`
              : "100%",
          width:
            isDesktop === true
              ? "100%"
              : `calc(100% - ${projects.length * paletteSize}px)`,
          position: "absolute",
           display:allColorsReady === true ?'block' :'none',
        top: 0,
        originX: 0,
        originY: 0,
      background:'rgba(0,0,0,0.4)',
    pointerEvents:'none'
      }} 
        initial={{opacity:0}}
        animate={{
          zIndex: projects.length + 1,
        skewX:  current > 0 && isDesktop === true ?  30 : 0,
          skewY:  currentIndex > 0 && isDesktop === false ?  50 : 0,
          opacity:  (current > 0 && isDesktop === true) || (currentIndex > 0 && isDesktop === false)?  0 :1,
          filter: (current > 0 && isDesktop === true ) || (currentIndex > 0 && isDesktop === false)?  'blur(10px)' :'blur(0px)',
      
      }}

         transition={paperAnim}
        ></motion.div>
      <motion.div
        className="paper"
        style={{
          zIndex: projects.length + 1,
          display: "flex",
          padding: 24,
          originX: 0,
          originY: 0,
          position: "absolute",
          overflow: "visible",
        }}
        initial={{
          height:
            isDesktop === true
              ? `calc(100dvh - ${paperPadding} - ${projects.length * paletteSize}px)`
              : "100%",
          width:
            isDesktop === true
              ? "100%"
              : `calc(100% - ${projects.length * paletteSize}px)`,
        }}
        animate={{
          width:
            isDesktop === true
              ? "100%"
              : `calc(100% - ${projects.length * paletteSize}px)`,
          background: "white",
          rotateX: current > 0 && isDesktop === true ? 90 : 0,
          rotateY : currentIndex> 0 && isDesktop === false? -90 + -360 * totalRotations: 0 - 360 * totalRotations,
          height:
            isDesktop === true
              ? `calc(100dvh - ${paperPadding} - ${projects.length * paletteSize}px)`
              : "100%",
        }}
        transition={{
          width: { duration: isDesktop === true ? 0 : 0.3 },
          height: { duration: isDesktop === false ? 0 : 0.3 },
          ...paperAnim,
        }}
      >
        <PaperHeader />
      </motion.div>
      
      {projects.map((info, index) => (
        <ColorTitle
          key={"project" + index}
          index={index}
          info={info}
          data={info.attachments}
          num={projects.length}
          current={current}
          setCurrent={setCurrent}
          paletteSize={paletteSize}
          allColorsReady={allColorsReady}
          onColorReady={handleColorReady}
        />
      ))}
     
    </div>
     
  );
}

export default ColorPapers;


const ColorTitle = ({
  index,
  info,
  data,
  num,
  current,
  setCurrent,
  paletteSize,
  allColorsReady,
  onColorReady,
 
}) => {
  const isDesktop = useDesktopDetect();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [firstMediaType, setFirstMediaType] = useState(data[0].type);
  const [base64Image, setBase64Image] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("black");

    const [isScrollable, setIsScrollable] = useState(false);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
const [showBottomFade, setShowBottomFade] = useState(false);
  const scrollRef = useRef(null);


 const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      if (isDesktop) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isScrollable = scrollWidth > clientWidth;
        setIsScrollable(isScrollable)
        setShowLeftFade(scrollLeft > 0);
        setShowRightFade(isScrollable && scrollLeft < scrollWidth - clientWidth - 1);
      } else {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isScrollable = scrollHeight > clientHeight;
        setIsScrollable(isScrollable)
        setShowTopFade(scrollTop > 0);
        setShowBottomFade(isScrollable && scrollTop < scrollHeight - clientHeight - 1);
      }
    }
  }, [isDesktop]);

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollPosition, data, info, allColorsReady]);



  const processFirstMedia = useCallback(async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const firstMedia = data[0];

    if (firstMedia.type === "video") {
      const video = videoRef.current;
      video.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          resolve();
        };
      });

      await new Promise((resolve) => {
        video.onseeked = () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        video.currentTime = 0.1;
      });
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = firstMedia.url;

      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          resolve();
        };
      });
    }

    const base64 = canvas.toDataURL("image/jpeg");

    try {
      const colors = await prominent(base64, { amount: 6, format: "hex" });
      const mostColorful = getMostColorful(colors);
      setColor(mostColorful);
      setTextColor(getColorByBgColor(mostColorful));
      onColorReady();
    } catch (error) {
      console.error("Error getting prominent color:", error);
      onColorReady(); // Still call onColorReady to avoid blocking the process
    }
  }, [data, onColorReady]);

  useEffect(() => {
    processFirstMedia();
  }, [processFirstMedia]);


  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e) => {
    if (!isDesktop) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, [isDesktop]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scrolling speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);


  
  // for mobile infinite flipping
   const totalRotations = Math.floor(current / (num+1));
    const currentIndex = current % (num+1);


  return (
    <>
      <motion.div style={{
       width:
          isDesktop === true
            ? "100%"
            : `calc(100vw - ${mobilePaperPadding} - ${(num - index - 1) * paletteSize}px)`,
          position: "absolute",
        top: 0,
        originX: 0,
        originY: 0,
     display:allColorsReady === true ?'block' :'none',
      
      background:'rgba(0,0,0,0.4)',
      pointerEvents:'none',
       height:
          isDesktop === true
            ? `calc(100dvh - ${paperPadding} - ${(num - index - 1) * paletteSize}px)`
            : "100%",
      }} 
        initial={{opacity:0}}
        animate={{
              zIndex: num - index,
        skewX: index + 1 < current && isDesktop === true ? 30 : 0,
      
          skewY : index + 1 < currentIndex && isDesktop === false? 50: 0,

          opacity: (index + 1 < current && isDesktop === true) || (index + 1 < currentIndex && isDesktop === false) ? 0 :1,
          filter:(index + 1 < current && isDesktop === true ) || (index + 1 < currentIndex && isDesktop === false) ? 'blur(10px)' :'blur(0px)',
      }}
  transition={paperAnim}
       
        ></motion.div>
    <motion.div
      className="paper"
      key={info.heading}
      style={{
        width:
          isDesktop === true
            ? "100%"
            : `calc(100vw - ${mobilePaperPadding} - ${(num - index - 1) * paletteSize}px)`,
        display: "flex",
        flexDirection: isDesktop === true ? "column" : "column-reverse",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: isDesktop === true ? "10px 20px" : "50px 20px 20px 20px",
        gap: 15,
        position: "absolute",
        top: 0,
        originX: 0,
        originY: 0,
        overflow: "hidden",
      }}
    
      animate={{
        rotateX: index + 1 < current && isDesktop === true ? 90 : 0,
      
        rotateY : index + 1 < currentIndex && isDesktop === false? -90 + -360 * totalRotations: 0 - 360 * totalRotations,


        zIndex: num - index,
        
      
        height:
          isDesktop === true
            ? `calc(100dvh - ${paperPadding} - ${(num - index - 1) * paletteSize}px)`
            : "100%",
        background: allColorsReady === true ? color : "#ffffff",
      }}
      transition={{
                ...paperAnim,

        width: { duration: isDesktop === true ? 0 : 0.3,},
        height: { duration: isDesktop === false ? 0 : 0.3,delay: isDesktop === true ?0.05*(index+1):0 },
        background:{duration:0,delay: isDesktop === true ?0.05*(index+1):0},
     
      }}
    >
      <div
        className="anton"
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          padding: 10,
          color: textColor,
          textAlign: "center",
          fontSize: isDesktop === true? '1em': '0.8em'
        }}
      >
        {cv.general.displayName}
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: isDesktop === true ? "fit-content" : "100%",
          overflowX: isDesktop === true ? "auto" : "hidden",
          overflowY: isDesktop === true ? "hidden" : "auto",
          position: "relative",
          cursor: isDesktop && isScrollable ? (isDragging ? 'grabbing' : 'grab') : 'default',


        }}
          ref={scrollRef}
        onScroll={checkScrollPosition}
                onMouseDown={handleMouseDown}

        className="hideScrollBar"
      >
        <motion.div
          style={{
            width: "fit-content",
            height: "fit-content",
            display: "flex",
            flexDirection: isDesktop === true ? "row" : "column",
            gap: 10,
            alignItems: isDesktop === true ? "flex-end" : "flex-start",
            justifyContent: "flex-start",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentIndex === index + 1 ? 1 : 0 }}
                    

        >
          {info.description && (
            <div
              style={{
                color: textColor,
                width: isDesktop === true ? "30vw" : "100%",
                fontSize: "0.9em",
                paddingTop: "5vh",
              }}
            >
              <RichText text={info.description} />
            </div>
          )}
          {data.map((item, index) => (
            <div
              key={"media" + index}
              style={{
                height: isDesktop === true ? "50vh" : "fit-content",
                width: isDesktop === false ? "100%" : "fit-content",
              }}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  style={{
                    height: isDesktop === true ? "100%" : undefined,
                    width: isDesktop === false ? "100%" : undefined,
                          pointerEvents: isDragging ? 'none' : 'auto',
                    userSelect: 'none',
                  }}
                  alt={`Attachment ${index}`}
                  draggable={false}

                />
              ) : (
                <video
                  src={item.url}
                  autoPlay
                  muted
                  playsInline
                  loop
                  ref={index === 0 ? videoRef : null}
                  crossOrigin="anonymous"
                  style={{
                    height: isDesktop === true ? "100%" : undefined,
                    width: isDesktop === false ? "100%" : undefined,
                          pointerEvents: isDragging ? 'none' : 'auto',
                    userSelect: 'none',
                  }}
                  draggable={false}

                />
              )}
            </div>
          ))}
          <canvas
            ref={canvasRef}
            style={{ border: "1px solid yellow", display: "none", width: 50 }}
          />
        </motion.div>
      </div>

      <motion.div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          color: textColor,
        }}
      >
        
        {isDesktop === true || isDesktop === false && !info.url ? <p style={{ maxWidth: "70%" }}>{info.heading}</p> :<a
            href={info.url}
            target="_blank"
            style={{maxWidth: "100%" }}
          >
           {info.heading}{" ->"}
          </a>}
        
        <div
          style={{
            width: "30%",
            display: isDesktop === true? "flex":'none',
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <p style={{ color: textColor, opacity: 0.5 }}>{info.year}</p>
          <a
            className={index === current - 1? null:"arrow"}
            href={info.url}
            target="_blank"
            style={{ display: isDesktop === true ? "block" : "none" }}
          >
         
            {index === current - 1 && <motion.span initial={{opacity:0}} animate={{opacity:0.6}}>Learn more</motion.span>} {info.url ? "->" : ""}
          </a>
        </div>
      </motion.div>

     {allColorsReady && (
        <>
          <motion.div
            animate={{ opacity: isDesktop ? (showLeftFade ? 1 : 0) : (showTopFade ? 1 : 0) }}
            style={{
              width: isDesktop ? "10vw" : `calc(100% - 40px)`,
              height: isDesktop ? `calc(100% - ${paletteSize + 10}px)` : "5vh",
              top: isDesktop ? 0 : `calc(${scrollRef.current.getBoundingClientRect().top}px - ${mobilePaperPadding} - 1px)`,
              position: "absolute",
              left: 20,
              background: isDesktop
                ? `linear-gradient(270deg, transparent, ${color})`
                : `linear-gradient(180deg, ${color}, transparent)`,
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ opacity: isDesktop ? (showRightFade ? 1 : 0) : (showBottomFade ? 1 : 0) }}
            style={{
              width: isDesktop ? "10vw" : `calc(100% - 40px)`,
              height: isDesktop ? `calc(100% - ${paletteSize + 10}px)` : "5vh",
              top: isDesktop ? 0 : undefined,
              bottom: isDesktop ? undefined : 20 -1,
              position: "absolute",
              right: 20,
              background: isDesktop
                ? `linear-gradient(90deg, transparent, ${color})`
                : `linear-gradient(180deg, transparent, ${color})`,
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </motion.div>
      </>
  );
};

function Footer(props) {
  const isDesktop = useDesktopDetect();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        height: isDesktop === true ? paperPadding : 40,
        width: `calc(100vw - ${paperPadding})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        gap: 16,
        fontSize: "0.8em",
      }}
    >
      <div style={{ opacity: 0.4 }}>{cv.general.displayName}</div>

      <div
        style={{ width: 1, height: "1em", background: "white", opacity: 0.2 }}
      />
      {cv.contact.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {cv.contact.map((contactItem, index) => {
            return (
              <motion.div
                key={contactItem.url}
                style={{ opacity: 0.4 }}
                whileHover={{ opacity: 0.6 }}
              >
                <a href={contactItem.url} target="_blank">
                  {contactItem.platform}
                </a>
              </motion.div>
            );
          })}
          <motion.div style={{ opacity: 0.4 }} whileHover={{ opacity: 0.6 }}>
            <a href={"https://read.cv/" + cv.general.username} target="_blank">
              Read.cv
            </a>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}


function PaperHeader(props) {
  const links = cv.contact;
  const about = cv.general.about;
  const isDesktop = useDesktopDetect();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "100%",
        flexDirection: isDesktop === true ? "row" : "column",
        alignItems: isDesktop === true ? "flex-end" : "flex-start",
        gap: 20,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 20,
          flexDirection: isDesktop === true ? "column" : "column-reverse",
        }}
      >
    
          {cv.general.byline && <p>{cv.general.byline}</p>}

          <h1
            className="anton"
            style={{
              fontSize: "10vw",
              width: "fit-content",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {cv.general.displayName}
          </h1>
      </div>
       <div
            style={{
              display: "flex",
              flexDirection:'column',
              gap:10,
              width: isDesktop === true? "80%":'100%',
              fontSize: "0.9em",
            }}
          >
            {about && <RichText text={about} />}
          </div>
      {cv.contact.length > 0 && isDesktop === false && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            position: "absolute",
            bottom: 0,
            fontSize:'0.9em'
          }}
        >
          {cv.contact.map((contactItem, index) => {
            return (
              <div key={contactItem.url}>
                <a href={contactItem.url} target="_blank">
                  {contactItem.platform}
                </a>
              </div>
            );
          })}
          <div>
            <a href={"https://read.cv/" + cv.general.username} target="_blank">
              Read.cv
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


function Scroll({ num, current, setCurrent, allColorsReady }) {
  const { scrollYProgress } = useScroll();
  const containerRef = useRef(null);
  const scrollBarRef = useRef(null);
  const sectionHeight = window.innerHeight * 0.6;
  const [scope, animate] = useAnimate();

  const scrollBarHeight = 200;
  const scopeBarHeight = 50;
  
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    // stiffness: 100,
    // damping: 30,
    type:'spring', bounce:0.05,
    restDelta: 0.001
  });

  const scrollIndicatorY = useTransform(smoothScrollYProgress, [0, 1], [0, scrollBarHeight - scopeBarHeight]);

  const updateCurrent = useCallback(() => {
    if (containerRef.current) {
      const scrollPercentage = scrollYProgress.get();
      let newCurrent = Math.floor(scrollPercentage * (num + 1));
      newCurrent = Math.min(Math.max(newCurrent, 0), num);
      if (newCurrent !== current) {
        setCurrent(newCurrent);
      }
    }
  }, [scrollYProgress, current, setCurrent, num]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(updateCurrent);
    return () => unsubscribe();
  }, [scrollYProgress, updateCurrent]);

  const handleScrollBarClick = useCallback((event) => {
    if (scrollBarRef.current && containerRef.current) {
      const scrollBarRect = scrollBarRef.current.getBoundingClientRect();
      const clickY = event.clientY - scrollBarRect.top;
      const scrollPercentage = clickY / scrollBarRect.height;
      
      const containerHeight = containerRef.current.clientHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = containerHeight - windowHeight;
      const targetScrollY = scrollPercentage * maxScroll;

      animate(scope.current, { y: scrollPercentage * 180 }, { type: 'spring', bounce: 0.05});
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  }, [animate, scope]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: allColorsReady === true? `${(num + 1) * sectionHeight}px`:0,
        position: 'absolute',
        top: 0,
        left: 0,
    
        pointerEvents: 'none'
      }}
    >
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: paperPadding,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 8,
        alignItems: 'center'
      }}>
        <motion.div 
          ref={scrollBarRef}
          onClick={handleScrollBarClick}
          style={{
            width: 3, 
         
            background: 'rgba(255,255,255,0.3)', 
            borderRadius: 1.5, 
            overflow: 'hidden',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          animate={{   height: allColorsReady === true? scrollBarHeight:scopeBarHeight, }}
        >
          <motion.div 
            ref={scope}
            style={{
              width: 3, 
              height: scopeBarHeight, 
              background: 'white',
              borderRadius: 1.5,
              y: scrollIndicatorY
            }}
          />
        </motion.div>
      </div>
      {Array.from({ length: num + 1 }, (_, i) => (
        <motion.div
          key={'section' + i}
          style={{
            width: '100%',
            height: `${sectionHeight}px`,
            // border: '1px solid red'
          }}
        />
      ))}
    </div>
  );
}

// colorUtils.js

/**
 * Get the prominent colors from an image, prioritizing distinctive colors.
 * @param {string} src - The source of the image (URL or base64).
 * @param {Object} options - Options for color extraction.
 * @returns {Promise<string[]>} A promise that resolves to an array of color values.
 */
export const prominent = (src, options = {}) => {
  const {
    amount = 5,
    format = 'hex',
    sample = 10, // Increase this for faster processing, decrease for more accuracy
    distinctiveThreshold = 0.15, // Adjust this to change what's considered a distinctive color
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colors = getProminent(imageData, { amount, format, sample, distinctiveThreshold });
      resolve(colors);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};

/**
 * Get the most prominent colors from image data, prioritizing distinctive colors.
 * @param {Uint8ClampedArray} data - The image data.
 * @param {Object} options - Options for color extraction.
 * @returns {string[]} An array of color values.
 */
const getProminent = (data, options) => {
  const { amount, format, sample, distinctiveThreshold } = options;
  const colorCounts = new Map();
  const step = 4 * sample;

  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip fully transparent pixels
    if (a === 0) continue;

    const rgb = `${r},${g},${b}`;
    colorCounts.set(rgb, (colorCounts.get(rgb) || 0) + 1);
  }

  const sortedColors = Array.from(colorCounts.entries())
    .map(([color, count]) => ({
      rgb: color.split(',').map(Number),
      count,
      distinctiveness: getColorDistinctiveness(color.split(',').map(Number))
    }))
    .sort((a, b) => {
      // Prioritize distinctive colors, then by count
      if (a.distinctiveness > distinctiveThreshold && b.distinctiveness <= distinctiveThreshold) return -1;
      if (b.distinctiveness > distinctiveThreshold && a.distinctiveness <= distinctiveThreshold) return 1;
      return b.count - a.count;
    })
    .slice(0, amount)
    .map(({ rgb }) => formatColor(rgb, format));

  return sortedColors;
};

/**
 * Calculate the distinctiveness of a color.
 * @param {number[]} rgb - The RGB values of the color.
 * @returns {number} A value between 0 and 1, where higher values are more distinctive.
 */
const getColorDistinctiveness = (rgb) => {
  const [r, g, b] = rgb;
  
  // Calculate the standard deviation of the RGB values
  const mean = (r + g + b) / 3;
  const variance = ((r - mean) ** 2 + (g - mean) ** 2 + (b - mean) ** 2) / 3;
  const stdDev = Math.sqrt(variance);
  
  // Normalize the standard deviation to a 0-1 range
  // A higher value means the color is more distinctive
  return Math.min(stdDev / 127.5, 1);
};

/**
 * Format a color value to the desired output format.
 * @param {number[]} rgb - The RGB color values.
 * @param {string} format - The desired output format ('rgb', 'array', or 'hex').
 * @returns {string|number[]} The formatted color value.
 */
const formatColor = (rgb, format) => {
  switch (format) {
    case 'rgb':
      return `rgb(${rgb.join(',')})`;
    case 'array':
      return rgb;
    case 'hex':
    default:
      return rgbToHex(rgb);
  }
};

/**
 * Convert RGB values to a hex color string.
 * @param {number[]} rgb - The RGB color values.
 * @returns {string} The hex color string.
 */
const rgbToHex = (rgb) => 
  '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');

/**
 * Determine the best text color (black or white) based on the background color.
 * @param {string} bgColor - The background color in hex format.
 * @returns {string} The recommended text color ('#000' for black or '#fff' for white).
 */
export const getColorByBgColor = (bgColor) => {
  if (!bgColor) return '';
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? '#000' : '#fff';
};

/**
 * Get the most colorful color from an array of colors.
 * @param {string[]} colors - An array of hex color strings.
 * @returns {string} The most colorful color.
 */
export const getMostColorful = (colors) => {
  if (!Array.isArray(colors) || colors.length === 0) {
    return undefined;
  }
  return colors.reduce((prev, current) => {
    return getColorfulness(current) > getColorfulness(prev) ? current : prev;
  });
};

/**
 * Get the colorfulness value of a hex color.
 * @param {string} hex - The hex color string.
 * @returns {number} The colorfulness value.
 */
const getColorfulness = (hex) => {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  const s = max === 0 ? 0 : d / max;
  
  // Colorfulness is a combination of saturation and brightness
  return s * Math.sqrt(l); // This formula can be adjusted for different perceptions of colorfulness
};


export const useDesktopDetect = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    // Check if window is defined (we're in the browser, not server-side)
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    // Default to false if window is not defined
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
};





export default App;