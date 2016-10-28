(function($) {
    
    $.comet = function(options){
        var open = false;
        var connect = null;
        var datetime = 0;

        var settings = $.extend({
            //Options
                timeout: 60000,
                wait: 3, //seconds
                type: 'GET',
                dataType: 'json',
                autoStart: true,
                debug: false,
                datetime: true,
                url: '', // required
                data: {},
            // Events
                onMessage: null,
                onError: null,
                beforeRequest: null,
        }, options);

        if(settings.url == null || settings.url == ''){
            console.error('url can not be empty');
            return 1;
        }

        if(settings.debug){ console.log('init comet object') }

        fetch = function() {
            if (open){ return 1; }
            open = true;
            
            if (settings.beforeRequest != null) {
                settings.beforeRequest();
            }
            
            var data = settings.data;
            if(settings.datetime){
                data = $.extend(data, {datetime: datetime});
            }
            
            connect = $.ajax({
                url: settings.url,
                type: settings.type,
                timeout: settings.timeout,
                dataType: settings.dataType,
                data: data,
                async: true,
                cache: false,
                //contentType: 'multipart/form-data',
                ifModified: true,
                success: function(data, textStatus, jqXHR) {
                    //jQuery.comet.handle_update(data);
                    if (settings.onMessage != null) {
                        settings.onMessage(data, textStatus, jqXHR);
                    }
                    open = false;
                    if (settings.datetime===true && typeof data.datetime !== 'undefined') {
                        datetime = data.datetime;
                    }
                    setTimeout(fetch, settings.wait);
                },
                //complete: function(){
                //    console.log('complete');
                //},
                error: function(jqXHR, textStatus, errorThrown) {
                    open = false;
                    if (textStatus == 'timeout') {
                        if(settings.debug){ console.log('response timeout') }
                        setTimeout(fetch, settings.wait);
                    } else {
                        if (settings.onError != null) {
                            settings.onError(jqXHR, textStatus, errorThrown);
                        }else{
                            console.error('response error: ');
                            console.error(jqXHR);
                        }
                    }
                }
            });
            return 0;
        }
        
        this.setData = function(data, recursively = false){
            settings.data = $.extend(recursively, settings.data, data);
        }

        this.start = function(){
            if (settings.url != null && settings.url != '') {
                open = false;
                if(settings.debug){ console.log('comet started!') }
                fetch();
            }else{
                console.error('url to open not found!');
            }
        }
        
        this.stop = function(){
            open = true;
            if( connect != null){
                connect.abort();
                if(settings.debug){ console.log('comet stoped!') }
                connect = null;
            }
        }
        
        this.restart = function(){
            this.stop();
            this.start();
        }
        
        if(settings.autoStart){
            this.start();
        }

        return this;
    }
    
}(jQuery));
