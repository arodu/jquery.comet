(function($) {

    $.comet = function(options){
        var open = false;
        var connect = null;
        var datetime = 0;
        var status = 'init' // init, open, closed, finished

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

        debug('init comet object')

        fetch = function() {
            if (open){ return 1; }
            open = true;
            if (status=='open' || status=='finished'){ return 1; }
            status = 'open';

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
                    status = 'closed';
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
                    status = 'closed';
                    if (textStatus == 'timeout') {
                        debug('response timeout')
                        setTimeout(fetch, settings.wait);
                    } else {
                        if (settings.onError != null) {
                            settings.onError(jqXHR, textStatus, errorThrown);
                        }else{
                            console.error('response error: ' + textStatus);
                            debug(jqXHR)
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
                status = 'closed';
                debug('comet started!')
                fetch();
            }else{
                console.error('url to open not found!');
            }
        }

        this.stop = function(){
            open = true;
            status = 'finished';
            if( connect != null){
                connect.abort();
                debug('comet stoped!')
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

        function debug(msg){
          if(settings.debug){ console.log(msg) }
        }

        return this;
    }

}(jQuery));
