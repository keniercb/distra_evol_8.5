Ext.define('CRM.core.managers.ModuleManager', {
        extend: 'CRM.core.managers.AbstractManager',
        alternateClassName: 'ModuleMgr',
        singleton: true,

        requires: ['CRM.core.managers.AbstractManager'],

        getActiveModule:function(){
            if(Ext.ComponentQuery.query('main_tabpanel')[0]){
                return Ext.ComponentQuery.query('main_tabpanel')[0].getActiveTab();
            }
            return null;
        }
    });