/**
 * Created by yuchunbo on 2015/4/2.
 */
(function(A){
    A.widget.printCounter = 0;
	A.widget.print=function(options){
        var modes = { iframe : "iframe", popup : "popup" };
        var standards = { strict : "strict", loose : "loose", html5 : "html5" };
        var pagesize = {
            A5 : 'width: 210mm;height: 147mm;overflow:hidden;',
            A4 : 'height: 210mm;width: 297mm;overflow:hidden;',
            auto:''
        }
        var defaults = { mode       : modes.iframe,
            standard   : standards.html5,
            popHt      : 500,
            popWd      : 400,
            popX       : 200,
            popY       : 200,
            popTitle   : '',
            popClose   : true,
            extraCss   : '',
            extraHead  : '',
            retainAttr : ["id","class","style"] ,
            extraScripts:[]
        };

        var settings = {};
        $.extend( settings, defaults, options );
        var PrintArea = {
            print : function (content) {
                A.widget.printCounter++;
                var idPrefix = "printArea_";
                $( "[id^=" + idPrefix + "]" ).remove();

                settings.id = idPrefix + A.widget.printCounter;

                var PrintAreaWindow = PrintArea.getPrintWindow();

                PrintArea.write( PrintAreaWindow.doc, content );

                setTimeout( function () { 
                    PrintAreaWindow.doc.close();
                    PrintArea._print( PrintAreaWindow ); }, 1000 );
            },
            _print : function( PAWindow ) {
                var paWindow = PAWindow.win;

                $(PAWindow.doc).ready(function(){
                    paWindow.focus();
                    setTimeout(function(){
                        paWindow.print();
                    },500)
                    
                    if ( settings.mode == modes.popup && settings.popClose )
                        setTimeout(function() { paWindow.close(); }, 1000);
                });
            },
            write : function ( PADocument, content ) {
                PADocument.open();
                PADocument.write( PrintArea.docType() + "<html>" + PrintArea.getHead() + PrintArea.getBody( content ) + "</html>" );
                // PADocument.close();
            },
            pageSize : function(){
                try{
                    return ' style="' + pagesize[settings.paperType] + '" ';
                }catch (e){
                    console.log(e.message);
                }
            },
            docType : function() {
                if ( settings.mode == modes.iframe ) return "";

                if ( settings.standard == standards.html5 ) return "<!DOCTYPE html>";

                var transitional = settings.standard == standards.loose ? " Transitional" : "";
                var dtd = settings.standard == standards.loose ? "loose" : "strict";

                return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd +  '.dtd">';
            },
            getHead : function() {
                var extraHead = "";
                var links = "";

                if ( settings.extraHead ) settings.extraHead.replace( /([^,]+)/g, function(m){ extraHead += m });

                $(document).find("link")
                    .filter(function(){ // Requirement: <link> element MUST have rel="stylesheet" to be considered in print document
                        var relAttr = $(this).attr("rel");
                        return ($.type(relAttr) === 'undefined') == false && relAttr.toLowerCase() == 'stylesheet';
                    })
                    .filter(function(){ // Include if media is undefined, empty, print or all
                        var mediaAttr = $(this).attr("media");
                        if(!mediaAttr) return false;
                        return mediaAttr.toLowerCase() == 'print' || mediaAttr.toLowerCase() == 'all'
                    })
                    .each(function(){
                        links += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >';
                    });
                if ( settings.extraCss ) {
                    if(typeof settings.extraCss == 'string'){
                        settings.extraCss.replace( /([^,\s]+)/g, function(m){ links += '<link type="text/css" rel="stylesheet" href="' + m + '">' });
                    }else{
                        A.each(settings.extraCss, function(_index, css){
                            links += '<link type="text/css" rel="stylesheet" href="' + css + '">';
                        })
                    }
                    
                }
                var extraScripts = settings.extraScripts,
                    html = [];
                for(var index = 0,len = extraScripts.length; index<len; index++){
                    html.push('<script src="' + extraScripts[index] + '" type="text/javascript" charset="utf-8"></script>');
                }

                return "<head><title>" + settings.popTitle + "</title>" + html.join('') + extraHead + links + "</head>";
            },
            getBody : function ( content ) {
                var unitArr = [].concat(content);
                var htm = "";
                var attrs = settings.retainAttr;

                unitArr = $.map(unitArr,function(unit){
                    return $(PrintArea.construTpl(unit));
                })

                $.each(unitArr,function(index) {
                    var ele = PrintArea.getFormData( $(this) );

                    var attributes = ""
                    for ( var x = 0; x < attrs.length; x++ )
                    {
                        var eleAttr = $(ele).attr( attrs[x] );
                        if ( eleAttr ) attributes += (attributes.length > 0 ? " ":"") + attrs[x] + "='" + eleAttr + "'";
                    }

                    htm += '<div ' + attributes + ' '+ PrintArea.pageSize() +'>' + $(ele).html() + '</div>';
                    if(index<unitArr.length-1){
                        htm += '<div style="page-break-after: always"></div>'
                    }
                });

                return "<body>" + htm + "</body>";
            },
            construTpl : function (unit) {
                try {
                    return A.widget[unit.driverType](unit.data);
                }catch (e){
                    console.log(unit.driverType+"模板组件缺失");
                }
            },
            getFormData : function ( ele ) {
                var copy = ele.clone();
                var copiedInputs = $("input,select,textarea", copy);
                $("input,select,textarea", ele).each(function( i ){
                    var typeInput = $(this).attr("type");
                    if ($.type(typeInput) === 'undefined') typeInput = $(this).is("select") ? "select" : $(this).is("textarea") ? "textarea" : "";
                    var copiedInput = copiedInputs.eq( i );

                    if ( typeInput == "radio" || typeInput == "checkbox" ) copiedInput.attr( "checked", $(this).is(":checked") );
                    else if ( typeInput == "text" || typeInput == "" ) copiedInput.attr( "value", $(this).val() );
                    else if ( typeInput == "select" )
                        $(this).find( "option" ).each( function( i ) {
                            if ( $(this).is(":selected") ) $("option", copiedInput).eq( i ).attr( "selected", true );
                        });
                    else if ( typeInput == "textarea" ) copiedInput.text( $(this).val() );
                });
                return copy;
            },
            getPrintWindow : function () {
                switch ( settings.mode )
                {
                    case modes.iframe :
                        var f = new PrintArea.Iframe();
                        return { win : f.contentWindow || f, doc : f.doc };
                    case modes.popup :
                        var p = new PrintArea.Popup();
                        return { win : p, doc : p.doc };
                }
            },
            Iframe : function () {
                var frameId = settings.id;
                var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
                var iframe;

                try
                {
                    iframe = document.createElement('iframe');
                    document.body.appendChild(iframe);
                    $(iframe).attr({ style: iframeStyle, id: frameId, src: "#" + new Date().getTime() });
                    iframe.doc = null;
                    iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
                }
                catch( e ) { throw e + ". iframes may not be supported in this browser."; }

                if ( iframe.doc == null ) throw "Cannot find document.";

                return iframe;
            },
            Popup : function () {
                var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
                windowAttr += ",width=" + settings.popWd + ",height=" + settings.popHt;
                windowAttr += ",resizable=yes,screenX=" + settings.popX + ",screenY=" + settings.popY + ",personalbar=no,scrollbars=yes";

                var newWin = window.open( "", "_blank",  windowAttr );

                newWin.doc = newWin.document;

                return newWin;
            }
        };
        return PrintArea;
	}
})(alijk)
