Ext.ns('LOG.lb.trazas');

LOG.lb.trazas.View = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    usuarios: undefined,
    documentos: undefined,

    constructor: function(config) {

        this.dirController = '/logistica/utiles/documento/index.php/trazas';
        this.urlBusquedaGridPrincipal = 'cargarTrazas';
        this.modoSeleccion = 1;
        this.panelBotonesVisible = true;
        this.formaVisualizacion = 'ventana';
        this.autoLoad=false;
        config.idioma ={};
        this.iddocumento=config.iddocumento;

        LOG.lb.trazas.View.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma , LOG.lb.trazas.Idioma);
        this.getVistaPrincipal().title = 'Trazas de Documentos';
        this.getVistaPrincipal().width = 700;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);

    },
    initDefaultColumns: function() {
        var _this = this;

        this.addGridColumn({
                header: this.idioma.cgNo,
                width: 95,
                dataIndex: 'DatDocumento.nrodoc',
                default: true
            });

        this.addGridColumn({
            header: this.idioma.cgDoc,
            width: 145,
            dataIndex: 'DatDocumento.iddoc',
            default: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                _this.documentos = store.reader.jsonData.documentos;
                return _this.getTipoDocById(value);
            }
        });


        this.addGridColumn({
            header: this.idioma.cgOperacion,
            width: 145,
            dataIndex: 'operacion',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUser,
            width: 100,
            dataIndex: 'idusuario',
            default: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });

        this.addGridColumn({
            header: this.idioma.cgfecha,
            width: 90,
            dataIndex: 'fecha',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgHora,
            width: 80,
            dataIndex: 'hora',
            default: true
        });


        this.addGridColumn({
            header: this.idioma.cgFechaCont,
            width: 100,
            dataIndex: 'fechacontable',
            default: true
        });

    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton("->");
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            text: '',
            tooltip: this.idioma.tBotonAyuda,
        }));
    },
    getUsuarioById: function(id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },

    getTipoDocById: function(id) {
        var _this = this;
        for (var i = 0; i < _this.documentos.length; i++) {
            if (_this.documentos[i].iddoc == id) {
                return _this.documentos[i].denominacion;
            }
        }
        return '-';
    },

    render:function(){
        var vista=LOG.lb.trazas.View.superclass.render.call(this);
        var id= Ext.encode(this.iddocumento);
        this.getStorePrincipal().baseParams.iddocumento=id;
        this.getStorePrincipal().load();
        return vista;
    }
});