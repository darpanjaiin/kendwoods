document.addEventListener('DOMContentLoaded', function() {
    // Mobile view notice
    if (window.innerWidth > 480) {
        const notice = document.createElement('div');
        notice.className = 'mobile-view-notice';
        notice.innerHTML = '<i class="fas fa-mobile-alt"></i> This is a mobile view. For best experience, use your mobile device.';
        document.body.appendChild(notice);

        setTimeout(() => {
            notice.remove();
        }, 6000);
    }

    // Sticky Back Button for Modals
    const stickyBackBtn = document.querySelector('.sticky-back-btn');
    if (stickyBackBtn) {
        stickyBackBtn.addEventListener('click', function() {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        });

        // Check for open modals periodically and show/hide back button
        function checkForOpenModals() {
            const openModal = document.querySelector('.modal[style*="display: block"]');
            if (openModal) {
                stickyBackBtn.classList.add('visible');
            } else {
                stickyBackBtn.classList.remove('visible');
            }
        }

        // Run initially and then periodically check
        checkForOpenModals();
        setInterval(checkForOpenModals, 300);
    }

    // Modal functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            // Show sticky back button
            if (stickyBackBtn) {
                stickyBackBtn.classList.add('visible');
            }
            
            // Initialize collapsible menus when rules or amenities modal opens
            if (modalId === 'rules-modal' || modalId === 'amenities-modal') {
                initializeCollapsible(modal);
            }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            
            // Check if any other modals are still open
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            if (openModals.length === 0 && stickyBackBtn) {
                stickyBackBtn.classList.remove('visible');
            }
        }
    }

    // Button click handlers
    const buttonMappings = {
        'book-now-btn': 'book-now-modal',
        'book-now-footer-btn': 'book-now-modal',
        'reviews-btn': 'reviews-modal',
        'nearby-btn': 'nearby-modal',
        'emergency-btn': 'emergency-modal',
        'rules-btn': 'rules-modal',
        'specials-btn': 'specials-modal',
        'host-favorites': 'host-favorites-modal',
        'gallery-card': 'gallery-modal',
        'amenities-card': 'amenities-modal',
        'prices-card': 'prices-modal'
    };

    // Add click handlers for all buttons
    Object.entries(buttonMappings).forEach(([btnId, modalId]) => {
        const button = document.getElementById(btnId);
        if (button) {
            button.addEventListener('click', () => {
                console.log(`Button clicked: ${btnId} for modal: ${modalId}`);
                const modal = document.getElementById(modalId);
                if (modal) {
                    openModal(modalId);
                } else {
                    console.error(`Modal not found: ${modalId}`);
                }
            });
        } else {
            console.error(`Button not found: ${btnId}`);
        }
    });

    // Close button handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Share button functionality
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: "Kenwoods Farmstay - Digital Guidebook",
                text: 'Check out this amazing property in Vikramgad, Palghar!',
                url: window.location.href
            };

            // Try Web Share API first
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                    console.log('Shared successfully');
                } catch (err) {
                    console.log('Error sharing:', err);
                    fallbackShare();
                }
            } else {
                fallbackShare();
            }

            // Fallback sharing method - copy to clipboard
            function fallbackShare() {
                const tempInput = document.createElement('input');
                document.body.appendChild(tempInput);
                tempInput.value = window.location.href;
                tempInput.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        alert('URL copied to clipboard! You can now share it manually.');
                    } else {
                        alert('Unable to copy URL. Please copy the address manually from your browser.');
                    }
                } catch (err) {
                    console.error('Failed to copy URL', err);
                    alert('Unable to share. Please copy the URL manually from your browser.');
                }
                
                document.body.removeChild(tempInput);
            }
        });
    }

    // Collapsible menu functionality
    function initializeCollapsible(modalElement) {
        const headers = modalElement.querySelectorAll('.category-header');
        
        headers.forEach(header => {
            // Remove existing event listeners
            header.replaceWith(header.cloneNode(true));
            const newHeader = modalElement.querySelector(`[data-category="${header.dataset.category}"]`);
            
            newHeader.addEventListener('click', function() {
                const category = this.parentElement;
                const content = category.querySelector('.category-content');
                const icon = this.querySelector('i');
                
                // Close other categories
                const otherCategories = modalElement.querySelectorAll('.rule-category.active, .amenity-category.active');
                otherCategories.forEach(otherCategory => {
                    if (otherCategory !== category) {
                        otherCategory.classList.remove('active');
                        otherCategory.querySelector('.category-content').style.display = 'none';
                        otherCategory.querySelector('i').style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current category
                category.classList.toggle('active');
                if (category.classList.contains('active')) {
                    content.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    content.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // Gallery functionality
    function initializeGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                
                const closeBtn = document.createElement('span');
                closeBtn.className = 'lightbox-close';
                closeBtn.innerHTML = '&times;';
                
                lightbox.appendChild(lightboxImg);
                lightbox.appendChild(closeBtn);
                document.body.appendChild(lightbox);
                
                setTimeout(() => lightbox.classList.add('active'), 10);
                
                const closeLightbox = () => {
                    lightbox.classList.remove('active');
                    setTimeout(() => lightbox.remove(), 300);
                };
                
                closeBtn.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) closeLightbox();
                });
            });
        });
    }

    // Initialize gallery when gallery card is clicked
    const galleryCard = document.getElementById('gallery-card');
    if (galleryCard) {
        galleryCard.addEventListener('click', () => {
            setTimeout(initializeGallery, 100);
        });
    }

    // Gallery Filtering
    function initializeGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Show all items initially
        galleryItems.forEach(item => item.classList.add('show'));

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                    }
                });
            });
        });
    }

    // Initialize filters when gallery modal opens
    document.getElementById('gallery-card').addEventListener('click', () => {
        setTimeout(() => {
            initializeGalleryFilters();
            // Show all items initially
            document.querySelectorAll('.gallery-item').forEach(item => item.classList.add('show'));
        }, 100);
    });

    // Add this with your other event listeners
    document.getElementById('rooms-card').addEventListener('click', function() {
        document.getElementById('rooms-modal').style.display = 'block';
    });

    // Room Gallery functionality
    function initializeRoomGalleries() {
        const galleries = document.querySelectorAll('.room-image-gallery');
        
        galleries.forEach(gallery => {
            const images = gallery.querySelectorAll('img');
            const dots = gallery.querySelectorAll('.dot');
            const prevBtn = gallery.querySelector('.prev');
            const nextBtn = gallery.querySelector('.next');
            let currentIndex = 0;

            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                images[index].classList.add('active');
                dots[index].classList.add('active');
            }

            function nextImage() {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }

            function prevImage() {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            }

            prevBtn.addEventListener('click', e => {
                e.stopPropagation();
                prevImage();
            });

            nextBtn.addEventListener('click', e => {
                e.stopPropagation();
                nextImage();
            });

            dots.forEach((dot, index) => {
                dot.addEventListener('click', e => {
                    e.stopPropagation();
                    currentIndex = index;
                    showImage(currentIndex);
                });
            });
        });
    }

    // Initialize galleries when rooms modal opens
    document.getElementById('rooms-card').addEventListener('click', () => {
        setTimeout(initializeRoomGalleries, 100);
    });

    // Hero Slider functionality
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    const slideInterval = 6000; // Change slide every 6 seconds (increased from 5s)
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Start the slideshow with a slight initial delay
    setTimeout(() => {
        setInterval(nextSlide, slideInterval);
    }, 1000);

    // Villa tabs in Rooms Modal
    const villaTabs = document.querySelectorAll('.villa-tab');
    const villaSections = document.querySelectorAll('.villa-section');
    
    villaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetVilla = tab.getAttribute('data-villa');
            
            // Update active tab
            villaTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected villa section
            villaSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetVilla}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Room sliders functionality
    function initializeRoomSliders() {
        const villaSliders = document.querySelectorAll('.villa-slider');
        
        villaSliders.forEach(slider => {
            const sliderWrapper = slider.querySelector('.slider-wrapper');
            const images = slider.querySelectorAll('.slider-image');
            const prevBtn = slider.querySelector('.slider-nav.prev');
            const nextBtn = slider.querySelector('.slider-nav.next');
            const thumbnails = slider.querySelectorAll('.thumbnail');
            const counter = slider.querySelector('.slider-counter');
            
            let currentIndex = 0;
            const totalImages = images.length;
            
            // Update counter
            function updateCounter() {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }
            
            // Show image by index
            function showImage(index) {
                // Hide all images
                images.forEach(img => img.classList.remove('active'));
                
                // Show selected image
                images[index].classList.add('active');
                
                // Update thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                if (thumbnails[index]) {
                    thumbnails[index].classList.add('active');
                }
                
                // Update counter
                updateCounter();
            }
            
            // Next slide
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalImages;
                showImage(currentIndex);
            });
            
            // Previous slide
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                showImage(currentIndex);
            });
            
            // Thumbnail click
            thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    currentIndex = index;
                    showImage(currentIndex);
                });
            });
            
            // Initialize counter
            updateCounter();
        });
    }

    // Initialize sliders when rooms modal is opened
    document.getElementById('rooms-card').addEventListener('click', function() {
        setTimeout(initializeRoomSliders, 100); // Small delay to ensure DOM is ready
    });

    // Also initialize if modal is already open (for refreshes)
    if (document.getElementById('rooms-modal').style.display === 'block') {
        initializeRoomSliders();
    }

    // Gallery modal functionality
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const gallerySections = document.querySelectorAll('.gallery-section');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs and sections
            galleryTabs.forEach(tab => tab.classList.remove('active'));
            gallerySections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            this.classList.add('active');
            document.getElementById(`${category}-section`).classList.add('active');
        });
    });
    
    // Gallery sliders
    const gallerySliders = document.querySelectorAll('.gallery-section .gallery-slider');
    
    gallerySliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        const prevBtn = slider.querySelector('.slider-nav.prev');
        const nextBtn = slider.querySelector('.slider-nav.next');
        const counter = slider.querySelector('.slider-counter');
        const thumbnails = slider.querySelectorAll('.thumbnail');
        
        let currentIndex = 0;
        const totalImages = images.length;
        
        // Update slider
        function updateSlider() {
            images.forEach(img => img.classList.remove('active'));
            images[currentIndex].classList.add('active');
            
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            if (thumbnails[currentIndex]) {
                thumbnails[currentIndex].classList.add('active');
            }
            
            counter.textContent = `${currentIndex + 1} / ${totalImages}`;
        }
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateSlider();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % totalImages;
                updateSlider();
            });
        }
        
        // Thumbnail clicks
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                currentIndex = index;
                updateSlider();
            });
        });
        
        // Initialize
        updateSlider();
    });
    
    // "View Detailed Room Images" button
    const viewRoomsBtn = document.getElementById('view-rooms-from-gallery');
    if (viewRoomsBtn) {
        viewRoomsBtn.addEventListener('click', function() {
            // Close gallery modal
            document.getElementById('gallery-modal').style.display = 'none';
            
            // Open rooms modal
            document.getElementById('rooms-modal').style.display = 'block';
        });
    }
}); 