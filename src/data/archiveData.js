/* ===================== IMAGE IMPORTS ===================== */

// Event Posters
import fw_poster from '../assets/events/Events-Posters/fluxwave.jpeg';
import cs_poster from '../assets/events/Events-Posters/colour_smash.jpeg';
import flux_hard_wired_poster from '../assets/events/Events-Posters/flux_hard_wired.jpeg';
import rw_poster from '../assets/events/Events-Posters/robo_workshop.jpeg';
import tv26_poster from '../assets/events/Events-Posters/technovision_26.jpeg';
import tv25_poster from '../assets/events/Events-Posters/technovision_25.jpeg';
import webdev_poster from '../assets/events/Events-Posters/web_dev_workshop.jpeg';
import bw_poster from '../assets/events/Events-Posters/blockchain_workshop.jpeg';
import rocket_poster from '../assets/events/Events-Posters/rocket_crash.jpeg';
import fluxwave2_0_poster from '../assets/events/Events-Posters/fluxwave_2.0.jpeg';
import recruitment_26_poster from '../assets/events/Events-Posters/recruitment_26.jpeg';
import recruitment_25_poster from '../assets/events/Events-Posters/recruitment_25.jpeg';
import code_to_creation_poster from '../assets/events/Events-Posters/web_dev_workshop_2026.jpeg';
import banner10_poster from '../assets/banner/10.png';
import technovision_nov26_poster from '../assets/events/technovision_nov2026/Technovision.jpeg';

/* ===================== DATA STRUCTURE ===================== */

