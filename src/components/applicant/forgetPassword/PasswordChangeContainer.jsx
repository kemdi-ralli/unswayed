"use client";
import React, { useState } from "react";
import PasswordRecovery from "./PasswordRecovery";
import VerficationCode from "./VerficationCode";
import ChangePassword from "./ChangePassword";

import { Wizard } from "react-use-wizard";

const PasswordChangeContainer = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  return (
    <Wizard>
      <PasswordRecovery setUserEmail={setEmail} />
      <VerficationCode Email={email} setToken={setToken} />
      <ChangePassword Email={email} token={token} handleClose={handleClose}/>
    </Wizard>
  );
};

export default PasswordChangeContainer;
