# Easy jQuery.comet

* Connection
            var comet = $.comet({
                url: 'comet.php',
                onMessage: function(m){
                    $('.date').append( m.date + '<br/>' )
                }
            });

* start
            comet.start();

* stop
            comet.stop();

* options
            $.comet({
                url: 'comet.php',
                timeout: 60000,
                type: 'GET',
                dataType: 'json',
                autoStart: true,
                url: null, // String
                onMessage: function(){},
                onError: function(){},
            });
