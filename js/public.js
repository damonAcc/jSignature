new function (){
    var _self = this;
    _self.width = 640;//设置默认最大宽度
    _self.fontSize = 100;//默认字体大小
    _self.widthProportion = function(){
        var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;return p<0.5?0.5:(p>0.75?0.75:p);
    };
    
    _self.changePage = function(){
        document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px !important");
    }
    _self.changePage();
    window.addEventListener("resize",function(){_self.changePage();},false);
};


/*获取验证码 1,div*/
function getCodefun(obj,phone,time){
    var me = {};
    me.obj = obj;
    me.phone = phone;
    me.wait= time;
    me.time = function(obj) { 
        if (me.wait == 0) { 
            obj.text("获取验证码"); 
            me.wait = time; 
        }else { 
            obj.text(me.wait + "s"); 
            me.wait--;
            setTimeout(function(){ 
                me.time(obj);
            },1000);
        } 
    } 
    me.getCodeBindEvent = function(){
        obj.on('tap',function(e){
            var p = me.phone;
            var num = (typeof(p) == 'object')?p.val():p;
            if(Number(num)&&(num+'').length==11){
                me.time(obj);
                $(this).off('tap');
            }else{
                console.log('号码为空或格式不对');
                p.focus();
            }
        });
        setTimeout(function(){ 
            me.getCodeBindEvent(obj);
        },me.wait*1000);
    }
    me.getCodeBindEvent(me.obj,me.phone);
    return me;
}
/*获取验证码 2,button*/
var getCode = function(btn,time,fn,specialTimeObj){
    var me = {};
    me.btn = btn;
    me.wait= time;
    me.callBack = fn;
    me.specialTimeObj = specialTimeObj;
    me.show = function() {
        $(me.btn).attr("disabled","disabled");//设置button不可用

        if(me.specialTimeObj&&me.wait==me.specialTimeObj.specialTime){
            me.specialTimeObj.fn();
        }
        
        me.wait--;
        $(me.btn).val(me.wait+"秒").css('color','#999');
        if(me.wait == -1){
            $(me.btn).removeAttr("disabled");//设置button不可用
            $(me.btn).val("获取").css('color','#0aaefd');
            return ;
        }else if(me.wait == 0){
            $(me.btn).removeAttr("disabled");//设置button不可用
            $(me.btn).val("重新获取").css('color','#0aaefd');
            me.wait = time;
            return ;
        }else if(me.wait>0){
            setTimeout(function(){
                me.show();
            }, 1000);
        }
    };
    me.init = function(){
        if($(me.btn).attr("disabled")!="disabled"){//fix button disabled='disabled' 失效
            me.callBack();
            me.show();
        }
    };
    me.reset = function(){
        me.wait = 0;
    };
    me.init();
    return me;
}

/*提示，弹窗*/
//tips('数据错误','tips_center',1500);
//tips('数据错误','tips_left',1500);
function tips(msg,className,time){
    var tipsDiv = $('<div class="tips '+className+'"></div>');
    $('body').append(tipsDiv);
    tipsDiv.html(msg).addClass('tips_show');
    setTimeout(function(){
        tipsDiv.removeClass('tips_show').remove();
    },time);
}
//通用提示
function commonTips(className,msg,time){
    var _obj = $('.'+className);
    _obj.text(msg);
    _obj.addClass(className+'-show');
    setTimeout(function(){
        _obj.addClass(className+'-fadeout');
    },time);
    setTimeout(function(){
        _obj.addClass(className+'-fadein');
        _obj.removeClass(className+'-show');
    },time*2);
}

/*数字键盘*/
function enterPsw($wrapper,$cubeWrap,parms){

    var me = {};
    me.$cubeWrap = $cubeWrap;
    me.cubes = me.$cubeWrap.children('span');
    me.psdInput = me.$cubeWrap.find('.psw');
    me.len = me.cubes.size();
    me.parms = parms?parms:{
        done:function(me){
            return;
        }
    }
     
    var $keyboard = $('<div class="num_keyboard"><table><tr><td class="num_td">1</td><td class="num_td">2</td><td class="num_td">3</td></tr><tr><td class="num_td">4</td><td class="num_td">5</td><td class="num_td">6</td></tr><tr><td class="num_td">7</td><td class="num_td">8</td><td class="num_td">9</td></tr><tr><td class="grey_bg"></td><td class="num_td">0</td><td class="grey_bg del_td"><img src="images/del-btn.png" alt=""></td></tr></table></div>');

    $wrapper.append($keyboard);
    //数字按钮
    $keyboard.find('.num_td').on('tap',function(){
        $(this).addClass('active');
        var _that = this;
        setTimeout(function(){
            $(_that).removeClass('active');
        },100);

        var currNum = $(this).text();
        var psw = me.psdInput.val();

        if(psw.length<me.len){
            me.cubes.eq(psw.length).addClass('active');
            psw = (psw=='')?currNum:(psw+currNum);
            me.psdInput.val(psw);
        }
        if(psw.length==me.len){
            me.parms.done(me);
            //me.cubes.removeClass('active');
            //me.psdInput.val('');
        }
    });
    //删除按钮
    $keyboard.find('.del_td').on('tap',function(){
        $(this).addClass('active');
        var _that = this;
        setTimeout(function(){
            $(_that).removeClass('active');
        },100);
        var psw = me.psdInput.val();
        if(psw.length>0){
            me.cubes.eq(psw.length-1).removeClass('active');
            me.psdInput.val(psw.substring(0,psw.length-1));
        }
    });
    me.close = function(){
        $keyboard.removeClass('num_keyboard_show');
    }
    me.show = function(){
        $keyboard.addClass('num_keyboard_show');
    }
    
    return me;
}

/*confirm,弹窗*/
function confirmWin($wrapper,parms){
    var me = {};
    var parms = parms?parms:{
        title:'支付',
        leftBtnText:'cancel',
        rightBtnText:'confirm',
        cancel:function(){
            return;
        },
        confirm:function(){
            return;
        }
    }
    var $bg = $('<div class="bg-layer"></div>');
    var $confirmPanel = $('<div class="alert confirm-popup"><div class="a-info"></div><div class="a-btn"><div class="a-btn-left"></div><div class="a-btn-right"></div></div></div>');
    $wrapper.append($bg).append($confirmPanel);
    //left btn
    $confirmPanel.find('.a-btn-left').on("tap",function(e){
        parms.cancel();
    });
    //right btn
    $confirmPanel.find('.a-btn-right').on("tap",function(e){
        parms.confirm();
    });
    me.close = function(){
        $confirmPanel.removeClass('alert-show');
        //setTimeout(function(){
            $bg.css("display","none");
        //},200);
    }
    me.show = function(){
        $bg.css('display','block');
        $confirmPanel.addClass('alert-show');
    }
    me.init = function(){
        $confirmPanel.find('.a-info').text(parms.title);
        $confirmPanel.find('.a-btn-left').text(parms.leftBtnText);
        $confirmPanel.find('.a-btn-right').text(parms.rightBtnText);
    }
    me.init();
    return me;
}
