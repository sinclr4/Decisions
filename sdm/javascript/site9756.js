(function() {
    var images = ['visited','not-visited','current'];
    for (var i = 0; i < images.length; i++) {
        var img = new Image();
        img.src = '../images/layout/pda-nav-tail-' + images[i];
        img.src = '../images/layout/pda-nav-arrow-' + images[i];
    }
});
(Nhs = function() {
    var _urlVars;
    var _storageAvailable;
    
    /**
     * Checks to see if the HTML5 feature localStorage is aviable for this client
     */
    var _html5StorageAvailable = function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };
    
    /**
     * Set a standard cookie name = value
     * 
     * @param {Object} name
     * @param {Object} value
     */
    var _setCookie = function(name, value, duration) {
        var date = new Date();
        
        var expires = 0;
        if (duration > 0) {
            date.setDate(date.getDate() + duration);
            expires = date.toUTCString();
        }
        // unset cookie if no value is provided
        if (!value) {
            date.setDate(date.getDate() - 10);
            expires = date.toUTCString();
        }
        
        var cookie = name + "=" + value + ";path=/";
        if (expires) {
            cookie+= ';expires=' + expires;
        }
        
        document.cookie = cookie;
    };
    
    /**
     * Retrieve a cookie value by name
     * 
     * @param {Object} name
     */
    var _getCookie = function(name) {
        var cookieJar = document.cookie.split(';');

        for (var i = 0; i < cookieJar.length; i++) {
            var cookie = cookieJar[i].split('=');
            if ($.trim(cookie[0]) == $.trim(name)) {
                return cookie[1];
            }
        }
    }
    
    /**
     * To enable lightbox functionality to be announced to screen readers add
     * aria-live attribute to body of PDA sections
     */
    var _initAria = function() {
        $('body').attr('aria-live', 'polite');
        $('body').attr('aria-relevant', 'additions removals');
        $('#header .menu ul.level1').attr('role', 'navigation');
    };
    
    /**
     * Private function to return an array of url variables e.g. ?foo=bar
     */
    var _getUrlVars = function() {
        var vars = [], hash;
        
        if (window.location.href.indexOf('?') < 0) {
            _urlVars = false;
            return;
        }
        
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        
        _urlVars = vars;
    };
    
    var _launchVideo = function(containerId, file, options) {
        if (!(typeof jwplayer == 'function')) {
            return;
        }
        var downloadUrl = 'http://d3hb40lqyplkxw.cloudfront.net';
        var streamingUrl = 'sma61y0iamldp.cloudfront.net';
        var settings = {
            'id': 'video-stage',
            'width': '640',
            'height': '360',
            'autostart': true,
            'file': file,
            'allowscriptaccess': 'always',
            'provider': 'rtmp',
            'icons': false,
            'streamer': 'rtmp://' + streamingUrl + '/cfx/st',
            'modes': [
                  { 
                      type: 'flash', 
                      src: downloadUrl + '/player.swf'
                  },
                  {
                      type: 'html5',
                      config: {
                          'file': downloadUrl + "/" + file,
                          'provider': 'video'
                      }
                  },
                  {
                      type: 'download',
                      config: {
                          'file': downloadUrl + "/" + file,
                          'provider': 'video'
                      }
                  }
            ]
        };
        
        $.extend(settings, options);
        var jwPlayerObj = jwplayer(containerId);
        
        if (jwPlayerObj) {
            jwPlayerObj.setup(settings);
        }
        
    };
    
    /**
     * Enables streaming and backup HTML5 video popups for the further
     * information section
     */
    var _enableVideoLinks = function() {
        $('body').on('click', 'a.video, .intro-video a.title, #help-animation, .video-box', function(e){
            e.preventDefault();
            var file = $(e.target).attr('href') 
                     ? $(e.target).attr('href') 
                     : $(e.target).attr('data-animation-file');
             
             if (!file) {
                 var file = $(this).find('a').attr('href');
             }
            
            $.fancybox({
                type: 'html',
                wrapCSS: 'video-popup',
                content: '<div id="video-player"></div>',
                autoSize: false,
                width: 640,
                height: 360,
                scrolling: 'no',
                padding: 10,
                afterShow: function() {
                    $("#fancybox-overlay").unbind();
                    $('.fancybox-close').addClass('frutiger').text("CLOSE");
                    _launchVideo('video-player', file);
                    fancyboxOpen = true;
                },
                afterClose: function() {
                    fancyboxOpen = false;
                }
            });
        });
    };
    return {
        init: function() {
            _storageAvailable = _html5StorageAvailable();
        },
        /**
         * Public accessor _initAria()
         */
        initAria: function() {
            _initAria();
        },
        /**
         * Public accessor _getUrlVars()
         */
        getUrlVars: function() {
            return _getUrlVars();
        },
        urlVars: function() {
            return _urlVars;
        },
        enableVideoLinks: function() {
            _enableVideoLinks();
        },
        launchVideo: function(containerId, file, options) {
            _launchVideo(containerId, file, options);
        },
        storageAvailable: function() {
            return _storageAvailable;
        },
        setCookie: function(name, value, duration) {
            _setCookie(name, value, duration);
        },
        getCookie: function(name) {
            return _getCookie(name);
        }
    };
}());

