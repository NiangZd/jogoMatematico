const gravity = 0.2;

const floorHeight = 96;

const backgroundSpritePath = "./assets/background/placeholder.png";

const defaultObjectSpritePath = "file:///C:/xampp/htdocs/assets/objects/square.svg";

class Sprite {
    constructor({ position, velocity, source, scale, offset, sprites }) {
        this.position = position;
        this.velocity = velocity;

        this.scale = scale || 1;
        this.image = new Image();
        this.image.src = source || defaultObjectSpritePath;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;

        this.offset = offset || {
            x: 0,
            y: 0,
        };

        this.sprites = sprites || {
            idle: {
                src: this.image.src,
                totalSpriteFrames: 1,
                framesPerSpriteFrame: 1,
            },
        };

        this.currentSprite = this.sprites.idle;

        this.currentSpriteFrame = 0;
        this.elapsedTime = 0;
        this.totalSpriteFrames = this.sprites.idle.totalSpriteFrames;
        this.framesPerSpriteFrame = this.sprites.idle.framesPerSpriteFrame;
    }

    setSprite(sprite) {
        this.currentSprite = this.sprites[sprite];

        if (!this.currentSprite) {
            this.currentSprite = this.sprites.idle;
        }
    }

    loadSprite() {
        let previousSprite = this.image.src;

        this.image = new Image();
        this.image.src = this.currentSprite.src;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;

        this.totalSpriteFrames = this.currentSprite.totalSpriteFrames;
        this.framesPerSpriteFrame = this.currentSprite.framesPerSpriteFrame;

        let newSprite = this.image.src;

        if (previousSprite !== newSprite) {
            // Corrects the sprite's position when switching sprites
            console.log(
                "Detected sprite change: ",
                previousSprite.split("/").pop(),
                " -> ",
                newSprite.split("/").pop()
            );

            let previousSpriteImage = new Image();
            previousSpriteImage.src = previousSprite;

            // Corrects the sprite's position:
            this.position.y += (previousSpriteImage.height - this.image.height) * this.scale;
        }
    }

    draw(ctx) {
        ctx.imageSmoothingEnabled = false;

        // Determine the x-scale based on the facing direction
        const xScale = this.facing === "left" ? -1 : 1;

        this.drawHealthBar(ctx);

        ctx.save();
        ctx.translate(this.position.x + this.offset.x, this.position.y + this.offset.y);
        ctx.scale(xScale, 1); // Flip the image horizontally if facing left

        ctx.drawImage(
            this.image,
            (this.currentSpriteFrame * this.image.width) / this.totalSpriteFrames,
            0,
            this.image.width / this.totalSpriteFrames,
            this.image.height,
            0,
            0,
            (this.width / this.totalSpriteFrames) * xScale, // Adjust the width with x-scale
            this.height
        );

        ctx.restore();
    }

    animate() {
        this.elapsedTime += 1;

        if (this.elapsedTime >= this.framesPerSpriteFrame) {
            this.currentSpriteFrame += 1;

            if (this.currentSpriteFrame >= this.totalSpriteFrames) {
                this.currentSpriteFrame = 0;
            }

            this.elapsedTime = 0;
        }
    }

    update(ctx) {
        this.draw(ctx);
        this.animate();
    }

