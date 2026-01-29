'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TerminalLineData {
  cmd: string
  output: string
}

interface TerminalHeroProps {
  className?: string
  lines?: TerminalLineData[]
}

const defaultLines: TerminalLineData[] = [
  { cmd: 'whoami', output: 'Developer & Creator' },
  { cmd: 'cat skills.txt', output: 'Full-Stack • UI/UX • Open Source' },
  { cmd: 'ls projects/', output: 'Loading projects...' },
]

export function TerminalHero({ className, lines = defaultLines }: TerminalHeroProps) {
  const [completedLines, setCompletedLines] = useState<number>(0)
  
  return (
    <div className={cn("w-full max-w-3xl mx-auto font-mono text-sm md:text-base", className)}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden rounded-lg border border-border/50 bg-[#0c0c0c]/90 shadow-2xl backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="ml-2 text-xs text-muted-foreground/50">visitor@devport:~</div>
        </div>

        <div className="p-4 md:p-6 min-h-[240px] text-gray-300 space-y-4">
          {lines.map((line, index) => (
            <TerminalLine 
              key={index}
              line={line}
              index={index}
              startDelay={index * 2.5}
              onComplete={() => setCompletedLines(prev => Math.max(prev, index + 1))}
              showOutput={completedLines >= index}
            />
          ))}
          
          {completedLines >= lines.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="text-accent">➜</span>
              <span className="text-blue-400">~</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="h-5 w-2.5 bg-accent/50"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface TerminalLineProps {
  line: { cmd: string, output: string }
  index: number
  startDelay: number
  onComplete: () => void
  showOutput: boolean
}

function TerminalLine({ line, index, startDelay, onComplete, showOutput }: TerminalLineProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => line.cmd.slice(0, latest))
  const [isTyping, setIsTyping] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    if (hasRun) return

    const timer = setTimeout(() => {
      setIsTyping(true)
      const controls = animate(count, line.cmd.length, {
        type: "tween",
        duration: line.cmd.length * 0.1,
        ease: "linear",
        onComplete: () => {
          setIsTyping(false)
          setHasRun(true)
          setTimeout(() => {
            onComplete()
          }, 400)
        }
      })
      return controls.stop
    }, startDelay * 1000)

    return () => clearTimeout(timer)
  }, [line.cmd.length, startDelay, hasRun, count, onComplete])

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-accent">➜</span>
        <span className="text-blue-400">~</span>
        <motion.span>{displayText}</motion.span>
        {isTyping && (
           <motion.span
           animate={{ opacity: [1, 0] }}
           transition={{ repeat: Infinity, duration: 0.8 }}
           className="inline-block h-4 w-2 align-middle bg-accent/50"
         />
        )}
      </div>
      
      {showOutput && hasRun && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pl-6 text-muted-foreground"
        >
          {line.output}
        </motion.div>
      )}
    </div>
  )
}