export const ARCHIVE_DATA = {

  "2026": [
    {
      title: "TECHNOVISION NOV '26",
      tag: "Mega Technical Fest",
      detailsUrl: "/events/technovision-nov-2026",
      images: [technovision_nov26_poster],
      terminal: "> registration_deadline: 31_Oct_2026\n> date: 02-03_Nov_2026\n> events: Model_Presentation, Robo_Rumble, Walking_Bot\n> focus: Robotics_&_Innovation",
      date: "2026-10-22",
      popularity: 110,
      summary: "Technovision returns this November with three premier competitions: Model Presentation, Robo Rumble, and the all-new Walking Bot challenge. Open to students of all colleges. Register by 31 October."
    },
    {
      title: "FLUX RECRUITMENT 2026",
      tag: "Membership Drive",
      detailsUrl: "/events/recruitment-2026",
      images: [recruitment_26_poster],
      terminal: "> status: Registration_Opens_17_Sept\n> timeline: 17 Sept - 12 Oct 2026\n> stages: Registration, Written_Test, Interview, Result\n> contact: Disha, Anshika, Pramit",
      date: "2026-09-15",
      popularity: 105,
      summary: "Specialized in impossible things! Technical Club FLUX is conducting its official Recruitment Drive 2026. Explore the timeline for Registration, Pen & Paper Test, Personal Interview, and Final Results."
    },
    {
      title: "CODE TO CREATION",
      tag: "Web Dev Workshop",
      reportUrl: "https://drive.google.com/file/d/10nM0Ig3AYTLZkxS8ouJCbbrndgy0JLsg/view?usp=drive_link",
      images: [code_to_creation_poster],
      terminal: "> event: Hands-On_Web_Development_Workshop\n> host: Devanshu_Vishwakarma\n> date: 17_August_2026_(Monday)\n> venue: SMART_CLASSROOM\n> curriculum: MERN_Stack, AI_Tools_10x_Faster, Live_Interactive_Project_Build, Hands-On_CRUD\n> perks: Goodies & Rewards",
      date: "2026-09-01",
      popularity: 102,
      summary: "Hands-on Web Development Workshop hosted by Devanshu Vishwakarma. Learn MERN Stack, leverage AI tools 10x faster, build live interactive full-stack applications, and win exclusive goodies & rewards."
    },
    {
      title: "FLUXWAVE 2.0 HACKATHON",
      tag: "Mega Hackathon",
      detailsUrl: "/events/fluxwave-2.0",
      images: [fluxwave2_0_poster],
      terminal: "> registered: 0_Teams\n> timeline: June - August 2026\n> focus: Code, Hardware, Design\n> prize_pool: TBA",
      date: "2026-08-01",
      popularity: 100,
      summary: "The ultimate innovation sandbox where code, hardware, and design crash together. Forge solutions to real-world problems and push boundaries."
    },
    {
      title: "BLOCKCHAIN WORKSHOP",
      tag: "India OnChain Tour",
      reportUrl: null,
      images: [bw_poster],
      terminal: "> venue: COE_Lab_SATI\n> date: 24_Feb_2026\n> focus: Web3_&_Blockchain\n> block_reward: Hot_Pizza_Delivered",
      date: "2026-02-24",
      popularity: 90,
      summary: "An action-packed session with Shardeum breaking down Web3 and smart contracts for everyone. Students got hands-on insights into decentralized tech careers, wrapped up with a massive pizza party!"
    },
    {
      title: "TECHNOVISION '26",
      tag: "Mega Technical Fest",
      detailsUrl: "/events/technovision-2026",
      images: [tv26_poster],
      terminal: "> arena: SU_Ground\n> date: 19-20_Feb_2026\n> events: Model_Presentation, Ropeway, Robo_Rumble\n> focus: Robotics_&_Innovation",
      date: "2026-02-19",
      popularity: 100,
      summary: "Technovision 2026 is the premier technical fest of SATI, featuring high-octane robotics and innovation challenges. Witness the clash of metal and code in Ropeway Racing, Robo Rumble, and Model Presentation."
    },
    {
      title: "ROBOTICS WORKSHOP",
      tag: "Technical Workshop",
      reportUrl: null,
      images: [rw_poster],
      terminal: "> venue: Embedded_Lab\n> date: 13_Feb_2026\n> guest: Mr._Kapil_Soni\n> focus: 1st_Year_Students",
      date: "2026-02-13",
      popularity: 92,
      summary: "Exclusive hands-on workshop led by Mr. Kapil Soni for 1st-year students. Built ropeway racing robots and RC cars, bridging theory with practical mechanical assembly."
    },
    {
      title: "FLUX HARD-WIRED 1.0",
      tag: "Hardware Ideathon",
      detailsUrl: "/events/flux-hard-wired",
      images: [flux_hard_wired_poster],
      terminal: "> mode: Online\n> deadline: 09_Feb_2026\n> team_size: 2-3_Members\n> focus: Hardware_Innovation",
      date: "2026-02-09",
      popularity: 95,
      summary: "FLUX Hard-Wired 1.0 is a competitive hardware-focused innovation challenge designed to evaluate participants on their ability to convert ideas into logically sound, well-structured, and defensible solutions."
    },
    {
      title: "INTRA-CLUB SATURDAYS",
      tag: "Club Activity",
      // reportUrl: '/reports/intra_club_activity_reports25-26.pdf',
      reportUrl: 'https://drive.google.com/file/d/1aGlCpZGZmqT31cAkuuE9L5Ta7m1h1KhO/view?usp=drive_link',
      images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c"],
      terminal: "> session: Weekly_Sprint\n> status: Active\n> timeline: Dec 2025 - Jan 2026",
      date: "2026-01-15",
      popularity: 80,
      summary: "Ongoing weekly internal meetups featuring high-energy activities like KBC Flux, Technical Debates, and Flux Auction to sharpen club members' competitive skills."
    },

  ],
  "2025": [
    {
      title: "ROCKET CRASH",
      tag: "Diwali Edition",
      reportUrl: null, // To be added later
      images: [rocket_poster],
      terminal: "> project: Diwali_Special\n> engine: Python\n> month: October_2025\n> status: Deployed\n> winner: Mrinal Rangare",
      date: "2025-10-20",
      popularity: 88,
      summary: "The official 2025 Diwali game. A creative physics-based challenge developed for the festival of lights, focusing on projectile logic and festive digital lighting simulations. Huge congratulations to our brilliant 1st-year winner: Mrinal Rangare!"
    },
    {
      title: "WEB DEV WORKSHOP",
      tag: "Training",
      // reportUrl: '/reports/web_workshop.pdf',
      reportUrl: 'https://drive.google.com/file/d/1hEBMCqarDzJlEnvVjUvflHgKVtED3W3c/view?usp=drive_link',
      images: [webdev_poster],
      terminal: "> venue: Embedded_Lab\n> date: 13/09/2025\n> participants: 37_Students\n> focus: Modern_Tools_&_Advanced_Libraries",
      date: "2025-09-13",
      popularity: 92,
      summary: "A specialized workshop transitioning from basics to advanced development. Explored modern industry tools, MERN stack libraries, and a career roadmap for freelancing and global internships."
    },
    {
      title: "FLUXWAVE HACKATHON",
      tag: "Online Hackathon",
      // reportUrl: '/reports/fluxwave_25.pdf',
      reportUrl: 'https://drive.google.com/file/d/1p40aK4vyMOEsW4K_V-PKl7m-3Ap_Tdc5/view?usp=drive_link',
      images: [fw_poster],
      terminal: "> registered: 51_Teams\n> shortlisted: 13_Teams\n> timeline: June - August 2025\n> winner: Med_Squad",
      date: "2025-08-15",
      popularity: 98,
      summary: "A high-stakes 3-round thriller. From 51 teams down to 13 finalists presenting offline at the Embedded Lab. Focused on technical innovation, business viability, and UI/UX design."
    },
    {
      title: "COLOR SMASH",
      tag: "Holi Special",
      reportUrl: null, // To be added later
      images: [cs_poster],
      terminal: "> engine: PyGame\n> month: March_2025\n> release: v1.0.4\n> concept: Digital_Festivities\n> winners: (1st)Safal Tiwari, (2nd)Pranav Dwivedi, (3rd)Sumit Rajpoot",
      date: "2025-03-25",
      popularity: 85,
      summary: "The official 2025 Holi game. A festive simulation developed in Python to celebrate Holi safely. Huge congratulations to our brilliant 1st-year winners who smashed the high scores: Safal Tiwari (🥇 1st Prize), Pranav Dwivedi (🥈 2nd Prize), and Sumit Rajpoot (🥉 3rd Prize)!"
    },
    {
      title: "TECHNOVISION '25",
      tag: "Mega Technical Fest",
      // reportUrl: '/reports/Technovision_25.pdf',
      reportUrl: 'https://drive.google.com/file/d/1WXYGhdrryTSJd8keMrtqBuiQkAHnQ1_5/view?usp=drive_link',
      images: [tv25_poster],
      terminal: "> arena: IT_Garden\n> date: 20-21_Feb_2025\n> events: Robo_Sumo & Robo_Rumble\n> focus: Mechatronics & Strategic_Battle",
      date: "2025-02-20",
      popularity: 100,
      summary: "A two-day robotic warfare event. Robo Sumo featured autonomous/manual ring battles, while Robo Rumble tested bots against complex obstacle courses and navigation tasks."
    },

  ],

};