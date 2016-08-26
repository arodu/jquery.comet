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
        }, options);


        fetch = function() {
            if (open){ return; }
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
                    console.log('error');
                    if (textStatus == 'timeout') {
                        fetch();
                    } else {
                        if (settings.onError != null) {
                            settings.onError(jqXHR, textStatus, errorThrown);
                        }
                        // setTimeout(fetch, 10000);
                    }
                }
            });
        }

        this.start = function(){
            if (settings.url != null) {
                open = false;
                fetch();
            }else{
                console.error('url to open not found!');
            }
        }
        
        this.stop = function(){
            open = true;
            if( connect != null){
                connect.abort();
                connect = null;
            }
        }
        
        if(settings.autoStart){
            this.start();
        }

        return this;
    }
    
}(jQuery));
