"use client"

import { useState, useCallback, useMemo, memo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Grid3X3, Layers, LayoutList, ExternalLink, Github } from "lucide-react"

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
}

const SWIPE_THRESHOLD = 50

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Hook to get responsive card dimensions
function useCardDimensions(layout) {
  const [dims, setDims] = useState({ imageHeight: 170, cardHeight: 410 })

  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (layout === "stack") {
        if (w < 360) {
          setDims({ imageHeight: 120, cardHeight: 340, textZoneHeight: 130, buttonZoneHeight: 70 })
        } else if (w < 480) {
          setDims({ imageHeight: 140, cardHeight: 370, textZoneHeight: 140, buttonZoneHeight: 72 })
        } else {
          setDims({ imageHeight: 170, cardHeight: 410, textZoneHeight: 150, buttonZoneHeight: 74 })
        }
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [layout])

  return dims
}

// Memoized Card Component
const ProjectCard = memo(function ProjectCard({
  card,
  layout,
  styles,
  isExpanded,
  isTopCard,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
  dims,
}) {
  const isListLayout = layout === "list"
  const isGridLayout = layout === "grid"
  const isStackLayout = layout === "stack"

  const FigmaOnly = card.tags?.length === 1 && card.tags[0] === "Figma"
  const linkCount = (card.github ? 1 : 0) + (card.webapp ? 1 : 0)

  return (
    <motion.div
      layoutId={isStackLayout ? String(card.id) : undefined}
      initial={isStackLayout ? { opacity: 0, scale: 0.8 } : { opacity: 0 }}
      animate={{
        opacity: 1,
        scale: isExpanded ? 1.02 : (styles.scale ?? 1),
        x: 0,
        rotate: styles.rotate ?? 0,
      }}
      style={isStackLayout ? {
        position: 'absolute',
        top: styles.top ?? 0,
        left: styles.left ?? 0,
        zIndex: styles.zIndex ?? 1,
        width: '100%',
        height: `${dims.cardHeight}px`,
      } : undefined}
      exit={isStackLayout ? { opacity: 0, scale: 0.8, x: -200 } : { opacity: 0 }}
      transition={isStackLayout ? { type: "spring", stiffness: 300, damping: 25 } : { duration: 0.2 }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl sm:rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden",
        "hover:border-purple-500/50 transition-colors duration-200",
        "hover:shadow-xl hover:shadow-purple-500/20",
        isStackLayout && "flex flex-col",
        isStackLayout && isTopCard && "cursor-grab active:cursor-grabbing",
        // Grid: fill the grid cell naturally
        isGridLayout && "w-full flex flex-col",
        // List: horizontal layout on sm+, vertical on xs
        isListLayout && "w-full flex flex-col xs:flex-row",
        isExpanded && "ring-2 ring-purple-500",
      )}
    >
      {/* ── IMAGE ZONE ── */}
      {!isListLayout && card.image && (
        <div
          className={cn(
            "relative overflow-hidden bg-gray-800/50 flex-none",
            isListLayout && "xs:w-32 sm:w-40 md:w-48 xs:flex-none xs:h-auto h-28",
            isGridLayout && "h-32 sm:h-36 md:h-40",
          )}
          style={isStackLayout ? { height: `${dims.imageHeight}px` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 pointer-events-none" />
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className={cn(
              "w-full h-full object-contain bg-gray-800/30",
              isStackLayout && "p-1.5 sm:p-2",
              isGridLayout && "p-1",
              isListLayout && "p-2 xs:object-cover",
            )}
          />
        </div>
      )}

      {/* ── TEXT ZONE ── */}
      <div
        className={cn(
          "flex flex-col overflow-hidden",
          isStackLayout && "flex-none px-3 sm:px-4 pt-3 pb-0",
          isGridLayout && "p-3 sm:p-4 flex-1",
          isListLayout && "p-3 sm:p-4 flex-1 min-w-0",
        )}
        style={isStackLayout ? { height: `${dims.textZoneHeight}px` } : undefined}
      >
        <h3 className={cn(
          "font-bold text-white truncate flex-none",
          isStackLayout && "text-sm sm:text-base md:text-lg mb-1",
          isGridLayout && "text-sm sm:text-base mb-1 sm:mb-2",
          isListLayout && "text-sm sm:text-base mb-1",
        )}>
          {card.title}
        </h3>
        <p className={cn(
          "text-xs sm:text-sm text-gray-400 leading-relaxed flex-none",
          isStackLayout && "line-clamp-2",
          isGridLayout && "line-clamp-2 sm:line-clamp-3",
          isListLayout && "line-clamp-2",
        )}>
          {card.description}
        </p>

        {/* Tags */}
        {card.tags?.length > 0 && (
          <div className={cn(
            "flex flex-wrap gap-1 mt-2 flex-none overflow-hidden",
            isStackLayout && "max-h-[40px]",
            isListLayout && "max-h-[48px]",
          )}>
            {card.tags.slice(0, isListLayout ? 4 : isStackLayout ? 3 : 3).map((tag, i) => (
              <span
                key={i}
                className="bg-gray-800/80 text-purple-300 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md border border-purple-500/20 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > (isListLayout ? 4 : 3) && (
              <span className="text-gray-500 text-[10px] sm:text-xs px-1 self-center">
                +{card.tags.length - (isListLayout ? 4 : 3)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── BUTTON ZONE ── */}
      {(card.github || card.webapp) && (
        <div
          className={cn(
            "flex-none flex flex-col justify-end",
            isStackLayout && "px-3 sm:px-4 pb-3 sm:pb-4",
            isGridLayout && "px-3 sm:px-4 pb-3 sm:pb-4",
            isListLayout && "px-3 sm:px-4 pb-3 sm:pb-4 xs:px-4 xs:pb-4 xs:pt-4 xs:border-l xs:border-gray-700/50 xs:flex-row xs:items-center xs:justify-end xs:gap-3",
          )}
          style={isStackLayout ? { height: `${dims.buttonZoneHeight}px` } : undefined}
        >
          {/* Swipe hint */}
          {isTopCard && isStackLayout && (
            <div className="text-center mb-1">
              <span className="text-[9px] sm:text-[10px] text-gray-500">← Swipe to navigate →</span>
            </div>
          )}

          {/* Buttons */}
          <div className={cn(
            "flex gap-1.5 sm:gap-2 border-t border-gray-700/50",
            isStackLayout && "pt-1.5 sm:pt-2",
            isGridLayout && "mt-2 sm:mt-3 pt-1.5 sm:pt-2",
            isListLayout && "mt-2 pt-1.5 xs:mt-0 xs:pt-0 xs:border-t-0 xs:flex-row xs:gap-2 xs:min-w-[170px] xs:justify-end",
          )}>
            {FigmaOnly ? (
              <a
                href={card.github || card.webapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-purple-600/90 hover:bg-purple-500 text-white py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium shadow-lg shadow-purple-500/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 sm:h-4 sm:w-4 flex-none">
                  <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117v-6.04H8.148zm7.704 0c2.476 0 4.49 2.015 4.49 4.49s-2.014 4.49-4.49 4.49-4.49-2.015-4.49-4.49 2.014-4.49 4.49-4.49zm0 1.471c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.02-3.019-3.02zM8.148 24c-2.476 0-4.49-2.015-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.015 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.02-3.019-3.02z"/>
                </svg>
                <span className="truncate">View in Figma</span>
              </a>
            ) : (
              <>
                {card.github && (
                  <a
                    href={card.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gray-800/80 hover:bg-purple-600 text-gray-300 hover:text-white py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium",
                      isListLayout ? "px-3 min-w-[96px]" : "min-w-0",
                    )}
                  >
                    <Github className="h-3 w-3 sm:h-4 sm:w-4 flex-none" />
                    <span className={cn(!isListLayout && "truncate")}>Code</span>
                  </a>
                )}
                {card.webapp && (
                  <a
                    href={card.webapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-purple-600/90 hover:bg-purple-500 text-white py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium shadow-lg shadow-purple-500/20",
                      isListLayout ? "px-3 min-w-[96px]" : "min-w-0",
                    )}
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-none" />
                    <span className={cn(!isListLayout && "truncate")}>Live</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
})

export default function Component({
  cards = [],
  className,
  defaultLayout = "stack",
  onCardClick,
}) {
  const [layout, setLayout] = useState(defaultLayout)
  const [expandedCard, setExpandedCard] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dims = useCardDimensions(layout)

  // Reset activeIndex if cards change
  useEffect(() => {
    setActiveIndex(0)
  }, [cards.length])

  const handleDragStart = useCallback(() => setIsDragging(true), [])

  const handleDragEnd = useCallback((event, info) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x
    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % cards.length)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }
    setIsDragging(false)
  }, [cards.length])

  const handleCardClick = useCallback((card, isExpanded) => {
    if (isDragging) return
    setExpandedCard(isExpanded ? null : card.id)
    onCardClick?.(card)
  }, [isDragging, onCardClick])

  const handleLayoutChange = useCallback((mode) => {
    setLayout(mode)
    setExpandedCard(null)
  }, [])

  const handlePaginationClick = useCallback((index) => setActiveIndex(index), [])

  const stackOrder = useMemo(() => {
    if (layout !== "stack") return null
    const maxVisible = 4
    const reordered = []
    for (let i = 0; i < Math.min(cards.length, maxVisible); i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }, [layout, cards, activeIndex])

  const displayCards = useMemo(() => {
    if (layout === "stack") return stackOrder
    return cards.map((c, i) => ({ ...c, stackPosition: i }))
  }, [layout, stackOrder, cards])

  const getLayoutStyles = useCallback((stackPosition) => {
    if (layout === "stack") {
      return {
        top: stackPosition * 5,
        left: stackPosition * 5,
        zIndex: 10 - stackPosition,
        rotate: 0,
        scale: 1 - stackPosition * 0.02,
      }
    }
    return { top: 0, left: 0, zIndex: 1, rotate: 0 }
  }, [layout])

  // Stack container height accounts for the offset of background cards
  const stackContainerHeight = dims.cardHeight + 20

  const containerClass = {
    stack: `relative mx-auto w-full`,
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full",
    list: "flex flex-col gap-3 sm:gap-4 w-full",
  }

  if (!cards || cards.length === 0) return null

  return (
    <div className={cn("space-y-4 sm:space-y-6 w-full", className)}>
      {/* Layout Toggle */}
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl bg-gray-800/80 backdrop-blur-sm p-1 sm:p-1.5 w-fit mx-auto border border-gray-700/50 shadow-lg">
        {Object.keys(layoutIcons).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <button
              key={mode}
              onClick={() => handleLayoutChange(mode)}
              className={cn(
                "rounded-md sm:rounded-lg p-2 sm:p-2.5 transition-colors duration-200",
                layout === mode
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50",
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )
        })}
      </div>

      {/* Cards Container */}
      <div
        className={containerClass[layout]}
        style={layout === "stack" ? { height: `${stackContainerHeight}px`, maxWidth: "min(380px, 92vw)" } : undefined}
      >
        {layout === "stack" ? (
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = card.stackPosition === 0
              return (
                <ProjectCard
                  key={card.id}
                  card={card}
                  layout={layout}
                  styles={styles}
                  isExpanded={isExpanded}
                  isTopCard={isTopCard}
                  isDragging={isDragging}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleCardClick(card, isExpanded)}
                  dims={dims}
                />
              )
            })}
          </AnimatePresence>
        ) : (
          displayCards.map((card) => {
            const styles = getLayoutStyles(card.stackPosition)
            const isExpanded = expandedCard === card.id
            return (
              <ProjectCard
                key={card.id}
                card={card}
                layout={layout}
                styles={styles}
                isExpanded={isExpanded}
                isTopCard={false}
                isDragging={false}
                onDragStart={undefined}
                onDragEnd={undefined}
                onClick={() => handleCardClick(card, isExpanded)}
                dims={dims}
              />
            )
          })
        )}
      </div>

      {/* Pagination dots — stack only */}
      {layout === "stack" && cards.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 flex-wrap px-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePaginationClick(index)}
              className={cn(
                "h-1.5 sm:h-2 rounded-full transition-all duration-200",
                index === activeIndex
                  ? "w-5 sm:w-6 bg-purple-500"
                  : "w-1.5 sm:w-2 bg-gray-600 hover:bg-gray-500",
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}