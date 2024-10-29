document.addEventListener("DOMContentLoaded", () => {
   
   class Game {
      constructor(){

         // ============================================vars
         this.cnv = document.querySelector('#cnv');
         this.ctx = this.cnv.getContext('2d');
         this.cnv.height = 700;
         this.cnv.width = 1100;
         this.mouseYposition;
         this.mouseXposition;
         this.interwalRespawn = 4;
         this.btnPlay = document.querySelector('.play');
         this.btnIcon = this.btnPlay.querySelector('img');
         this.btnTitle = this.btnPlay.querySelector('.play__title');
         this.counterPointsVisible = document.querySelector('.counter-points__value');
         this.counterPoints = 0;
         this.duration = 180;
         this.remainingTime = this.duration;
         this.minutes = document.querySelector('.timer__minutes');
         this.secundes = document.querySelector('.timer__secundes');
      

         // status game
         this.status = false;
         this.animStatus = null;
         this.respawnIntervalId = null;

         // audio
         this.randomAudio;
         this.kukareku = new Audio();
         this.kukareku.src;
         this.kukareku.volume = 0.1;
         this.shot = new Audio();
         this.shot.src = './src/shot.mp3';
         this.shot.volume = 0.1;

         // x point for respawn
         this.randomXspawn = Math.floor(Math.random() * this.cnv.width); 

         // target sprite
         this.target = new Image();
         this.target.src = './img/target.png';
         
         // chiken sprite
         this.chiken = new Image();
         this.chiken.src = './img/chiken-fat.png'; 
         this.chickenX = this.randomXspawn;
         
         // mouse position
         this.mousePosition = this.cnv.addEventListener('mousemove',(e)=>{
            this.mouseXposition = e.clientX - this.cnv.offsetLeft;
            this.mouseYposition = e.clientY - this.cnv.offsetTop;
         })

         // created clones for chicken
         this.chikenClones = [];

         // new clone
         this.chikenClones[0] = {
            x: this.chickenX,
            y: 0,
         }

         // =============================================functions\

         

         // play soundshot
         this.shotSound = () => {
            this.shot.load();
            this.shot.play();
         }

         // play random sound
         this.playSoundChicken = () => {
            this.randomAudio = Math.floor(Math.random() * 4) + 1;
            this.kukareku.src = `./src/${this.randomAudio}.mp3`;
            this.kukareku.load();
            this.kukareku.play();
         }

         // shot
         this.cnv.addEventListener('click', (e) => {
            
         const clickX = e.clientX - this.cnv.getBoundingClientRect().left;
         const clickY = e.clientY - this.cnv.getBoundingClientRect().top;
         this.shotSound();

         this.chikenClones.forEach((clone) => {
               if (
                  clickX >= clone.x &&
                  clickX <= clone.x + 100 &&
                  clickY >= clone.y - 100 &&
                  clickY <= clone.y
               ) {
                  this.playSoundChicken();
                  this.chikenClones.splice(this.chikenClones.indexOf(clone), 1);
                  this.counterPoints += 1;
                  this.counterPointsVisible.innerText = this.counterPoints;

                  // random interwal
                  this.interwalRespawn = 0.5 + Math.random() * 3.5;

                  clearInterval(this.respawnIntervalId);
                  this.respawnIntervalId = setInterval(() => {
                     this.Respawn();
                  }, this.interwalRespawn * 1000);
                  console.log(this.interwalRespawn);
               }
         });
      });


      // respawn
      this.Respawn = () =>{ 
         this.randomXspawn = Math.floor(Math.random() * this.cnv.width);
         this.randomSpeed = Math.floor((Math.random() * 10) + 1);
         
         if(this.randomXspawn > this.cnv.width - 100){
            this.randomXspawn = this.cnv.width - 100;
         }

         this.chikenClones.push({
            x: this.randomXspawn,
            y: this.randomSpeed,
         });
         console.log(this.randomSpeed);

      }

      // render chicken
      this.renderChicken = () =>{
         for(let i = 0; i < this.chikenClones.length; i++){

            this.ctx.drawImage(this.chiken, this.chikenClones[i].x,this.chikenClones[i].y - 100, 100, 100);

            this.chikenClones[i].y += this.randomSpeed;
            
         }
      }

      // render target
      this.renderTarget = () =>{
         this.ctx.drawImage(this.target, this.mouseXposition - 50, this.mouseYposition - 50, 100, 100);
      }

      // animation
      this.animation = () => {
         // clear all frame
         this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);

         // renderChicken
         this.renderChicken();

         // paint target
         this.renderTarget();

         if (this.status) {
            this.animationId = requestAnimationFrame(this.animation);
          }
         
      }

      this.resetTimer = () => {
         this.remainingTime = this.duration;
         this.minutes.innerHTML = Math.floor(this.remainingTime / 60).toString().padStart(2, '0');
         this.secundes.innerHTML = (this.remainingTime % 60).toString().padStart(2, '0');
         this.stopTimer();
     
      }

      this.endGame = () => {
         this.status = false;
         clearInterval(this.respawnIntervalId);
      
         this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
      
         alert(`Подстрелено ${this.counterPoints} куров!`);
      
         this.counterPoints = 0;
         this.counterPointsVisible.innerText = '0';
      
         this.btnPlay.style.backgroundColor = 'green';
         this.btnTitle.innerText = 'Play';
         this.btnIcon.src = './img/play.svg';
      
         // Сбрасываем и перезапускаем таймер
         this.resetTimer();
      }

      // timer
      this.startTimer = () => {
         if (!this.timerRunning) {
            this.timerRunning = true;
            this.intervalId = setInterval(() => {
               this.remainingTime--;
               if (this.remainingTime <= 0) {
                  clearInterval(this.intervalId);
                  this.endGame();
               } else {
                  this.minutes.innerHTML = Math.floor(this.remainingTime / 60).toString().padStart(2, '0');
                  this.secundes.innerHTML = (this.remainingTime % 60).toString().padStart(2, '0');
               }
            }, 1000);
         }
      }
      
      // Остановить таймер
      this.stopTimer = () => {
         if (this.timerRunning) {
            this.timerRunning = false;
            clearInterval(this.intervalId);
         }
      }

      // start \ pause 
      this.onOffGame = () => {
         if (this.status === false) {
            this.status = true;
            this.btnPlay.style.backgroundColor = 'orange';
            this.btnTitle.innerText = 'Pause';
            this.btnIcon.src = './img/pause.svg';
            this.animationId = requestAnimationFrame(this.animation);
      
            this.respawnIntervalId = setInterval(() => {
               this.Respawn();
            }, this.interwalRespawn * 1000);
      
            this.startTimer();
         } else if (this.status === true) {
            this.status = false;
            this.btnPlay.style.backgroundColor = 'green';
            this.btnTitle.innerText = 'Play';
            this.btnIcon.src = './img/play.svg';
      
            cancelAnimationFrame(this.animationId);
            clearInterval(this.respawnIntervalId);
      
            this.stopTimer();
         }
      }

      this.btnPlay.addEventListener('click', this.onOffGame);

      // call animation after start game
      this.animation();
   
   }

   }

   const chickenGame = new Game();
});

// 1. добавить счетчик куриц + 
// 2. сверстать окошко для никнейма. 
// 3. после введения никнейма должен создаваться объект с пользователем и пушиться в массив всех пользователей
// 4. таймер. должен стартовать после нажатия на play и останавливать игру, когда время выйдет. После остановки таймера должно показываться окошко с результатом игры, а результат должен пушиться в массив к нужному объекту. Результат должен улетать в локалку.
// 5. сделать кнопку для просмотра рекорда


// актуальное

// останавливать игру когда таймер кончится (обнулять все значения)
// после окончания таймера нужно заносить данные в таблицу рекордов
// сверстать таблицу и кнопку под нее