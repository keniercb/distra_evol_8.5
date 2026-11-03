Ext.ns('LOG.fac.configuracionpuntoventa');
LOG.fac.configuracionpuntoventa.relacionador = Ext.extend(Ext.Panel, {
    controllerRel: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/',
    defaultController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/',
    valorCampo: 0,
    campoIdNomenclador: undefined,
    constructor: function (config) {
        var me = this;
        Ext.apply(this, config);
        LOG.fac.configuracionpuntoventa.relacionador.superclass.constructor.call(this, config);
        this.on({
            'bodyresize': function (panel, width, height) {
                if (!width) {
                    width = 385 * 2 + 40;//width = 385 * 2 + 40;
                }
                var widthNew = 370 + (width / 2 - 370 - 20);//370 + (width / 2 - 370 - 20);
                me.gridIzquierdo.setWidth(widthNew);
                me.gridDerecho.setWidth(widthNew);
            }
        });
    },
    getTime: function () {
        var fecha = new Date();
        return fecha.getTime();
    },
    initComponent: function () {
        var me = this;
        this.adicionados = [];
        this.eliminados = [];
        /*
         * Definimos los botones de las operaciones
         */
        this.btnAdicionarTodos = new Ext.Button({
            iconCls: 'ultimapagina',
            tooltip: 'Pasar todos ',
            hidden: false,
            disabled: true
        });

        this.btnAdicionar = new Ext.Button({
            iconCls: 'siguiente',
            tooltip: 'Pasar de la selecci\xf3n',
            hidden: false,
            disabled: true
        });

        this.btnEliminar = new Ext.Button({
            iconCls: 'anterior',
            tooltip: 'Quitar de la selecci\xf3n',
            hidden: false,
            disabled: true
        });

        this.btnEliminarTodos = new Ext.Button({
            iconCls: 'primerapagina',
            tooltip: 'Quitar todos',
            hidden: false,
            disabled: true
        });

        /*
         * Creamos el selectionModel para ambos grid
         */
        this.smIzquierdo = new Ext.grid.RowSelectionModel({});

        this.smDerecho = new Ext.grid.RowSelectionModel({});

        /*
         * Creamos el registro de datos
         */
        var fieldsIzq = [{
            name: 'idusuario'
        }, {
            name: 'nombreusuario'
        }, {
            name: this.idIzq
        }, {
            name: 'idpersona'
        }];
        if (this.storeFieldsIzq) {
            fieldsIzq = fieldsIzq.concat(me.storeFieldsIzq);
        }
        this.RecordGridIzquierdo = new Ext.data.Record.create(fieldsIzq);

        var fieldsDer = [{
            name: 'idusuario'
        }, {
            name: 'nombreusuario'
        }, {
            name: this.idDer
        }, {
            name: this.idIzq
        }, {
            name: 'idpersona'
        }];
        if (this.storeFieldsDer) {
            fieldsDer = fieldsDer.concat(me.storeFieldsDer);
        }
        this.RecordGridDerecho = new Ext.data.Record.create(fieldsDer);

        /*
         * Creamos el datastore donde se van a almacenar los datos de la tabla
         */
        //var url = this.campoIdNomenclador=="idtipotransferencia" ? 'cargarnomencladorentidad' : 'cargarnomenclador'
        this.stGridIzquierdo = new Ext.data.Store({
            url: this.defaultController + 'cargarUsuarios',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: 'datos',
                id: this.idIzq
            }, this.RecordGridIzquierdo)
        });

        this.stGridIzquierdo.on({
            'beforeload': function () {
                me.stGridIzquierdo.baseParams = me.onStIzqBeforeLoad();
                /*if (!me.stGridIzquierdo.baseParams.start) {
                    me.stGridIzquierdo.baseParams.start = 0;
                }
                if (!me.stGridIzquierdo.baseParams.limit) {
                    me.stGridIzquierdo.baseParams.limit = me.gridIzquierdo.getBottomToolbar().cbPageSize.getValue();
                }*/
            }
        });
        this.stGridDerecho = new Ext.data.Store({
            url: this.defaultController + 'cargarUsuarios',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: this.idIzq
            }, me.RecordGridDerecho)
        });
        this.stGridDerecho.on({
            'beforeload': function () {
                me.stGridDerecho.baseParams = me.onStDerBeforeLoad();
                /*if (!me.stGridIzquierdo.baseParams.start) {
                    me.stGridDerecho.baseParams.start = 0;
                }
                if (!me.stGridIzquierdo.baseParams.limit) {
                    me.stGridDerecho.baseParams.limit = me.gridDerecho.getBottomToolbar().cbPageSize.getValue();
                }*/
            }
        });
        /*
         * Creamos las columnas que van a estar en el grid
         */
        var idexpandirder = this.getTime() + 'expandirder';
        var idexpandirizq = this.getTime() + 'expandirizq';
        var columnasIzq = [
            new Ext.LOG.PagingRowNumberer(),
            {
                header: 'Nombre',
                dataIndex: 'nombreusuario',
                //width: 150,
                align: 'left',
                id: idexpandirizq
            }];

        if (this.columnsFieldsIzq) {
            columnasIzq = columnasIzq.concat(me.columnsFieldsIzq);
        }
        this.cmIzquierdo = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: columnasIzq
        });

        var columnasDer = [
            new Ext.LOG.PagingRowNumberer(),
            {
                header: 'Nombre',
                dataIndex: 'nombreusuario',
                //width: 150,
                align: 'left',
                id: idexpandirder
            }];

        if (this.columnsFieldsDer) {
            columnasDer = columnasDer.concat(me.columnsFieldsDer);
        }

        this.cmDerecho = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: columnasDer
        });

        /*
         * Definimos los grid
         */
        this.gridIzquierdo = new Ext.grid.GridPanel({
            frame: true,
            region: 'west',
            title: this.idioma.cgUsuarios,
            autoScroll: true,
            iconCls: 'icon-grid',
            autoExpandColumn: idexpandirizq,
            loadMask: {
                store: me.stGridIzquierdo
            },
            store: this.stGridIzquierdo,
            cm: this.cmIzquierdo,
            sm: me.smIzquierdo/*,
            bbar: new Ext.PagingToolbar({
                pageSize: 30,
                store: this.stGridIzquierdo,
                displayInfo: false
            })*/
        });
        this.comboCaja.addListener('select', function () {
            if (me.comboArea.isDirty()) {
                me.stGridIzquierdo.load({
                    params: {
                        idcaja: me.comboCaja.getValue()
                    }
                });
                me.stGridDerecho.load({
                    params: {
                        idcaja: me.comboCaja.getValue()
                    }
                });
            }
        });
        this.comboArea.addListener('select', function () {
            if (me.comboCaja.isDirty()) {
                me.stGridIzquierdo.load({
                    params: {
                        idcaja: me.comboCaja.getValue()
                    }
                });
                me.stGridDerecho.load({
                    params: {
                        idcaja: me.comboCaja.getValue()
                    }
                });
            }
        });

        this.txtSimpleFind = LOG.util.Prototipos.inputTexto({
            emptyText: me.idioma.lbIntroducirNombre,
            maxLength:50,
            enableKeyEvents: true,
            width:'250px',
            listeners: {
                keydown: function (txt, e) {
                    if (e.getKey() === 13) {
                        /*me.productos.stDtView.filtrado = true;
                        me.productos.stDtView.load({
                            params: {
                                criterio: txt.getValue()
                            },
                            callback: function (record) {
                                if (record.length == 0) {
                                    mostrarMensaje(1, me.idioma.msgNoResultados);
                                    delete me.productos.stDtView.filtrado;
                                    return;
                                }
                                var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                                Ext.each(record, function (rd) {
                                    st.each(function (item) {
                                        if (rd.data.idproducto == item.data.idproducto) {
                                            rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                            rd.commit();
                                        }
                                    });
                                });
                            }
                        });*/
                    }
                }
            }
        });
        this.txtSimpleFind.on('render', function () {
            me.txtSimpleFind.el.dom.qtip = me.idioma.lbIntroducirNombre;
        }, this, {single: true});

        this.gridDerecho = new Ext.grid.EditorGridPanel({
            id: 'idgriderecho',
            frame: true,
            region: 'east',
            title: 'Usuarios autorizados',
            autoScroll: true,
            iconCls: 'icon-grid',
            autoExpandColumn: idexpandirder,
            clicksToEdit: 1,
            loadMask: {
                store: me.stGridDerecho
            },
            store: this.stGridDerecho,
            cm: this.cmDerecho,
            sm: me.smDerecho,
            //tbar:[this.txtSimpleFind]
            /*bbar: new Ext.PagingToolbar({
                pageSize: 30,
                store: me.stGridDerecho,
                displayInfo: false
            })*/
        });
        this.panelOperaciones = new Ext.Panel({
            region: 'center',
            frame: true,
            border: false,
            layout: 'form',
            bodyStyle: 'margin-top:10px',
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 40,
                        width: 20
                    },
                        this.btnAdicionarTodos
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 10,
                        width: 20
                    },
                        this.btnAdicionar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 10,
                        width: 20
                    },
                        this.btnEliminar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [
                        {
                            xtype: 'panel',
                            height: 10,
                            width: 20
                        },
                        this.btnEliminarTodos
                    ]
                }]
        });

        this.stGridIzquierdo.on({
            'load': function (st) {
                me.activarBtns();
            }
        });
        this.stGridDerecho.on({
            'load': function (st) {
                me.activarBtns();
            }
        });
        this.smIzquierdo.on({
            'rowselect': function () {
                me.activarBtns();
            },
            'rowdeselect': function () {
                me.activarBtns();
            }
        });

        this.smDerecho.on({
            'rowselect': function () {
                me.activarBtns();
            },
            'rowdeselect': function () {
                me.activarBtns();
            }
        });
        this.btnAdicionar.on({
            'click': function () {
                me.onBtnbtaddClick();
            }
        });
        this.btnAdicionarTodos.on({
            'click': function () {
                me.onBtnbtaddallClick();
            }
        });
        this.btnEliminar.on({
            'click': function () {
                me.onBtnbtdelClick();
            }
        });
        this.btnEliminarTodos.on({
            'click': function () {
                me.onBtnbtdelallClick();
            }
        });
        Ext.apply(this, {
            height: 380,
            layout: 'border',
            items: [this.gridIzquierdo, this.panelOperaciones, this.gridDerecho]
        }),
            LOG.fac.configuracionpuntoventa.relacionador.superclass.initComponent.call(this);
    },
    activarBtns: function () {
        var cantI = this.stGridIzquierdo.getCount();
        var cantD = this.stGridDerecho.getCount();
        if (cantI > 0) {
            this.btnAdicionarTodos.enable();
            if (this.smIzquierdo.hasSelection()) {
                this.btnAdicionar.enable();
            } else {
                this.btnAdicionar.disable();
            }
        } else {
            this.btnAdicionarTodos.disable();
        }
        if (cantD > 0) {
            this.btnEliminarTodos.enable();
            if (this.smDerecho.hasSelection()) {
                this.btnEliminar.enable();
            } else {
                this.btnEliminar.disable();
            }
        } else {
            this.btnEliminarTodos.disable();
        }
    },
    onBtnbtaddClick: function () {
        var me = this;
        var arr = [];
        var arreglo = [];
        if (this.stGridIzquierdo.getCount() > 0) {
            arr = this.smIzquierdo.getSelections();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridDerecho.find(this.idIzq, arr[i].id) == -1) || (this.stGridDerecho.find(this.idIzq, arr[i].id) == 0)) {
                    me.adicionados.push(arr[i].id);
                    me.eliminarRecordsArreglo(arr[i].id, this.eliminados);
                    me.stGridIzquierdo.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            this.adicionarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtaddallClick: function () {
        var me = this;
        var arr = [];
        var arreglo = [];
        var cant = me.stGridIzquierdo.getCount();
        if (cant > 0) {
            arr = me.stGridIzquierdo.getRange();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridDerecho.find(this.idIzq, arr[i].id) == -1) || (this.stGridDerecho.find(this.idIzq, arr[i].id) == 0)) {
                    me.adicionados.push(arr[i].id);
                    me.eliminarRecordsArreglo(arr[i].id, this.eliminados);
                    me.stGridIzquierdo.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            me.adicionarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    onBtnbtdelClick: function () {
        var me = this;
        var arr = [];
        var arreglo = [];
        if (this.stGridDerecho.getCount() > 0) {
            arr = this.smDerecho.getSelections();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridIzquierdo.find(this.idIzq, arr[i].id) == -1) || (this.stGridIzquierdo.find(this.idIzq, arr[i].id) == 0)) {
                    me.eliminados.push(arr[i].id);
                    me.eliminarRecordsArreglo(arr[i].id, this.adicionados);
                    me.stGridDerecho.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            this.eliminarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtdelallClick: function () {
        var me = this;
        var arr = [];
        var arreglo = [];
        var cant = me.stGridDerecho.getCount();
        if (cant > 0) {
            arr = me.stGridDerecho.getRange();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridIzquierdo.find(this.idIzq, arr[i].id) == -1) || (this.stGridIzquierdo.find(this.idIzq, arr[i].id) == 0)) {
                    me.eliminados.push(arr[i].id);
                    me.eliminarRecordsArreglo(arr[i].id, this.adicionados);
                    me.stGridDerecho.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            me.eliminarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    adicionarRecords: function (arreglo) {
        this.stGridDerecho.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecords: function (arreglo) {
        this.stGridIzquierdo.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecordsArreglo: function (idelemento, arreglo) {
        var index = arreglo.indexOf(idelemento);
        if (index != -1) {
            arreglo.remove(arreglo[index]);
        }
    },
    setValorCampo: function (newValor) {
        this.valorCampo = newValor;
    },
    setValor: function () {
        this.adicionados = [];
        this.eliminados = [];
    },
    onStIzqBeforeLoad: function () {
        var me = this;
        var baseParams = {
            modelo: me.modeloIzq,
            idnom: me.idIzq,
            bussines: me.bussinesModelIzq,
            adicionados: me.adicionados.length > 0 ? me.adicionados.join(',') : '',
            filtroOr: me.eliminados.length > 0 ? me.eliminados.join(',') : '',
            idcaja: !isNaN(me.comboCaja.getValue()) ? me.comboCaja.getValue() : me._parent.getSmPrincipal().getSelected().data.idcaja,
            idareaventa: !isNaN(me.comboArea.getValue()) ? me.comboArea.getValue() : me._parent.getSmPrincipal().getSelected().data.idareaventa,
            grid: 'izq'
        };

        var filtro = new Array();
        baseParams.filtro = Ext.encode(filtro);
        if (me.valorCampo > 0) {
            var obj = {
                signo: 'not in,select',
                modelo: me.modeloDer
            };
            obj[me.campoIdNomenclador] = me.valorCampo;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        }

        return baseParams;
    },
    onStDerBeforeLoad: function () {
        var me = this;
        var baseParams = {
            modelo: me.modeloIzq,
            idnom: me.idIzq,
            bussines: me.bussinesModelDer,
            join: 'm.' + me.modeloDer + ' t',
            eliminados: me.eliminados.length > 0 ? me.eliminados.join(',') : '',
            filtroOr: me.adicionados.length > 0 ? me.adicionados.join(',') : '',
            idcaja: !isNaN(me.comboCaja.getValue()) ? me.comboCaja.getValue() : me._parent.getSmPrincipal().getSelected().data.idcaja,
            idareaventa: !isNaN(me.comboArea.getValue()) ? me.comboArea.getValue() : me._parent.getSmPrincipal().getSelected().data.idareaventa,
            grid: 'der'
        };
        var filtro = new Array();

        if (me.valorCampo > 0) {
            var obj = {
                signo: '= ?'
            };
            obj[me.idDer] = me.valorCampo;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        } else {
            var obj = {
                signo: '= ?'
            };
            obj[me.idDer] = -1;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        }
        return baseParams;
    },
    getTotalCount: function () {
        return this.stGridDerecho.getCount() + this.adicionados.length - this.eliminados.length;
    },
    loadDatos: function () {
        this.stGridIzquierdo.reload();
        if (this.valorCampo > 0) {
            this.stGridDerecho.reload();
        }
    }
});
