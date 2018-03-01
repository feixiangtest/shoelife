var wxShare = {
    access_token: "",
    config: {
        debug: false,
        appId: "",
        timestamp: Math.ceil(new Date().getTime() / 1000).toString(),
        nonceStr: getRandom(),
        signature: "",
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ]
    },
    init: function (shareData) {
        if (!wx) {
            alert("微信接口调用失败");
            return false;
        }
        var that = this;
        this.wx_get_appid(function (data) {
            that.config.appId = data.data[0];
            that.wx_get_access_token(function (data) {
                that.access_token = data.data[0];
                that.wx_get_sign(function (data) {
                    that.config.signature = data.data[0];
                    that.initWx(shareData);
                });
            });
        });
    },
    wx_get_appid: function (call) {
        $.ajax({
            type: "get", url: "/users/common/wx/appid",
            success: function (data) {
                if(data.returncode===1){
                    return console.log(data.message);
                }
                call(data)
            }
        });
    },
    wx_get_access_token: function (call) {
        $.ajax({
            type: "get", url: "/users/common/wx/js-token",
            success: function (data) {
                if(data.returncode===1){
                    return console.log(data.message);
                }
                call(data)
            }
        });
    },
    wx_get_sign: function (call) {
        $.ajax({
            type: 'post',
            url: "/users/common/wx/sign",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "noncestr": this.config.nonceStr,
                "jsapiTicket": this.access_token,
                "timestamp": this.config.timestamp,
                "url": window.location.href.split('#')[0]
            }),
            dataType: "json",
            success: function (data) {
                if(data.returncode===1){
                    return console.log(data.message);
                }
                call(data);
            }
        });
    },
    initWx: function (shareData,call, errorCall) {
        wx.config(wxShare.config);
        var shareTitle = shareData.shareTitle;
        var shareImg = shareData.shareImg;
        var shareDesc=shareData.shareDesc;
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title:shareTitle,
                link: window.location.href.split('#')[0],
                imgUrl: shareImg
            });
            wx.onMenuShareAppMessage({
                title:shareTitle,
                desc: shareDesc,
                link: window.location.href.split('#')[0],
                imgUrl: shareImg,
                type: 'link'
            });
            //分享到QQ
            wx.onMenuShareQQ({
                title:shareTitle,
                desc: shareDesc,
                link: window.location.href.split('#')[0],
                imgUrl: shareImg
            });
            wx.onMenuShareWeibo({
                title:shareTitle,
                desc: shareDesc,
                link: window.location.href.split('#')[0],
                imgUrl: shareImg
            });
            wx.onMenuShareQZone({
                title:shareTitle,
                desc: shareDesc,
                link: window.location.href.split('#')[0],
                imgUrl: shareImg
            });
        });
        wx.error(function (res) {
            errorCall && errorCall();
        });
    }
};
function getRandom(){
    var random = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        random += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) random += "";
    }
    return random;
}
//初始化
//wxShare.init({'shareTitle':"这个是分享的标题",'shareImg':'http://www.shoelives.com/assets/img/view4_item_left.jpg','shareDesc':'咦，这个描述，你看到了吗？'});