    drawHealthBar(ctx) {
        // Placeholder drawHealthBar for the base class
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        attackBox,
        sprites,
        scale,
        maxHealth = 200,
        currentHealth = 200,
    }) {
        super({
            position,
            velocity,
            scale,
            sprites,
        });

        this.velocity = velocity;

        this.attackBox = attackBox || {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 125,
            height: 50,
        };
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
        this.isAttacking;
        this.attackCooldown = 500;
        this.onAttackCooldown;

        this.lastKeyPressed;
        this.onGround;
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
    }

    drawHealthBar(ctx) {
        // Largura fixa da barra de vida
        const healthBarWidth = 50;
    
        // Calcula a largura proporcional com base na vida atual
        const currentHealthWidth = (this.currentHealth / this.maxHealth) * healthBarWidth;
    
        // Desenha a barra de vida
        ctx.fillStyle = "green";
        ctx.fillRect(
            this.position.x,
            this.position.y - 10,
            currentHealthWidth,
            10
        );
    }
    

    gravity() {
        if (this.position.y + this.height >= canvas.height - floorHeight) {
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        if (this.position.y + this.height > canvas.height - floorHeight) {
            this.position.y = canvas.height - this.height - floorHeight;
            this.velocity.y = 0;
        } else {
            if (!this.onGround) this.velocity.y += gravity;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.attackBox.position.x = this.position.x;
        this.attackBox.position.y = this.position.y;
    }

    update(ctx) {
        this.gravity();
        this.loadSprite();
        this.draw(ctx);
        this.animate();
    }

    attack() {
        if (this.onAttackCooldown) return;

        this.isAttacking = true;
        this.onAttackCooldown = true;

        // Check for collision with the enemy's position and dimensions
        if (
            this.position.x < enemy.position.x + enemy.width &&
            this.position.x + this.attackBox.width > enemy.position.x &&
            this.position.y < enemy.position.y + enemy.height &&
            this.position.y + this.attackBox.height > enemy.position.y
            
        ) {
            // Deal damage only if there is a collision
            enemy.takeDamage(12);
        }

        if (
            this.position.x < enemy2.position.x + enemy2.width &&
            this.position.x + this.attackBox.width > enemy2.position.x &&
            this.position.y < enemy2.position.y + enemy2.height &&
            this.position.y + this.attackBox.height > enemy2.position.y
            
        ) {
            // Deal damage only if there is a collision
            enemy2.takeDamage(12);
        }

        setTimeout(() => {
            this.isAttacking = false;
        }, 400);

        setTimeout(() => {
            this.onAttackCooldown = false;
        }, this.attackCooldown);
    }

    jump() {
        if (!this.onGround) return;
        this.velocity.y = -8.5;
    }
}

class Enemy extends Fighter {
    constructor({
        position,
        velocity,
        attackBox,
        sprites,
        scale,
        maxHealth = 80,
        currentHealth = 80,
    }) {
        super({
            position,
            velocity,
            scale,
            sprites,
        });

        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
        this.aiCooldown = 30;
        this.elapsedAiTime = 0;
        this.aiDirection = 1;
        this.attackCooldown = 700;
        this.isAttacking = false;
        this.elapsedDeathTime = 500;

        this.sprites.dead = {
            src: "file:///C:/xampp/htdocs/assets/enemy1/Dead.png",
            totalSpriteFrames: 3,
            framesPerSpriteFrame: 8,
        };

        this.attackBox = attackBox || {
            position: {
                x: this.position.x,
                y: this.position.y + 20, // Mova a hitbox para baixo
            },
            width: 125,
            height: 50,
        };

    }

    setHealth(newHealth) {
        this.currentHealth = newHealth;
    }

    setAttackDamage(newDamage) {
        this.attackDamage = newDamage;
    }

    isDead() {
        if (this.currentHealth <= 0) {
            return true;
        }
        return false;
    }    

    update(ctx) {
        if (this.isDead()) {
            this.setSprite("dead");

            // Mova a chamada para animateDeath fora da condição if
            this.animateDeath();

            // Lógica adicional para lidar com a conclusão da animação de morte
            if (this.currentSpriteFrame >= this.sprites.dead.totalSpriteFrames) {
                // A animação de morte está completa
                // Lógica adicional pode ser adicionada aqui, se necessário

                // Atraso antes de exibir alertas ou reiniciar o jogo
                setTimeout(() => {
                    // Exibir um alerta
                    alert("Você passou de fase!");

                    // Ou mostrar uma mensagem no console
                    console.log("Você passou de fase!");

                }, 2000);
            }
        } else {
            this.gravity();
            this.loadSprite();
            this.handleAI();
            this.draw(ctx);
            this.animate();
        }
    }    
    
    animateDeath() {
        this.elapsedDeathTime += 1;

        if (this.elapsedDeathTime >= this.sprites.dead.framesPerSpriteFrame) {
            this.currentSpriteFrame += 1;

            if (this.currentSpriteFrame >= this.sprites.dead.totalSpriteFrames) {
                // A animação de morte está completa
                // Lógica adicional pode ser adicionada aqui, se necessário
                console.log("Animação de morte concluída!");
            }

            this.elapsedDeathTime = 0;
        }
    }
    
    attack() {
        if (this.onAttackCooldown) return;

        this.isAttacking = true;
        this.onAttackCooldown = true;

        // Check for collision with the player's position and dimensions
        if (
            this.position.x < player.position.x + player.width &&
            this.position.x + this.attackBox.width > player.position.x &&
            this.position.y < player.position.y + player.height &&
            this.position.y + this.attackBox.height > player.position.y
        ) {
            // Deal damage only if there is a collision
            player.takeDamage(this.attackDamage);  // Use o dano do ataque configurado
        }

        setTimeout(() => {
            this.isAttacking = false;
        }, 400);

        setTimeout(() => {
            this.onAttackCooldown = false;
        }, this.attackCooldown);
    }
    

    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
    }
    
    drawHealthBar(ctx) {
        if (!this.isDead()) {
            // Largura fixa da barra de vida
            const healthBarWidth = 50;
    
            // Calcula a largura proporcional com base na vida atual
            const currentHealthWidth = (this.currentHealth / this.maxHealth) * healthBarWidth;
    
            // Desenha a barra de vida
            ctx.fillStyle = "red";
            ctx.fillRect(
                this.position.x,
                this.position.y - 10,
                currentHealthWidth,
                10
            );
        }
    }    

    handleAI() {
        this.elapsedAiTime += 1;

        if (this.elapsedAiTime >= this.aiCooldown) {
            const horizontalDifference = player.position.x - this.position.x;

            if (horizontalDifference < -5) {
                this.facing = "left";
            } else if (horizontalDifference > 5) {
                this.facing = "right";
            }

            if (Math.abs(horizontalDifference) < this.attackBox.width) {
                this.attack();
                this.velocity.x = 0;
                this.setSprite("attacking");
            } else {
                this.velocity.x = 1.2 * 2 * (horizontalDifference > 0 ? 1 : -1);

                if (!this.onGround) {
                    this.setSprite("jumping");
                } else if (this.velocity.x !== 0) {
                    this.setSprite("running");
                } else {
                    this.setSprite("idle");
                }
            }

            this.elapsedAiTime = 0;
        }
    }
}

