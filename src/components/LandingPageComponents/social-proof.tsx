import Image from "next/image"

export function SocialProof() {
  return (
    <section
      style={{
        width: "100%",
        padding: "64px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "rgba(128,128,128,0.8)",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "20px",
        }}
      >
        Trusted by fast-growing startups
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "32px",
          justifyItems: "center",
          width: "100%",
          maxWidth: "1100px",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Image
            key={i}
            src={`/logos/logo0${i + 1}.svg`}
            alt={`Company Logo ${i + 1}`}
            width={400}
            height={120}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              objectFit: "contain",
              filter: "grayscale(100%)",
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </section>
  )
}