Nhs.Site = function() {
    var redirectSiteUrl,
        redirectSecureUrl;

    /**
     * Attaches a jQuery UI datepicker to and dobuser input fields
     */
    var enableDatePicker = function() {
        $('input[name=dobuser]').datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '-120',
            dateFormat: 'dd/mm/yy',
            altFormat: 'yy-mm-dd',
            altField: '#dob',
            defaultDate: '25/11/77'
        });
    };
    
    /**
     * Attach default text to jQuery form element and prevent default text
     * from being submitted
     */
    var defaultKeywordText = function(form) {
        // Some default text for the search input
        var defText = "Search for a condition...";
        
        if ($('#keywords').val() == "") {
            $('#keywords').val(defText);
        }
        
        // Listeners to manage the default text and submit event
        $('#keywords').on({
            focus: function() {
                if ($('#keywords').val() == defText) {
                    $('#keywords').val("");
                }
            },
            blur: function() {
                if ($('#keywords').val() == "") {
                    $('#keywords').val(defText);
                }
            }
        });
        
        form.on('submit', function(e){
            if ($('#keywords').val() == defText || $('#keywords').val() == "") {
                return false;
            }
        });
    };
    
    /**
     * Sets some basic functionality and listeners for the homepage
     */
    var initHomepage = function() {
        // If we're on the homepage and have any kind of search query then
        // we need to unhide the results section
        var urlVars = Nhs.urlVars();

        if (urlVars !== false){
            if (typeof urlVars['qf'] != 'undefined' 
                || typeof urlVars['keywords'] != 'undefined') {
                $('#pda-finder .searchResults.alpha-results').show();
                var pdaFinder = $('#pda-finder').offset();
                window.scrollTo(pdaFinder.left, pdaFinder.top);
            }
        }
        defaultKeywordText($('#keyword-search'));
    };
    
    /**
     * Attaches an event handler to doLogin class members for async style login
     * and handles form processing via XHR calls
     */
    var enableLogin = function(forcePopup) {
        var liveUrl = redirectSiteUrl;
        var secureUrl = redirectSecureUrl + '/';
        
        /*
         * Send a confirmation email
         */
        var _doSendConfirmEmail = function(form) {
            var formData = form.serializeArray();
            $.ajax({
                dataType: 'json',
                url: secureUrl + 'your-account/send-confirmation-email?callback=?',
                data: formData,
                success: function(response) {
                    if (response.success) {
                        $('.access-container .message-container').show().find('.messages').html(response.message);
                        
                        var sendConfirm = $('.forms .unconfirmed-email');
                        var loginForm = $('.forms .login #login-form-elements');
                        sendConfirm.hide().attr('aria-hidden', true);
                        loginForm.show().attr('aria-hidden', false).find('input[name=email]').focus();
                        
            
                    } else {
                        $('.access-container .error-container').show().find('.messages').html(response.errors);
                    }
                }
            });
        };
        
        var _emailConfirmDialogue = function() {
            var sendConfirm = $('.forms .unconfirmed-email');
            var loginForm = $('.forms .login #login-form-elements');
            
            if (sendConfirm.is(':visible')) {
                sendConfirm.hide().attr('aria-hidden', true);
                loginForm.show().attr('aria-hidden', false).find('input[name=email]').focus();
            } else {
                sendConfirm.show().attr('aria-hidden', false).find('input[type=text]').focus();
                loginForm.hide().attr('aria-hidden', true);
            }
            
            $('a.resend-confirmation').on('click', function(e) {
                e.preventDefault();
                _doSendConfirmEmail($('.forms .login #th-login-form'));
            });
        };
        
        /*
         * Perform and XHR login
         */
        var _doLogin = function(form) {
            var formData = form.serializeArray();
            $.ajax({
                dataType: 'json',
                url: secureUrl + 'your-account/xhr-login?callback=?',
                data: formData,
                success: function(response) {

                    Nhs.setCookie('SID', response.SID, 0);

                    if (response.success) {
                        if (response.completeStep == 1) {
                            $('#save-continue-btn').removeClass('doLogin').click();
                        } else if (response.redirectUrl) {
                            window.location = response.redirectUrl;
                        } else {
                            window.location.reload();
                        }
                    } else {
                        if (response.errors.search(/!!UNCONFIRMED_EMAIL!!/) > -1) {
                            _emailConfirmDialogue();
                        }
                        else {
                            $('.access-container .error-container').show().find('.messages').html(response.errors);
                        }
                    }
                }
            });
        };
        
        /*
         * Perform an XHR registration
         */
        var _doRegister = function(form) {
            var formData = form.serializeArray();
            $.ajax({
                dataType: 'json',
                url: secureUrl + 'your-account/xhr-register?callback=?',
                data: formData,
                success: function(response) {
                    
                    Nhs.setCookie('SID', response.SID, 0);

                    if (response.success) {
                        if (response.completeStep == 1) {
                            $('#save-continue-btn').removeClass('doLogin').click();
                        } else if (response.redirectUrl) {
                            window.location = response.redirectUrl;
                        } else {
                            window.location.reload();
                        }
                    } else {
                        $('.access-container .error-container').show().find('.messages').html(response.errors);
                    }
                }
            });
        };
        
        /*
         * Reset password via XHR
         */
        var _doResetPassword = function(form) {
            var formData = form.serializeArray();
            $.ajax({
                dataType: 'json',
                url: secureUrl + 'your-account/xhr-reset-password?callback=?',
                data: formData,
                success: function(response) {
                    if (response.success) {
                        $('.access-container .error-container').hide();
                        $('.access-container .message-container').show().find('.messages').html(response.message);
                        $('.password-reset').toggle().attr('aria-hidden', true).find('input[name=email]').val('');
                        $('.forms .login #login-form-elements').show().attr('aria-hidden', false).find('input[name=email]').focus();
                    } else {
                        $('.access-container .message-container').hide();
                        $('.access-container .error-container').show().find('.messages').html(response.errors);
                    }
                }
            });
        };
        
        /*
         * Launch the login/reg forms in lightbox
         */
        var _launchFormWindow = function(element) {
            var redirectUrl = false;
            var completeStep = false;
            var isCompareOptions = $('#pda .compare-options').length === 1 
                                 ? true : false;
            
            if (element) {
                // Defining a redirectUrl here will ensure it is adhered to on the
                // callback
                if (element.attr('name') === '_saveContinue') {
                    redirectUrl = $('.navigation input[name=nextUrl]').val();
                    
                    if (isCompareOptions) {
                        var completeStep = true;
                    }
                }
                else 
                    if (element.attr('id') === 'progressSummary') {
                        redirectUrl = element.attr('data-login-success-url');
                    }
                    else 
                        if (element.attr('id') === 'coach-callback') {
                            redirectUrl = element.attr('href');
                        }
            }
            
            $.fancybox({
                padding     : 10,
                fitToView   : true,
                autoSize    : true,
                scrolling   : 'auto',
                type        : 'ajax',
                wrapCSS     : 'access',
                href        : '/your-account/xhr-access/',
                afterShow: function() {
                    $("#fancybox-overlay").unbind();
                    $('.access-container input:first').focus();
                    $('.fancybox-close').addClass('frutiger').text("CLOSE");
                    if (redirectUrl !== false) {
                        $('input[name=_loginSuccessUrl]').val(redirectUrl);
                    }
                    if (completeStep === true) {
                        $('#_completeStepLogin').val(1);
                        $('#_completeStepRegister').val(1);
                    }
                }
            });
        };
        
        $('body').on('click', '.doLogin', function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            _launchFormWindow($(this));
        });
        
        var formSubmits = 'input[name="_login"], input[name="_register"], input[name="_resetPassword"]';
        
        $('body').on('click', formSubmits, 
            function(e){
                e.preventDefault();
                switch ($(this).attr('name')) {
                    case "_login" :
                        _doLogin($(this).parents('form'));
                        break;
                    case "_register" :
                        _doRegister($(this).parents('form'));
                        break;
                    case "_resetPassword" :
                        _doResetPassword($(this).parents('form'));
                        break;
                }
        });
        
        $('body').on('click', '.forgotten-password', function(e){
            e.preventDefault();
            var passwordReset = $('.forms .password-reset');
            var loginForm = $('.forms .login #login-form-elements');
            if (passwordReset.is(':visible')) {
                passwordReset.hide().attr('aria-hidden', true);
                loginForm.show().attr('aria-hidden', false).find('input[name=email]').focus();
            } else {
                passwordReset.show().attr('aria-hidden', false).find('input[type=text]').focus();
                loginForm.hide().attr('aria-hidden', true);
            }
        });
        
        /*
         * Listeners and functionality for login/register buttons and forms
         */
        $('body').on('click', '.register-btn, .login-btn', function(e) {
            var that = $(e.target),
                accessContainer = $('.access-container');
                
            // Reset all elements to default visibility
            accessContainer.find('.form-select > div').removeClass('selected');
            accessContainer.find('.form-info, .access-container .error-container, .access-container .message-container').hide();
            accessContainer.find('.forms > div').removeClass('selected').attr('aria-hidden', true);
            
            // Enable the selected form and parent arrow
            var forms = $(this).parents('.inline-block').addClass('selected').parent().siblings('.forms');
            
            if (that.hasClass('register-btn')) {
                forms.find('.register').addClass('selected').attr('aria-hidden', false);
            } else if (that.hasClass('login-btn')) {
                forms.find('.login').addClass('selected').attr('aria-hidden', false);
            }
        });
        
        // We need to ensure that logout actions occur on all domains
        $('body').on('click', '.logout-link', function(e) {
            e.preventDefault();
            var sameDomain = window.location.host == liveUrl ? true : false;
            
            if (sameDomain) {
                $.post(secureUrl + '?_logout=1');
            } else {
                $.post('http://' + liveUrl + '?_logout=1');
            }
            
            window.location.href = $(e.target).attr('href');
        });
        
        if (forcePopup === true) {
            _launchFormWindow();
        }
    };
    
    /**
     * Enables standard tab functionality for a group of title and content
     * elements
     * 
     * @param {Object} elementId The parent element id
     */
    var _standardTabs = function(elementId, tabTitleClass, tabContentClass) {
        
        tabTitleClass = tabTitleClass || '.tab-titles';
        tabContentClass = tabContentClass || '.tab-content';
        
        $(elementId).on('click', tabTitleClass + ' > .tab', function(e){
            if ($(elementId).hasClass('contributor-search')) {
                return;
            }
            
            if ($(e.target).is('a')) {
                e.preventDefault();
            }
            $(tabTitleClass + ' > .tab').removeClass('selected').attr('aria-selected', false);
            $(tabContentClass + ' > div').removeClass('selected').attr('aria-hidden', true);
            $(this).addClass('selected').attr('aria-selected', true);
            $('#' + $(this).attr('aria-controls')).addClass('selected').attr('aria-hidden', false);
        });
    };
    
    /**
     * Allow hidden value form elements to be updated in Your Account area
     */
    var _updateProfileForm = function() {
        $('#your-profile .enable').on('click', function(){
            $(this).parents('.element').removeClass('noshow').addClass('show');
        });
        $('input[type=reset]').on('click', function(){
            $('.element').removeClass('show').addClass('noshow');
        });
    };
    
    /**
     * Enables account section specific functionality
     */
    var initYourAccount = function() {
        _standardTabs('#your-account');
        _updateProfileForm();
    };
    
    /**
     * Enables advisory groups section specific functionality
     */
    var initAdvisoryGroups = function() {
        Nhs.initAria();
        _standardTabs('#advisory-groups');
        
        /*
         * Toggles the contributor panel for each PDA row
         */
        _toggleContributors = function(row) {
            row.toggleClass('open').find('.contributors').toggle();

            var defaultText = 'VIEW CONTRIBUTORS';
            var link = row.find('.link a');
            if (link.text() == defaultText) {
                link.text('CLOSE').parent().css({ marginLeft: "101px" });
            } else {
                link.text(defaultText).parent().css({ marginLeft: "-5px" });
            }
        };
        
        $('#pdas .row-item .link a').on('click', function(e){
            e.preventDefault();
            var row = $(this).parents('.row-item');
            _toggleContributors(row);
        });
        
        var hash = window.location.hash;
        
        if (hash) {
            _toggleContributors($(hash));
        }
        
        defaultKeywordText($('.tab-titles form'));
        
        $('.contributor a').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $.fancybox({
                type: 'ajax',
                wrapCSS: 'contributor-lightbox',
                href: $(this).attr('href'),
                autoSize: true,
                scrolling: 'no',
                padding: 10,
                afterShow: function() {
                    $("#fancybox-overlay").unbind();
                    $('.fancybox-close').addClass('frutiger').text("CLOSE");
                }
            });
        });
    };
    
    /**
     * Toggle show/hide functionality for FAQs
     */
    var initFaqs = function() {
        $('.faq li').on('click', function(){
            $(this).toggleClass('open');
        });
    };
    
    /**
     * Move the accessibility header to be first child of body and enable tab
     * click functionality to show info
     */
    var accessibilityHeader = function() {
        var accessHeader = $('.accessibility').detach();
        accessHeader.prependTo('body');
        
        $('.accessibility .pull-tab').on('click', function(){
            $(this).parent().toggleClass('open');
        });
    };
    
    /**
     * Adds a version specific class to IE browsers for conditional CSS
     */
    var enableBrowserDetection = function() {
        if ($.browser.msie) {
            var legacyRedirect = '/browser-upgrade/';
            var ieVersion = parseInt($.browser.version);
            $('html').addClass('ie ie' + ieVersion);
            
            if (ieVersion < 7) {
                if (window.location.href.indexOf('browser-upgrade') > -1) {
                    $('#version').text(ieVersion);
                }
                else {
                    window.location = legacyRedirect;
                }
            }
        }
        if ($.browser.mozilla) {
            $('html').addClass('firefox');
        }
        if ($.browser.webkit) {
            $('html').addClass('webkit');
        }
    };
    
    /**
     * Sets event listeners and functionality for the tour images and text
     */
    var initTour = function() {
        $('#tour .digit').on('click', function(){
            var digit = $(this).attr('id').match(/\d/g);
            var highlight = '#highlight-' + digit;
            var key = '#key-' + digit;
            $('.screenshot .highlight-image').removeClass('selected').attr('aria-selected', false);
            $('.numbers .number').removeClass('selected').attr('aria-hidden', true);
            $(highlight).addClass('selected').attr('aria-selected', true);
            $(key).addClass('selected').attr('aria-hidden', false);
        });
        $('a.video').each(function(){
                var div = '<div id="video-player" />';
                $(div).insertAfter(this);
                var file = $(this).attr('href');
                var stageId = 'video-stage';
                var playerId = 'video-player';
                var options = { 'id': stageId, 'autostart': false, 'width': 940, 'height': 530 };
                $(this).remove();
                Nhs.launchVideo(playerId, file, options);
        });
    };
    
    /**
     * Adds keypress listeners to allow standard browsing keys to navigate
     */
    var enableKeyboardBrowsing = function() {
        var N = 78;
        var S = 83;
        var zero = 48;
        var one = 49;
        var four = 52;
        var eight = 56;
        var nine = 57;
        
        $(window).on('keydown', function(e){
            if (e.altKey !== true) {
                return;
            }
            
            if (e.altKey === true && e.shiftKey === false) {
                switch (e.which) {
                    case N :
                        window.location.hash = 'navigation-start';
                        break;
                    case S :
                        window.location.hash = 'content-start';
                        break;
                }
            }
        
            if (e.altKey === true && e.shiftKey === true) {
                switch (e.which) {
                    case zero :
                        window.location.href = '/accessibility';
                        break;
                    case one :
                        window.location.href = '/';
                        break;
                    case four :
                        window.location.href = '/';
                        break;
                    case eight :
                        window.location.href = '/terms-of-use';
                        break;
                    case nine :
                        window.location.href = '/contact';
                        break;
                }
            }
        });
    };
    
    /**
     * Debug function to show a viewport outline
     */
    var enableViewport = function() {
        if (typeof Nhs.urlVars() === false) {
            return;
        }

        if (typeof Nhs.urlVars()['viewport'] != 'undefined') {
            var viewPort = Nhs.urlVars()['viewport'].split('x');
            var vpHtml = '<div id="viewport" />';
            $(vpHtml).insertAfter('body');
            var winWidth = $(window).width();
            var left = (winWidth / 2) - (viewPort[0] / 2);
            $('#viewport').css({
                width: viewPort[0],
                height: viewPort[1],
                position: 'absolute',
                opacity: 0.2,
                backgroundColor: 'red',
                top: 0,
                left: left,
                zIndex: 1
            });
        }
    };
    
    /**
     * Listeners to enable element clicks to trigger link clicks
     */
    var enableRowClicks = function() {
        $('.row-item').on(
            {
            'click': function(e) {
                if ($(e.target).is('.contributer a')) {
                    return;
                } else if ($(e.target).is('a')) {
                    var href = $(e.target).attr('href');
                    window.location.href = href;
                    return;
                } else {
                    $(this).find('a:first').click();
                }
            },
            'mouseenter': function() {
                $(this).addClass('hover');
            },
            'mouseleave': function() {
                $(this).removeClass('hover');
            }
        });
    };
    
    /**
     * Add classes to Pelorous tables for fancy styling
     */
    var pelorousTables = function() {
        $('.further-info-tab-content table tr:first, .further-information table tr:first').addClass('th');
        $('.further-info-tab-content table tr, .further-information table tr').each(function(){
            $(this).find('td:first').addClass('firstItem').parent().find('td:last').addClass('lastItem');
        });
        $('.further-info-tab-content table tr:odd, .further-information table tr:odd').addClass('odd');
    };
    
    /**
     * Enable the videos on the video page
     * 
     * @return void
     */
    var enableVideosPage = function() {
        var autoPlay = $('#play-introduction');
        var title = autoPlay.find('h4.title').text();
        var file = autoPlay.attr('data-s3-filename');
        var preview = autoPlay.attr('data-preview-image');
        var containerId = 'video-stage';
        var options = {
            autostart: false,
            width: 705,
            height: 397
        }
        
        if (preview) {
            options.image = preview;
        }
        
        $('#video-content .right-col h3.video-title').text(title);

        Nhs.launchVideo(containerId, file, options);
        
        $('.video-item').on('click', function(){
            file = $(this).attr('data-s3-filename');
            preview = $(this).attr('data-preview-image');
            title = $(this).find('h4.title').text();
            
            options.image = preview ? preview : null; 
            
            $('#video-content .right-col h3.video-title').text(title);
            Nhs.launchVideo(containerId, file, options);
        });
    };
    
    var initContactForm = function() {
        var description = $('.onlineForm span.description').detach();
        description.insertAfter('#email-element');
    };
    
    return {
        init: function() {
            Nhs.getUrlVars();
            enableBrowserDetection();
            enableKeyboardBrowsing();
            //enableDatePicker();
            enableLogin();
            accessibilityHeader();
            enableViewport();
            enableRowClicks();
            pelorousTables();
            enableVideosPage();
            
            if ($('#custom-doc').hasClass('subsection')) {
                initYourAccount();
                initAdvisoryGroups();
                initFaqs();
                initTour();
                initContactForm();
            }
            
            // If the home layout is used we want to run this function
            if ($('#custom-doc').hasClass('home')) {
                initHomepage();
            }
        },
        doLogin: function() {
            enableLogin(true);
        },
        standardTabs: function(elementId, tabTitleClass, tabContentClass) {
            _standardTabs(elementId, tabTitleClass, tabContentClass);
        },
        setDomains: function(domains) {
            redirectSiteUrl = domains.redirectSiteUrl;
            redirectSecureUrl = domains.redirectSecureUrl;
        }
    };
}();

