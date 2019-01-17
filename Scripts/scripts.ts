/// <reference path="../node_modules/@types/jquery/index.d.ts" />

//var mylib = require("../node_modules/jquery/dist/jquery.min.js");

enum Vector {
  left,
  right
}

class Accordion {

  constructor() {
    this.accordionHideAll();
    this.accordionOnClick();
  }

  accordionHideAll() {
    let blocks = $(".answer-block .answers .answer");
    for (let i = 0; i < blocks.length; i++) {
      $(blocks[i]).addClass("hide");
    }
  }

  accordionOnClick() {
    $(".answer-block .answers .answer").on("click", e => $(e.currentTarget).toggleClass("hide"));
  }
}

class Arrows {

  constructor(left: string, right: string, private onLeft: () => void, private onRight: () => void) {
    this.left = $(left);
    this.right = $(right);
    this.bind();
  }

  left: JQuery;
  right: JQuery;

  bind() {
    this.left.on("click", () => this.onLeft());
    this.right.on("click", () => this.onRight());
  }
}

class Corusel {
  arrows: Arrows;
  conteiner: JQuery;
  textNumber: JQuery;
  constructor(arrowL: string, arrowR: string, conteiner: string, textNumber: string, private isCentred: boolean) {
    this.conteiner = $($(conteiner)[0]);
    this.setHeight();
    this.arrows = new Arrows(arrowL, arrowR, this.onLeft, this.onRight);
    this.setParams();
    this.textNumber = $($(textNumber)[0]);
    this.textNumber.html(this.currenCount + 1 + "/" + this.countCard);
    let leftPhase = this.conteiner.css("left");
    if (leftPhase.indexOf("px") != -1) {
      this.position = +leftPhase.replace("px", "");
      if (this.position < 0)
        this.currenCount = 1;
    }


  }

  position = 0;
  widthBlock = 240;

  onLeft = () => {
    if (this.isEnd(Vector.left))
      return
    this.position -= this.widthBlock
    this.conteiner.css("left", this.position + "px");
    this.textNumber.html(this.currenCount + 1 + "/" + this.countCard);
  }

  onRight = () => {
    if (this.isEnd(Vector.right))
      return
    this.position += this.widthBlock;
    this.conteiner.css("left", this.position + "px");
    this.textNumber.html(this.currenCount + 1 + "/" + this.countCard);
  }

  countCard: number = 0;
  currenCount: number = 0;

  isEnd(vector: Vector): boolean {
    if (vector == Vector.right)
      return this.currenCount == 0 ? true : this.currenCount-- < -1;
    else
      return this.currenCount == this.countCard - 1 ? true : this.currenCount++ < -1;
  }

  setParams() {

    let el = this.conteiner.children().children();
    this.countCard = el.length;
    this.widthBlock = $(el[0]).outerWidth();
    let cards = this.conteiner.children();
    $(cards[0]).css("width", (this.countCard + 1) * this.widthBlock + "px");
  }

  setHeight() {
    let x = $(this.conteiner[0]).outerHeight();
    this.conteiner.parent().css("height", x);
  }
}

class SpoilerDots {
  obj: JQuery[];

  constructor(private className: string, private max: number) {
    this.obj = <any>$($(className));
    this.init();
    this.addBind();
  }

  init() {
    for (let i = 0; i < this.obj.length; i++) {
      if ($(this.obj[i]).html().length > this.max)
        this.setSpoiler($(this.obj[i]));
    }
  }

  setSpoiler(x: JQuery) {
    let str = x.html();
    x.data({ "text": x.html() });
    str = str.slice(0, this.max - str.length) + "... <font> Читать полностью</font>";
    x.html(str);
  }

  addBind() {
    $(this.className + " font").on("click", e => {
      let parent = $($(e.currentTarget).parent());
      parent.html(parent.data("text"));
    });
  }

}

class Tabs {
  selectors: JQuery[] = [];

  constructor(private selectorId: string, private photoWrapId: string, private photos: { name: string, url: string[] }[], private callBack: () => void) {
    let wrap = $($(this.selectorId)[0]);
    for (let i = 0; i < wrap.length; i++) {
      this.selectors.push($(wrap[i]));
    }
  }

  bind() {
    $(this.selectorId + "> *").on("click", e => {
      $(this.selectorId + "> *").removeClass("active");
      $(e.target).addClass("active");
      let photo: { name: string, url: string[] };
      this.photos.forEach(x => {
        if (x.name == $(e.target).data("name"))
          photo = x;
      });
      let str = "";
      photo.url.forEach(x => {
        str += '<img src="' + x + '" />';
      });

      $(this.photoWrapId).html(str);

      this.callBack();
    });
  }

}

class Ajax {

  constructor() {
    this.init();
  }



  init() { 
    $("button").on("click", () => { 
      debugger
      let phone: string = "";
      for (let i = 0; i < $("input.phone-input").length; i++) {
        let val: string = $($("input.phone-input")[i]).val() + "";
        phone = val.length > phone.length ? val : phone;
      }

      if (!phone || !phone.length || phone.length < 6) {
        alert("Введите корректный номер");
        return;
      }
      $(".popup").addClass("active");

      $(".popup .kudr").on("click", () => {
        $(".popup").removeClass("active");
        $.post(
          "/mail.php",
          {
            phone: phone,
            loc: "  "
          },
          function () {
            alert("Спасибо за обращение! Мы позвоним Вам на " + phone);
          }
        );

      });

      $(".popup .shuv").on("click", () => {
        $(".popup").removeClass("active");
        $.post(
          "/mail.php",
          {
            phone: phone,
            loc: "shuvalovskii"
          },
          function () {
            alert("Спасибо за обращение! Мы позвоним Вам на " + phone);
          }
        );
      });




    });
  }


}

class App {
  constructor() {
    this.init();
  }

  private init() {

    let spoilerDots = new SpoilerDots(".what-talk .cards .card .bottom .text", 360);
    debugger
    let spoilerTeams = new SpoilerDots(".we-teams .wrap .right .card .description", 300);


    let accordion = new Accordion();

    let team = new Corusel(
      ".we-teams .bottom .arrows .right",
      ".we-teams .bottom .arrows .left",
      ".we-teams .wrap .right .inner",
      ".we-teams .bottom .arrows .text",
      false
    );

    let roms = new Corusel(
      ".rooms .arrows .right",
      ".rooms .arrows .left",
      ".rooms .photos",
      ".rooms .arrows .text",
      true
    );




    let photosRooms: { name: string, url: string[] }[] = [
      {
        name: "kudrovo",
        url: ["img/rooms-room0-photo0.jpg", "img/rooms-room0-photo1.jpg", "img/rooms-room0-photo2.jpg"]
      },
      {
        name: "shuval",
        url: ["img/rooms-room0-photo0.jpg", "img/rooms-room0-photo1.jpg", "img/rooms-room0-photo2.jpg"]
      }
    ];

    let onSelectTab = () => {
      roms.setHeight();
      roms.setParams();
    }

    let tabs = new Tabs(".rooms .room-name", ".rooms .outer .photos .inner", photosRooms, onSelectTab);

    let ajax = new Ajax();
  }

  down = () => {
    $('html, body').animate({ scrollTop: $("#form-man").offset().top }, 500);
  }
}

setTimeout(() => {
  let app = new App();


}, 3000);

