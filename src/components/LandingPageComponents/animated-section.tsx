"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import type { ComponentPropsWithoutRef } from "react"
import type { SxProps, Theme } from "@mui/material"

interface AnimatedSectionProps extends ComponentPropsWithoutRef<typeof motion.div> {
  children: ReactNode
  delay?: number
  sx?: SxProps<Theme>
}

export function AnimatedSection({ children, delay = 0, sx, ...props }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
      style={{
        ...(sx as object), // injects sx as inline style object
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
