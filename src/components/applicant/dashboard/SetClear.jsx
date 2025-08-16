"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCvs } from "@/redux/slices/applicantCv";
import { setEditMode } from "@/redux/slices/editSlice";

const SetClear = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const previousPath = useRef("");

  useEffect(() => {
    const leavingRalliResume =
      previousPath.current === "/applicant/profile/ralli-resume" &&
      pathname !== "/applicant/profile/ralli-resume";

    const enteringJobDetails = !pathname.includes("/career-areas/job-details");

    if (leavingRalliResume || enteringJobDetails) {
      dispatch(setEditMode(false));
      dispatch(setCvs());
    }

    previousPath.current = pathname;
  }, [pathname, dispatch]);

  return null;
};

export default SetClear;
