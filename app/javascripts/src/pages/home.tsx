import React from "react";
import { Button } from "@/components/ui/button"

import { Sponsors } from "@/components/Sponsors";
import { About } from "@/components/About";
import { Cta } from "@/components/Cta";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { Pricing } from "@/components/Pricing";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";

const Home = props => (
    <>
    <Navbar />
    <Hero />
    <Sponsors />
    <About />
    <HowItWorks />
    <Features />
    <Services />
    <Cta />
    <Testimonials />
    <Team />
    <Pricing />
    <Newsletter />
    <FAQ />
    <Footer />
    <ScrollToTop />
    </>
);

export default Home;