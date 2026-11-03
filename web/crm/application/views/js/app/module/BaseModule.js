Ext.define('CRM.module.BaseModule', {
    extend: 'Ext.app.BundledApplication',
    name: 'BaseModule',
    controllers: [
        'GlobalPanel',
        'CenterGrid',
        'MainWindow',
        'SelectWindow',
        'WesternTree',
        'ElementWindow',
    ],
    autoLoadLang: true,
    disabled: true,
    appFolder:'basemodule',
    launch: function () {
        //console.log('Module:' + this.name + ' launched (deep: ' + this.depth + ')');

        var files = [
            '../../views/js/app/core/utils/components/vtypes.js',
            '../../views/js/app/core/utils/components/CustomMessage.js',
            document.location.origin+'/lib/UCID/js/WinAddInci.js'
        ];

        for (i in files) {
            Ext.Loader.loadScript({
                url: files[i]
            });
        }

    }
});