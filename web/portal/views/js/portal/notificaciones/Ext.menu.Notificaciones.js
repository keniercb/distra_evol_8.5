/**
 * Menu de notificaciones
 */
Ext.ns('Ext.menu.Notificaciones');

function isMobile(){
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/))
    );
}

Ext.menu.Notificaciones = Ext.extend(Ext.util.Observable, {
    constructor: function(config) {
        var me = this;
        this.notificaciones = config.notificaciones || [];
        this.msgError = config.msgError || '';
        this.error = config.notificaciones === false ? 1 : 0;
        this.events = {};
        this.listeners = config.listeners;
        this.top = config.top || -10;
        this.margenDerecho = config.margenDerecho || 0;
        Ext.menu.Notificaciones.superclass.constructor.apply(this, arguments);
        this.sonido = config.sonido || false;
        this.idSpanNoti = config.id || 'menuContainerNoti';
        this.creado = false;
        this.calcular();
        if(isMobile())
            this.mobile = true;
        this.agregarMenu();
        this.playSonido();
        this.audionotif = document.getElementById("audio");
        window.onresize =  function(e){
            me.reposicionar();
        };

        Ext.menu.Noti = this;
    },
    reposicionar : function(){
        this.calcular();
        if(this.left_menu != Ext.get(this.idSpanNoti).getX()){
            Ext.get(this.idSpanNoti).setX(this.left_menu);
        }
    },
    agregarMenu : function(){
        this.span = new Ext.Template('<span id={id} style="position: absolute;width:{ancho}px; height: 30px; top:{top}px; left:{left}px; z-index:99999">{html}</span>');
        this.sound = new Ext.Template('<span id={id} style="position: absolute;width:{ancho}px; height: 30px; top:{top}px; left:{left}px; z-index:99999">{html}</span>');
        this.template = new Ext.XTemplate('<span id={id} style="position: absolute;width:{ancho}px; height: 30px; top:{top}px; left:{left}px; z-index:99999">{html}</span>');
        this.template = new Ext.XTemplate(
            '<ul class="nav ace-nav">',
            '<li class="">' ,
            '<a data-toggle="dropdown" class="dropdown-toggle" href="#" style=" background-color: transparent; height: 30px;" ondblclick="Ext.menu.Noti.changeBellState();">',
            '<tpl if="cantidad_total == 0">',
            '<i class="icon-bell-alt" style="margin-top: 15px"></i>' ,
            '</tpl>',
            '<tpl if="cantidad_total != 0">',
            '<i class="icon-bell-alt icon-animated-mybell" style="margin-top: 15px"></i>' ,
            '</tpl>',
            '<span class="badge badge-important"><tpl if="error == 0">{cantidad_total}</tpl><tpl if="error == 1">x</tpl></span>' ,
            '</a>' ,
            '<ul class="pull-right dropdown-navbar navbar-blue dropdown-menu dropdown-caret dropdown-close">',
            '<li class="dropdown-header" style="width: inherit;">' ,
            '<tpl if="error == 1">',
            '<i class="icon-remove red"></i>{msgError}' ,
            '</tpl>',
            '<tpl if="error == 0">',
            '<tpl if="cantidad_total != 0">',
            '<i class="icon-warning-sign"></i>{cantidad_total} Notificaciones' ,
            '<a href="#" class="pull-right nobackground noborder" onclick="Ext.menu.Noti.onClickConfigurar();">' ,
            '<i class="icon-gear"></i>',
            '</a>',
            '</tpl>',
            '<tpl if="cantidad_total == 0">',
            '<i class="icon-ok-sign green"></i>No existen notificaciones' ,
            '</tpl>',
            '</tpl>',

            '</li>' ,
            '<tpl for="notificaciones">',
            '<tpl if="cantidad != 0">',
            '<li style="width: inherit;">' ,
            '<a href="#" name="{tipo}" onclick="Ext.menu.Noti.onClick(Ext.get(this).dom.name);">',
            '<div class="clearfix">' ,
            '<span class="pull-left">' ,
            '<i class="btn-xs color-{tipo}-icon {iconClass}"></i>{titulo}' ,
            '</span>' ,
            '<span class="pull-right badge background-{tipo}-icon">+{cantidad}</span>' ,
            '</div>' ,
            '</a>' ,
            '</li>',
            '</tpl>',
            '</tpl>',
            '<tpl if="error == 0">',
            '<li style="width: inherit;">' ,
            '<a name="todas" href="#" onclick="Ext.menu.Noti.onClick(Ext.get(this).dom.name);">Mostrar todas ' ,
            '<i class=""></i>',
            '</a>',
            '</li>' ,
            '</tpl>',

            '</ul>',
            '</li>',
            '</ul>'
        );
        this.span.compile();
        this.sound.compile();
        var html = this.obtenerCuerpoMenu();
        var soundhtml = '<a class="dropdown-toggle" href="#" style=" background-color: transparent; height: 30px;" onclick="Ext.menu.Noti.changeBellState();">'+
                        '<i class="icon-volume-off" style="margin-top: 15px;display:block;color:white;font-size: 17"></i>' ;
        this.span.append(Ext.getBody(), {id:this.idSpanNoti, html: html, left: this.left_menu, ancho: this.width_menu, top: this.top});
        if(this.mobile)
            this.span.append(Ext.getBody(), {id:'idvolume', html: soundhtml, left: this.left_menu - 20, ancho: 20, top: this.top});
        this.creado = true;
    },
    /*----Obtener posicion x ------*/
    getLeft: function(){
        return  window.innerWidth - this.width_menu - this.margenDerecho;
    },
    /*----Obtener cantidad totalde notificaciones------*/
    obtenerCantidadTotal : function(){
        var total = 0;
        this.notificaciones.forEach(function(noti){
            if(noti.cantidad){
                total+=parseInt(noti.cantidad);

            }
        });
        return total;
    },
    /*----Obtener html cuerpo menu------*/
    obtenerCuerpoMenu: function(){
        return this.template.apply({notificaciones: this.notificaciones, cantidad_total: this.cantidad_total, error : this.error, msgError:this.msgError});
    },
    /*----Obtener ancho del menu ------*/
    obtenerWidthMenu: function(){
        var st  = this.cantidad_total+'';
        return st.visualLength() + 50;
    },
    /*----Obtener ejecutar sonido------*/
    playSonido: function(){
        if(!this.sonido){
            return;
        }
        if(this.cantidad_total > 0){
            //this.audio = jBeep("../../views/js/portal/notificaciones/assets/jBeep/jBeep/campana.wav");
            this.audionotif.play();
        }
    },
    /*----calcular variables------*/
    calcular: function(){
        if(this.cantidad_total < this.obtenerCantidadTotal())
            this.sonido = true;
        this.cantidad_total = this.obtenerCantidadTotal();
        this.width_menu = this.obtenerWidthMenu();
        this.left_menu = this.getLeft();
        if(this.creado){
            Ext.get(this.idSpanNoti).setWidth(this.width_menu);
            Ext.get(this.idSpanNoti).setX(this.left_menu);
        }
    },
    /*----Funcion publica para actualizar el menu de notificaciones y activar el sonido------*/
    actualizar : function(notis, msgError){
        msgError = msgError || 'Error al obtener las notificaciones';
        this.notificaciones = notis === false ? [] : notis;
        this.error = notis === false ? 1 : 0;
        this.calcular();
        if(notis !== false){
            this.playSonido();
        }
        this.template.overwrite(this.idSpanNoti, {notificaciones: this.notificaciones, cantidad_total: this.cantidad_total, error: this.error, msgError: msgError});
        this.fireEvent('update', this, this.notificaciones, this.cantidad_total);
    },
    /*-----Obtener las notificaciones dado un tipo--------*/
    obtenerCantidadPorTipo : function(tipo){
        if(tipo == 'todas'){
            return this.cantidad_total;
        }
        for(var i =0; i < this.notificaciones.length; i++){
            if(this.notificaciones[i]['tipo'] == tipo){
                return this.notificaciones[i].cantidad;
            }
        }
        return 0;
    },
    /*-----Funcion que se ejecuta al dar click en los items del menu--------*/
    onClick : function(tipo){
        var me = this;
        var cantidad = me.obtenerCantidadPorTipo(tipo);
        var event = 'onClick' + Ext.util.Format.capitalize(tipo);
        me.fireEvent(event, me, tipo, cantidad);
    },
    /*-----Funcion que se ejecuta al dar click en el icono configurar--------*/
    onClickConfigurar : function(){
        this.fireEvent('onClickConfigurar', this);
    },
    changeBellState : function(){
        (this.sonido) ? this.desabilitarSonido() : this.habilitarSonido();
    },
    habilitarSonido: function(){
        if(this.mobile)
            $(".icon-volume-off").removeClass("icon-volume-off").addClass("icon-volume-up");
        //(this.audio) != undefined ? this.audio.play() : '';
        if(this.cantidad_total > 0) {
            this.audionotif.play();
            this.sonido = true;
        }
    },
    desabilitarSonido: function(){
        if(this.mobile)
            $(".icon-volume-up").removeClass("icon-volume-up").addClass("icon-volume-off");
        //(this.audio) != undefined ? this.audio.pause() : '';
        this.audionotif.pause();
        this.sonido = false;
    }
});


/**
 * Calcula los pixeles de ancho que ocupa un texto
 */

String.prototype.visualLength = function () {
    var span = document.getElementById("ruler") || document.createElement('span');
    span.id = 'ruler';
    span.setAttribute('style','display:none');
    //span.style = 'display:none';
    span.innerHTML = this;
    document.body.appendChild(span);
    return span.offsetWidth;
};