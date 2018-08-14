(function(global, factory, plug){
    factory.call(global, global.jQuery, plug);

}(typeof window === 'undefined' ? this : window, function($, plug){
    var __I18N__ = {
        "en" : {
            "notForm" : "is not form element",
            "errorMsg" : "* valid fail"
        }   
    }
    //默认配置
    var __DEFS__ = {
        raise: 'change', //默认change事件
        lang: 'en',
        pix: 'bv-', //前缀
        i18n: 'en',
        // getMessage: $.fn[plug].getMessage,
        errorMsg: null, //默认的错误提示信息
    }
    //默认规则引擎
    var __RULES__ = {
        'require' : function () {
            return this.val() && this.val() !=="";
        },
        'email' : function () {
            return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.val());
        },
        'integer' : function () {
            return true;
        },
        'number' : function () {
            return true;
        },
        'length' : function () {
            return true;
        },
        'regex' : function () {
            return new RegExp(this.data(__DEFS__.pix + "regex")).test(this.val());
        }
        //...                              
    }

    //真正被创建的闭包并且只执行一次的内存机构
    $.fn[plug] = function(ops){
        this.getMessage = $.fn[plug].getMessage;
        var that = $.extend(this, __DEFS__, ops); //先扩展默认值 再用用户设置
        if (this.is('form')) {
            var $fields = this.find('input, textarea, select').not('[type=submit], [type=button], [type=reset]');
            //当鼠标放开表单元素的时候，开始效验元素
            $fields.on(this.raise, function(){
                var $field = $(this); //当前被效验的元素
                var $group = $field.parents(".form-group:first"); //找到它所在的group元素
                $group.removeClass('has-error has-success'); //还原规则
                $group.find('.help-block').remove();
                var result = false;//效验结果默认失败
                var msg //错误信息
                //当前效验元素到底配置了哪些
                $.each(__RULES__, function(rule, active) {
                    if ($field.data(that.pix + rule)) {
                        result = active.call($field)
                        if (!result) {
                            msg = $field.data(that.pix + rule + "-message") || this.getMessage(that.lang, 'errorMsg');
                            $group.addClass("has-error");
                            $field.after('<span class=\"help-block\">'+msg+'</span>');
                            return false;
                        } else {
                            $group.addClass("has-success");
                        }
                    }
                });
            })
            this.extendRules = $.fn[plug].extendRules;
            return this;
        } else {
            throw new Error(this.getMessage(that.lang, "notForm"));
        }
    }
    //扩展
    $.fn[plug].extendRules = function(rules){
        $.extend(__RULES__, rules);
    }
    //zh en
    $.fn[plug].addLocale = function(language, data){
        __I18N__[language] = data;
    }
    $.fn[plug].getMessage = function(language, key){
        return __I18N__[language][key];
    }


}, "bootstrapValidator"));