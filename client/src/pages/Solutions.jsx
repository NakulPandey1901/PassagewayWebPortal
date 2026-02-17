import React, { useState } from 'react';

const Solutions = () => {
    const [activeTab, setActiveTab] = useState('energy');

    const solutionsData = {
        energy: [
            {
                id: '01',
                title: 'Smart Grid Data Hub',
                desc: 'Enterprise-grade ETL pipelines consolidating metering logs, ERP systems, and production data into a scalable warehouse. Enables end-to-end traceability and real-time operational KPI tracking.',
                tags: ['Big Data ETL', 'Data Warehouse', 'Operational Intelligence']
            },
            {
                id: '02',
                title: 'Industrial IoT Execution System (MES)',
                desc: 'Real-time shop-floor monitoring architecture. Ingests high-frequency sensor data to visualize production flows, detect bottlenecks, and optimize manufacturing throughput.',
                tags: ['IIoT', 'Process Analytics', 'Real-time Telemetry']
            },
            // ... more energy items from HTML
            {
                id: '03',
                title: 'AI-Driven Supply Chain Optimization',
                desc: 'Predictive analytics engine for inventory management and demand sensing. Leverages machine learning to reduce stockouts and optimize warehouse distribution logistics.',
                tags: ['Predictive Modeling', 'Smart Inventory', 'Logistics AI']
            },
            {
                id: '04',
                title: 'Automated Defect Recognition (ADR)',
                desc: 'High-speed computer vision pipelines for quality assurance. Deploys OCR and object detection models to identify labeling errors and packaging defects in real-time.',
                tags: ['Computer Vision', 'Automated QA', 'Deep Learning']
            },
            {
                id: '05',
                title: 'Asset Tracking & Recognition',
                desc: 'Vision-based monitoring system for industrial equipment and components. Automates asset tracking on the shop floor to ensure compliance and workflow continuity.',
                tags: ['Object Detection', 'Asset Mgmt', 'Industrial Vision']
            },
            {
                id: '06',
                title: 'Energy Data Integration Platform (VEDA)',
                desc: 'Centralized data unification layer for regional energy systems. Breaks down silos between generation, transmission, and consumption data for holistic performance reporting.',
                tags: ['Data Integration', 'Grid Analytics', 'Unified Reporting']
            },
            {
                id: '07',
                title: 'Advanced Metering Infrastructure (AMI) Analytics',
                desc: 'Big data analytics for smart meter ecosystems. Unlocks insights into consumption patterns, load forecasting, and revenue protection mechanisms.',
                tags: ['AMI', 'Load Forecasting', 'Revenue Protection']
            }
        ],
        fintech: [
            {
                id: '01',
                title: 'Multi-Broker Trading Platform',
                desc: 'Unified trading interface integrating multiple brokerage APIs with real-time market data ingestion. Provides centralized portfolio tracking, order execution, and analytics across brokers.',
                tags: ['API Integration', 'Real-time Data', 'Trading Infrastructure']
            },
            {
                id: '02',
                title: 'Investment Education & Analytics Platform',
                desc: 'AI-powered financial analytics platform with stock screeners, watchlists, and learning modules. Enables market analysis and decision-making using structured financial datasets and ML insights.',
                tags: ['Machine Learning', 'Financial Analytics', 'Market Analysis']
            },
            {
                id: '03',
                title: 'Banking Operations Hub',
                desc: 'Comprehensive suite for employee mapping, service desk management, and HR analytics. Optimizes operational efficiency and benchmarking.',
                tags: ['HR Analytics', 'Ops Optimization', 'AI Quality Checks']
            },
            {
                id: '04',
                title: 'Loan Lifecycle Management',
                desc: 'End-to-end solution covering Loan Origination (LOS) and Loan Management (LMS). Streamlines portfolio management and tracking.',
                tags: ['Loan Origination', 'Portfolio Mgmt', 'LMS']
            },
            {
                id: '05',
                title: 'Risk & Audit Vigilance',
                desc: 'Advanced monitoring platform for functional and operational audits. Includes branch scorecards and vigilance analytics.',
                tags: ['Risk Mgmt', 'Audit Architecture', 'Fraud Detection']
            },
            {
                id: '06',
                title: 'Financial Reporting Core',
                desc: 'Centralized data lake integration for demand, incentives, and income management. Unified reporting for strategic decisions.',
                tags: ['Data Lake', 'Reporting', 'Financial BI']
            }
        ],
        automotive: [
            {
                id: '01',
                title: 'Warranty KPI Development Project',
                desc: 'Developed backend data models and KPI datasets for warranty, service, and dealer performance analytics. Optimized SQL transformations and reporting layers supporting operational dashboards.',
                tags: ['Data Modeling', 'SQL Optimization', 'KPI Analytics']
            },
            {
                id: '02',
                title: 'Automotive Service Recommendation Dashboard',
                desc: 'Developed dashboard allowing users to query vehicle service requirements using prompts. Integrated analytics datasets with recommendation logic for service insights.',
                tags: ['NLP', 'Recommendation Engine', 'Analytics']
            },
            {
                id: '03',
                title: 'Service Contract Package Pricing',
                desc: 'Designed pricing analytics models for vehicle service contract packages. Enabled data-driven pricing decisions using historical service and cost datasets.',
                tags: ['Pricing Analytics', 'Data Modeling', 'Business Intelligence']
            },
            {
                id: '04',
                title: 'After-Sales Analytics Suite',
                desc: 'Holistic platform for warranty control, claim surveillance, and damage selection. Includes predictive pricing and repeat repair recognition.',
                tags: ['Warranty Control', 'Claim Surveillance', 'Predictive Pricing']
            },
            {
                id: '05',
                title: 'Connected Vehicle Intelligence',
                desc: 'Real-time insights for fault prediction, dealer activation, and vehicle network analysis. Optimizes service reminders and fuel monitoring.',
                tags: ['Fault Prediction', 'IoT Analytics', 'Network Analysis']
            },
            {
                id: '06',
                title: 'Automotive Customer 360',
                desc: 'Integrated system for customer acquisition, retention, and campaign management. Unifies payment data and call center insights.',
                tags: ['Customer Acquisition', 'Retention', 'Campaign Mgmt']
            },
            {
                id: '07',
                title: 'Remanufactured Parts Pricing',
                desc: 'Analytics for core operation management and parts feasibility. Forecasts returns and demand for optimal pricing strategies.',
                tags: ['Demand Forecasting', 'Pricing Strategy', 'Inventory Optimization']
            }
        ],
        ai: [
            {
                id: '01',
                title: 'Industrial Spatial Assistant',
                desc: 'Enterprise multi-agent system for AR smart glasses. Integrates computer vision with intelligent web agents to provide real-time, context-aware guidance for field technicians.',
                tags: ['Multi-Agent AI', 'Smart Glasses', 'Assisted Reality']
            }
        ]
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Projects that moved the needle</h1>
                <p className="page-subtitle">A selection of our recent engagements — each representing a real business challenge
                    solved with rigorous analytics and clear delivery.</p>
            </div>

            <section className="solutions-section fade-in">
                <div className="industry-tabs">
                    {['energy', 'fintech', 'automotive', 'ai'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'ai' ? 'Spatial Computing' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="solutions-content">
                    {solutionsData[activeTab].map(item => (
                        <div key={item.id} className="solution-card">
                            <div className="solution-number">{item.id}</div>
                            <div className="solution-details">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <div className="solution-tech">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="tech-badge">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Solutions;
