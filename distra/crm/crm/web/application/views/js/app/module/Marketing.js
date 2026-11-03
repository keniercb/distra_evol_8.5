Ext.define('CRM.module.Marketing', {
    extend: 'Ext.app.BundledApplication',
    name: 'Marketing',
    modules: ['PanelControlMarketing','GestionCampanna','GestionOportunidad'],
    autoLoadLang: true,
    disabled: false,
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');
    }
});