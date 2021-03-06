(function () {
  'use strict';

  //コメントの追加
  function Form(el) {
    this.initialize(el);
  }

  Form.prototype.initialize = function (el) {
    this.$window = $(window);
    this.$document = $(document);
    this.handleEvents();
  };

  Form.prototype.handleEvents = function () {
    var self = this;
    this.$document.on("change", "#js-comment", function (e) {
      self.validation();
    });
  };

  Form.prototype.validation = function () {
    var self = this;
    var validate = 0;
    $('input[type="text"], input[type="email"], textarea').each(function () {
      $(this).closest("dd").removeClass("error empty max email");

      if (self.isset($(this).attr("required"))) {
        if (!self.isset($(this).val())) {
          validate += 1;
          $(this).closest("dd").addClass("error empty");
        }
      }

      if (self.isset($(this).attr("maxlength"))) {
        if ($(this).val().length > $(this).attr("maxlength")) {
          validate += 1;
          $(this).closest("dd").addClass("error max");
        }
      }

      if ($(this).attr("type") == "email") {
        if (!$(this).val().match(/^[A-Za-z0-9]+[\w\.-]+@[A-Za-z0-9]+[\w\.-]+\.\w{2,}$/)) {
          validate += 1;
          $(this).closest("dd").addClass("error email");
        }
      }
    });

    if (validate > 0) {
      console.log("validate:false");
      $("#js-comment .confirm").prop('disabled', true).off("click.confirm");
      return false;
    } else {
      console.log("validate:true");
      $("#js-comment .confirm").prop('disabled', false).off("click.confirm").on("click.confirm", function () {
        self.sendComment();
      });
    }
  };

  Form.prototype.sendComment = function () {
    var self = this; // フォームデータ作成

    var data = new FormData();
    data.append("comment", $("#form-comment").val());
    data.append("name", $("#form-name").val());
    data.append("email", $("#form-email").val());
    data.append("url", $('#form-url').val());
    var addComment = '<div class="list-comment-item">' + '<p class="name">' + data.get('name') + ' より：</p>' + '<p class="confirm">' + data.get('name') + '様のコメントは承認待ちです。これはプレビューでコメントは承認後に表示されます。</p>' + '<p class="comment">' + data.get('comment') + '</p>' + '</div>';
    $(".list-comment").append(addComment);
    $("#js-comment")[0].reset();
    self.validation();
  };

  Form.prototype.isset = function (data) {

    if (data === "" || data === null || data === undefined || data === false) {
      return false;
    } else {
      return true;
    }
  }; //フッターバナー


  function AdFooter(el) {
    this.initialize(el);
  }

  AdFooter.prototype.initialize = function (el) {
    this.$window = $(window);
    this.$document = $(document);
    this.handleEvents();
  };

  AdFooter.prototype.handleEvents = function () {
    var self = this;
    self.carouselView();
    self.currentTimeView();
    self.countdownTimeView();
    self.randomness();
  };

  AdFooter.prototype.carouselView = function () {
    var sec = 6000;

    var panelSlide = function panelSlide() {
      var clone = $(".js-adlist li:first").clone(true);
      $(".js-adlist li:first").animate({
        marginTop: "-60px"
      }, {
        duration: 500,
        complete: function complete() {
          $(".js-adlist li:first").remove();
          clone.clone(true).insertAfter($(".js-adlist li:last"));
        }
      });
    };

    setInterval(panelSlide, sec);
  };

  AdFooter.prototype.currentTimeView = function () {

    var currentTimer = function currentTimer() {
      var time = new Date();
      var timeView = time.getHours() + "時" + time.getMinutes() + "分現在";
      $('.js-timer-current').text(timeView);
    };

    document.addEventListener("DOMContentLoaded", function (e) {
      currentTimer();
    });
    setInterval(currentTimer, 30000);
  };

  AdFooter.prototype.randomness = function () {
    var num = Math.floor(Math.random() * 11);
    document.addEventListener("DOMContentLoaded", function (e) {
      $('.js-num-people').text(num);
    });
  };

  AdFooter.prototype.countdownTimeView = function () {
    var hour = 2;
    var currentTime = new Date();
    var endTime; //console.log('The cookie check', currentTime.toLocaleString(), document.cookie)
    //値がない場合とcookie自体ない場合の判定

    if (document.cookie.split(';').some(function (item) {
      return item.trim().startsWith('endTime=');
    })) {
      var checkie = document.cookie.split('; ').find(function (row) {
        return row.startsWith('endTime');
      }).split('=')[1];

      if (checkie == "") {
        endTime = new Date();
        endTime.setHours(currentTime.getHours() + hour);
        document.cookie = 'endTime=' + endTime + '; expires=' + endTime + ';';
      } //console.log('cookieあり', document.cookie)

    } else {
      endTime = new Date();
      endTime.setHours(currentTime.getHours() + hour);
      document.cookie = 'endTime=' + endTime + '; expires=' + endTime + ';'; //console.log('cookieなし', document.cookie)
    }

    var countdownTimer = function countdownTimer() {
      currentTime = new Date();
      endTime = new Date(document.cookie.split('; ').find(function (row) {
        return row.startsWith('endTime');
      }).split('=')[1]);
      var diffTime = endTime - currentTime;

      if (endTime < currentTime) {
        document.cookie = "endTime=; expires=0";
        clearInterval(cd);
      } else {
        diffTime = diffTime % (1000 * 60 * 60 * 24);
        var h = diffTime / (1000 * 60 * 60);
        diffTime = diffTime % (1000 * 60 * 60);
        var m = diffTime / (1000 * 60);
        diffTime = diffTime % (1000 * 60);
        var s = diffTime / 1000;
        var cdNum = Math.floor(h) + "時間" + Math.floor(m) + "分" + Math.floor(s) + "秒";
        $('.js-timer-cd').text(cdNum);
      }
    };

    document.addEventListener("DOMContentLoaded", function (e) {
      countdownTimer();
    });
    var cd = setInterval(countdownTimer, 1000);
  }; //new


  var form = new Form();
  var adFooter = new AdFooter();

}());
