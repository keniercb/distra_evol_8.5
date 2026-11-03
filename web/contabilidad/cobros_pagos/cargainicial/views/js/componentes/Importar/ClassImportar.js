Ext.namespace('Ext.ClassImportar');

Ext.ClassImportar = Ext.extend(Ext.Component, {
    //tipoDuo: undefined,
    //titulo: undefined,
    //etiquetas: undefined,
    //url: undefined,
    constructor: function(etiquetas, params)
    {
        var scope = this;
        scope.etiquetas = etiquetas;
        scope.titulo = scope.etiquetas.titleImport;
        
        //this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando datos para adicionar.');
        
        Ext.apply(this, params || {});
        this.addEvents('closeImportar');

        if (!document.getElementById('FileUploadField')){
            scope.loadJs("/contabilidad/comun/js/FileUploadField", 'FileUploadField');
        }
        
        scope.wImportar = new Ext.UIImportar(scope);
        scope.initializeEvents(this);
        scope.initializeFunctions(this);
        
        scope.wImportar.show();
        
        return Ext.ClassImportar.superclass.constructor.call(this);
    },
    loadJs: function(jsSrc, id){
        if (jsSrc != null){
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadMessageBox: function(msg){
        Ext.MessageBox.show({
            title: scope.etiquetas.lbMsgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    initializeEvents: function(scope)
    {
        this.btnCancelar.on('click', function(component) {
            scope.wImportar.close();
            scope.fireEvent('closeImportar', scope, scope.wImportar);
        });

        this.btnAceptar.on('click', function(component) {
            
        });
    },
    initializeFunctions: function(scope)
    {

    }
});