const player = new Fighter({
    position: {
        x: 100,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    scale: 4,
    sprites: {
        idle: {
            src: "https://i.imgur.com/pcsDhAR.png",
            totalSpriteFrames: 7,
            framesPerSpriteFrame: 12,
        },
        running: {
            src: "https://i.imgur.com/KYHE8uy.png",
            totalSpriteFrames: 8,
            framesPerSpriteFrame: 8,
        },
        jumping: {
            src: "https://i.imgur.com/RsDBEr0.png",
            totalSpriteFrames: 9,
            framesPerSpriteFrame: 12,
        },
        attacking: {
            src: "https://i.imgur.com/Q8lfZvL.png",
            totalSpriteFrames: 14,
            framesPerSpriteFrame: 8,
        },
    },
});

const enemy = new Enemy({
    position: {
        x: 500,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    scale: 4,
    sprites: {
        idle: {
            src: "https://i.imgur.com/tv3GkfQ.png",
            totalSpriteFrames: 6,
            framesPerSpriteFrame: 8,
        },
        running: {
            src: "https://i.imgur.com/0X5JUYi.png",
            totalSpriteFrames: 8,
            framesPerSpriteFrame: 8,
        },
        jumping: {
            src: "https://i.imgur.com/DcA2ch0.png",
            totalSpriteFrames: 10,
            framesPerSpriteFrame: 8,
        },
        attacking: {
            src: "https://i.imgur.com/GE5FA8U.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 8,
        },
        dead: {
            src: "https://i.imgur.com/gy2D1VJ.png",
            totalSpriteFrames: 3, 
            framesPerSpriteFrame: 3,
        },
    
    },
});

enemy.setAttackDamage(8);
enemy.setHealth(80);

const enemy2 = new Enemy({
    position: {
        x: 500,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    scale: 4,
    sprites: {
        idle: {
            src: "https://i.imgur.com/RA6SC7C.png",
            totalSpriteFrames: 6,
            framesPerSpriteFrame: 8,
        },
        running: {
            src: "https://i.imgur.com/GUNUHb8.png",
            totalSpriteFrames: 8,
            framesPerSpriteFrame: 8,
        },
        jumping: {
            src: "https://i.imgur.com/lvSoCEL.png",
            totalSpriteFrames: 12,
            framesPerSpriteFrame: 8,
        },
        attacking: {
            src: "https://i.imgur.com/JINJz9W.png",
            totalSpriteFrames: 5,
            framesPerSpriteFrame: 8,
        },
        dead: {
            src: "https://i.imgur.com/l1vLIVE.png",
            totalSpriteFrames: 4, 
            framesPerSpriteFrame: 8,
        },
    
    },
});

enemy2.setAttackDamage(6);
enemy2.setHealth(220);

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    source: backgroundSpritePath,
});