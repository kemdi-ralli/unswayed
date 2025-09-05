"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(
  ({ style, ...props }, ref) => (
    <SheetPrimitive.Overlay
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.8)",
        transition: "opacity 0.3s ease-in-out",
        ...style,
      }}
      {...props}
    />
  )
)
SheetOverlay.displayName = "SheetOverlay"

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>>(
  ({ style, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "75%",
          maxWidth: 400,
          zIndex: 51,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: "#fff",
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          overflowY: "auto",
          transition: "transform 0.3s ease-in-out",
          transform: "translateX(0%)",
          ...style,
        }}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            borderRadius: 4,
            background: "transparent",
            opacity: 0.7,
            cursor: "pointer",
            border: "none",
            padding: 4,
            transition: "opacity 0.2s",
          }}
        >
          <X style={{ width: 16, height: 16 }} />
          <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
            Close
          </span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
)
SheetContent.displayName = "SheetContent"

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ style, ...props }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      textAlign: "center",
      ...style,
    }}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ style, ...props }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column-reverse",
      justifyContent: "flex-end",
      gap: 8,
      ...style,
    }}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(
  ({ style, ...props }, ref) => (
    <SheetPrimitive.Title
      ref={ref}
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: "#000",
        ...style,
      }}
      {...props}
    />
  )
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Description>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>>(
  ({ style, ...props }, ref) => (
    <SheetPrimitive.Description
      ref={ref}
      style={{
        fontSize: 14,
        color: "#666",
        ...style,
      }}
      {...props}
    />
  )
)
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
