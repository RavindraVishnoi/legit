// src/app/about/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const teamMembers = [
  {
    name: "Avijeet Singh Bhati",
    role: "Project Lead & AI Model Strategist",
    bio: "Avijeet provides the strategic direction for Project LEGIT, guiding the overall project and specializing in the AI model strategy, ensuring our LLaMA 3.1 integration delivers unparalleled legal insight.",
    photo: "" 
  },
  {
    name: "Ravindra Vishnoi",
    role: "Lead Frontend & UI/UX Architect",
    bio: "Ravindra architects and crafts the user-centric interface for Project LEGIT, ensuring an intuitive, accessible, and responsive web experience for seamless interaction with our legal AI.",
    photo: "/photos/ravindra.jpg"
  },
  {
    name: "Akanksha Thakur",
    role: "Lead Data Engineer",
    bio: "Akanksha spearheads our data operations, meticulously curating and transforming complex legal information into high-quality datasets, forming the backbone of our AI's legal knowledge.",
    photo: ""
  },
  {
    name: "Karan",
    role: "AI/ML Development Lead",
    bio: "Karan takes the helm of our AI model development, expertly fine-tuning the LLaMA 3.1 model with our specialized legal datasets to achieve state-of-the-art legal understanding.",
    photo: ""
  },
  {
    name: "Vishal Kumar",
    role: "Lead Backend & Deployment Engineer",
    bio: "Vishal engineers the robust backend systems and manages the seamless deployment of Project LEGIT on Firebase, ensuring a scalable, reliable, and always-available platform.",
    photo: "/photos/vishal.jpg"
  },
];

export default function AboutPage() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* You might want to add a specific header for the About page or use the AppHeader */}
      {/* e.g., <AppHeader /> */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-primary">About Project LEGIT</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Project Overview</h2>
            <p className="text-lg text-muted-foreground">
              Project LEGIT is an innovative legal technology platform engineered to democratize access to legal information within the Indian context. By harnessing the advanced capabilities of Meta’s LLaMA 3.1, meticulously fine-tuned with specialized Indian legal data, LEGIT offers an intelligent virtual assistant. This assistant is designed to provide nuanced legal guidance, answer complex queries, and make legal understanding more accessible, efficient, and intuitive.
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              Our mission is delivered through a sophisticated, user-friendly web application, ensuring that expert legal information is just a click away.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Our Team & Contributions</h2>
            <p className="text-lg text-muted-foreground mb-6">
              This project is a result of the collaborative effort of our dedicated team. Each member has played a crucial role in their respective domains, and all have collectively contributed to the foundational data collection that powers our AI.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.name} 
                  className={cn(
                    "bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center",
                    index === teamMembers.length - 1 && teamMembers.length % 2 !== 0 ? "md:col-span-2" : ""
                  )}
                >
                  <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-primary/50">
                    <Image
                      src={member.photo || "/photos/default.png"} // Fallback to a default image if no photo is provided
                      alt={member.name}
                      width={128} 
                      height={128} 
                      className="object-cover" 
                      priority={index === 0} // Prioritize loading the first image
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-card-foreground">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Technology Stack</h2>
            <p className="text-lg text-muted-foreground">
              This project leverages cutting-edge technologies including Next.js, TypeScript,
              Meta's LLaMA 3.1 for advanced natural language understanding, Genkit for AI flow management, 
              and Firebase for seamless deployment and backend services.
            </p>
          </section>
          
          <div className="text-center mt-10">
            <Link href="/chat">
              <Button>Back to Chat</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
