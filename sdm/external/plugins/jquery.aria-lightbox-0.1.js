/**
 * The ariaLightbox is a highly accessible jQuery plugin to make lightbox style
 * functionality usable by a wider range of website visitors, navigating
 * via assisted technology.
 */
(function(window, document, $){
    var AL = $.ariaLightbox = function() {
        AL.init.apply(this, arguments)
    };
    var WIN = $(window);
    var DOC = $(document);
    
    $.extend(AL, {
        version: '0.1',
        state : {
            isLaunched: false,
            isOpen: false,
            overlayIsComplete: false,
            windowResize: false
        },
        html: {
            id: "#aria-lb-",
            overlay: "<div id='aria-lb-overlay' />",
            container: "<div id='aria-lb-container' />",
            contentWrapper: "<div id='aria-lb-content-wrapper' />",
            content: "<div id='aria-lb-content' />"
        },
        defaults: {
            debug: false,
            maxWidth: 1000,
            minWidth: 250,
            width: 'auto',
            maxHeight: 600,
            minHeight: 250,
            height: 'auto',
            overlayColour: '#000000',
            overlayOpacity: 0.8,
            overlayDuration: 400,
            wrapperBackground: '#666',
            padding: '10px',
            isElement: true,
            politeness: false,
            relevance: false,
            setLiveAttrib: false
        },
        ariaAttribs: {
            live: 'aria-live',
            relevance: 'aria-relevant'
        },
        // See http://www.w3.org/TR/wai-aria/states_and_properties
        ariaProps: {
            live: ['polite', 'assertive', 'off'],
            relevance: ['additions', 'removals', 'text', 'all']
        },
        /**
         * Sets any required functionality before proceeding to launch
         * 
         * @param {Object} selection
         * @param {Object} options
         * @return void
         */
        init: function(selection, options) {
            // If selection is a jQuery object then the plugin has been called
            // on an element e.g. $(selector).ariaLightbox({}), otherwise the
            // plugin has been triggered via direct call e.g. $.ariaLightbox({})
            AL.defaults.isElement = selection instanceof $;
            AL.options = AL.defaults.isElement 
                       ? $.extend(AL.defaults, options) 
                       : $.extend(AL.defaults, selection);
            AL.element = AL.defaults.isElement ? selection : false;
            
            // If the aria-live attribute has not been set, or the user supplied
            // options require it to be set by the plugin then dynamically add
            // the attribute to the body element
            var liveIsSet = undefined === $('body').attr('aria-live')
                          ? false 
                          : true;

            if (liveIsSet === false || AL.options.setLiveAttrib === true) {
                var live = AL.options.politeness || AL.ariaProps.live[0]; 
                var relevance = AL.options.relevance
                             || AL._getRelevanceString(); 
                $('body').attr(AL.ariaAttribs.live, live);
                $('body').attr(AL.ariaAttribs.relevance, relevance);
            }
            
            AL._launch();
        },
        _launch: function() {
            AL._overlay();
        },
        _overlay: function() {
            DOC.find('body').append(AL.html.overlay)
               .find(AL.html.id + "overlay")
               .width(DOC.width()).height(DOC.height())
               .css({
                   backgroundColor: AL.options.overlayColour
               }).animate({
                   opacity: AL.options.overlayOpacity
               }, AL.options.overlayDuration, function(){
                   AL.state.overlayIsComplete = true;
                   AL._showLightbox();
               });
        },
        _showLightbox: function() {
            AL._attachMarkup();
            AL._applyCSS();
            AL._centerLightbox();
            AL._bindEvents();
        },
        _attachMarkup: function() {
            AL.container = $(AL.html.container).appendTo('body');
            AL.wrapper = $(AL.html.contentWrapper);
            AL.content = $(AL.html.content);
            
            AL.container.append(AL.wrapper);
            AL.wrapper.append(AL.content);
        },
        _applyCSS: function() {
            $(AL.html.id + "container").height(DOC.height());
            $(AL.html.id + "content-wrapper").css({
                maxWidth: AL.options.maxWidth,
                minWidth: AL.options.minWidth,
                width: AL.options.width,
                maxHeight: AL.options.maxHeight,
                minHeight: AL.options.minHeight,
                height: AL.options.height,
                padding: AL.options.padding,
                backgroundColor: AL.options.wrapperBackground
            });
            $(AL.html.id + "content").css({
                backgroundColor: '#fff',
                width: '100%',
                minHeight: AL.options.minHeight,
                height: AL.options.height
            });
        },
        _centerLightbox: function() {
            var boxTop = (WIN.height() / 2) 
                       - ($(AL.html.id + "content-wrapper").height() / 2)
            $(AL.html.id + "content-wrapper").css({ 
                top: boxTop
            });
        },
        _bindEvents: function() {
            $(window).on('resize', function() {
                if (AL.state.windowResize === false) {
                    AL.state.windowResize = true;
                    setInterval(function(){AL._centerLightbox();},1000);
                } else {
                    return;
                }
            });
        },
        /**
         * Returns a complete string representing the aria-relevant property.
         * Default text given if no arguments provided otherwise each argument
         * should be an integer matching an array index of ariaProps.relevance.
         * 
         * @return string
         */
        _getRelevanceString: function() {
            var options = arguments.length || [0,2];
            var string = '';
            for (var i = 0; i < options.length; i++) {
                string += AL.ariaProps.relevance[options[i]];
                string += i+1 != options.length ? ' ' : '';
            }
            return string;
        },
        _openLightbox: function() {
            
        }
    });
    
    $.fn.ariaLightbox = function(options) {
        AL.init(this, options);
    }
})(window, document, jQuery);
