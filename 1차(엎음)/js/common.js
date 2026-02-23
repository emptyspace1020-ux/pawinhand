document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.header nav');
    const topIcons = document.querySelector('.header .right .top');
    const mainSection = document.querySelector('.main .cont');
    const ham = document.getElementById('ham');
    const closeBtn = document.querySelector('.close_btn');
    const header = document.querySelector('.header');
    const hamOpen = document.querySelector('.ham_open');
    const mainMenuItems = document.querySelectorAll('.main_menu > ul > li');
    const subMenuUl = document.querySelector('.sub_menu ul');
    let lastScrollTop = 0;

    const handleScroll = () => {
        if (!mainSection) return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const triggerPoint = mainSection.offsetHeight * 0.8;

        if (scrollTop > lastScrollTop) {
            if (scrollTop > triggerPoint) {
                nav.classList.add('hide');
                topIcons.classList.add('hide');
            }
        } else {
            nav.classList.remove('hide');
            topIcons.classList.remove('hide');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    if (mainSection) {
        window.addEventListener('scroll', handleScroll);
    }

    ham.addEventListener('click', () => {
        header.classList.add('on');
        document.body.classList.add('lock');
        mainMenuItems.forEach(item => item.classList.remove('active'));
        subMenuUl.innerHTML = '';
        subMenuUl.style.opacity = '0';
    });

    closeBtn.addEventListener('click', () => {
        header.classList.remove('on');
        document.body.classList.remove('lock');
    });

    hamOpen.addEventListener('click', (e) => {
        if (e.target === hamOpen) {
            header.classList.remove('on');
            document.body.classList.remove('lock');
        }
    });

    mainMenuItems.forEach((li) => {
        li.addEventListener('mouseenter', () => {
            mainMenuItems.forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            const targetData = li.querySelector('.sub_data');
            if (targetData) {
                const content = targetData.innerHTML;
                subMenuUl.style.opacity = '0';
                subMenuUl.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    subMenuUl.innerHTML = content;
                    subMenuUl.style.opacity = '1';
                    subMenuUl.style.transform = 'translateY(0)';
                }, 150);
            }
        });

        li.addEventListener('click', (e) => {
            if (window.innerWidth > 1024) {
                e.preventDefault();
            }
        });
    });
});