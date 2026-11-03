Ext.ns('Ext.erp');

Ext.erp.conceptoprecio = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        config.codigo = false;
        var _this = this;
        Ext.apply(this, config);
//        this.campoIdNomenclador = 'idnomconceptoprecio';

      /*  this.storeFields = [{
                name: 'operacion'
            }];
        */
        this.store = new Ext.data.SimpleStore({
            fields: ['id1', 'name', 'estado'],
            data: [[1, 'Prestacion de servicio', false],
                [2, 'Prestacion de servicio', true],
                [3, 'Salida de mercancias para la venta', false]],
            autoLoad: false
        });
        
      /*  this.columnsFields = [{
                header: 'Operacion',
                dataIndex: 'name',
                width: 280,
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true ,
                    triggerAction: 'all',
                    selectOnTab: true,
                    editable: false,
                    store: [
                        ['Salida de mercancias para la venta', 'Salida de mercancias para la venta'],
                        ['Prestacion de servicio', 'Prestacion de servicio']
                    ],
                    lazyRender: true
                })
            }];*/

        this.btnAdicionarDN = new Ext.Button({
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            text: _this.idioma.lbBtnAdicionar,
            id: 'btnAdicionar'
        });


        this.cm = new Ext.grid.ColumnModel([
            new Ext.LOG.PagingRowNumberer(), {
                id: 'id1',
                header: 'Denominacion',
                dataIndex: 'id1',
                width: 280,
                // use shorthand alias defined above
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            }, {
                header: 'Operacion',
                dataIndex: 'name',
                width: 280,
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    editable: false,
                    store: [
                        ['Salida de mercancias para la venta', 'Salida de mercancias para la venta'],
                        ['Prestacion de servicio', 'Prestacion de servicio']
                    ],
                    lazyRender: true
                })
            }, {
                header: _this.idioma.lbEstado,
                width: 100,
                dataIndex: 'estado',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                },
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    editable: false,
                    store: [
                        [1, 'Activo'],
                        [2, 'Inactivo']
                    ],
                    lazyRender: true
                })
            }
        ]);

        this.cm.defaultSortable = true;

        this.gridDatoNomenclador = new Ext.grid.EditorGridPanel({
            store: this.store,
            cm: this.cm,
            width: 600,
            height: 300,
//            autoExpandColumn: 'name',
            frame: true,
            region: 'center',
            clicksToEdit: 1
        });

        this.tbarBtns = [
            _this.btnAdicionarDN
        ];

        this.btnAdicionarDN.on({
            'click': function() {
                var Plant = _this.gridDatoNomenclador.getStore().recordType;
                var p = new Plant({
                    id1: '',
                    name: '',
                    estado: false
                });
                _this.gridDatoNomenclador.stopEditing();
                _this.store.insert(0, p);
                _this.gridDatoNomenclador.startEditing(0, 0);
            }
        });

        Ext.erp.conceptoprecio.superclass.constructor.call(this, config);
        this.add(_this.gridDatoNomenclador);

        this.columnasNomenclador.setHidden(2, true);
        this.btnAdicionar.setVisible();
        this.btnModificar.setVisible();
        this.btnEliminar.setVisible();
        this.btnHabilitar.setVisible();
        this.btnUsarEntidad.setVisible();
        this.gridPanelNomenclador.setVisible()

    }
});