Nhs.Pda = function() {
    // Base URL for PDA without section parts
    var baseUrl, 
        debug,
        // Default values
        consoleAvailable = 0,
        sectionId,
        viewedContentElements = [],
        ajaxQueue = [],
        queueProcessing = false,
        fancyboxOpen = false;
    
    /**
     * Initialise the tabbed sections including lightbox functionality for 
     * compare options tab
     */
    var initTabs = function() {
        // Add some first/last classes for CSS rules
        $('dl dt:first, dl dd:first').addClass('firstItem');
        $('dl dt:last, dl dd:last').addClass('lastItem');
        
        /* If there are multiple further info boxes hidden for lightbox
        functionality then don't automatically log the first element
        as being viewed as it is not visible on screen */
        if ($('dl.tabbed-container').length === 1) {
            initSubNavigation($('dl.tabbed-container'), 'dt', 'dd');
        }
        
        var introFurtherInfo = $('.introduction .tab-content > .detach-further-info');
        
        if (introFurtherInfo.length === 1) {
            initSubNavigation(introFurtherInfo, 'dt', 'dd');
        }

        // Compare options popup functionality
        $('body').on('click', '.popup', function(element) {
            // Stop the click event happening
            element.preventDefault();
            var contentName = $(this).attr('href');
            
            var callerId = '#' + $(this).parents('th.option').attr('id');
            var parentEle = $(contentName).next().find('dl.tabbed-container').attr('id');

            var parentId = "#" + $(contentName)
                                 .parent('div.option-info-container')
                                 .attr('id');

            var content = $(contentName)
                          .next('div.insert-container').detach();
            $.fancybox({
                type: 'inline',
                wrapCSS: 'further-information',
                padding: 10,
                autoSize: true,
                minWidth: 980,
                scrolling: 'no',
                content: content.html(),
                beforeClose: function() {
                    // Add detached element back into document
                    $(parentId).append(content);
                },
                afterClose: function() {
                    // Return focus back to previous link before lightbox
                    $(callerId).find('a.popup').focus();
                    fancyboxOpen = false;
                },
                onUpdate: function() {
                    // We dynamically change the height of the inner content
                    // area for smaller screens to avoid hiding the scroll bar
                    var boxHeight = $('.fancybox-inner').height();
                    var boxDefault = 618;
                    var contentDefault = 500;
                    
                    if (boxHeight < boxDefault) {
                        var contentSize = contentDefault - (boxDefault - boxHeight);
                    } else {
                        var contentSize = contentDefault;
                    }
                    
                    $('.fancybox-wrap dd.further-info-tab-content').height(contentSize);
                },
                afterShow: function() {
                    initSubNavigation($('.fancybox-wrap #' + parentEle), 'dt', 'dd');
                    $("#fancybox-overlay").unbind();
                    
                    fancyboxOpen = true;
                    
                    $('.fancybox-close').addClass('frutiger').text("CLOSE");
                    
                    // Modify tabindex and focus first element in lightbox
                    var tabIndex = 1;
                    
                    $('.fancybox-inner dl dt').each(function(){
                        $(this).attr('tabindex', tabIndex);
                        tabIndex++;
                    });
                    
                    $('.fancybox-close').attr('tabindex', tabIndex)
                                        .on('keydown', function(e){
                                            if (e.which) {
                                                $(this).click();
                                            }
                                        });
                    
                    $('.fancybox-inner dl dt:first').focus();
                    
                    var playerCount = 0;
                    
                    $('.further-information a.video').each(function() {
                        var div = '<div id="video-player-'+ playerCount +'" />';
                        $(div).insertAfter(this);
                        var file = $(this).attr('href');
                        var stageId = 'video-stage-' + playerCount;
                        var playerId = 'video-player-' + playerCount;
                        var options = { 'id': stageId, 'autostart': false };
                        $(this).remove();
                        Nhs.launchVideo(playerId, file, options);
                        playerCount++;
                    });
                }
            });
        });
    };
    
    /**
     * Handles the next/previous cycle functionality for further information
     * @param {Object} elements
     */
    var initSubNavigation = function(parentEle, titleEle, contentEle) {
            var navigation = [], currentPage, pageTotal;
            
            parentEle.find(titleEle+':first').addClass('selected').attr('aria-selected', true);
            parentEle.find(contentEle+':first').addClass('selected').attr('aria-hidden', false);
            
            addContentView(parentEle.find(contentEle+':first div:first').attr('data-cms-content-id'));
        
            // Build an array of elements in this container
            var elements = parentEle.find('dt');
            elements.each(function(){
                navigation.push($(this).attr('id'));
            });
            
            pageTotal = navigation.length-1;

            // Setup navigation for page load
            if ($('#'+navigation[0]).hasClass('selected')) {
                $('.sub-navigation .previous div').hide();
                currentPage = 0;
            }
            
            // Listener for clicking on further information titles
            $('body').on({
                focus: function() {
                    _cycle($(this), 'title');
                }
            }, '.tabbed-container dt');
            
            // Listener for next/previous navigation buttons
            $('body').on({
                click: function() {
                    _cycle($(this), 'cycle');
                }
            }, '.sub-navigation .nav-link div');
            
            // Subroutine to move back+forth through elements in the subsection
            var _cycle = function(element, type) {
                if (type == 'cycle') {
                    // Just move currentPage +/-
                    if (element.parent('.nav-link').hasClass('previous')) {
                        currentPage--;
                    } else if (element.parent('.nav-link').hasClass('next')) {
                        currentPage++;
                    }
                } else if (type == 'title') {
                    // Change currentPage to the clicked element
                    for (var i = 0; i < navigation.length; i++) {
                        if (element.attr('id') == navigation[i]) {
                            currentPage = i;
                        }
                    }
                }
                
                // Clear existing selected CSS and add to the clicked element
                // to enable the tab functionality
                if (typeof navigation[currentPage] != 'undefined') {
                    var tab = '#' + navigation[currentPage].replace('title', 'content');
                    parentEle.find('dt').removeClass('selected');
                    parentEle.find('dd').removeClass('selected');
                    parentEle.find('.further-info-tab-content').removeClass('selected').attr('aria-hidden', true);
                    
                    // Log the section part view
                    addContentView($(tab + " div:first").attr('data-cms-content-id'));
                    
                    $(tab).addClass('selected').attr('aria-hidden', false);
                    $('#'+navigation[currentPage]).addClass('selected').attr('aria-selected', true);
                }
                
                // Toggle next/previous off if last or first item
                if ($('#' + navigation[0]).hasClass('selected')) {
                    $('.sub-navigation .previous div').hide();
                } else {
                    $('.sub-navigation .previous div').show();
                }

                if ($('#'+navigation[pageTotal]).hasClass('selected')) {
                    $('.sub-navigation .next div').hide();
                } else {
                    $('.sub-navigation .next div').show();
                }
            }
    };
    
    
    /**
     * Initialise the tabbed sections including lightbox functionality for 
     * compare options tab
     */
    var initReferences = function() {
        var activeHover;
        var images = {};
        
        var _preloadImages = function() {
            $('a.image-reference').each(function(){
                var image = new Image();
                var href = $(this).attr('href');
                var id = $(this).text().replace(/ /g, "_");
                image.src = href;
                images[id] = image;
            });
        };
        
        _preloadImages();
        
        /**
         * Show the hover box in the position where the reference is and fetch 
         * the reference text or image into it
         */
        _renderHoverBox = function(event, content, newHover) {
            var hover = $('#hover-wrap');
            if (newHover == activeHover && hover.hasClass('show')) {
                hover.removeClass('show');
            } else {
                hover.find('.content').html(content);
                hover.addClass('show');
                
                var id = $(event.target).text().replace(/ /g, "_");
                var margin = 20;
                
                if (typeof images[id] != 'undefined') {
                    var padding = 40;
                    var boxWidth = images[id].width + padding;
                } else {
                    var boxWidth = hover.outerWidth();
                }
                
                var left = event.pageX - (boxWidth / 2);
                var top = event.pageY + margin;
    
                hover.css({ 
                    top: top + 'px',
                    left: left + 'px'
                });
                
                activeHover = newHover;
            }
        };
        
        $('body').on({
            click: function(e) {
                $('#hover-wrap').removeClass('image text');
                var target = $(e.target);

                // If the click came from a reference element then trigger
                // functionality to show it
                if (target.hasClass('referenceLink') || target.hasClass('image-reference')) {
                    if (target.is('a')) {
                        e.preventDefault();
                        $('#hover-wrap').addClass('image');
                        var newHover = target.attr('href');
                        var content = "<img src='" + newHover + "' ";
                        content += "alt='" + target.text() + "' />";
                    } else {
                        $('#hover-wrap').addClass('text');
                        var newHover = target.attr('id').match(/\d+/);
                        var content = "<h4>[" + newHover + "] REFERENCES</h4>";
                        content += "<p>" + $('#reference-' + newHover).html() + "</p>";
                    }

                    _renderHoverBox(e, content, newHover);
                }
                else {
                    // If the click was not from a reference and we have a 
                    // visible popup then hide it
                    if (activeHover) {
                        $('#hover-wrap').removeClass('show');
                    }
                }
            }
        });
    };
    
    var enableNotes = function() {
        
        /** 
         * Open the note form up by adding the class, then apply class to 
         * this table row and the next row to allow them to expand to fit
         * the form
         */
        var _toggleOpenNote = function(element) {
            element.parents('.row').toggleClass('open-note').children()
                   .toggleClass('grow-down');
            if ($('.compare-options table').find('tr.open-note').length) {
                $('.compare-options table').addClass('open-notes');
            } else {
                $('.compare-options table').removeClass('open-notes');
            }
            
            if (element.parents('div.notes').find('.notes-form').hasClass('open')) {
                element.parents('div.notes').find('.open-note-button')
                       .addClass('open-form').find('span').text("-");
            } else {
                element.parents('div.notes').find('.open-note-button')
                       .removeClass('open-form').find('span').text("+");
            }
            $('.notes-form .buttons').show();
        };
        
        var notesTextarea = $('textarea[name=note]'), 
            initialNotes = notesTextarea.val(),
            formConfirm = $('.form-confirm');
        
        $('body').on('click', '#my-notes .tab', function(e) {
            var that = $(this);
            if (!that.hasClass('notes-disabled') && !that.hasClass('doLogin')) {
                that.toggleClass('selected').attr('aria-selected', that.hasClass('selected'))
                    .siblings('.notes-form').toggleClass('open');
                    
                formConfirm.removeClass('open');
                $(this).parents('.notes').addClass('has-note')
                       .find('.notes-form').find('.update-message').html('');
            }
        });
        
        
        $('body').on('click', '.open-note-button', function(e){
            if (!$(this).parents('table').hasClass('notes-disabled')) {
                $(this).next().toggleClass('open');
                _toggleOpenNote($(this));
            }
        });
        
        $('body').on('click', 'input[name=_closeNote]', function(e){
            e.preventDefault();
            
            // if the user added/updates its notes and want to close the box
            // displays a little message to be sure he wants to close the box
            if (initialNotes != $.trim(notesTextarea.val()) 
                && !formConfirm.hasClass('open')) {
                formConfirm.addClass('open');
                $('.notes-form .buttons').hide();
            } else {
                $(this).parents('.notes-form').toggleClass('open').siblings('.tab').toggleClass('selected').attr('aria-selected', false);
                _toggleOpenNote($(this));
                formConfirm.removeClass('open');
                
                notesTextarea.val(initialNotes);
                
                $(this).parents('.notes').addClass('has-note')
                    .find('.notes-form').find('.update-message').html('');
            }
        });
        
        // Functionality to submit the correct form data to the server to 
        // update the notes against this field
        $('body').on('click', 'input[name=_saveNote]', function(e){
            e.preventDefault();
            
            var data = {
                //noteContentId: $(this).siblings('input[name=noteContentId]').val(),
                pageId: Nhs.Pda.pageId,
                pelorousSectionId: Nhs.Pda.pelorousSectionId,
                note: notesTextarea.val()
            };
            
            // Prevent empty notes from being saved unless they previously held
            // a value
            var hasNote = $(this).parents('div.notes').hasClass('has-note');
            var removeNote = 0;

            if (!hasNote && data.note == "") {
                if (debug === 1 && consoleAvailable === 1) {
                    console.log("Cannot save empty note");
                }
                return;
            } else if (hasNote && data.note == "") {
                removeNote = 1;
            }
            
            $.ajax({
                type: 'POST',
                url: baseUrl + '/xhr-save-note',
                data: data,
                context: $(this),
                success: function(response) {
                    if (debug === 1 && consoleAvailable === 1) {
                        console.log('noteSaved: ');
                        console.log(response);
                        console.log($(this));
                    }
                    
                    // Add a has-note class to parent div and add some text
                    // to show successful save to update-message div
                    $(this).parents('.notes').addClass('has-note')
                           .find('.notes-form').find('.update-message').fadeOut(function() {
                               $(this).html('<span class="success frutiger">Saved</span>').fadeIn();
                           });
                    
                    if (removeNote === 1) {
                        $(this).parents('.notes').removeClass('has-note');
                    }
                    initialNotes = $.trim(notesTextarea.val());
                    
                    if ($(this).hasClass('save-and-close')) {
                        $(this).parents('.notes-form').toggleClass('open').siblings('.tab').toggleClass('selected').attr('aria-selected', false);
                        _toggleOpenNote($(this));
                    }
                }
            });
        });
    };
    
    /**
     * Add class to div#bd if a banner exists in header
     * 
     * @return void
     */
    var bannerAdjust = function() {
        var banner = $('#pda-head-strip img.banner');
        if (banner.hasClass('banner')) {
            $('div#bd').addClass('withBanner');
        }
    };
    
    /**
     * Iterates through all elements in introduction section with a 
     * data-cms-content-id attribute and logs that element as viewed
     */
    var registerContentElementViews = function() {
        $('#pda .introduction > [data-cms-content-id]').each(function(){
            addContentView($(this).attr('data-cms-content-id'));
        });
        $('#pda .compare-grid tr:first th[data-cms-content-id]').each(function(){
            addContentView($(this).attr('data-cms-content-id'));
        });
    };
    
    /**
     * Adds a content view to the overall progress for the PDA
     * 
     * @param {Object} contentId
     */
    var addContentView = function(contentId) {
        // We don't want to log items twice so check viewedContentElements
        // first
        if ($.inArray(contentId, viewedContentElements) > -1) {
            return;
        }
        
        viewedContentElements.push(contentId);
        ajaxQueue.push(contentId);
        
        if (queueProcessing == false) {
            processAjaxQueue();
        }
    };
    
    /**
     * To avoid restrictions on frequency of AJAX calls we process them in a
     * queue here
     */
    var processAjaxQueue = function() {
        if (ajaxQueue.length == 0) {
            queueProcessing = false;
            return;
        }
        
        var nextView = ajaxQueue.splice(0,1);
        queueProcessing = true;

        $.ajax({
            type: 'POST',
            url: baseUrl + '/xhr-add-content-view',
            data: { 'contentId': nextView[0] },
            success: function(response) {
                setTimeout(processAjaxQueue, 500);
                if (debug === 1 && consoleAvailable === 1) {
                    console.log('logPageViewResponse: ');
                    console.log(response);
                }
            }
        });
    };
    
    /**
     * Fetches the current PDA progress as JSON
     */
    var _getProgress = function(sectionId) {
        $.ajax({
            type: 'GET',
            url: baseUrl + '/xhr-get-progress',
            success: function(response) {
                if (debug === 1 && consoleAvailable === 1) {
                    console.log('progressFetched: ');
                    console.log(response);
                }
            }
        });
    };
    
    /**
     * Initialises the comfort level form functionality
     */
    var initSureForm = function() {
        /**
         * If the form has a value for every option then a message should be 
         * displayed based on the SURE values: If any no values are selected 
         * then show unsure, otherwise show sure text
         */
        var _toggleSureText = function() {
            var sure = true;
            var selected = 0;
            $('.step-3 input[type=radio]').each(function(){
                if ($(this).is(':checked')) {
                    selected++;
                    if ($(this).val() == 'no') {
                        sure = false;
                    }
                }
            });
            // Form must be complete
            if (selected < 4) {
                return;
            }
            if (sure === true) {
                $('#sure').show();
                $('#unsure').hide();
            } else {
                $('#sure').hide();
                $('#unsure').show();
            }
        };
        
        _toggleSureText();
        
        $('.step-3 input[type=radio]').on('click', function(){
            _toggleSureText();
            xhrUpdateYourDecision($('#pda form:first').serialize());
        });
    };
    
    /**
     * Updates the state of the Your Decision page on the fly with partial data
     * 
     * @param {Object} params
     */
    var xhrUpdateYourDecision = function(params) {
        $.ajax({
            type: 'POST',
            url: baseUrl + '/xhr-update-your-decision/',
            data: params,
            success: function(response) {
                if (debug === 1 && consoleAvailable === 1) {
                    console.log('decisionState: ');
                    console.log(response);
                }
            }
        });
    };
    
    /**
     * Initialises the functionality to order treatment options on Your Decision
     */
    var initOrderOptions = function(config) {
        var optionCount = $('.options-considered input[type!=hidden]').length;
        var orderedOptions = [];
        
        // Add first and last child classes to option-row elements
        $('.step-1 .option-row:first').addClass('firstChild');
        $('.step-1 .option-row:last').addClass('lastChild');
        
        $('.step-1 .option-row input[type!=hidden]').each(function(){
            if ($(this).is(':checked')) {
                $(this).parents('.option-row').addClass('selected');
            }
        });
        
        /**
         * Show/hide compare tools and form elements depending on the number
         * of comparable treatment options selected
         */
        var _toggleCompareTools = function() {
            var orderItems = $('.options-ordered .order .order-item').length;
            
            if (orderItems > 0) {
                $('.compare-tools .comfort-level').show();
                if (orderItems > 1) {
                    $('.compare-tools .options-ordered').show();
                } else {
                    $('.compare-tools .options-ordered').hide();
                }
            } else {
                $('.compare-tools > div').hide();
            }
        };
        
        /**
         * Removes/adds to orderedOptions array
         * 
         * @param {Object} optionId
         * @param {Object} label
         */
        var _addRemoveOption = function(optionId, label) {
            var optionId = "item-" + optionId.replace(/\[/g, "-").replace(/\]/g, "");

            var newObj = {
                "optionId": optionId,
                "label": label
            };

            // If it already exists remove it, otherwise add new option to list
            var existingId = optionInArray(optionId, orderedOptions);

            if (existingId > -1) {
                orderedOptions.splice(existingId, 1);
            } else {
                orderedOptions.push(newObj);
            }
            
            renderOrderedOptions();
            
            _toggleCompareTools();
        };
        
        /**
         * Reorders the orderedOptions array for display
         * 
         * @param {Object} optionId
         * @param {Object} direction
         */
        var _moveOption = function(optionId, direction) {
            // Find index key for item
            var existingId = optionInArray(optionId, orderedOptions);

            switch (direction) {
                case 'up' :
                    var newId = existingId-1;
                    break;
                case 'down' :
                    var newId = existingId+1;
                    break
            }
            
            var temp = orderedOptions[existingId];
            orderedOptions[existingId] = orderedOptions[newId];
            orderedOptions[newId] = temp;
            
            renderOrderedOptions();
        };
        
        /**
         * Updates for form value with the current preferred treatment option
         * and shows and related pda next step boxes
         */
        var _updatePreferredOption = function() {
            // Update the preferredOption value for form
            if (typeof orderedOptions[0] != 'undefined') {
                $('input[name=preferredTreatmentOption]').val(orderedOptions[0].optionId);
                $('input[name=preferredTreatmentOptionText]').val(orderedOptions[0].label);
                $('.current-preferred-treatment').text(orderedOptions[0].label);
                
                // If the preferredOption has a related PDA hidden then show it
                $('.related-pdas').hide();
                var relatedPda = orderedOptions[0].optionId.match(/\d+/);
                relatedPda = "#related-pda-" + relatedPda[0];
                $(relatedPda).show();
            } else {
                $('input[name=preferredTreatmentOption]').val(0);
                $('.current-preferred-treatment').text('');
                $('.related-pdas').hide();
            }
        };
        
        /**
         * Creates and inserts the HTML bases on the orderedOptions array
         */
        var renderOrderedOptions = function() {
            var newItem = "<div class='items'>";

            for (var i = 0; i < orderedOptions.length; i++) {
                newItem += "<div class='order-item' " 
                        + "data-order='" + (i + 1) 
                        + "' " + "id='" + orderedOptions[i].optionId 
                        + "'><div class='label inline-block'>" 
                        + orderedOptions[i].label
                        + "</div><div class='controls inline-block'>";
                // Adds the correct buttons to move the rows up/down
                if (i == 0 && orderedOptions.length > 1) {
                    newItem += "<div class='up disabled' role='button'>Move Up</div>";
                    newItem += "<div class='down' role='button'>Move Down</div>";
                } else if (i == (orderedOptions.length-1) && orderedOptions.length > 1) {
                    newItem += "<div class='up' role='button'>Move Up</div>";
                    newItem += "<div class='down disabled' role='button'>Move Down</div>";
                } else if (orderedOptions.length > 1) {
                    newItem += "<div class='up' role='button'>Move Up</div>"
                            + "<div class='down' role='button'>Move Down</div>";
                }
                newItem += "</div></div>";
            }
            
            newItem += "</div>";
            
            // In all cases re-render html for the list
            $('.options-ordered .order').html(newItem);
            $('.step-2 .order-item:first').addClass('firstChild');
            $('.step-2 .order-item:last').addClass('lastChild');
            $('.step-3 dt:first, .step-3 dd:first').addClass('firstChild');
            $('.step-3 dt:last, .step-3 dd:last').addClass('lastChild');

            _updatePreferredOption();
            _updateOrderFormValues();
        };
        
        /**
         * Updates the form values to apply the correct order based on user
         * re-ordering
         */
        var _updateOrderFormValues = function() {
            $('.step-1 input[type=hidden]').val('');
            for (var i = 0; i < orderedOptions.length; i++) {
                var id = orderedOptions[i].optionId.match(/\d+/);
                id = "#optionsOrder-option_" + id;
                $(id).val(i);
            }
        }
        
        /**
         * Function to be run on page load to create the initial structure
         */
        var _setOrderedOptionsArray = function() {
            var order = [];
            // Assemble a new array structured from the order value of hidden
            // form elements
            $('input[name^="optionsOrder"]').each(function(){
                var checked = $(this).parent().prev().find('input[type=checkbox]').is(':checked')
                if (checked) {
                    var id = $(this).attr('id').match(/\d+/);
                    id = '#treatmentOptions-' + id;
                    var pos = $(this).val();
                    order[pos] = id;
                }
            });

            // Loop through this new array and add the elements in order to the
            // orderedOptions array to render correctly from saved values
            for (i in order) {
                var optionId = $(order[i]).attr('name');
                var label = $(order[i]).parent('dd').prev('dt').find('label').text();
                _addRemoveOption(optionId, label);
            }
        };
        
        // Modified inArray function to look for object properties
        var optionInArray = function(value, array) {
            var inArray = -1;
            
            for (var i = 0; i < array.length; i++) {
                if (array[i].optionId == value) {
                    return i;
                }
            }
            
            return inArray;
        };
        
        // Needs to be run on page load to pre-format values for preference
        // order functionality
        _setOrderedOptionsArray();
        
        // Add some listeners for add/remove/reorder functions
        _toggleCompareTools();
        
        // If this is a single treatment option PDA e.g. AAA then we need to add
        // the selected radio to the orderedOptions array manually
        if (config.singleOption == 1) {
            var optionId = $('.step-1 input[type=radio]:checked').val();
            var label = $('.step-1 input[type=radio]:checked').parents('dd').prev('dt').find('label').text();
            if (optionId && label) {
                _addRemoveOption(optionId, label);
            }
        }
        
        // Add click event handlers for entire row
        $('.step-1 .form').on('click', 'div.option-row', function(e){
            if (config.singleOption == 1) {
                $(this).find('input[type=radio]').click();
            }
            else {
                $(this).find('input[type=checkbox]').click();
            }
        });
        
        $('.options-considered input[type=checkbox]').on('click', function(e){
            e.stopPropagation();
            var optionId = $(this).attr('name');
            var label = $(this).parent('dd').prev('dt').find('label').text();
            _addRemoveOption(optionId, label);
            $(this).parents('.option-row').toggleClass('selected');
            xhrUpdateYourDecision($('#pda form:first').serialize());
        });
        
        $('.options-considered input[type=radio]').on('click', function(e){
            e.stopPropagation();
            // If we have a previous selection remove it from orderedOptions
            if (orderedOptions.length > 0) {
                var oldOption = "#" + orderedOptions[0].optionId.replace('item', 'treatmentChoice');
                var optionId = $(oldOption).val();
                var label = $(oldOption).parents('.option-row').find('label').text();
                $('.option-row').removeClass('selected');
                _addRemoveOption(optionId, label);
                $(oldOption).toggleClass('selected');
            }
            
            // Add the newly selected option
            var optionId = $(this).val();
            var label = $(this).parents('dd').prev('dt').find('label').text();
            _addRemoveOption(optionId, label);
            $(this).parents('.option-row').toggleClass('selected');
            xhrUpdateYourDecision($('#pda form:first').serialize());
        });
        
        $('#pda .options-ordered').on('click', '.controls div', function(){
            var optionId = $(this).parents('div.order-item').attr('id');
            if ($(this).hasClass('up') && !$(this).hasClass('disabled')) {
                _moveOption(optionId, 'up');
            } else if ($(this).hasClass('down') && !$(this).hasClass('disabled')) {
                _moveOption(optionId, 'down');
            }
            xhrUpdateYourDecision($('#pda form:first').serialize());
        });
    };
    
    /**
     * Initialised functionality to hide/show compare options grid columns
     */
    var initCompareGrid = function() {
        // Set an initial value for number of visible columns. Visible meaning
        // all selected options not the amount currently on screen
        var checkedColCount = $('.selected-columns input[type=checkbox]:checked').length;
        var totalColCount = $('.selected-columns input[type=checkbox]').length;
        var hiddenCols = totalColCount - checkedColCount;
        var onScreenCols = $('.compare-grid th').not('.attribute').length;

        var visibleCols = [];
        var onScreenMaxCols = 4;
        var columnStartIndex = 0;
        var offScreenCols = 0;
        var warningSetting;
        var canScrollLeft = false;
        var controlClicked = false;
        
        // If the settings_showGridWarnings cookie is set then take its value.
        // In all other cases it should be true.
        // Cookies return strings so don't check for bool!
//        var showWarnings = Nhs.getCookie('settings_showGridWarnings');
//        showWarnings = (showWarnings === 'false') ? false : true;
        
        var _formatGridContainer = function() {
            var grid = $('#grid-container');
            
            if (onScreenCols < 5) {
                grid.removeAttr('style').removeClass('overhang');
                return;
            }
            
            // We have to define values for column width here rather than
            // measure them on the fly because the measurements are first 
            // determined by the browser based on column % widths and we 
            // need to maintain the desired width as the amount of columns
            // change.
            
            var columnWidth = 203; // column width + right hand padding of table
            var firstColWidth = 130; // first column width
            var bodyWidth = 920; // width of body div
            var borderWidth = 20; // you guessed it
            var winWidth = $(window).width();
            var newGridWidth = firstColWidth + (columnWidth * onScreenCols);
            var overhang = (newGridWidth - bodyWidth) + borderWidth;
            var gridWiderThanWin = (newGridWidth >= winWidth) ? true : false;
            
            if (overhang > 0 && gridWiderThanWin === false) {
                var marginLeft = '-' + (overhang / 2) + 'px';
                grid.css({ marginLeft: marginLeft });
            }
            
            grid.width(newGridWidth).addClass('overhang');
        };
        
        _formatGridContainer();
        
        /**
         * Determines if there are any off screen columns and shows a warning 
         * if applicable
         */
        var _anyOffScreenCols = function() {
            offScreenCols = Math.max(0, checkedColCount - onScreenMaxCols);
            canScrollLeft = ((offScreenCols - columnStartIndex) > 0) ? true : false;

            if (offScreenCols > 0 && showWarnings) {
                $('#offscreen-col-warning').addClass('show-warning');
            } else {
                $('#offscreen-col-warning').removeClass('show-warning');
            }
        };
        
        /**
         * Based on the number of columns currently checked by the user as
         * being visible this function hides or shows the scroll controls
         */
        var _updateControls = function() {
            if (checkedColCount <= 4) {
                $('.scroll > div').hide().attr('aria-hidden', true);
            } else {
                $('.scroll > div').show().attr('aria-hidden', false);
            }
        }
        
        /**
         * To fix a rendering issue with some (ie) browsers and fixed table
         * layout we add a class based on the number of variable width columns
         * visible on screen for % based calculations
         */
        var _addNumberClass = function() {
            var number = '';
            
            switch (onScreenCols) {
                case 4 :
                    number = 'four';
                    break;
                case 3 :
                    number = 'three';
                    break;
                case 2 :
                    number = 'two';
                    break;
            }
            
            $('.compare-grid th, .compare-grid td').not('.attribute').addClass(number);
        };
        
        /**
         * Add column close / hide listeners
         * 
         * @return void
         */
        var _addColCloseListeners = function() {
            var cols = $('#pda .compare-grid th.option');
            if (cols.length < 2) {
                cols.addClass('no-close');
                return;
            }
            $('#pda .compare-grid th.option').on('click', function() {
                var optionId = $(this).attr('id').replace(/.*-/,'');
                var checkboxId = 'selectedColumns-' + optionId;
                
                var wrap = $('.selected-columns');
                if (!wrap.hasClass('selected')) {
                    $('.introduction #select-options').triggerHandler('click');
                }
                $('#' + checkboxId).attr('checked', false);
                _fetchGrid();
            });
        };

        /**
         * Fetches grid html based on the visible columns
         */
        var _fetchGrid = function() {
            visibleCols = [];
            $('.selected-columns input[type=checkbox]').each(function(){
                if ($(this).is(':checked')) {
                    var idSplit = $(this).attr('name').match(/\[(\d+)\]/);
                    var colId = idSplit[1];
                    visibleCols.push(colId);
                }
            });

            $('#loadmask').show();
            
            $.ajax({
                type: 'GET',
                url: baseUrl + '/xhr-get-rendered-grid',
                data: {
                    visibleColumns: visibleCols,
                    startIndex: columnStartIndex
                },
                success: function(response) {
                    controlClicked = false;
                    $('.compare-grid').html(response);
                    
                    // Update the checked column count
                    checkedColCount = $('.selected-columns input[type=checkbox]:checked').length;
                    hiddenCols = totalColCount - checkedColCount;
                    onScreenCols = $('.compare-grid th').not('.attribute').length;

                    _addNumberClass();
                    _formatGridContainer();
//                    _updateControls();
                    
                    var wrap = $('.selected-columns');
                    
                    if (hiddenCols > 0) {
                        wrap.addClass('show-warning').height(wrapOpenWarningHeight);
                    } else {
                        wrap.removeClass('show-warning');
                        // We only want to adjust height of column select div
                        // if it was already open at the time of change
                        if ($('.selected-columns').hasClass('selected')) { 
                            wrap.height(wrapOpenHeight);
                        }
                    }
                    
                    // Add any new content elements to viewed objects
                    registerContentElementViews();
                    
                    // Update the offScreenCols variable with new count
//                    _anyOffScreenCols();

                    // add col close listeners 
                    _addColCloseListeners();
                    
                    $('#loadmask').hide();
                },
                failure: function(response) {
                    $('#loadmask').hide();
                }
            });
        };
        
        /**
         * Toggles the hidden form value associated with the checkbox to its
         * opposite state
         * 
         * @param {Object} element
         */
        var _toggleValue = function(element) {
            if (element.parent().siblings('input[type=hidden]').val() == 1) {
                element.parent().siblings('input[type=hidden]').val(0);
            } else {
                element.parent().siblings('input[type=hidden]').val(1);
            }
        };
        
        /**
         * Make all column cells the height of the tallest element
         */
        var _fixOptionHeight = function() {
            var maxHeight = 0;
            var height = 0;
            $('.columns > div').each(function(){
                height = $(this).height();
                if (height > maxHeight) {
                    maxHeight = Math.round(height);
                }
            });
            $('.columns .left, .columns .right').height(maxHeight);
        };
        
//        _anyOffScreenCols();
        _formatGridContainer();
        _fixOptionHeight();
//        _updateControls();
        _addNumberClass();
        
        // Listeners for the checkbox treatment options to add or remove
        // options from the grid
        $('.selected-columns input[type=checkbox]').on('click', function(e) {
            if ($('.selected-columns input[type=checkbox]:checked').length < 1) {
                e.preventDefault();
                return;
            }
            _toggleValue($(this));
            _fetchGrid();
        });
        
        // add col close listeners if more than two options
        var cols = $('#pda .compare-grid th.option');
        if (cols.length > 2) {
            _addColCloseListeners();
        } else {
            cols.addClass('no-close');
        }
        
        // Functionality for the SHOW ALL button
        $('#hidden-col-warning .reset').on('click', function(e){
            e.preventDefault();
            $('.selected-columns input[type=checkbox]').each(function(){
                _toggleValue($(this));
                $(this).attr('checked', true);
            });
            _fetchGrid();
        });

        // Add listeners for scroll buttons
        $('body').on('click', '.scroll-button', function(e) {
            // Stop users smashing buttons
            if (controlClicked !== false) {
                return;
            }
            
            $(this).attr('aria-pressed', true);
            
            // The scroll left functionality is attached to the right button
            // for usability... allegedly
            if ($(this).hasClass('right')) {
                if (canScrollLeft) {
                    controlClicked = true;
                    columnStartIndex++;
                    _fetchGrid();
                }
            } else {
                if (columnStartIndex-1 >= 0) {
                    controlClicked = true;
                    columnStartIndex--;
                    _fetchGrid();
                }
            }
        });
        
        var wrap = $('.selected-columns');
        var wrapOpenHeight = (wrap.outerHeight() + $('.column-wrap').outerHeight()) - 10;
        var wrapOpenWarningHeight = wrapOpenHeight + 60;
        
        // Add listeners for select columns button
        $('.introduction #select-options').on('click', function(){
            if (wrap.hasClass('selected')) {
                wrap.toggleClass('selected').height('');
            } else {
                
                wrap.toggleClass('selected').height(wrapOpenHeight);
            }
        });
        
        $('body').on('click', '.form-elements .close-warning', function(e){
            e.preventDefault();
            e.stopPropagation();
            if ($('input[name=hideWarnings]').is(':checked')) {
                if (Nhs.storageAvailable()) {
                    Nhs.setCookie('settings_showGridWarnings', false);
                    showWarnings = false;
                }
                else {
                    hideWarnings = true;
                }
            }
            $('#offscreen-col-warning').removeClass('show-warning');
        });
    };
    
    /**
     * Functionality for the "my values" section of a PDA
     */
    var initValuesForm = function(config) {
        var myValuesStepContent = $('.my-values-step-content'),
            myValuesIntroduction = $('.my-values-introduction'),
            saveContinueWrapper = $('#saveAndContinue');
        
        if (myValuesIntroduction.length) {
            myValuesStepContent.hide();
            saveContinueWrapper.hide();
        }
        
        $('#show-values-form').on('click', function() {
            myValuesIntroduction.hide();
            myValuesStepContent.show();
            saveContinueWrapper.show();
            return false;
        });
        
        $('a#skip').on('click', function() {
            $('#skip-hidden').val(1);
            $(this).parents('form').submit();
            return false;
        });
    };
    
    /**
     * Functionality for the help section of a PDA
     */
    var initHelpSection = function(config){
        var helpOpen = false;
        var slideTab = '.help-content .tab-body';
        var helpBtns = '#close-help-top, #close-help-bottom';
        var tabContentClass = '.tab-body';
        var element = '#help-key-facts';
        var pdaDom = '#pda';
        var footerDom = '#ft';
        
        var _closeHelp = function() {
            $(pdaDom).show();
            $(footerDom).show();
            $(slideTab).removeClass('selected');
            helpOpen = false;
            $(helpBtns).hide();
            $(tabContentClass + ' > div').removeClass('selected').attr('aria-hidden', true);
        };
        
        $(element).on('click', '.help-trigger', function(e) {
            if ($(e.target).is('a')) {
                e.preventDefault();
            }
            
            if (helpOpen === false) {
                $(pdaDom).hide();
                $(footerDom).hide();
                $('.help-content > .tab-body').addClass('selected');
                $(helpBtns).show();
                helpOpen = true;
                $(tabContentClass + ' > div').removeClass('selected').attr('aria-hidden', true);
                $('#' + $(this).attr('aria-controls')).addClass('selected').attr('aria-hidden', false);
            }
        });
        
        var autoPlay = $('#' + config.autoPlayId);
        var title = autoPlay.find('h4.title').text();
        var file = autoPlay.attr('data-s3-filename');
        var preview = autoPlay.attr('data-preview-image');
        var containerId = 'video-stage';
        var options = {
            autostart: false,
            width: 705,
            height: 397
        }
        
        if (preview) {
            options.image = preview;
        }
        
        $(helpBtns).on('click', function(){
            _closeHelp();
        });

        $('#video-content .right-col h3.video-title').text(title);

        Nhs.launchVideo(containerId, file, options);
        
        $('.video-item').on('click', function(){
            file = $(this).attr('data-s3-filename');
            preview = $(this).attr('data-preview-image');
            title = $(this).find('h4.title').text();
            
            options.image = preview ? preview : null; 
            
            $('#video-content .right-col h3.video-title').text(title);
            Nhs.launchVideo(containerId, file, options);
        });
    };
    
    var standardLightbox = function(content, parentEle, wrapCss, wrapHtml) {
        if (wrapHtml) {
            var newContent = wrapHtml + content.html() + '</div>';
        } else {
            var newContent = content.html();
        }

        $.fancybox({
            type: 'inline',
            wrapCSS: wrapCss,
            padding: 10,
            autoSize: true,
            minWidth: 980,
            maxWidth: 980,
            scrolling: 'no',
            content: newContent,
            beforeClose: function() {
                // Add detached element back into document
                $(parentEle).append(content);
            },
            afterClose: function() {
                // Return focus back to previous link before lightbox
                fancyboxOpen = false;
            },
            onUpdate: function() {
                // We dynamically change the height of the inner content
                // area for smaller screens to avoid hiding the scroll bar
                var boxHeight = $('.fancybox-inner').height();
                var boxDefault = 618;
                var contentDefault = 500;
                
                if (boxHeight < boxDefault) {
                    var contentSize = contentDefault - (boxDefault - boxHeight);
                } else {
                    var contentSize = contentDefault;
                }
                
                $('.fancybox-wrap dd.further-info-tab-content').height(contentSize);
            },
            afterShow: function() {
                initSubNavigation($('.fancybox-wrap.further-information dl.tabbed-container'), 'dt', 'dd');
                $("#fancybox-overlay").unbind();
                
                fancyboxOpen = true;
                
                $('.fancybox-close').addClass('frutiger').text("CLOSE");
                
                // Modify tabindex and focus first element in lightbox
                var tabIndex = 1;
                
                $('.fancybox-inner dl dt').each(function(){
                    $(this).attr('tabindex', tabIndex);
                    tabIndex++;
                });
                
                $('.fancybox-close').attr('tabindex', tabIndex)
                                    .on('keydown', function(e){
                                        if (e.which) {
                                            $(this).click();
                                        }
                                    });
                
                $('.fancybox-inner dl dt').filter(':first').focus();
                
                var playerCount = 0;
                
                $('.further-information a.video').each(function() {
                    var div = '<div id="video-player-'+ playerCount +'" />';
                    $(div).insertAfter(this);
                    var file = $(this).attr('href');
                    var stageId = 'video-stage-' + playerCount;
                    var playerId = 'video-player-' + playerCount;
                    var options = { 'id': stageId, 'autostart': false };
                    $(this).remove();
                    Nhs.launchVideo(playerId, file, options);
                    playerCount++;
                });
            }
        });
    };
    
    /**
     * Functionality for the help/key facts section of a PDA
     */
    var initHelpKeyFacts = function(config) {
        initHelpSection(config);
        
        var helpBox = $('#help-key-facts');
        var pdaIntro = $('#pda div.introduction:first');
        var helpContent = $('#help-key-facts-dyn-content');
        var parentEle = '';
        
        $('#help-key-facts-btn').on('click', function(){
            if (helpBox.hasClass('open')) {
                helpBox.removeClass('open').find('.help-key-facts-content').attr('aria-hidden', true);
                pdaIntro.removeClass('help-open');
            } else {
                helpBox.addClass('open').find('.help-key-facts-content').attr('aria-hidden', false);
                pdaIntro.addClass('help-open');
            }
        });
        
        $('#help-more-info').on('click', function() {
            if (config.sectionId != Nhs.Pda.SECTION_INTRO) {
                console.log('here');
                var furtherInfo = helpContent.find('.detach-further-info').detach();
                parentEle = '#help-key-facts-dyn-content';
                standardLightbox(furtherInfo, parentEle, 'further-information');
                initSubNavigation($('.fancybox-wrap.further-information dl.tabbed-container'), 'dt', 'dd');
            } else {
                $('body, html').animate({
                    scrollTop: ($('.detach-further-info').offset().top-$('#header').height()) + 'px'
                });
            }

        });
        
        $('#help-options .items > div').on('click', function() {
            var container = $(this).attr('data-option-info');
            var furtherInfo = helpContent.find('#' + container+' .insert-container').detach();
            parentEle = '#' + container;
            standardLightbox(furtherInfo, parentEle, 'further-information');
        });
    };
    
    /**
     * Vertical center alignment
     */
    var verticalAlign = function() {
        var dHeight = $('.getting-started #help').outerHeight();
        var pHeight = $('.getting-started #help p').outerHeight();
        var top = (dHeight / 2) - (pHeight / 2);
        $('.getting-started #help p').css({top: top});
    };
    
    /**
     * Allows the user to click the large label to select the radio option
     */
    var enableFormLabelSelect = function() {
        $('.values-form dd .radio-option').on('click', function(){
            $(this).parents('dd').find('.radio-option').removeClass('selected').find('input').attr('checked', false);
            $(this).addClass('selected').find('input').attr('checked', true);
        });
    };
    
    /**
     * Adds firstItem/lastItem CSS classes to items
     */
    var addFirstLast = function() {
        $('#pda-head-strip .main-nav.tab-titles > .title:first').addClass('firstItem');
        $('#pda-head-strip .main-nav.tab-titles > .title:last').addClass('lastItem');
        $('.video-listing .video-item:last').addClass('lastItem');
    };
    
    /**
     * Functionality for open/close of related PDA items
     */
    var enableRelatedPdas = function() {
        $('.introduction .related-pdas .title').on('click', function(){
            $(this).parent().toggleClass('open');
        });
    }
    
    var addNextStepListeners = function() {
        initSubNavigation($('.step-5 dl.tabbed-container'), 'dt', 'dd');
    };
    
    /**
     * Functionality for open/close of key fact items
     */
    var initKeyFacts = function() {
        $('.further-information.reduced-content dt').on('click', function(){
            $(this).toggleClass('selected').next().toggleClass('selected');
            var padding = 21;
            var content = $(this).next('dd').find('.content');
            var height = content.outerHeight();
            $(this).next().find('.links').height(height-40);
            addContentView(content.attr('data-cms-content-id'));
        });
    };
    
    
    /**
     * Functionalities used on the intro page
     */
    var initIntro = function() {
        var anchorLink = $('a.more-info'),
            anchorHash,
            anchorTarget;
            
        if (!anchorLink.length) {
            return;
        }
        anchorHash = anchorLink[0].hash;
        anchorTarget = $(anchorLink[0].hash);
        
        $('body').on('click', 'a.more-info', function(e) {
            window.scrollTo(0, anchorTarget.position().top - 200);
            return false;
        });
    };
    
    
    
    /**
     * Summary form and options functionality
     */
    var initSummary = function(config) {
        
        if (config.printAll) {
             $('#prepare-form form').submit();
        }
        
        $('#custom-print-btn').on('click', function(){
            window.location.href = baseUrl + "/progress-summary/?customise=1";
        });
        _enableDynamicForm();
    };
    
    /**
     * Internal function for dynamic summary form
     */
    var _enableDynamicForm = function() {
        $('input[type=checkbox]').on('change', function(){
            if ($(this).is(':checked')) {
                $(this).parents('dd').addClass('selected').prev().addClass('selected');
            } else {
                $(this).parents('dd').removeClass('selected').prev().removeClass('selected');
            }
        });
        
        $('.select-sub-items input[type=checkbox]').on('change', function(){
            var selectClass = "." + $(this).attr('data-sub-select');
            if ($(this).is(':checked')) {
                $(selectClass).addClass('selected');
                $("dd div" + selectClass).find('input[type=checkbox]').each(function(){
                    $(this).attr('checked', true);
                });
            } else {
                $(selectClass).removeClass('selected');
                $("dd div" + selectClass).find('input[type=checkbox]').each(function(){
                    $(this).attr('checked', false);
                });
            }
        });
        
        var dtHeight = 0;
        $('input[type=checkbox]').each(function(){
            dtHeight = $(this).parents('dd').prev('dt').outerHeight();
            if (dtHeight) {
                $(this).parents('dd').outerHeight(dtHeight).prev('dt').outerHeight(dtHeight);
            }
        });
    };
    
     var initSendToGP = function() {
         $('.show-gps').on('click', function(){
             var defText = 'SHOW DOCTORS AT THIS SURGERY';
             var openText = 'HIDE DOCTORS AT THIS SURGERY';
             if ($(this).parent('.practice').hasClass('open')) {
                 $(this).text(defText);
                 $(this).parents('.practice').find('.gps').attr('aria-hidden', true);
                 $(this).height(13);
             } else {
                 $(this).text(openText);
                 var height = $(this).next('.details').innerHeight();
                 $(this).height(height-10);
                 $(this).parents('.practice').find('.gps').attr('aria-hidden', false);
             }
             $(this).parent('.practice').toggleClass('open');
         });
         
         $('.practice input[type=radio]').on('change', function(){
             $('.practice').removeClass('selected');
             if ($(this).is(':checked')) {
                 $(this).parents('.practice').addClass('selected');
                 var pId = "#practice-" + $(this).val();
                 var surgeryName = $(pId).next('label').text();
                 var surgeryAddy = $(pId).siblings('.address').text();
                 var selectedTxt = surgeryName + " located at " + surgeryAddy;
                 $('#selected-pid').text(selectedTxt);
                 $('.submit').show().attr('aria-hidden', false);
             }
         });
         
         $('.practice:first').addClass('firstItem');
         $('.practice:last').addClass('lastItem');
     };
    
    /**
     * Increase the hit area of the main navigation buttons
     */
     var enableMenuLinks = function() {
         $('.tab-titles .title .link, .tab-titles .title .tab-no').on('click', function(e){
             if ($(e.target).is('a')) {
                 window.location.href = $(e.target).attr('href');
                 return;
             }
             if ($(e.target).hasClass('tab-no')) {
                 $(e.target).siblings('.link').find('a').click();
             }
             else {
                 $(this).find('a').click();
             }
         });
     };
    
    /**
     * Enables some debug output
     */
    var startDebug = function() {
        debug = 1;
        var tabKey = 9;
        
        if (typeof console != 'undefined'
            && typeof console.log == 'function') {
            consoleAvailable = 1;
            console.log('debug started');
            console.log('baseUrl: ' + baseUrl);
            _getProgress();
        }
        
        $('body').on({
            focus: function(event) {
                $(this).toggleClass('focus');
                $('#debug .focus-element').text($(this).html());
            },
            blur: function() {
                $(this).toggleClass('focus');
            }
        }, 'a, input');
    };
    
    return {
        SECTION_INTRO: 1,
        SECTION_OPTIONS: 2,
        SECTION_VIEWS: 3,
        SECTION_TRADE_OFFS: 4,
        SECTION_DECISION: 5,
        SECTION_SUMMARY: 7,
        SECTION_GETTING_STARTED: 10,
        SECTION_HELP: 11,
        SECTION_KEY_FACTS: 12,
        SECTION_SEND_TO_DOC: 13,
        
        pelorousSectionId: null,
        pageId: null,
        
        init: function(config) {
            config = config || {};
            baseUrl = config.baseUrl || '/';
            
            if (config.debug) {
                startDebug();
            }
            
            if (config.sectionId) {
                sectionId = config.sectionId;
            }
            
            if (config.pelorousSectionId) {
                this.pelorousSectionId = config.pelorousSectionId;
            }
            
            if (config.pelorousSectionId) {
                this.pageId = config.pageId;
            }
            
            /*
             * Methods that should be called on all pages
             */
            Nhs.init();
            enableMenuLinks();
            Nhs.initAria();
            bannerAdjust();
            enableNotes();
            initTabs();
            initReferences();
            addFirstLast();
            registerContentElementViews();
            Nhs.enableVideoLinks();
            
            /*
             * Section specific methods
             */
            if (config.sectionId === Nhs.Pda.SECTION_GETTING_STARTED) {
                verticalAlign();
            }
            
            if (config.sectionId === Nhs.Pda.SECTION_INTRO) {
                enableRelatedPdas();
                initKeyFacts();
                initIntro();
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_KEY_FACTS) {
                initKeyFacts();
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_TRADE_OFFS) {
                
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_OPTIONS) {
                initCompareGrid();
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_VIEWS) {
                enableFormLabelSelect();
                initValuesForm(config);
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_DECISION) {
                initOrderOptions(config);
                initSureForm();
                enableFormLabelSelect();
                addNextStepListeners();
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_SUMMARY) {
                initSummary(config);
            }
            
            if (config.sectionId == Nhs.Pda.SECTION_HELP) {
                
            }

            if (config.sectionId == Nhs.Pda.SECTION_SEND_TO_DOC) {
                initSendToGP(config);
            }
            
            initHelpKeyFacts(config);
        }
    };
}();

$('document').ready(function(){
    Nhs.init();
    Nhs.Site.init();
//    $('head').append('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, target-densitydpi=device-dpi" >');
//    $('head').append('<meta name="apple-touch-fullscreen" content="YES" />');
});
