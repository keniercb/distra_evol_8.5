Ext.ns('LOG.lb.plugin');

LOG.lb.plugin.Leyenda = Ext.extend(Ext.Button, {
    defaultAlign : 'top-left',
    configAlign : {
        'top-right' : {align : 'tl-bl', offsets : [-3, 3]},
        'top-left' : {align : 'tr-br', offsets : [3, 3]},
        'bot-right' : {align : 'bl-tl', offsets : [-3, -3]},
        'bot-left' : {align : 'br-tr', offsets : [3, -3]},
    },
    initComponent: function() {   
        this.text = 'Leyenda';
        this.iconCls = 'mostrar';        
        this.enableToggle = true;        
        LOG.lb.plugin.Leyenda.superclass.initComponent.call(this);
        this.addListener('toggle', this.onBtnToggle, this);


    },
    applyCssBtn : function(text){
        return '<span style="color:#15428B;font-weight:bold">'+text+'</span>';
    },
    onRender : function(ct, position){

        LOG.lb.plugin.Leyenda.superclass.onRender.call(this, ct, position);
        this.initLeyendPanel();
        if(this.leyendContainer){
            this.leyendContainer.on('resize', this.updatePosicionLeyendPanel, this);
            this.leyendContainer.on('hide', function(){
                this.leyendPanel.hide();
            }, this);            
        }
    },
    initLeyendPanel : function(){

        var init = new Ext.Panel({
            floating : true,
            bodyBorder : false,
            shadow : false,
            cls : 'leyend-panel',
            listeners : {
                render : this.updateInfoLeyend.createDelegate(this),
            }
        });

        this.leyendPanel = Ext.apply(init, this.leyendConfig);
    },
    updateLeyendConfigData : function(data){
        if( this.leyendConfig && Ext.isArray(data)){
            this.leyendConfig.data = data;
            this.updateInfoLeyend();
        }
    },
    getLeyendConfigData : function(){
        if( this.leyendConfig && Ext.isArray( this.leyendConfig.data ))
            return this.leyendConfig.data;
        return [];
    },
    updateInfoLeyend : function(){
        if(this.leyendConfig &&  this.leyendPanel && this.leyendPanel.rendered){
            this.leyendConfig.tpl.overwrite( this.leyendPanel.body, this.getLeyendConfigData());
            this.leyendPanel.doLayout();
        }
    },
    updatePosicionLeyendPanel : function(){
        if( this.isExpanded() ){
            this.leyendPanel.getEl().hide();
            this.alignToBtnLeyendPanel();
            this.leyendPanel.getEl().show();
        }
    },
    renderLeyendPanel : function(){
        this.leyendPanel.render( (this.leyendContainer)? this.leyendContainer.bwrap : document.body );
        this.leyendPanel.hide();
    },
    isExpanded : function(){
        return this.leyendPanel && this.leyendPanel.isVisible();
    },
    expand : function(){
        if(!this.leyendPanel.rendered)
            this.renderLeyendPanel();

        if(this.isExpanded())
            return;

        this.alignToBtnLeyendPanel();

        this.leyendPanel.getEl().show({
            duration : 1,
            easing : 'tr'
        });
    },
    alignToBtnLeyendPanel : function(){
        var posicion = this.configAlign[this.defaultAlign];

        if( this.leyendAlign && this.configAlign[this.leyendAlign] )
            posicion = this.configAlign[this.leyendAlign];

        this.leyendPanel.el.alignTo(this.el, posicion.align, posicion.offsets);
    },
    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.leyendPanel.hide();
    },
    onBtnToggle : function(btn, pressed){
        if(this.leyendPanel)
            this[pressed? 'expand' :  'collapse']();
    },
});
      