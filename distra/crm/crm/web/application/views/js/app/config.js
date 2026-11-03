Ext.define('CRM.config', {
    config: {
        info: {
            version: '0.1',
            author: 'Equipo desarrollo Centro INTEGRACION'
        },
        basePath: 'crm/'
    },

    constructor: function(){
        var realPath;
        if(this.config.basePath && this.superclass.basePath && this.config.basePath !== this.superclass.basePath){
            realPath = this.superclass.basePath.toString() + this.config.basePath.toString() + '/';
            if(!this.setBasePath){
                this.setValue('basePath', realPath.replace('//', '/'));
            }
            this.setBasePath(realPath.replace('//', '/'));
        }else{
            realPath = this.basePath + 'application/'
            this.setBasePath(realPath.replace('//', '/'));
        }
    },

    get: function(property){
        return this[property];
    },

    setValue: Ext.Function.flexSetter(function(name, value) {
        this[name] = value;
    })
});