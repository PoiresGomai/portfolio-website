// Main JavaScript for Portfolio Website

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTop = document.querySelector('.back-to-top');

    // Function to handle scroll events
    function handleScroll() {
        // Add background to navbar on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            // For resume page, don't remove the scrolled style to keep background visible
            if (!window.location.href.includes('resume.html')) {
                navbar.classList.remove('scrolled');
            }
            backToTop.classList.remove('active');
        }

        // Update active nav link based on scroll position
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Ensure navbar has background on resume page immediately
    if (window.location.href.includes('resume.html')) {
        navbar.classList.add('scrolled');
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call once on load to set initial state
    handleScroll();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset based on navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');

                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // Contact form submission with validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic form validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            let isValid = true;

            [name, email, subject, message].forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                // Simulate form submission with success message
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    // Reset form
                    contactForm.reset();

                    // Show success alert
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert alert-success mt-3 animated fadeIn';
                    successAlert.innerHTML = '<i class="fas fa-check-circle me-2"></i> Your message has been sent successfully!';
                    contactForm.appendChild(successAlert);

                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Remove validation classes
                    [name, email, subject, message].forEach(field => {
                        field.classList.remove('is-valid');
                    });

                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        successAlert.classList.add('fadeOut');
                        setTimeout(() => {
                            successAlert.remove();
                        }, 500);
                    }, 5000);
                }, 2000);
            }
        });

        // Real-time validation
        const formFields = contactForm.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('blur', function () {
                if (!this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    // Animate skill progress bars when in view
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar');

    if (skillsSection && progressBars.length) {
        const animateProgressBars = () => {
            const sectionTop = skillsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.75) {
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });

                // Remove event listener once animation is triggered
                window.removeEventListener('scroll', animateProgressBars);
            }
        };

        // Initial check
        animateProgressBars();

        // Add scroll event for animation
        window.addEventListener('scroll', animateProgressBars);
    }

    // Project hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.classList.add('hovered');
        });

        card.addEventListener('mouseleave', function () {
            this.classList.remove('hovered');
        });
    });

    // Image loading optimization
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Check if the image is not yet loaded
        if (!img.complete) {
            img.classList.add('img-loading');

            img.addEventListener('load', function () {
                img.classList.remove('img-loading');
                img.classList.add('img-loaded');
            });

            img.addEventListener('error', function () {
                img.classList.remove('img-loading');
                img.classList.add('img-error');
            });
        }
    });

    // Project Filter Functionality
    // Project filtering
    const filterItems = document.querySelectorAll('.filter-item');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all filter items
            filterItems.forEach(filter => filter.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(project => {
                // Reset styles first to avoid transition issues
                project.style.display = '';
                project.style.opacity = '';
                project.style.transform = '';
                
                const projectCategory = project.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === projectCategory) {
                    // Show the project
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide the project
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize all projects as visible when page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Get the "All" filter button
        const allFilterButton = document.querySelector('.filter-item[data-filter="all"]');
        
        // If it exists, set it as active and show all projects
        if (allFilterButton) {
            // Trigger a click on the "All" filter to initialize properly
            allFilterButton.click();
        } else {
            // Fallback if the "All" button doesn't exist
            document.querySelectorAll('.project-item').forEach(project => {
                project.style.display = 'block';
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            });
        }
    });
    
    // Project Details Modal
    const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
    const projectDetailsBtns = document.querySelectorAll('.project-details-btn');
    const modalContent = document.querySelector('.project-modal-content');
    
    // Project details data
    const projectDetails = {
        'network-detection': {
            title: 'Network Intrusion Detection System',
            category: 'AI / Machine Learning',
            year: '2023',
            client: 'University Research',
            description: `
                <p>This deep learning-based network intrusion detection system was developed to identify and prevent malicious network activities in real-time. It uses advanced neural network architectures to analyze network traffic patterns and detect anomalies with high accuracy.</p>
                <p>The system was trained on the NSL-KDD dataset and achieves over 98% accuracy in identifying various types of network attacks including DDoS, port scanning, and brute force attempts.</p>
            `,
            challenge: 'The main challenge was optimizing the neural network architecture to process large volumes of network traffic data in real-time while maintaining high detection accuracy.',
            solution: 'I implemented a hybrid CNN-LSTM architecture that efficiently processes sequential network flow data while capturing spatial features, leading to improved detection rates and reduced false positives.',
            technologies: ['Python 3.9', 'TensorFlow 2.8', 'Scikit-learn', 'Pandas', 'NumPy', 'Flask API'],
            images: [
                'images/projects/network-detection.jpg',
                'images/projects/network-detection.jpg',
                'images/projects/network-detection.jpg'
            ],
            links: {
                live: '#',
                github: '#',
                paper: '#'
            }
        },
        'library': {
            title: 'Library Management System',
            category: 'Web Application',
            year: '2023',
            client: 'City Public Library',
            description: `
                <p>A comprehensive library management system designed to streamline book lending, returns, and inventory management processes for a public library.</p>
                <p>The system includes features for user management, book cataloging, barcode scanning, reservation system, and automated notifications for due dates.</p>
            `,
            challenge: 'The library needed to transition from an outdated paper-based system to a digital solution while ensuring ease of use for staff with limited technical background.',
            solution: 'I designed an intuitive interface with clear workflows and implemented comprehensive onboarding training for library staff, resulting in a smooth transition with minimal disruption to library operations.',
            technologies: ['Ruby on Rails 7', 'PostgreSQL', 'Bootstrap 5', 'Hotwire', 'Stimulus.js', 'Redis'],
            images: [
                'images/projects/library-management.jpg',
                'images/projects/library-management.jpg',
                'images/projects/library-management.jpg'
            ],
            links: {
                live: '#',
                github: '#'
            }
        },
        'forum': {
            title: 'Forum Discussion System',
            category: 'Web Application',
            year: '2022',
            client: 'Online Community Platform',
            description: `
                <p>A robust forum platform that enables users to create topics, post comments, and engage in threaded discussions. The system supports rich text formatting, file attachments, and real-time notifications.</p>
                <p>The forum includes features like user profiles, reputation systems, moderation tools, topic categorization, and advanced search capabilities.</p>
            `,
            challenge: 'Building a scalable real-time comment system that could handle high traffic while maintaining performance and preventing spam was particularly challenging.',
            solution: 'I implemented ActionCable for WebSocket connections and designed a sophisticated caching system using Redis that significantly reduced database load and improved page load times by 60%.',
            technologies: ['Ruby on Rails', 'ActionCable', 'MySQL', 'Redis', 'jQuery', 'Bootstrap'],
            images: [
                'images/projects/discussion-forum.jpg',
                'images/projects/discussion-forum.jpg',
                'images/projects/discussion-forum.jpg'
            ],
            links: {
                live: '#',
                github: '#'
            }
        },
        'elevator': {
            title: 'Elevator Management System',
            category: 'IoT System',
            year: '2022',
            client: 'Commercial Building Management',
            description: `
                <p>An intelligent elevator control and management system that optimizes elevator routing and scheduling in multi-story buildings to reduce wait times and energy consumption.</p>
                <p>The system uses predictive algorithms to anticipate traffic patterns based on historical data and adapts routing strategies accordingly.</p>
            `,
            challenge: 'Creating an efficient algorithm for real-time elevator dispatching that could handle varying traffic patterns while minimizing wait times and energy usage.',
            solution: 'I developed a custom machine learning model that analyzes historical usage patterns to predict high-traffic periods and optimizes elevator positioning, reducing average wait times by 37%.',
            technologies: ['Ruby on Rails', 'JavaScript', 'Redis', 'Python', 'TensorFlow', 'IoT Sensors'],
            images: [
                'images/projects/elevator-system.jpg',
                'images/projects/elevator-system.jpg',
                'images/projects/elevator-system.jpg'
            ],
            links: {
                live: '#',
                github: '#'
            }
        },
        'ecommerce': {
            title: 'E-commerce Platform',
            category: 'Web Application',
            year: '2023',
            client: 'Retail Business',
            description: `
                <p>A full-featured e-commerce platform built with React and Vite that provides an intuitive shopping experience with fast page loads and seamless checkout process.</p>
                <p>The platform includes inventory management, payment processing, user accounts, order tracking, product recommendations, and comprehensive analytics.</p>
            `,
            challenge: 'Designing a highly performant and responsive user interface that could maintain speed even with large product catalogs and high concurrent user counts.',
            solution: 'I utilized React\'s virtual DOM with efficient state management and implemented code splitting, lazy loading, and service workers to achieve a Lighthouse performance score of 96/100.',
            technologies: ['React', 'Vite', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Firebase'],
            images: [
                'images/projects/ecommerce.jpg',
                'images/projects/ecommerce.jpg',
                'images/projects/ecommerce.jpg'
            ],
            links: {
                live: '#',
                github: '#'
            }
        },
        'scholarship': {
            title: 'Scholarship Gathering Website',
            category: 'Web Platform',
            year: '2022',
            client: 'Educational Nonprofit',
            description: `
                <p>A comprehensive scholarship aggregation platform that collects and organizes scholarship opportunities from multiple sources to help students find financial aid more easily.</p>
                <p>The platform features personalized scholarship matching, application deadline tracking, requirement checklists, and automated notifications for new opportunities.</p>
            `,
            challenge: 'Developing a reliable data scraping system that could accurately aggregate scholarship information from hundreds of different websites with varying structures and formats.',
            solution: 'I created an advanced web scraper with machine learning capabilities that can identify and extract structured data from diverse sources with 95% accuracy, supplying the platform with over 10,000 scholarships.',
            technologies: ['React', 'Vite', 'Firebase', 'Node.js', 'Python', 'BeautifulSoup', 'TensorFlow'],
            images: [
                'images/projects/scholarship.jpg',
                'images/projects/scholarship.jpg',
                'images/projects/scholarship.jpg'
            ],
            links: {
                live: '#',
                github: '#'
            }
        },
        'suppliers': {
            title: 'Chinese Suppliers Repository',
            category: 'Web Application',
            year: '2022',
            client: 'International Trade Company',
            description: `
                <p>A comprehensive directory and management system for Chinese manufacturers and suppliers, designed to streamline the sourcing process for international businesses.</p>
                <p>The platform features advanced search filters, supplier verification, product categorization, quotation requests, and communication tools to connect buyers with qualified suppliers across various industries.</p>
            `,
            challenge: 'The main challenge was creating a reliable verification system for suppliers and managing large datasets of product information in multiple languages, particularly Chinese and English.',
            solution: 'I implemented a multi-step verification process with document upload capabilities and developed a custom database structure optimized for bilingual content and rapid search across thousands of supplier profiles.',
            technologies: ['PHP 7.4', 'MySQL', 'jQuery', 'Bootstrap 4', 'AJAX', 'Baidu Maps API', 'WeChat Integration'],
            images: [
                'images/projects/suppliers.jpg',
                'images/projects/suppliers.jpg',
                'images/projects/suppliers.jpg'
            ],
            links: {
                live: '#',
                github: '#'
            }
        }
    };
    
    projectDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectDetails[projectId];
            
            if (project) {
                // Build modal content
                let modalHTML = `
                    <div class="project-modal-header">
                        <span class="project-category">${project.category}</span>
                        <h2 class="mb-3">${project.title}</h2>
                        <div class="project-meta mb-4">
                            <span><i class="far fa-calendar-alt me-2"></i>Year: ${project.year}</span>
                            <span><i class="far fa-building me-2"></i>Client: ${project.client}</span>
                        </div>
                    </div>
                    
                    <div class="project-modal-gallery mb-4">
                        ${project.images.map(img => `
                            <div class="modal-gallery-img">
                                <img src="${img}" alt="${project.title}" class="img-fluid">
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="project-modal-description">
                        <h4 class="mb-3">Project Overview</h4>
                        ${project.description}
                        
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <h5>Challenge</h5>
                                <p>${project.challenge}</p>
                            </div>
                            <div class="col-md-6">
                                <h5>Solution</h5>
                                <p>${project.solution}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-modal-tech">
                        <h4 class="mb-3">Technologies Used</h4>
                        <ul class="tech-list">
                            ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-modal-links">
                        <div class="d-flex gap-2">
                            ${project.links.live ? `<a href="${project.links.live}" class="btn btn-primary" target="_blank"><i class="fas fa-external-link-alt me-2"></i>View Live Demo</a>` : ''}
                            ${project.links.github ? `<a href="${project.links.github}" class="btn btn-outline-dark" target="_blank"><i class="fab fa-github me-2"></i>View Source Code</a>` : ''}
                            ${project.links.paper ? `<a href="${project.links.paper}" class="btn btn-outline-primary" target="_blank"><i class="fas fa-file-alt me-2"></i>Read Paper</a>` : ''}
                        </div>
                    </div>
                `;
                
                // Set modal content and show modal
                modalContent.innerHTML = modalHTML;
                projectModal.show();
            }
        });
    });
});

// EmailJS initialization
(function () {
    // Initialize EmailJS with your public key
    emailjs.init("7FFhSDZ_1UvAkT8IB"); // Replace with your actual EmailJS public key
})();

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Check if the honeypot field is filled (spam detection)
            const honeypotField = document.getElementById('honeypot');
            if (honeypotField && honeypotField.checked) {
                console.log("Bot detected");
                return false;
            }

            // Get form elements
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const submitBtn = document.getElementById('submit-btn') || contactForm.querySelector('button[type="submit"]');
            const submitText = document.getElementById('submit-text');
            const submitSpinner = document.getElementById('submit-spinner');
            const formMessages = document.getElementById('form-messages');

            if (!name || !email || !subject || !message || !submitBtn) {
                console.error("Required form elements are missing");
                return;
            }

            // Validate form
            let isValid = true;

            [name, email, subject, message].forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                if (submitText) {
                    submitText.textContent = 'Sending...';
                } else {
                    // Fallback if submitText element doesn't exist
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
                }
                
                submitBtn.disabled = true;
                
                if (submitSpinner) {
                    submitSpinner.classList.remove('d-none');
                }

                // Prepare template parameters
                const templateParams = {
                    name: name.value,
                    email: email.value,
                    subject: subject.value,
                    message: message.value,
                    to_email: 'contact@bizkeyz.com'
                };

                // Send email using EmailJS
                emailjs.send('service_ghxeavj', 'template_z8lu9hp', templateParams)
                    .then(function (response) {
                        console.log('Email sent successfully:', response);

                        // Show success message
                        if (formMessages) {
                            formMessages.innerHTML = '<div class="alert alert-success">Your message has been sent successfully!</div>';
                        } else {
                            // Fallback if formMessages element doesn't exist
                            const successAlert = document.createElement('div');
                            successAlert.className = 'alert alert-success mt-3';
                            successAlert.innerHTML = '<i class="fas fa-check-circle me-2"></i> Your message has been sent successfully!';
                            contactForm.appendChild(successAlert);
                        }

                        // Reset form
                        contactForm.reset();
                        [name, email, subject, message].forEach(field => {
                            field.classList.remove('is-valid');
                        });

                        // Reset button
                        if (submitText) {
                            submitText.textContent = 'Send Message';
                        } else {
                            submitBtn.innerHTML = 'Send Message';
                        }
                        
                        submitBtn.disabled = false;
                        
                        if (submitSpinner) {
                            submitSpinner.classList.add('d-none');
                        }

                        // Remove success message after 5 seconds
                        setTimeout(() => {
                            if (formMessages) {
                                formMessages.innerHTML = '';
                            } else {
                                const alerts = contactForm.querySelectorAll('.alert');
                                alerts.forEach(alert => alert.remove());
                            }
                        }, 5000);
                    })
                    .catch(function (error) {
                        console.error('Email sending failed:', error);

                        // Show error message
                        if (formMessages) {
                            formMessages.innerHTML = '<div class="alert alert-danger">Sorry! There was a problem sending your message. Please try again.</div>';
                        } else {
                            // Fallback if formMessages element doesn't exist
                            const errorAlert = document.createElement('div');
                            errorAlert.className = 'alert alert-danger mt-3';
                            errorAlert.innerHTML = 'Sorry! There was a problem sending your message. Please try again.';
                            contactForm.appendChild(errorAlert);
                        }

                        // Reset button
                        if (submitText) {
                            submitText.textContent = 'Send Message';
                        } else {
                            submitBtn.innerHTML = 'Send Message';
                        }
                        
                        submitBtn.disabled = false;
                        
                        if (submitSpinner) {
                            submitSpinner.classList.add('d-none');
                        }
                    });
            }
        });

        // Real-time validation
        const formFields = contactForm.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('blur', function () {
                if (field.id === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value) && field.value.trim() !== '') {
                        field.classList.add('is-invalid');
                    } else if (field.value.trim() === '') {
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                        field.classList.add('is-valid');
                    }
                } else {
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                        field.classList.add('is-valid');
                    }
                }
            });
        });
    }
});

// Preloader
window.addEventListener('load', function () {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
