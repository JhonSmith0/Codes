"use strict;";

async function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}

class Component {
  conteiner = document.querySelector(".conteiner");

  constructor(qtd) {
    this.criarBoxs(qtd);

    this.width = parseFloat(this.boxs[0].clientWidth);
    this.gap = parseFloat(
      getComputedStyle(this.conteiner).getPropertyValue("gap")
    );
    this.length = this.width + this.gap;

    this.calc();
  }

  criarBoxs(qtd) {
    for (qtd; qtd > 0; qtd--) {
      this.conteiner.insertAdjacentHTML(
        "afterbegin",
        `<div class="box">${qtd}</div>`
      );
    }
  }

  get boxs() {
    return [...this.conteiner.querySelectorAll(".box")];
  }

  async moverEsquerda() {
    return await this._mover(-this.length);
  }

  _mover(length) {
    return new Promise((res) => {
      const primeiro = this.boxs[0];

      primeiro.addEventListener(
        "transitionend",
        async ({ target }) => {
          this.conteiner.append(primeiro);
          this.calc();

          await wait(0.1111);

          res();
        },
        { once: true }
      );

      this.boxs.forEach((box, i) => {
        const atual = parseInt(box.style.transform.split("(")[1]);
        const novo = atual + length;
        box.style.transform = `translateX(${novo}px)`;
      });
    });
  }
  calc() {
    this.boxs.forEach((box, i) => {
      box.style.transform = `translateX(${this.length * i}px)`;
    });
  }

  set velocidade(novo) {
    this.conteiner.style.setProperty("--velocidade", novo);
  }
  get velocidade() {
    return parseFloat(
      getComputedStyle(this.conteiner).getPropertyValue("--velocidade")
    );
  }
}

(async () => {
  const c = new Component(10);

  let i = 0;
  let point = c.boxs.length / 2;

  while (1) {
    await c.moverEsquerda();
    i++;

    if (c.velocidade >= 1) break;

    if (!(i % point)) {
      point = Math.round(point / 2);
      c.velocidade = c.velocidade * 1.25 + "s";
    }
  }
})();
