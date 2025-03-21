import React, { useState } from "react";
import "./ItActInfo.css";

const ItActInfo = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const openModal = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const keyProvisions = [
    {
      title: "Electronic Governance",
      description: "Legal recognition of electronic records and digital signatures, enabling paperless transactions and authentication mechanisms in the digital realm.",
      icon: "fa-file-signature",
      image: "https://source.unsplash.com/800x600/?digital,signature",
      details: "Sections 4-10 of the IT Act provide legal recognition to electronic records and digital signatures. This enables government departments to accept filings, applications and other documents in electronic form. The Act also promotes the use of digital signatures for authentication in e-commerce and e-governance."
    },
    {
      title: "Cybercrime Regulations",
      description: "Defines cyber offenses such as hacking, identity theft, phishing, and cyber terrorism with associated penalties.",
      icon: "fa-shield-alt",
      image: "https://source.unsplash.com/800x600/?cybercrime,hacking",
      details: "The Act covers a wide range of cybercrimes including unauthorized access to computers (Section 43), computer-related offenses like tampering with source code (Section 65), and hacking (Section 66). It also addresses more serious crimes like cyber terrorism (Section 66F) which can lead to life imprisonment."
    },
    {
      title: "Data Protection",
      description: "Includes provisions related to safeguarding personal and sensitive data from unauthorized access and misuse.",
      icon: "fa-user-shield",
      image: "https://source.unsplash.com/800x600/?data,protection",
      details: "Section 43A mandates body corporates to implement reasonable security practices for protecting sensitive personal data. Section 72A prohibits service providers from disclosing personal information without consent. The 2011 Rules further elaborate on what constitutes 'sensitive personal data' and the procedures for collecting and processing such data."
    },
    {
      title: "Cyber Appellate Tribunal",
      description: "Establishes a tribunal to handle cyber disputes and grievances efficiently, ensuring specialized adjudication.",
      icon: "fa-gavel",
      image: "https://source.unsplash.com/800x600/?court,justice",
      details: "The Cyber Appellate Tribunal (CAT) was established under Section 48 of the IT Act to hear appeals against the decisions of the Adjudicating Officers. The tribunal has the same powers as a civil court and provides specialized adjudication for cyber disputes. Appeals from CAT go directly to the High Court."
    },
    {
      title: "Liabilities of Intermediaries",
      description: "Sets guidelines for intermediaries such as ISPs and social media platforms regarding data storage, content moderation, and liability.",
      icon: "fa-server",
      image: "https://source.unsplash.com/800x600/?server,network",
      details: "Section 79 provides 'safe harbor' protection to intermediaries, exempting them from liability for third-party information, data, or links made available by them, provided they follow due diligence and remove unlawful content upon notification. The 2021 IT Rules have further expanded intermediary obligations regarding content moderation and user grievances."
    },
    {
      title: "Penalties for Offenses",
      description: "Specifies fines and punishments for various offenses like hacking, data theft, and spreading harmful content online.",
      icon: "fa-exclamation-triangle",
      image: "https://source.unsplash.com/800x600/?law,penalty",
      details: "The Act prescribes various penalties for different offenses. For instance, hacking under Section 66 can lead to imprisonment up to 3 years or a fine up to ₹5 lakhs or both. Cyber terrorism under Section 66F can lead to life imprisonment. Section 67 dealing with publishing obscene material electronically can lead to imprisonment up to 5 years and fine up to ₹10 lakhs for repeat offenders."
    }
  ];

  const timelineEvents = [
    { year: "2000", event: "Original IT Act passed by Parliament" },
    { year: "2006", event: "Amendment proposed to address new types of cybercrimes" },
    { year: "2008", event: "IT Amendment Act passed, adding new sections on cyber terrorism and data protection" },
    { year: "2011", event: "Rules notified for reasonable security practices and sensitive personal data" },
    { year: "2021", event: "New IT Rules regarding social media intermediaries, OTT platforms, and digital news" }
  ];

  const caseStudies = [
    {
      title: "Shreya Singhal v. Union of India (2015)",
      summary: "Supreme Court struck down Section 66A of the IT Act as unconstitutional for violating freedom of speech."
    },
    {
      title: "Justice K.S. Puttaswamy v. Union of India (2017)",
      summary: "Privacy judgment that impacted interpretation of data protection provisions under the IT Act."
    },
    {
      title: "Facebook v. Union of India (2019)",
      summary: "Case related to traceability requirements for messaging platforms under the IT Act."
    }
  ];

  const faqs = [
    {
      question: "What is the IT Act?",
      answer: "The Information Technology Act, 2000 (IT Act) is India's primary legislation that deals with cybercrime and electronic commerce. It was enacted to provide legal recognition to electronic transactions and to facilitate e-governance."
    },
    {
      question: "What offenses are covered under the IT Act?",
      answer: "The IT Act covers various cybercrimes including hacking, data theft, identity theft, phishing, cyber terrorism, publishing obscene content electronically, unauthorized access to protected systems, and spreading computer viruses among others."
    },
    {
      question: "How does the IT Act protect user data?",
      answer: "Section 43A mandates companies to implement reasonable security practices to protect sensitive personal data. The Act also punishes disclosure of information in breach of lawful contract under Section 72A. The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, further elaborate on data protection requirements."
    },
    {
      question: "What are the penalties for hacking?",
      answer: "Under Section 66 of the IT Act, hacking (dishonestly or fraudulently accessing a computer system) can lead to imprisonment up to three years or a fine of up to five lakh rupees, or both."
    },
    {
      question: "How does the IT Act impact online businesses?",
      answer: "The IT Act provides legal recognition to electronic transactions, digital signatures, and electronic records, which facilitates e-commerce. It also imposes obligations on businesses regarding data protection, privacy policies, and security practices. Intermediaries like e-commerce platforms need to follow due diligence guidelines and have grievance redressal mechanisms in place."
    },
    {
      question: "Has the IT Act been amended recently?",
      answer: "While the core IT Act was last significantly amended in 2008, new Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules were notified in 2021, which substantially impact social media platforms, OTT services, and digital news outlets."
    },
    {
      question: "What role does the IT Act play in cybersecurity?",
      answer: "The IT Act forms the legal foundation for cybersecurity in India. It criminalizes various cyber attacks, establishes procedures for investigating cybercrimes, and mandates security practices for organizations. It also allows for the designation of critical information infrastructure and prescribes heightened security for such systems."
    }
  ];

  return (
    <div className="it-act-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Information Technology Act, 2000</h1>
          <p>India's Comprehensive Legal Framework for the Digital Age</p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-text">
              <h2>Empowering Digital India</h2>
              <p>
                The Information Technology Act, 2000 (IT Act) is India's primary law governing cyber activities and electronic commerce. Enacted on 17 October 2000, it provides legal recognition to electronic records and digital signatures, establishes a framework for e-governance, and sets penalties for various cyber offenses.
              </p>
              <p>
                As India's digital landscape evolves, the IT Act continues to be the cornerstone of regulatory efforts to promote a secure and efficient electronic ecosystem while addressing emerging challenges in cybersecurity and data protection.
              </p>
            </div>
            <div className="intro-stats">
              <div className="stat-card">
                <i className="fas fa-calendar-alt"></i>
                <h3>2000</h3>
                <p>Year Enacted</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-gavel"></i>
                <h3>94</h3>
                <p>Sections</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-history"></i>
                <h3>2008</h3>
                <p>Major Amendment</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-shield-alt"></i>
                <h3>20+</h3>
                <p>Cybercrimes Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Provisions Section */}
      <section className="key-provisions-section">
        <div className="container">
          <h2 className="section-title">Key Provisions</h2>
          <p className="section-description">
            The IT Act contains various provisions addressing different aspects of the digital ecosystem, from enabling e-governance to criminalizing cybercrimes and protecting sensitive data.
          </p>
          
          <div className="provision-cards">
            {keyProvisions.map((provision, index) => (
              <div className="provision-card" key={index} onClick={() => openModal(provision)}>
                <div className="card-icon">
                  <i className={`fas ${provision.icon}`}></i>
                </div>
                <h3>{provision.title}</h3>
                <p>{provision.description}</p>
                <span className="read-more">Learn more</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Evolution of the IT Act</h2>
          <div className="timeline">
            {timelineEvents.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-badge">{item.year}</div>
                <div className="timeline-content">
                  <p>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="tabs-section">
        <div className="container">
          <h2 className="section-title">Impact & Applications</h2>
          
          <div className="tabs">
            <div className="tab-headers">
              <button 
                className={activeTab === 0 ? "active" : ""} 
                onClick={() => setActiveTab(0)}
              >
                For Businesses
              </button>
              <button 
                className={activeTab === 1 ? "active" : ""} 
                onClick={() => setActiveTab(1)}
              >
                For Individuals
              </button>
              <button 
                className={activeTab === 2 ? "active" : ""} 
                onClick={() => setActiveTab(2)}
              >
                For Government
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 0 && (
                <div className="tab-pane">
                  <div className="tab-grid">
                    <div className="tab-image">
                      <img src="https://source.unsplash.com/800x600/?business,technology" alt="Business Technology" />
                    </div>
                    <div className="tab-text">
                      <h3>Implications for Businesses</h3>
                      <p>The IT Act provides the legal framework for e-commerce and digital transactions in India, enabling businesses to operate in the digital space with legal certainty.</p>
                      <ul>
                        <li>Legal recognition of electronic contracts and digital signatures</li>
                        <li>Framework for secure electronic records and payment systems</li>
                        <li>Obligations for handling sensitive personal data</li>
                        <li>Intermediary liability protections and requirements</li>
                        <li>Penalties for data breaches and security lapses</li>
                      </ul>
                      <p>Companies must implement reasonable security practices to protect sensitive personal data as mandated by Section 43A of the Act.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 1 && (
                <div className="tab-pane">
                  <div className="tab-grid">
                    <div className="tab-image">
                      <img src="https://source.unsplash.com/800x600/?user,privacy" alt="User Privacy" />
                    </div>
                    <div className="tab-text">
                      <h3>Protecting Individual Rights</h3>
                      <p>The IT Act provides various protections for individuals in the digital space, safeguarding privacy and offering recourse against cybercrimes.</p>
                      <ul>
                        <li>Protection against unauthorized access to personal data</li>
                        <li>Remedies for identity theft and impersonation</li>
                        <li>Prohibitions against publishing obscene or harmful content</li>
                        <li>Protection against intrusion into privacy</li>
                        <li>Compensation mechanisms for data breaches</li>
                      </ul>
                      <p>Individuals have the right to seek compensation for damages caused by unauthorized access to their personal data under Section 43 of the Act.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="tab-pane">
                  <div className="tab-grid">
                    <div className="tab-image">
                      <img src="https://source.unsplash.com/800x600/?government,digital" alt="Digital Governance" />
                    </div>
                    <div className="tab-text">
                      <h3>E-Governance Framework</h3>
                      <p>The IT Act provides the foundation for e-governance initiatives in India, enabling digital delivery of public services.</p>
                      <ul>
                        <li>Legal recognition for electronic filing of documents</li>
                        <li>Framework for digital signatures in government processes</li>
                        <li>Provisions for electronic gazette notifications</li>
                        <li>Legal backing for digital service delivery</li>
                        <li>Powers to designate and protect critical information infrastructure</li>
                      </ul>
                      <p>The Act empowers government departments to accept filings, applications, and other documents in electronic form, facilitating the Digital India initiative.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="case-studies-section">
        <div className="container">
          <h2 className="section-title">Landmark Cases</h2>
          <div className="case-studies-slider">
            {caseStudies.map((caseStudy, index) => (
              <div className="case-study-card" key={index}>
                <h3>{caseStudy.title}</h3>
                <p>{caseStudy.summary}</p>
                <a href="#" className="case-link">Read Full Case Analysis</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${openAccordion === index ? 'active' : ''}`} 
                  onClick={() => toggleAccordion(index)}
                >
                  {faq.question}
                  <span className="faq-icon">{openAccordion === index ? '−' : '+'}</span>
                </button>
                {openAccordion === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && selectedCard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2>{selectedCard.title}</h2>
            </div>
            <div className="modal-body">
              <img src={selectedCard.image} alt={selectedCard.title} className="modal-image" />
              <p>{selectedCard.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItActInfo;