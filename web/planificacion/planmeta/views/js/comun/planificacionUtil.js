Ext.ns('Ext.planificacion.comun.window');
Ext.planificacion.comun.window.winLoad = Ext.extend(Ext.Window,{
    layout:'border',
    currentTab : false,
    initComponent: function() {
        this.title      = (this.title) ? this.title : 'Cargando datos...';
        this.layout     = 'fit';
        this.width      = (this.width) ? this.width : 300;
        this.height     = 50;
        this.closable   = false;
        this.resizable  = false;
        this.modal      = true;
        var mensaje         = (this.mensaje) ? this.mensaje : false;
        this.items = [new Ext.ProgressBar({
            text:(mensaje) ? mensaje : "Cargando datos...",
            cls:'custom'
        })];
        this.closeAction = (this.closeAction) ? this.closeAction : 'hide';
        Ext.planificacion.comun.window.winLoad.superclass.initComponent.call(this);
    },
    showMask:function(){
        var titulo = this.items.items[0].text;
        this.items.items[0].wait({
            interval:200,
            increment:15,
            fn:function(){
            }
        });
        this.items.items[0].text =titulo;
        this.show();
    },
    hideMask:function(){
        if(this.closeAction == 'destroy')
            this.destroy();
        else
            this.hide();
    },
    mostrar:function(titulo){
        this.setTitle(titulo);
        this.items.items[0].wait({
            interval:200,
            increment:15,
            fn:function(){
            }
        });
        this.items.items[0].text =titulo;
        this.show();
    },
    ocultar:function(el){
        this.hide(el);
    },
    setMensaje:function(newT){
        this.items.items[0].setText(newT);
    }
});
Ext.reg('comun-winload', Ext.planificacion.comun.window.winLoad);

Ext.ns('Planificacion');
Planificacion.TaskRunner = new Ext.util.TaskRunner();
Planificacion.TimerCount = {};
Planificacion.maskControl = {};
Planificacion.mostrarMascara = function(idMask,title,mensaje){
    if(Ext.getCmp(idMask)){
        Ext.getCmp(idMask).hideMask();
    }
    var width = (title.length < 49) ? 300 : title.length*6;
    var widthM = (!mensaje || mensaje == '' || mensaje.length < 49) ? 300 : mensaje.length*6+12;
    var mask = new Ext.planificacion.comun.window.winLoad({
        id          : idMask,
        title       : title,
        mensaje     : mensaje,
        width       :(width > widthM) ? width : widthM,
        closeAction : 'destroy',
        count       : 0,
        listeners   :{
            show:function(win){
                Planificacion.maskControl[idMask] = mask;
                Planificacion.TimerCount[idMask] = 1;
            },
            destroy:function(){
                delete Planificacion.maskControl[idMask];
                delete Planificacion.TimerCount[idMask];
            }
        }
    });
    mask.showMask();
    return mask;
}
Planificacion.taskMaskControl = {
    id:'taskMaskControl',
    run: function(){
        for(var a in Planificacion.TimerCount){
            if(Planificacion.TimerCount[a])
                Planificacion.TimerCount[a] ++;
            if(Planificacion.TimerCount[a] == 60){
                if(Planificacion.maskControl[a] && Planificacion.maskControl[a] instanceof Ext.planificacion.comun.window.winLoad)
                    Planificacion.maskControl[a].destroy();
                delete Planificacion.maskControl[a];
                delete Planificacion.TimerCount[a];
            }
        }
    },
    interval: 2000 //1 second
}
Planificacion.TaskRunner.start(Planificacion.taskMaskControl);

/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Planificacion.ocultarMascara
 *@Tipo: Funcion
 *@Description: Oculta la mascara.
 */
Planificacion.ocultarMascara = function(idMask){
    var mask = Ext.getCmp(idMask);
    if(mask && mask.isXType('comun-winload'))
        mask.hideMask();
}
Planificacion.maskElement = function(el){
    el.mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
}
Planificacion.unmaskElement = function(el){
    el.unmask();
}
Planificacion.round = function(value, precision) {
    var result = Number(value);
    if (typeof precision == 'number') {
        precision = Math.pow(10, precision);
        result = Math.round(value * precision) / precision;
    }
    return result;
}

Planificacion.find = function(array, value){
    var index_ = -1
    Ext.each(array, function(item, index, allitems){
        if(item == value){
            index_ = index;
            return false;
        }
        else
            return true;
    });
    return index_;
}
Planificacion.remove = function(array, value){
    Ext.each(array, function(item, index, allitems){
        if(item == value){
            allitems.splice(index, 1);
            return false;
        }
        else
            return true;
    });
}


