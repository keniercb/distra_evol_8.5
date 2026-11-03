Ext.define('Dashboard.module.Clients', {
    extend: 'Ext.app.BundledApplication',
    name: 'Clients',
    controllers: [
        'MainCntrl'
    ],
    views: ['Main'],
    placeholder:'#col-a-1',
    autoConfig:true,
    language: true,
    launch: function () {
        console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});


