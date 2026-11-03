Ext.define('Dashboard.module.Sales', {
    extend: 'Ext.app.BundledApplication',
    name: 'Sales',
    controllers: [
        'MainCntrl'
    ],
    views: ['Main'],
    placeholder:'#col-a-2',
    autoConfig:true,
    language: true,
    launch: function () {
        console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});


