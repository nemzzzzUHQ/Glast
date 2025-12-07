// app.js - interactions + lightweight particles background
(function (){
    // NAV interaction
    const navButtons = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.panel');
    const ctaButtons = document.querySelectorAll('.cta');

    function activateSection(id){
        panels.forEach(p => p.classList.remove('active'));
        const el = document.getElementById(id);
        if(el) el.classList.add('active');
        // update nav active state
        navButtons.forEach(b=> b.classList.toggle('active', b.dataset.section === id));
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', ()=>{
            const target = btn.dataset.section;
            if(!target) return;
            activateSection(target);
        });
    });

    ctaButtons.forEach(cta => {
        cta.addEventListener('click', ()=>{
            const target = cta.dataset.section || 'join';
            activateSection(target);
        });
    });

    // Simple particle/nebula background on canvas
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    const particles = [];
    const PARTICLE_COUNT = Math.max(30, Math.floor((w*h)/60000)); // scale with screen

    function rand(min, max){ return Math.random()*(max-min)+min; }

    class Particle {
        constructor(){
            this.reset();
        }
        reset(){
            this.x = rand(0,w);
            this.y = rand(0,h);
            this.r = rand(12,60);
            this.vx = rand(-0.1,0.1);
            this.vy = rand(-0.05,0.05);
            this.alpha = rand(0.06,0.22);
            this.hue = rand(250,290); // purple spectrum
        }
        step(){
            this.x += this.vx;
            this.y += this.vy;
            if(this.x < -200 || this.x > w+200 || this.y < -200 || this.y > h+200){
                this.reset();
                this.x = rand(0,w);
                this.y = rand(0,h);
            }
        }
        draw(ctx){
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            g.addColorStop(0, `hsla(${this.hue},80%,70%,${this.alpha})`);
            g.addColorStop(0.4, `hsla(${this.hue},70%,55%,${this.alpha*0.6})`);
            g.addColorStop(1, `hsla(${this.hue},60%,35%,0)`);
            ctx.beginPath();
            ctx.fillStyle = g;
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            ctx.fill();
        }
    }

    function initParticles(){
        particles.length = 0;
        for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Particle());
    }

    function resize(){
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        initParticles();
    }

    addEventListener('resize', ()=>{ resize(); });

    function render(){
        ctx.clearRect(0,0,w,h);
        // subtle vignette
        ctx.globalCompositeOperation = 'lighter';
        particles.forEach(p => { p.step(); p.draw(ctx); });
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(render);
    }

    // kick off
    resize();
    render();

})();
