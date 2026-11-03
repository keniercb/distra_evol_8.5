if (!Ext.CONT)
    Ext.ns('Ext.CONT');
Ext.ns('Ext.CONT.Componentes');
Ext.CONT.Componentes.Window = Ext.extend(Ext.Window,{
    initComponent: function() {
        this.title      = (this.title) ? this.title : 'Cargando datos...';
        this.layout     = 'fit';
        this.width      = (this.width) ? this.width : 300;
        this.height     = 50;
        this.closable   = false;
        this.resizable  = false;
        this.modal      = true;
        this.constrain      = true;
        var message         = (this.message) ? this.message : false;
        this.items = [new Ext.ProgressBar({
            text:(message) ? message : "Cargando...",
            cls:'custom'
        })];
        this.closeAction = (this.closeAction) ? this.closeAction : 'hide';
        Ext.CONT.Componentes.Window.superclass.initComponent.call(this);
    },
    showBox:function(){
        var title = this.items.items[0].text;
        this.items.items[0].wait({
            interval:200,
            increment:15,
            fn:function(){
            }
        });
        this.items.items[0].text = title;
        this.show();
    },
    hideBox:function(){
        if(this.closeAction == 'destroy')
            this.destroy();
        else
            this.hide();
    },
    setMessage:function(title){
        this.items.items[0].setText(title);
    }
});
Ext.reg('cont.window', Ext.CONT.Componentes.Window);
Ext.CONT.Componentes.TaskRunner = new Ext.util.TaskRunner();
Ext.CONT.Componentes.TimerCount = {};
Ext.CONT.Componentes.MessageControl = {};
Ext.CONT.Componentes.MessageBox = function(idBox, message, title, fn){

    if(Ext.getCmp(idBox))
        Ext.getCmp(idBox).hideBox();

    var widthM = (!message || message == '' || message.length < 49) ? 300 : message.length*6+12;
    var width = (!title || title == '' || title.length < 49) ? 300 : title.length*6;

    var box = new Ext.CONT.Componentes.Window({
        id          : idBox,
        title       : "Por favor espere...",
        message     : message,
        width       :(width > widthM) ? width : widthM,
        closeAction : 'destroy',
        count       : 0,
        listeners   :{
            show:function(){
                Ext.CONT.Componentes.MessageControl[idBox] = box;
                Ext.CONT.Componentes.TimerCount[idBox] = 1;
            },
            destroy:function(){

                if(fn && !this.forced)
                    fn();

                delete Ext.CONT.Componentes.MessageControl[idBox];
                delete Ext.CONT.Componentes.TimerCount[idBox];
            }
        }
    });
    box.showBox();
    return box;
};
Ext.CONT.Componentes.HideBox = function(idBox){
    var box = Ext.getCmp(idBox);
    if(box && box.isXType('cont.window'))
        box.hideBox();
};
Ext.CONT.Componentes.taskMessageControl = {
    id:'taskMessageControl',
    run: function(){
        for(var a in Ext.CONT.Componentes.TimerCount){
            if(Ext.CONT.Componentes.TimerCount[a])
                Ext.CONT.Componentes.TimerCount[a] ++;
            if(Ext.CONT.Componentes.TimerCount[a] == 6000000){
                if(Ext.CONT.Componentes.MessageControl[a] && Ext.CONT.Componentes.MessageControl[a] instanceof Ext.CONT.Componentes.Window){
                    Ext.CONT.Componentes.MessageControl[a].forced = true;
                    Ext.CONT.Componentes.MessageControl[a].destroy();
                }
                delete Ext.CONT.Componentes.MessageControl[a];
                delete Ext.CONT.Componentes.TimerCount[a];
            }
        }
    },
    interval: 2000
};
Ext.CONT.Componentes.TaskRunner.start(Ext.CONT.Componentes.taskMessageControl);
