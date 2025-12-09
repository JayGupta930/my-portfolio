"use client"

import { useState, useCallback, useMemo, memo } from "react"
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

// Memoized Card Component for better performance
const ProjectCard = memo(function ProjectCard({ 
  card, 
  layout, 
  styles, 
  isExpanded, 
  isTopCard, 
  isDragging,
  onDragStart,
  onDragEnd,
  onClick 
}) {
  return (
    <motion.div
      layoutId={layout === "stack" ? String(card.id) : undefined}
      initial={layout === "stack" ? { opacity: 0, scale: 0.8 } : { opacity: 0 }}
      animate={{
        opacity: 1,
        scale: isExpanded ? 1.02 : 1,
        x: 0,
        ...styles,
      }}
      exit={layout === "stack" ? { opacity: 0, scale: 0.8, x: -200 } : { opacity: 0 }}
      transition={layout === "stack" ? {
        type: "spring",
        stiffness: 300,
        damping: 25,
      } : { duration: 0.2 }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden",
        "hover:border-purple-500/50 transition-colors duration-200",
        "hover:shadow-xl hover:shadow-purple-500/20",
        layout === "stack" && "absolute w-full max-w-[360px] h-[400px] flex flex-col",
        layout === "stack" && isTopCard && "cursor-grab active:cursor-grabbing",
        layout === "grid" && "w-full",
        layout === "list" && "w-full",
        isExpanded && "ring-2 ring-purple-500",
      )}
    >
      {/* Project Image - hidden in list view */}
      {card.image && layout !== "list" && (
        <div className="relative overflow-hidden bg-gray-800/50">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 pointer-events-none" />
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            className={cn(
              "w-full object-contain bg-gray-800/30",
              layout === "stack" && "h-44 p-2",
              layout === "grid" && "h-40 p-1",
            )}
          />
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "p-4 flex flex-col",
        layout === "stack" && "p-5 flex-1",
      )}>
        <h3 className={cn(
          "font-bold text-white truncate mb-2",
          layout === "stack" && "text-lg",
          layout === "grid" && "text-base",
          layout === "list" && "text-base",
        )}>
          {card.title}
        </h3>
        <p
          className={cn(
            "text-sm text-gray-400 leading-relaxed",
            layout === "stack" && "line-clamp-3",
            layout === "grid" && "line-clamp-2",
            layout === "list" && "line-clamp-2",
          )}
        >
          {card.description}
        </p>

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className={cn(
            "flex flex-wrap gap-1.5 mt-3",
            layout === "list" && "mt-2",
          )}>
            {card.tags.slice(0, layout === "list" ? 5 : 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="bg-gray-800/80 text-purple-300 text-xs px-2 py-0.5 rounded-md border border-purple-500/20"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > (layout === "list" ? 5 : 3) && (
              <span className="text-gray-500 text-xs px-1">
                +{card.tags.length - (layout === "list" ? 5 : 3)}
              </span>
            )}
          </div>
        )}

        {/* Swipe hint for stack layout - above buttons */}
        {isTopCard && layout === "stack" && (
          <div className="text-center mb-2">
            <span className="text-xs text-gray-500">← Swipe to navigate →</span>
          </div>
        )}

        {/* Action Buttons */}
        {(card.github || card.webapp) && (
          <div className={cn(
            "flex gap-2 pt-2 border-t border-gray-700/50",
            layout === "stack" && "mt-auto",
            layout === "list" && "mt-3 pt-2",
            layout === "grid" && "mt-3",
          )}>
            {/* Check if it's a Figma-only project */}
            {card.tags && card.tags.length === 1 && card.tags[0] === "Figma" ? (
              <a
                href={card.github || card.webapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600/90 hover:bg-purple-500 text-white py-2 rounded-lg transition-colors duration-200 text-sm font-medium shadow-lg shadow-purple-500/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.02s-1.354-3.02-3.019-3.02h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02h3.117v-6.04H8.148zm7.704 0c2.476 0 4.49 2.015 4.49 4.49s-2.014 4.49-4.49 4.49-4.49-2.015-4.49-4.49 2.014-4.49 4.49-4.49zm0 1.471c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.02-3.019-3.02zM8.148 24c-2.476 0-4.49-2.015-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.015 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.02s1.354 3.02 3.019 3.02 3.019-1.355 3.019-3.02-1.354-3.02-3.019-3.02z"/>
                </svg>
                <span>View in Figma</span>
              </a>
            ) : (
              <>
                {card.github && (
                  <a
                    href={card.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-purple-600 text-gray-300 hover:text-white py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <Github className="h-4 w-4" />
                    <span>Code</span>
                  </a>
                )}
                {card.webapp && (
                  <a
                    href={card.webapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600/90 hover:bg-purple-500 text-white py-2 rounded-lg transition-colors duration-200 text-sm font-medium shadow-lg shadow-purple-500/20"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Live</span>
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
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

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

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
  }, [])

  const handlePaginationClick = useCallback((index) => {
    setActiveIndex(index)
  }, [])

  // Memoize stack order calculation - only show 4 cards for cleaner look
  const stackOrder = useMemo(() => {
    if (layout !== "stack") return null
    const reordered = []
    const maxVisible = 4 // Only show 4 cards in stack
    for (let i = 0; i < Math.min(cards.length, maxVisible); i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }, [layout, cards, activeIndex])

  // Memoize display cards
  const displayCards = useMemo(() => {
    if (layout === "stack") {
      return stackOrder
    }
    return cards.map((c, i) => ({ ...c, stackPosition: i }))
  }, [layout, stackOrder, cards])

  const getLayoutStyles = useCallback((stackPosition) => {
    switch (layout) {
      case "stack":
        return {
          top: stackPosition * 6,
          left: stackPosition * 6,
          zIndex: 10 - stackPosition,
          rotate: 0,
          scale: 1 - (stackPosition * 0.02),
        }
      case "grid":
      case "list":
      default:
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
    }
  }, [layout, cards.length])

  const containerStyles = {
    stack: "relative h-[440px] w-full max-w-[380px]",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "flex flex-col gap-4",
  }

  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Layout Toggle */}
      <div className="flex items-center justify-center gap-1 rounded-xl bg-gray-800/80 backdrop-blur-sm p-1.5 w-fit mx-auto border border-gray-700/50">
        {Object.keys(layoutIcons).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <button
              key={mode}
              onClick={() => handleLayoutChange(mode)}
              className={cn(
                "rounded-lg p-2.5 transition-colors duration-200",
                layout === mode
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50",
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </div>

      {/* Cards Container */}
      <div className={cn(containerStyles[layout], "mx-auto")}>
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
              />
            )
          })
        )}
      </div>

      {/* Pagination dots for stack layout */}
      {layout === "stack" && cards.length > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePaginationClick(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                index === activeIndex 
                  ? "w-6 bg-purple-500" 
                  : "w-2 bg-gray-600 hover:bg-gray-500",
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}