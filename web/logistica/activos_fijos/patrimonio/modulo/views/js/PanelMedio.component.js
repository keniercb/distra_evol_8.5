Ext.ns('Ext.LOG.moduloMedio');

Ext.LOG.moduloMedio.PanelMedioP = Ext.extend(LOG.util.UITemplate, {
    nottitle: null,
    idsRegNumNoMostrar: new Array(),
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.idGridPrincipal = 'idregnumerico';
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.concepto = this.idioma.lbTtBtnBuscar;
        this.urlBusquedaGridPrincipal = 'getNumerosSerie';
        Ext.LOG.moduloMedio.PanelMedioP.superclass.constructor.call(this, config);



        this.plugins = new Array();
        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.attatchPlugin(arrElementosGridPlugin[i]);
        }
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCodigo,
            dataIndex: 'codigo',
            autoExpand: true,
            width: 120,
            hidden: true,
            default: true

        });
        this.addGridColumn({
            header: _this.idioma.lbCMDenominacion,
            dataIndex: 'denominacion',
            width: 120,
            agrupador: false,
            default: true
        });
        /*this.addGridColumn({
            header: _this.idioma.lbCmbMarcaModelo,
            dataIndex: 'descripcionmarcamodelo',
            width: 100,
            default: true
        });*/
        this.addGridColumn({
            header: _this.idioma.lbCMNroInventario,
            dataIndex: 'nroinventario',
            width: 100,
            default: true
        });
        /*this.addGridColumn({
            header: _this.idioma.lbCMNroSeir,
            dataIndex: 'nroserie',
            width: 100,
            default: true
        });*/
        this.addGridColumn({
            header: _this.idioma.lbCMUbicacion,
            width: 100,
            dataIndex: 'ubicacion',
            default: true
        });
       /* this.addGridColumn({
            header: _this.idioma.lbCMNacionalidad,
            width: 100,
            dataIndex: 'descripcionnacionalidad',
            default: true
        });*/
        this.addGridColumn({
           // header: _this.idioma.lbCMValorContable,
            header: (alternativa) ? _this.idioma.lbCMValorContable +" "+ nommonedacontable: _this.idioma.lbCMValorContable,
            width: 150,
            dataIndex: 'valorcontable',
            default: true
        });
        if (alternativa) {
            this.addGridColumn({
                header: "Valor contable alternativo"+" "+nommonedaalternativa,
                width: 150,
                dataIndex: 'valorcontablealternativo'
            });
        }
        this.addGridColumn({
            header: _this.idioma.lbCMEstado,
            width: 150,
            dataIndex: 'estatustecnico',
            default: true
        });


    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.panelNomenModP.superclass.render.call(this);
        _this.getStorePrincipal().on({
            beforeload: function(st){
                Ext.getBody().mask("Cargando...", 'x-mask-loading');
                _this.getStorePrincipal().initBaseParams.idnaturaleza = (_this.objetoobra) ? natobjobraP : natinmuebleP;
            },
            load: function(st, obj) {
                Ext.getBody().unmask();
            }
        });
        this.getStorePrincipal().load({
            params: {
                objetoobra: (_this.objetoobra) ? _this.objetoobra: false,
                interfazNrodinventario: 1,
                idarea: _this.idarea,
                idnaturaleza:(_this.objetoobra) ? natobjobraP : natinmuebleP
                
            }
        });
        
        return vista;
    },
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    }

});