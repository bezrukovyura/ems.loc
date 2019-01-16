var Vector;
(function (Vector) {
    Vector[Vector["left"] = 0] = "left";
    Vector[Vector["right"] = 1] = "right";
})(Vector || (Vector = {}));
var Accordion = (function () {
    function Accordion() {
        this.accordionHideAll();
        this.accordionOnClick();
    }
    Accordion.prototype.accordionHideAll = function () {
        var blocks = $(".answer-block .answers .answer");
        for (var i = 0; i < blocks.length; i++) {
            $(blocks[i]).addClass("hide");
        }
    };
    Accordion.prototype.accordionOnClick = function () {
        $(".answer-block .answers .answer").on("click", function (e) { return $(e.currentTarget).toggleClass("hide"); });
    };
    return Accordion;
}());
var Arrows = (function () {
    function Arrows(left, right, onLeft, onRight) {
        this.onLeft = onLeft;
        this.onRight = onRight;
        this.left = $(left);
        this.right = $(right);
        this.bind();
    }
    Arrows.prototype.bind = function () {
        var _this = this;
        this.left.on("click", function () { return _this.onLeft(); });
        this.right.on("click", function () { return _this.onRight(); });
    };
    return Arrows;
}());
var Corusel = (function () {
    function Corusel(arrowL, arrowR, conteiner, textNumber, isCentred) {
        var _this = this;
        this.isCentred = isCentred;
        this.position = 0;
        this.widthBlock = 240;
        this.onLeft = function () {
            if (_this.isEnd(Vector.left))
                return;
            _this.position -= _this.widthBlock;
            _this.conteiner.css("left", _this.position + "px");
            _this.textNumber.html(_this.currenCount + 1 + "/" + _this.countCard);
        };
        this.onRight = function () {
            if (_this.isEnd(Vector.right))
                return;
            _this.position += _this.widthBlock;
            _this.conteiner.css("left", _this.position + "px");
            _this.textNumber.html(_this.currenCount + 1 + "/" + _this.countCard);
        };
        this.countCard = 0;
        this.currenCount = 0;
        this.conteiner = $($(conteiner)[0]);
        this.setHeight();
        this.arrows = new Arrows(arrowL, arrowR, this.onLeft, this.onRight);
        this.setParams();
        this.textNumber = $($(textNumber)[0]);
        this.textNumber.html(this.currenCount + 1 + "/" + this.countCard);
        var leftPhase = this.conteiner.css("left");
        if (leftPhase.indexOf("px") != -1) {
            this.position = +leftPhase.replace("px", "");
            if (this.position < 0)
                this.currenCount = 1;
        }
    }
    Corusel.prototype.isEnd = function (vector) {
        if (vector == Vector.right)
            return this.currenCount == 0 ? true : this.currenCount-- < -1;
        else
            return this.currenCount == this.countCard - 1 ? true : this.currenCount++ < -1;
    };
    Corusel.prototype.setParams = function () {
        var el = this.conteiner.children().children();
        this.countCard = el.length;
        this.widthBlock = $(el[0]).outerWidth();
        var cards = this.conteiner.children();
        $(cards[0]).css("width", (this.countCard + 1) * this.widthBlock + "px");
    };
    Corusel.prototype.setHeight = function () {
        var x = $(this.conteiner[0]).outerHeight();
        this.conteiner.parent().css("height", x);
    };
    return Corusel;
}());
var SpoilerDots = (function () {
    function SpoilerDots(className, max) {
        this.className = className;
        this.max = max;
        this.obj = $($(className));
        this.init();
        this.addBind();
    }
    SpoilerDots.prototype.init = function () {
        for (var i = 0; i < this.obj.length; i++) {
            if ($(this.obj[i]).html().length > this.max)
                this.setSpoiler($(this.obj[i]));
        }
    };
    SpoilerDots.prototype.setSpoiler = function (x) {
        var str = x.html();
        x.data({ "text": x.html() });
        str = str.slice(0, this.max - str.length) + "... <font> Читать полностью</font>";
        x.html(str);
    };
    SpoilerDots.prototype.addBind = function () {
        $(this.className + " font").on("click", function (e) {
            var parent = $($(e.currentTarget).parent());
            parent.html(parent.data("text"));
        });
    };
    return SpoilerDots;
}());
var Tabs = (function () {
    function Tabs(selectorId, photoWrapId, photos, callBack) {
        this.selectorId = selectorId;
        this.photoWrapId = photoWrapId;
        this.photos = photos;
        this.callBack = callBack;
        this.selectors = [];
        var wrap = $($(this.selectorId)[0]);
        for (var i = 0; i < wrap.length; i++) {
            this.selectors.push($(wrap[i]));
        }
    }
    Tabs.prototype.bind = function () {
        var _this = this;
        $(this.selectorId + "> *").on("click", function (e) {
            $(_this.selectorId + "> *").removeClass("active");
            $(e.target).addClass("active");
            var photo;
            _this.photos.forEach(function (x) {
                if (x.name == $(e.target).data("name"))
                    photo = x;
            });
            var str = "";
            photo.url.forEach(function (x) {
                str += '<img src="' + x + '" />';
            });
            $(_this.photoWrapId).html(str);
            _this.callBack();
        });
    };
    return Tabs;
}());
var Ajax = (function () {
    function Ajax() {
        this.init();
    }
    Ajax.prototype.init = function () {
        $(".form button").on("click", function () {
            var phone = "";
            for (var i = 0; i < $(".form input").length; i++) {
                var val = $($(".form input")[i]).val() + "";
                phone = val.length > phone.length ? val : phone;
            }
            if (!phone || !phone.length || phone.length < 6) {
                alert("Введите корректный номер");
                return;
            }
            $(".popup").addClass("active");
            $(".popup .kudr").on("click", function () {
                $(".popup").removeClass("active");
                $.post("/mail.php", {
                    phone: phone,
                    loc: "  "
                }, function () {
                    alert("Спасибо за обращение! Мы позвоним Вам на " + phone);
                });
            });
            $(".popup .shuv").on("click", function () {
                $(".popup").removeClass("active");
                $.post("/mail.php", {
                    phone: phone,
                    loc: "shuvalovskii"
                }, function () {
                    alert("Спасибо за обращение! Мы позвоним Вам на " + phone);
                });
            });
        });
    };
    return Ajax;
}());
var App = (function () {
    function App() {
        this.down = function () {
            $('html, body').animate({ scrollTop: $("#form-man").offset().top }, 500);
        };
        this.init();
    }
    App.prototype.init = function () {
        var spoilerDots = new SpoilerDots(".what-talk .cards .card .bottom .text", 360);
        debugger;
        var spoilerTeams = new SpoilerDots(".we-teams .wrap .right .card .description", 300);
        var accordion = new Accordion();
        var team = new Corusel(".we-teams .bottom .arrows .right", ".we-teams .bottom .arrows .left", ".we-teams .wrap .right .inner", ".we-teams .bottom .arrows .text", false);
        var roms = new Corusel(".rooms .arrows .right", ".rooms .arrows .left", ".rooms .photos", ".rooms .arrows .text", true);
        var photosRooms = [
            {
                name: "kudrovo",
                url: ["img/rooms-room0-photo0.jpg", "img/rooms-room0-photo1.jpg", "img/rooms-room0-photo2.jpg"]
            },
            {
                name: "shuval",
                url: ["img/rooms-room0-photo0.jpg", "img/rooms-room0-photo1.jpg", "img/rooms-room0-photo2.jpg"]
            }
        ];
        var onSelectTab = function () {
            roms.setHeight();
            roms.setParams();
        };
        var tabs = new Tabs(".rooms .room-name", ".rooms .outer .photos .inner", photosRooms, onSelectTab);
        var ajax = new Ajax();
    };
    return App;
}());
setTimeout(function () {
    var app = new App();
}, 3000);
