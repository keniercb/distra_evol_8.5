Ext.ns('Ext.erp');
Ext.erp.fallasmedios = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    idproducto: undefined,
    constructor: function (config) {
        var _this = this;
        config._plugins = [];
        config._plugins.push(new Ext.grid.RowExpander({
            tpl: '<p><b>Soluciones:</b><br>{soluciones}</p><br>',
            enableCaching: false
        }));
        Ext.apply(this, config);
        this.bussinesModel = 'NomFallasmediosModel';
        this.campoIdNomenclador = 'idfalla';
        config.codigo = false;
        config.usarFecha = false;
        this.storeFields = [{
            name: 'idproducto'
        }, {
            name: 'soluciones'
        }];
        var stFallas = new Ext.data.Store({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/cargarTiposMedios',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idindicador',
                totalProperty:'cantidad'
            }, [
                {name: 'idindicador'},
                {name: 'denominacion'},
            ])
        });
        this.comboMedio = new LOG.util.ComboBox({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/cargarTiposMedios',
            name: 'idproducto',
            store:stFallas,
            id: 'producto',
            displayField: 'denominacion',
            valueField: 'idindicador',
            fieldLabel: this.idioma.labelMedio,
            allowBlank: false,
            mode: 'remote',
            pageSize: 10,
            width: 260,
            resizable: true,
            minListWidth : 300,
            emptyText: 'Seleccione...',
        });
        this.panelSuperior = new Ext.Panel({
            region: 'north',
            tbar: ['->', new Ext.menu.TextItem({
                text: this.idioma.lbcmbMedio + ':'
            }), '', this.comboMedio]
        });
        var array = new Array();
        array.push(config._plugins[0]);
        Ext.erp.fallasmedios.superclass.constructor.call(this, config);

        this.columnasNomenclador.config[1].width = 120;
        this.columnasNomenclador.config[2].width = 200;
        this.columnasNomenclador.config[5].hidden = true;
        this.columnasNomenclador.config[6].hidden = true;
        var columnas = this.columnasNomenclador.config;
        for (i = 0; i < columnas.length - 1; i++) {
            array.push(columnas[i]);
        }
        this.columnasNomenclador.config = array;
        this.btnAdicionar.disable();
        this.panelBotones.add(this.panelSuperior);
        this.panelBotones.setHeight(52);
        this.comboMedio.on({
            'select' : function() {
                _this.idproducto = this.getValue();
                _this.onSelectElemento(_this.idproducto);
                _this.btnAdicionar.enable();
            }
        });
        this.storeNomenclador.on({
            'load': function (st) {
                if(st.getCount()== 0 ){
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable();
                    _this.btnUsarEntidad.disable();
                }
            }
        });
        this.btnAdicionar.on({
            'click': function () {
                _this.btnAceptar.on({
                    'click': function() {
                        _this.hidden.setValue(_this.idproducto);
                    }
                })
            }
        });
    },

    initFormFields: function() {
        var _this = this;
        var solucion = new Ext.form.TextArea({
            name: 'soluciones',
            anchor: '98%',
            fieldLabel: _this.idioma.lbSolucion,
            allowBlank: false,
            minLength:2,
            minLengthText: _this.idioma.lbMsgMinLongDescripcion,
            maxLength: 255,
            maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
            regex: _this.idioma.lbRegexSol,
            regexText: _this.idioma.lbRegexSolText
        });

        _this.hidden = new Ext.form.Hidden({
            name : 'idproducto',
            value: _this.idproducto
        });

        this.formFields = [solucion,_this.hidden];
    },

    onSelectElemento: function (idproducto) {
        var _this = this;
        this.storeNomenclador.on({
            'beforeload': function () {
                _this.storeNomenclador.baseParams.idproducto = idproducto
            }
        });
        this.storeNomenclador.load({
            callback: function () {
                if (this.getCount() == 0)
                    mostrarMensaje(1, 'No existen datos que mostrar.');
            }
        });
    }

});

