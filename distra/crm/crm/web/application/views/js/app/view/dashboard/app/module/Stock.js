Ext.define('Dashboard.module.Stock', {
    extend: 'Ext.app.BundledApplication',
    name: 'Stock',
    modules: ['ClientContract'],
    //language: 'es',  no language
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    },
    moduleConfig: {
        name: 'Stock',
        controller: false
    }
});