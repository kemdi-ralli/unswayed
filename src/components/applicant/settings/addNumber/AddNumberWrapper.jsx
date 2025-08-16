import React from "react";
import AddNumber from "./AddNumber";
import VerifyNumber from "./VerifyNumber";
import { Wizard } from "react-use-wizard";

const AddNumberWrapper = ({profile}) => {
  return (
    <Wizard>
      <AddNumber profile={profile}/>
      <VerifyNumber type={"phone"} />
    </Wizard>
  );
};
export default AddNumberWrapper;
