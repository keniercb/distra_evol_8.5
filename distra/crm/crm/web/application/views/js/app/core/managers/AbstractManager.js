Ext.define('CRM.core.managers.AbstractManager', {
    extend: 'Ext.AbstractManager',
    //singleton: true,

    /* @override */
    register: function (item, customKey) {
        //<debug>
        var all = this.all,
            key = !customKey ? all.getKey(item) : customKey;

        if (all.containsKey(key)) {
            Ext.Error.raise('Registering duplicate id "' + key + '" with this manager');
        }
        //</debug>
        !customKey ? this.all.add(item) : this.all.add(customKey, item);
    },

    getAll: function(){
        return this.all.getValues();
    }
});