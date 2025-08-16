import React from "react";
import Chatboot from "@/components/chatboot/Chatboot";
import Container from "@/components/common/Container";

const page = () => {
  return (
    <Container
      sx={{
        padding: "40px",
      }}
    >
      <Chatboot />
    </Container>
  );
};

export default page;
