(function($) {
    
    $.comet = function(options){
        var open = false;
        var connect = null;

        var settings = $.extend({
            timeout: 60000,
            type: 'GET',
            dataType: 'json',
            autoStart: true,
            url: null,
            onMessage: null,
            onError: null,
            debug: false;
        }, options);

        if(debug){ console.log('init comet objet') }

        fetch = function() {
            if (open){ return 1; }
            open = true;
            connect = $.ajax({
                url: settings.url,
                type: settings.type,
                timeout: settings.timeout,
                dataType: settings.dataType,
                async: true,
                cache: true,
                contentType: 'multipart/form-data',
                ifModified: true,
                success: function(data, textStatus, jqXHR) {
                    //jQuery.comet.handle_update(data);
                    if (settings.onMessage != null) {
                        settings.onMessage(data, textStatus, jqXHR);
                    }
                    open = false;
                    setTimeout(fetch, 1);
                },
                //complete: function(){
                //    console.log('complete');
                //},
                error: function(jqXHR, textStatus, errorThrown) {
                    open = false;
                    if (textStatus == 'timeout') {
                        if(debug){ console.log('response timeout') }
                        fetch();
                    } else {
                        if(debug){ console.error('response error') }
                        if (settings.onError != null) {
                            settings.onError(jqXHR, textStatus, errorThrown);
                        }
                        // setTimeout(fetch, 10000);
                    }
                }
            });
            return 0;
        }

        this.start = function(){
            if (settings.url != null) {
                open = false;
                if(debug){ console.log('comet started!') }
                fetch();
            }else{
                if(debug){ console.error('url to open not found!') }
            }
        }
        
        this.stop = function(){
            open = true;
            if( connect != null){
                connect.abort();
                if(debug){ console.log('comet stoped!') }
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
