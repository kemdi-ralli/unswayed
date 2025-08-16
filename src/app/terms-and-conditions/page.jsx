'use client'
import React from 'react'
import TermsAndConditions from '@/components/common/termsAndConditon/TermsAndConditions'
import TremsAndConditions from '@/components/applicant/applied/TremsAndConditions'
import { TERMS_CONDITIONS } from "@/constant/applicant/termsconditions";
import { Wizard } from "react-use-wizard";
import Container from '@/components/common/Container';


const Page = () => {
    return (
        // <TermsAndConditions />
        <Container>
            <Wizard>
                <TremsAndConditions data={TERMS_CONDITIONS} />
            </Wizard>
        </Container>
    )
}

export default Page