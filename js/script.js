document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.nav-container');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navContainer.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navContainer.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Faixa de contenção (crime tape)
    const crimeTape = document.querySelector('.crime-tape-content');
    if (crimeTape) {
        // Duplicar o conteúdo para uma rolagem infinita suave
        crimeTape.innerHTML += crimeTape.innerHTML;

        // Ajustar velocidade da animação com base no tamanho da tela
        function adjustCrimeTapeSpeed() {
            const screenWidth = window.innerWidth;
            let duration = 20; // padrão em segundos
            
            if (screenWidth < 768) {
                duration = 15;
            } else if (screenWidth > 1400) {
                duration = 30;
            }
            
            crimeTape.style.animationDuration = `${duration}s`;
        }
        
        // Ajustar velocidade inicial
        adjustCrimeTapeSpeed();
        
        // Ajustar quando a janela é redimensionada
        window.addEventListener('resize', adjustCrimeTapeSpeed);
        
        // Pausar a animação quando o mouse está sobre a faixa
        crimeTape.addEventListener('mouseenter', () => {
            crimeTape.style.animationPlayState = 'paused';
        });
        
        crimeTape.addEventListener('mouseleave', () => {
            crimeTape.style.animationPlayState = 'running';
        });
        
        // Adicionar evento de clique aos itens da faixa
        document.querySelectorAll('.crime-tape-item').forEach(item => {
            item.addEventListener('click', function() {
                const skinName = this.textContent.trim();
                alert(`Você selecionou: ${skinName}`);
                // Aqui você pode adicionar código para mostrar skins relacionadas
            });
        });
    }

    // Carrossel de skins
    const skinsTrack = document.querySelector('.carousel-track');
    const skinCards = document.querySelectorAll('.skin-card');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (skinsTrack && skinCards.length > 0 && prevButton && nextButton) {
        // Mostrar os botões de navegação novamente
        prevButton.style.display = 'flex';
        nextButton.style.display = 'flex';
        
        // Limpar o carrossel e preservar apenas os 3 cards originais com os nomes corretos
        skinsTrack.innerHTML = '';
        
        // Criar os 3 cards com os nomes específicos
        const cardTypes = [
            { 
                type: 'GRUPO DE TRADE', 
                alt: 'CS2 Skin Trade', 
                class: 'trade-type',
                link: 'https://chat.whatsapp.com/EXW0oZujoCX6Hin9RmZE6g'
            },
            { 
                type: 'GRUPO DE PRÊMIOS', 
                alt: 'CS2 Skin Prêmios', 
                class: 'premios-type',
                link: 'https://chat.whatsapp.com/LwTCeWbwudv2KPh5nLbqme'
            },
            { 
                type: 'GRUPO DE RESENHA', 
                alt: 'CS2 Skin Resenha', 
                class: 'resenha-type',
                link: 'https://chat.whatsapp.com/K8bjskLCF9i2cHj5wXEvoe'
            }
        ];
        
        // Criar o conjunto inicial de cards
        cardTypes.forEach(cardType => {
            const card = document.createElement('div');
            card.className = 'skin-card';
            card.innerHTML = `
                <div class="skin-image">
                    <img src="images/card.png" alt="${cardType.alt}">
                </div>
                <div class="skin-info">
                    <span class="skin-tag trades ${cardType.class}">${cardType.type}</span>
                    <a href="${cardType.link}" target="_blank" class="skin-tag participate">PARTICIPE</a>
                </div>
            `;
            skinsTrack.appendChild(card);
        });
        
        // Adicionar duas cópias adicionais de cada card para criar um ciclo completo
        for (let i = 0; i < 2; i++) {
            cardTypes.forEach(cardType => {
                const card = document.createElement('div');
                card.className = 'skin-card';
                card.innerHTML = `
                    <div class="skin-image">
                        <img src="images/card.png" alt="${cardType.alt}">
                    </div>
                    <div class="skin-info">
                        <span class="skin-tag trades ${cardType.class}">${cardType.type}</span>
                        <a href="${cardType.link}" target="_blank" class="skin-tag participate">PARTICIPE</a>
                    </div>
                `;
                skinsTrack.appendChild(card);
            });
        }
        
        // Referência atualizada para todos os cards
        const allCards = document.querySelectorAll('.carousel-track .skin-card');
        const totalCards = allCards.length;
        
        // Começar pelo terceiro card (índice 2) para destacar RESENHA
        let currentIndex = 2;
        let isTransitioning = false;
        let autoPlayInterval = null;
        
        // Intervalo entre transições automáticas (3 segundos)
        const AUTO_PLAY_INTERVAL = 3000;
        
        // Atualizar classes para destacar os cards corretos
        function updateCardClasses() {
            allCards.forEach((card, index) => {
                // Remover todas as classes de estado anteriores
                card.classList.remove('active', 'prev', 'next', 'far');
                
                // Calcular a posição relativa ao card atual
                const distance = Math.abs((index - currentIndex + totalCards) % totalCards);
                
                if (distance === 0) {
                    // Card ativo (central)
                    card.classList.add('active');
                } else if (distance === 1) {
                    // Cards adjacentes (anterior e próximo)
                    if ((index - currentIndex + totalCards) % totalCards === 1) {
                        card.classList.add('next');
                    } else {
                        card.classList.add('prev');
                    }
                } else {
                    // Cards mais distantes
                    card.classList.add('far');
                }
            });
        }
        
        // Centralizar o carrossel no card atual
        function centerCarousel() {
            if (!allCards.length) return;
            
            const cardWidth = allCards[0].offsetWidth;
            const gapWidth = parseInt(window.getComputedStyle(skinsTrack).gap) || 40; // Ajustado para o novo gap
            const totalWidth = cardWidth + gapWidth;
            
            // Centralizar o card atual
            const containerWidth = document.querySelector('.carousel-container').offsetWidth;
            
            // Ajuste para garantir que o card ocupe a maior parte da tela
            const offset = -(currentIndex * totalWidth) + (containerWidth - cardWidth) / 2;
            
            skinsTrack.style.transform = `translateX(${offset}px)`;
        }
        
        // Ir para o próximo card sem resetar posição
        function goToNextCard() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex = (currentIndex + 1) % totalCards;
            updateCardClasses();
            centerCarousel();
            
            setTimeout(() => {
                isTransitioning = false;
            }, 700);
        }
        
        // Ir para o card anterior sem resetar posição
        function goToPrevCard() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCardClasses();
            centerCarousel();
            
            setTimeout(() => {
                isTransitioning = false;
            }, 700);
        }
        
        // Iniciar carrossel automático com mudança de direção suave
        function startAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            
            // Variável para controlar a direção do carrossel
            let direction = 'forward';
            
            autoPlayInterval = setInterval(() => {
                if (isTransitioning) return; // Evitar mudanças durante transições
                
                // Se estiver indo para frente e chegar no penúltimo card, mudar direção
                if (direction === 'forward' && currentIndex >= totalCards - 4) {
                    direction = 'backward';
                    goToPrevCard();
                } 
                // Se estiver indo para trás e chegar no segundo card, mudar direção
                else if (direction === 'backward' && currentIndex <= 1) {
                    direction = 'forward';
                    goToNextCard();
                }
                // Caso contrário, continuar na direção atual
                else {
                    if (direction === 'forward') {
                        goToNextCard();
                    } else {
                        goToPrevCard();
                    }
                }
            }, AUTO_PLAY_INTERVAL);
        }
        
        // Parar carrossel automático
        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }
        
        // Inicialização
        updateCardClasses();
        
        // Centralizar após o carregamento completo das imagens
        window.addEventListener('load', () => {
            centerCarousel();
            startAutoPlay();
        });
        
        // Ajustar ao redimensionar a janela
        window.addEventListener('resize', centerCarousel);
        
        // Botões de navegação
        prevButton.addEventListener('click', () => {
            stopAutoPlay();
            goToPrevCard();
            setTimeout(startAutoPlay, 4000);
        });
        
        nextButton.addEventListener('click', () => {
            stopAutoPlay();
            goToNextCard();
            setTimeout(startAutoPlay, 4000);
        });
        
        // Pausar ao interagir com o carrossel
        skinsTrack.addEventListener('mouseenter', stopAutoPlay);
        skinsTrack.addEventListener('touchstart', stopAutoPlay);
        
        // Retomar após interação
        skinsTrack.addEventListener('mouseleave', startAutoPlay);
        skinsTrack.addEventListener('touchend', startAutoPlay);
    }

    // Efeito de reveal ao scroll
    const revealElements = document.querySelectorAll('.hero, .skins-carousel, .members, .characters, .footer-content');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Executa uma vez ao carregar para verificar elementos já visíveis

    // Adiciona classe .active para elementos visíveis
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('active');
    });

    // Ações interativas para os cards de skins
    document.querySelectorAll('.skin-tag.participate').forEach(button => {
        button.removeEventListener('click', function(e) {
            e.preventDefault();
            alert('Você será redirecionado para o grupo de WhatsApp');
        });
    });

    document.querySelectorAll('.skin-tag.trades').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Você será redirecionado para a página de trades');
            // Adicionar aqui o redirecionamento real para a página de trades
        });
    });

    // Suaviza o scroll ao clicar em links internos e garante posicionamento preciso
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adiciona classe ativa ao link clicado e remove dos outros
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Calcula a posição exata considerando o header fixo
                const headerOffset = window.innerWidth <= 768 ? 85 : 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Atualiza o menu ativo durante a rolagem
    function updateActiveMenu() {
        const scrollPosition = window.scrollY;
        
        // Obtém todas as seções e seus offsets
        const sections = document.querySelectorAll('section[id]');
        const headerOffset = window.innerWidth <= 768 ? 85 : 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset - 5;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove a classe ativa de todos os links
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Adiciona a classe ativa ao link correspondente
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Atualiza o menu ativo durante a rolagem
    window.addEventListener('scroll', updateActiveMenu);
    
    // Executa uma vez ao carregar para definir o menu ativo inicial
    updateActiveMenu();

    // Efeito nos cards de membros
    const memberNames = document.querySelectorAll('.member-name');
    
    // Adicionar efeito de rotação aleatório aos nomes dos membros
    memberNames.forEach(name => {
        // Ângulo de rotação aleatório entre -5 e 5 graus
        const randomSkew = Math.floor(Math.random() * 10) - 5;
        name.style.transform = `skew(${randomSkew}deg)`;
        
        // Adicionar efeito de rotação suave no hover
        name.addEventListener('mouseenter', () => {
            name.style.transform = `skew(-15deg)`;
        });
        
        name.addEventListener('mouseleave', () => {
            name.style.transform = `skew(${randomSkew}deg)`;
        });
    });
    
    // Aplicar uma pequena animação adicional aos cards
    document.querySelectorAll('.member').forEach(member => {
        member.addEventListener('mouseenter', () => {
            const memberInfo = member.querySelector('.member-info');
            memberInfo.style.transform = 'skew(-15deg)';
        });
        
        member.addEventListener('mouseleave', () => {
            const memberInfo = member.querySelector('.member-info');
            memberInfo.style.transform = 'skew(0deg)';
        });
    });

    // Duplicar o conteúdo das faixas de membros para rolagem infinita
    document.querySelectorAll('.members-track').forEach(track => {
        // Duplicar o conteúdo para uma rolagem infinita suave
        track.innerHTML += track.innerHTML;
    });
    
    // Ajustar velocidade da animação das faixas de membros com base no tamanho da tela
    function adjustMembersSpeed() {
        const screenWidth = window.innerWidth;
        const tracks = document.querySelectorAll('.members-track');
        
        let duration = 20; // padrão em segundos
        
        if (screenWidth < 768) {
            duration = 15;
        } else if (screenWidth > 1400) {
            duration = 30;
        }
        
        tracks.forEach(track => {
            if (track.classList.contains('reverse')) {
                track.style.animationDuration = `${duration + 5}s`; // Um pouco mais lento para a direção reversa
            } else {
                track.style.animationDuration = `${duration}s`;
            }
        });
    }
    
    // Ajustar velocidade inicial
    adjustMembersSpeed();
    
    // Ajustar quando a janela é redimensionada
    window.addEventListener('resize', adjustMembersSpeed);
}); 