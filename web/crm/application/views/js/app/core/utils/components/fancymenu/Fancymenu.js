/**
 * @class Ext.ux.toggleslide.Slider
 * @extends Ext.menu.Menu
 * Componente que crea un MenuItem utilizando CSS3
 * @category Componente
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @version 1.0
 */

Ext.define('CRM.ux.fancymenu.Fancymenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.fancymenu',


    initComponent: function () {
        this.addStyle();
        this.baseCls = 'ca-menu';
        this.autoEl = {
            tag: 'ul',
            cls: 'ca-menu'
        };
        this.bodyStyle="background: url('../../../application/views/images/gestioncomercialadorno.png') no-repeat left bottom; background-size: 100% 100%";
        // this.bodyStyle = {
        //     // background: '#d3e0f6'
        //     background: '#c1d5e4'
        // };

        // this.html = '<img src="../../../application/views/images/gestioncomercial1.png" width="100%" height="100%" style="position: absolute"/>';

        this.showSeparator = false;

        this.callParent();
    },

    constructor: function(cfg){
        var items = [];
        if(cfg.items && cfg.items.length){
            cfg.items.every(function(item){
                if(!item.xtype){
                    var menuitem = Ext.create('CRM.ux.fancymenu.Fancymenuitem',item);
                    /* Esta es la parte para colocar el boton de anclar la funcionalidad */
                    if(cfg.createPinBtn){
                        menuitem.on({
                            render: function(item){
                                var btn = new Ext.button.Button({
                                    //id: item.id + 'btn',
                                    enableToggle: true,
                                    iconCls: item.autorun ? 'icondistra-anclar' : 'icondistra-desanclar',
                                    action: 'pin',
                                    hidden: true,
                                    menuitem: item,
                                    pressed: item.autorun || false
                                });
                                btn.render('pin-container-' + item.id);
                            }
                        });
                    }

                    items.push(menuitem);
                }
                return true;
            });
            cfg.items = items;
        }

        this.callParent(arguments);
    },//#D5DDDE   hover backgground: d9e7f8 9eacbd
    addStyle:function(){
        if (!document.getElementById('style-fancymenu')) {
            var styleLeaf = document.createElement('style');
            styleLeaf.id = 'style-fancymenu';
            styleLeaf.innerHTML = ".ca-content h1, h2, h3, h4, h5, h6 {font-size: 100%;font-weight: normal;" +
            "            margin: 0;            padding: 0;}.ca-menu{padding:0;margin:20px auto;width: 100%; " +
            "       }.ca-menu li{width: 100%;            height: auto;            min-height: 40px;overflow: hidden;  " +
            "          position: relative;display: block;background: #cddfec; opacity: 0.90;-moz-opacity: 0.90;-khtml-opacity: 0.90;" +
                "-webkit-box-shadow: 1px 1px 2px rgba(217,231,248,1);" +
            "-moz-box-shadow: 1px 1px 2px rgba(217,231,248,1);box-shadow: 1px 1px 2px rgba(217,231,248,1);margin-bottom: 4px;" +
            "-webkit-transition: all 300ms ease-in-out;-moz-transition: all 300ms ease-in-out;-o-transition: all 300ms ease-in-out;" +
            "-ms-transition: all 300ms ease-in-out;transition: all 300ms ease-in-out;border-left: 5px solid #d9e7f8;" +
            "border-radius: unset !important;}.ca-menu li:last-child{margin-bottom: 0px;}.ca-menu li a{text-align: left;" +
            "width: 100%;height: 100%;display: block;color: #333;position: relative;text-decoration: none;}.ca-icon{font-size: 20px;" +
            "color: #124872;text-shadow: 1px 2px 2px;line-height: 35px;position: absolute;width: 15px;left: 3px;text-align: center;" +
            "-webkit-transition: all 300ms linear;-moz-transition: all 300ms linear;-o-transition: all 300ms linear;" +
            "-ms-transition: all 300ms linear;transition: all 300ms linear;}.ca-content{position: absolute;left: 37px;" +
            "width: 100%;/*height: 10px; *//*60*/top: 2px;}.ca-main{font-size: 13px;-webkit-transition: all 300ms linear;" +
            "-moz-transition: all 300ms linear;-o-transition: all 300ms linear;-ms-transition: all 300ms linear;" +
            "transition: all 300ms linear;}.ca-sub {font-size: 10px;}.ca-menu li:hover{background-color: #a8c8de;" +
            "border: hidden;border-left: 5px solid #15498b !important;}.ca-menu li:hover .ca-icon{color: #15498b;" +
            "font-size: 60px;opacity: 0.2;left: -30px;-webkit-transform: rotate(20deg);-moz-transform: rotate(20deg);" +
            "-ms-transform: rotate(20deg);transform: rotate(20deg);}.ca-menu li:hover .ca-main{color: #15498b;" +
            "opacity: 0.8;}.ca-menu li:hover .ca-sub{color: #000;opacity: 0.8;}/*esto es para los botones de anclaje*/.ca-pin{position: absolute;right: 5px;" +
            "vertical-align: middle;font-size: 11px;color: #808080 !important;}";
            document.body.appendChild(styleLeaf);
        }
    }
});
