Ext.define('Dashboard.module.State', {
    extend: 'Ext.app.BundledApplication',
    name: 'State',
    controllers: [
        'MainCntrl'
    ],
    views: ['Main'],
    placeholder:'#col-a-3',
    autoConfig:true,
    language: true,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});


