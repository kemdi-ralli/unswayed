"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SPLASH_SCREEN_DATA } from "@/constant/spalsh";
import styles from "./page.module.css";
import { useDispatch, useSelector } from "react-redux";
import RalliModal from "../Modal/RalliModal";
import { clearSuccessMessage } from "@/redux/slices/deactivateMessageSlice";

const SplashScreen = () => {
  const data = SPLASH_SCREEN_DATA;
  const { successMessage, showMessage } = useSelector(
    (state) => state?.deactivateAccount
  );
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleOk = () => {
    dispatch(clearSuccessMessage());
    setModalOpen(false)
  };

  const renderList = (items) => (
    <List>
      {items?.map((item, index) => (
        <ListItem key={index} sx={{ pl: 0 }}>
          <Link href={item.link} passHref>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: "#FFF",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#FE4D82",
                    },
                  }}
                >{`• ${item.label}`}</Typography>
              }
            />
          </Link>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box className={styles.container}>
            <Box
              component="img"
              src="/assets/images/Ralli_White_Logo.png"
              width={200}
              height={140}
              alt="splash-img"
            />
            <Accordion className={styles.dropDownBox}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.dropDownIcon} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography className={styles.dropDownTitle}>
                  {data.loginTypeTitle}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>{renderList(data.loginType)}</AccordionDetails>
            </Accordion>

            <Box sx={{ marginBottom: 2, borderBottom: "1px solid #FFF" }} />

            <Accordion className={styles.dropDownBox}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.dropDownIcon} />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography className={styles.dropDownTitle}>
                  {data.helpCenterTitle}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>{renderList(data.helpCenter)}</AccordionDetails>
            </Accordion>

            <Box sx={{ marginBottom: 2, borderBottom: "1px solid #FFF" }} />

            <Accordion className={styles.dropDownBox}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.dropDownIcon} />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <Typography className={styles.dropDownTitle}>
                  {data.diversityTitle}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderList(data.diversityItems)}
              </AccordionDetails>
            </Accordion>

            <Box sx={{ marginBottom: 2, borderBottom: "1px solid #FFF" }} />

            <Accordion className={styles.dropDownBox}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className={styles.dropDownIcon} />}
                aria-controls="panel4-content"
                id="panel4-header"
              >
                <Typography className={styles.dropDownTitle}>
                  {data.toolikitsTitle}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderList(data.toolkitItems)}
              </AccordionDetails>
            </Accordion>

            <Box sx={{ marginBottom: 2, borderBottom: "1px solid #FFF" }} />
          </Box>
        </Grid>

        <Grid className={styles.imageSection} item xs={12} md={6}>
          <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Box
                component="img"
                src="/assets/images/Ralli_Dark_Logo.png"
                width={200}
                height={160}
                alt="splash-img"
                sx={{
                  "@media (max-width: 1024px)": {
                    width: "180px",
                    height: "180px",
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
      {showMessage && (
        <RalliModal
          open={isModalOpen}
          onClose={handleCloseModal}
          para={successMessage}
          buttonLabel="Ok"
          onClick={handleOk}
        />
      )}
    </Box>
  );
};

export default SplashScreen;
