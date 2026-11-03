Ext.define('Stock.module.ClientContract', {
    extend: 'Ext.app.BundledApplication',
    name: 'ClientContract',
    appFolder: 'clientcontract',
    controllers: [
        'MainCntrl'
    ],
    views: ['Main'],
    placeholder:'#col-a-2',
    autoConfig:true,
    language: true,
    init: function() {
        var me = this, className = this.name + '.config';
        Ext.require(className, function(){
            me.config = Ext.create(className);
        })
    },
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },

    run: function(options){
        var me = this;
    }
});


