"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Github,
  Globe,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TextHoverEffect } from "@/components/ui/hover-footer";

export default function HoverFooter() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Footer link data customized for Yunetra
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "How It Works", href: "#" },
        { label: "Skill Trading", href: "#" },
        { label: "Find Sessions", href: "#" },
        { label: "Community", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Guidelines", href: "#" },
        { label: "Contact Us", href: "#" },
        {
          label: "Live Chat",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data customized for Yunetra
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#38bdf8]" />,
      text: "hello@yunetra.com",
      href: "mailto:hello@yunetra.com",
    },
    {
      icon: <Phone size={18} className="text-[#38bdf8]" />,
      text: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: <MapPin size={18} className="text-[#38bdf8]" />,
      text: "India",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Github size={20} />, label: "Github", href: "#" },
    { icon: <Globe size={20} />, label: "Website", href: "#" },
  ];

  return (
    <footer 
      className="bg-black/10 backdrop-blur-sm relative w-full overflow-hidden border-t border-[#38bdf8]/10"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 z-10 relative pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12 pointer-events-auto">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="flex items-center gap-2 group bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent text-3xl font-extrabold font-syne">
                YUNETRA
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Built for Indian students. Trade skills, not money. Connect, learn, and grow together.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6 font-syne">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#38bdf8] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6 font-syne">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-[#38bdf8] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-400 hover:text-[#38bdf8] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-700/20 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-gray-400">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-[#38bdf8] transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-gray-400">
            &copy; {new Date().getFullYear()} Yunetra. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text hover effect - positioned as background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-0">
        <TextHoverEffect text="YUNETRA" className="w-full h-full" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}