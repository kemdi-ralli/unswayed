import Image from "next/image"
import React from "react"

interface OneClickIntegrationsIllustrationProps {
  className?: string
}

const OneClickIntegrationsIllustration: React.FC<OneClickIntegrationsIllustrationProps> = ({ className = "" }) => {
  type ThemeVars = React.CSSProperties & { [key: string]: string | number | undefined }
  const themeVars: ThemeVars = {
    "--oci-primary-color": "hsl(var(--primary))",
    "--oci-background-color": "hsl(var(--background))",
    "--oci-foreground-color": "hsl(var(--foreground))",
    "--oci-muted-foreground-color": "hsl(var(--muted-foreground))",
    "--oci-border-color": "hsl(var(--border))",
    "--oci-shadow-color": "rgba(0, 0, 0, 0.12)",
    "--oci-gradient-light-gray-start": "hsl(var(--foreground) / 0.2)",
    "--oci-gradient-light-gray-end": "transparent",
  }

  // Generic logo/avatar box
  const LogoBox: React.FC<{ logo?: React.ReactNode; gradient?: boolean }> = ({ logo, gradient }) => {
    const baseStyle: React.CSSProperties = {
      width: 60,
      height: 60,
      borderRadius: 9,
      border: `1px solid rgba(32, 190, 87, 0.2)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    }

    if (gradient) {
      Object.assign(baseStyle, {
        background: `linear-gradient(180deg, ${themeVars["--oci-gradient-light-gray-start"]} 0%, ${themeVars["--oci-gradient-light-gray-end"]} 100%)`,
        boxShadow: `0px 1px 2px ${themeVars["--oci-shadow-color"]}`,
        backdropFilter: "blur(18px)",
        padding: "6px 8px",
      })
    }

    // If no logo → return just an empty box
    return <div style={baseStyle}>{logo || null}</div>
  }

  // Avatar Images
  const AlbertFlores = (
    <Image src="/images/avatars/albert-flores.png" alt="Albert Flores" width={36} height={36} style={{ borderRadius: "50%" }} />
  )
  const AnnetteBlack = (
    <Image src="/images/avatars/annette-black.png" alt="Annette Black" width={36} height={36} style={{ borderRadius: "50%" }} />
  )
  const CameronWilliamson = (
    <Image src="/images/avatars/cameron-williamson.png" alt="Cameron Williamson" width={36} height={36} style={{ borderRadius: "50%" }} />
  )
  const CodyFisher = (
    <Image src="/images/avatars/cody-fisher.png" alt="Cody Fisher" width={36} height={36} style={{ borderRadius: "50%" }} />
  )
  const DarleneRobertson = (
    <Image src="/images/avatars/darlene-robertson.png" alt="Darlene Robertson" width={36} height={36} style={{ borderRadius: "50%" }} />
  )

  const RobertFox = (
    <Image src="/images/avatars/robert-fox.png" alt="Darlene Robertson" width={36} height={36} style={{ borderRadius: "50%" }} />
  )

  // Map grid positions to avatars
  const logoPositions: Record<string, React.ReactNode> = {
    "0-3": AlbertFlores,
    "0-6": CameronWilliamson,
    "1-2": DarleneRobertson,
    "1-5": AnnetteBlack,
    "2-3": CameronWilliamson,
    "2-7": CodyFisher,
    "3-5": DarleneRobertson,
    "3-1": RobertFox,
  }

  const totalRows = 4
  const totalCols = 10

  return (
    <div
      className={className}
      style={themeVars}
      role="img"
      aria-label="One-click integrations illustration showing a grid of connected squares"
    >
      {/* Background radial gradient */}
      <div
        style={{
          width: 377.33,
          height: 278.08,
          position: "absolute",
          top: 24,
          left: 0,
          background: `radial-gradient(ellipse 103.87% 77.04% at 52.56% -1.80%, 
            ${themeVars["--oci-foreground-color"]}00 0%, 
            ${themeVars["--oci-foreground-color"]}F5 15%, 
            ${themeVars["--oci-foreground-color"]}66 49%, 
            ${themeVars["--oci-foreground-color"]}F5 87%, 
            ${themeVars["--oci-foreground-color"]}00 100%)`,
        }}
      />

      {/* Grid container */}
      <div
        style={{
          width: 600,
          height: 450,
          position: "absolute",
          top: 30,
          left: 0.34,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 16,
          backdropFilter: "blur(7.91px)",
        }}
      >
        {Array.from({ length: totalRows }).map((_, row) => (
          <div key={row} style={{ display: "flex", gap: 16 }}>
            {Array.from({ length: totalCols }).map((_, col) => {
              const key = `${row}-${col}`
              return <LogoBox key={col} logo={logoPositions[key]} gradient={!!logoPositions[key]} />
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OneClickIntegrationsIllustration
