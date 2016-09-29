# Easy jQuery.comet

* Install
    ``` 
    bower install arodu-jquery-comet
    ```

* Connection
    ``` javascript
    var comet = $.comet({
        url: 'comet.php',
        onMessage: function(m){
            // Actions
        }
    });
    ```

* start
    ``` javascript
    comet.start();
    ```

* stop
    ``` javascript
    comet.stop();
    ```

* options
    ``` javascript
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
    ```
