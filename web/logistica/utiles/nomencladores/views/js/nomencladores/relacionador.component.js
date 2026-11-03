Ext.ns('Ext.erp');

Ext.erp.relacionador = Ext.extend(Ext.Panel, {
    controllerRel: '/logistica/utiles/nomencladores/index.php/relacionardatos/',
    defaultController: '/logistica/utiles/nomencladores/index.php/nomencladores/',
    valorCampo: 0,
    pageSize: undefined,
    campoIdNomenclador: undefined,
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.region = 'center';
        Ext.erp.relacionador.superclass.constructor.call(this, config);
        this.on({
            'bodyresize': function(panel, width, height) {
                if (!width)
                    width = 385 * 2 + 20;
                var widthNew = 370 + (width / 2 - 370 - 20);
                _this.gridIzquierdo.setWidth(widthNew);
                _this.gridDerecho.setWidth(widthNew);
            }
        });
    },
    getTime: function() {
        var fecha = new Date();
        return fecha.getTime();
    },
    initComponent: function() {
        var _this = this;
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
                name: 'nro'
            }, {
                name: 'denominacion'
            }, {
                name: this.idIzq
            }, {
                name: 'orden'
            }, {
                name: 'concepto'
            }];
        if (this.storeFieldsIzq) {
            fieldsIzq = fieldsIzq.concat(_this.storeFieldsIzq);
        }
        this.RecordGridIzquierdo = new Ext.data.Record.create(fieldsIzq);

        var fieldsDer = [{
                name: 'nro'
            }, {
                name: 'denominacion'
            }, {
                name: this.idDer
            }, {
                name: this.idIzq
            }, {
                name: 'orden'
            }, {
                name: 'concepto'
            }];
        if (this.storeFieldsDer) {
            fieldsDer = fieldsDer.concat(_this.storeFieldsDer);
        }

        this.RecordGridDerecho = new Ext.data.Record.create(fieldsDer);

        /*
         * Creamos el datastore donde se van a almacenar los datos de la tabla
         */
        //var url = this.campoIdNomenclador=="idtipotransferencia" ? 'cargarnomencladorentidad' : 'cargarnomenclador'
        this.stGridIzquierdo = new Ext.data.Store({
            //autoLoad:true,
            url: this.defaultController + 'cargarnomenclador',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: 'datos',
                id: this.idIzq
            }, this.RecordGridIzquierdo)
        });

        this.stGridIzquierdo.on({
            'beforeload': function() {
                _this.stGridIzquierdo.baseParams = _this.onStIzqBeforeLoad();
            }
        });
        this.stGridDerecho = new Ext.data.Store({
            // autoLoad:true,
            url: this.defaultController + 'cargarnomenclador',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: this.idIzq
            }, _this.RecordGridDerecho)
        });
        this.stGridDerecho.on({
            'beforeload': function() {
                _this.stGridDerecho.baseParams = _this.onStDerBeforeLoad();
            }
        });
        /*
         * Creamos las columnas que van a estar en el grid
         */
        var idexpandirder = this.getTime() + 'expandirder';
        var idexpandirizq = this.getTime() + 'expandirizq';
        if(this.todosFn){
            var columnasIzq = [
                new Ext.LOG.PagingRowNumberer(),
                //this.smIzquierdo,
                {
                    header: 'Denominaci\xf3n',
                    dataIndex: 'denominacion',
                    width: 150,
                    align: 'left',
                    id: idexpandirizq
                }];
            var columnasDer = [
                new Ext.LOG.PagingRowNumberer(),
                //this.smDerecho,
                {
                    header: 'Denominaci\xf3n',
                    dataIndex: 'denominacion',
                    width: 150,
                    align: 'left',
                    id: idexpandirder
                }];
        }else{
            var columnasIzq = [
                new Ext.LOG.PagingRowNumberer(),
                {
                    header: 'Denominaci\xf3n',
                    dataIndex: 'denominacion',
                    width: 150,
                    align: 'left',
                    id: idexpandirizq
                }];
            var columnasDer = [
                new Ext.LOG.PagingRowNumberer(),
                {
                    header: 'Denominaci\xf3n',
                    dataIndex: 'denominacion',
                    width: 150,
                    align: 'left',
                    id: idexpandirder
                }];
        }

        if (this.columnsFieldsIzq) {
            columnasIzq = columnasIzq.concat(_this.columnsFieldsIzq);
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
                header: 'Denominaci\xf3n',
                dataIndex: 'denominacion',
                width: 150,
                align: 'left',
                id: idexpandirder
            }];

        if (this.columnsFieldsDer) {
            columnasDer = columnasDer.concat(_this.columnsFieldsDer);
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
        this.textBuscarIzq = LOG.util.Prototipos.inputTexto({
            enableKeyEvents: true,
            emptyText: (_this.conceptoBusqueda) ? _this.conceptoBusqueda : ''
        });
        this.gridIzquierdo = new Ext.grid.GridPanel({
            frame: true,
            region: 'west',
            title: this.tituloIzq,
            autoScroll: true,
            iconCls: 'icon-grid',
            autoExpandColumn: idexpandirizq,
            loadMask: {
                store: _this.stGridIzquierdo
            },
            width: 375,
            store: this.stGridIzquierdo,
            cm: this.cmIzquierdo,
            sm: _this.smIzquierdo,
            tbar:(_this.buscar) ? _this.createToolBarIzq(_this) : null,
            bbar: new Ext.PagingToolbar({
                pageSize: (_this.pageSize) ? _this.pageSize : 5,
                store: this.stGridIzquierdo,
                displayInfo: false
            })
        });

        this.gridIzquierdo.on({
            'render': function() {
                _this.stGridIzquierdo.reload();
            }
        });
        this.textBuscarDer = LOG.util.Prototipos.inputTexto({
            enableKeyEvents: true,
            emptyText: (_this.conceptoBusqueda) ? _this.conceptoBusqueda : ''
        });
        this.gridDerecho = new Ext.grid.EditorGridPanel({
            frame: true,
            region: 'east',
            title: this.tituloDer,
            autoScroll: true,
            iconCls: 'icon-grid',
            autoExpandColumn: idexpandirder,
            width: 375,
            clicksToEdit: 1,
            loadMask: {
                store: _this.stGridDerecho
            },
            store: this.stGridDerecho,
            cm: this.cmDerecho,
            sm: _this.smDerecho,
            //~ columnWidth: .47,
            tbar:(_this.buscar) ? _this.createToolBarDer(_this) : null,
            bbar: new Ext.PagingToolbar({
                pageSize: (_this.pageSize) ? _this.pageSize : 5,
                store: _this.stGridDerecho,
                displayInfo: false
            })
        });
        this.gridDerecho.on({
            'render': function() {
                _this.stGridDerecho.reload();
            }
        });
        this.panelOperaciones = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            frame: true,
            //width: 37,
            //height: 200,
            border: false,
            layout: 'form',
            bodyStyle: 'margin-top:10px',
            //columnWidth: .04,
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
                        {xtype: 'panel',
                            height: 10,
                            width: 20
                        },
                        this.btnEliminarTodos
                    ]
                }]
        });

        this.stGridIzquierdo.on({
            'load': function(st) {
                _this.activarBtns();
            }
        });


        this.stGridDerecho.on({
            'load': function(st) {
                _this.activarBtns();
            }
        });


        this.smIzquierdo.on({
            'rowselect': function() {
                _this.activarBtns();
            },
            'rowdeselect': function() {
                _this.activarBtns();
            }
        });

        this.smDerecho.on({
            'rowselect': function() {
                _this.activarBtns();
            },
            'rowdeselect': function() {
                _this.activarBtns();
            }
        });
        this.btnAdicionar.on({
            'click': function() {
                _this.onBtnbtaddClick();
            }
        });

        this.btnAdicionarTodos.on({
            'click': function() {
                _this.onBtnbtaddallClick();
            }
        });

        this.btnEliminar.on({
            'click': function() {
                _this.onBtnbtdelClick();
            }
        });

        this.btnEliminarTodos.on({
            'click': function() {
                _this.onBtnbtdelallClick();
            }
        });
        this.textBuscarIzq.on('render', function () {
            this.textBuscarIzq.el.dom.qtip = (_this.conceptoBusqueda) ? _this.conceptoBusqueda : '';
            this.gridIzquierdo.keyMap = new Ext.KeyMap(this.textBuscarIzq.el, [{
                key: Ext.EventObject.ENTER
                , scope: this
                , fn: function(){
                    _this.stGridIzquierdo.load()
                }
            }/*, {
                key: Ext.EventObject.ESC
                , scope: this
                , fn: this.onTriggerClear
            },{
                key: 'L',
                alt: true,
                shift: false,
                scope: this,
                control: false,
                fn: this.onTriggerClear
            },{
                key: 'B',
                alt: true,
                shift: false,
                scope: this,
                control: false,
                fn: this.onTriggerSearch
            }*/]);
            this.gridIzquierdo.keyMap.stopEvent = true;
        }, this, {single: true});
        
        this.textBuscarDer.on('render', function () {
            this.textBuscarDer.el.dom.qtip = (_this.conceptoBusqueda) ? _this.conceptoBusqueda : '';
            this.gridDerecho.keyMap = new Ext.KeyMap(this.textBuscarDer.el, [{
                key: Ext.EventObject.ENTER
                , scope: this
                , fn: function(){
                    _this.stGridDerecho.load()
                }
            }/*, {
                key: Ext.EventObject.ESC
                , scope: this
                , fn: this.onTriggerClear
            },{
                key: 'L',
                alt: true,
                shift: false,
                scope: this,
                control: false,
                fn: this.onTriggerClear
            },{
                key: 'B',
                alt: true,
                shift: false,
                scope: this,
                control: false,
                fn: this.onTriggerSearch
            }*/]);
            this.gridDerecho.keyMap.stopEvent = true;
        }, this, {single: true});


        Ext.apply(this, {
            height: 200,
            layout: 'border',
            items: [this.gridIzquierdo, this.panelOperaciones, this.gridDerecho]
        })

        Ext.erp.relacionador.superclass.initComponent.call(this);
    },
    createToolBarIzq: function(_this) {
        this.textBuscarIzq = LOG.util.Prototipos.inputTexto({
            enableKeyEvents: true,
            emptyText: (_this.conceptoBusqueda) ? _this.conceptoBusqueda : ''
        });
        new Ext.Toolbar({
            items:[
                _this.textBuscarIzq,
                '-',
                LOG.util.Prototipos.botonBuscar({
                    handler: function(){
                        _this.stGridIzquierdo.load()
                    }
                }),
                '-',
                LOG.util.Prototipos.botonLimpiar({
                    handler:function(){
                        _this.textBuscarIzq.reset();
                        _this.stGridIzquierdo.reload();
                    }
                })
            ]
        })
    },
    createToolBarDer: function(_this) {
        this.textBuscarDer = LOG.util.Prototipos.inputTexto({
            enableKeyEvents: true,
            emptyText: (_this.conceptoBusqueda) ? _this.conceptoBusqueda : ''
        });
        new Ext.Toolbar({
            items:[
                _this.textBuscarDer,
                '-',
                LOG.util.Prototipos.botonBuscar({
                    handler: function(){
                        _this.stGridDerecho.load()
                    }
                }),
                '-',
                LOG.util.Prototipos.botonLimpiar({
                    handler:function(){
                        _this.textBuscarDer.reset();
                        _this.stGridDerecho.reload();
                    }
                })
            ]
        })
    },
    activarBtns: function() {
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
            this.btnAdicionar.disable();
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
            this.btnEliminar.disable();
        }
    },
    onBtnbtaddClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        if (this.stGridIzquierdo.getCount() > 0) {
            arr = this.smIzquierdo.getSelections();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridDerecho.find(this.idIzq, arr[i].id) == -1) || (this.stGridDerecho.find(this.idIzq, arr[i].id) == 0)) {
                    _this.adicionados.push(arr[i].id);
                    _this.eliminarRecordsArreglo(arr[i].id, this.eliminados);
                    _this.stGridIzquierdo.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            this.adicionarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtaddallClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        var cant = _this.stGridIzquierdo.getCount();
        if (cant > 0) {
            arr = _this.stGridIzquierdo.getRange();
            if(this.todosFn){
                _this.adicionadosTodos = true;
                _this.eliminadosTodos = null;
            }
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridDerecho.find(this.idIzq, arr[i].id) == -1) || (this.stGridDerecho.find(this.idIzq, arr[i].id) == 0)) {
                    if(arr[i].json.idtipoareaoperaciones){
                        arr[i].id=arr[i].json.idtipoareaoperaciones;
                    }
                    _this.adicionados.push(arr[i].id);
                    _this.eliminarRecordsArreglo(arr[i].id, this.eliminados);
                    _this.stGridIzquierdo.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            _this.adicionarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    onBtnbtdelClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        if (this.stGridDerecho.getCount() > 0) {
            arr = this.smDerecho.getSelections();

            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridIzquierdo.find(this.idIzq, arr[i].id) == -1) || (this.stGridIzquierdo.find(this.idIzq, arr[i].id) == 0)) {
                    if(arr[i].json.idtipoareaoperaciones){
                        arr[i].id=arr[i].json.idtipoareaoperaciones;
                    }
                    _this.eliminados.push(arr[i].id);
                    _this.eliminarRecordsArreglo(arr[i].id, this.adicionados);
                    _this.stGridDerecho.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            this.eliminarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtdelallClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        var cant = _this.stGridDerecho.getCount();
        if (cant > 0) {
            if(this.todosFn){
                _this.adicionadosTodos = null;
                _this.eliminadosTodos = true;
            }

            arr = _this.stGridDerecho.getRange();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridIzquierdo.find(this.idIzq, arr[i].id) == -1) || (this.stGridIzquierdo.find(this.idIzq, arr[i].id) == 0)) {
                    _this.eliminados.push(arr[i].id);
                    _this.eliminarRecordsArreglo(arr[i].id, this.adicionados);
                    _this.stGridDerecho.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            _this.eliminarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    adicionarRecords: function(arreglo) {
        this.stGridDerecho.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecords: function(arreglo) {
        this.stGridIzquierdo.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecordsArreglo: function(idelemento, arreglo) {
        var index = arreglo.indexOf(idelemento);
        if (index != -1) {
            arreglo.remove(arreglo[index]);
        }
    },
    activarBotones: function(newValor) {
        this.valorCampo = newValor;
    },
    setValorCampo: function(newValor) {
        this.valorCampo = newValor;
    },
    setValor: function( ) {
        this.adicionados = [];
        this.eliminados = [];
    },
    onStIzqBeforeLoad: function() {
        var _this = this;
        var baseParams = {
            modelo: _this.modeloIzq,
            idnom: _this.idIzq,
            bussines: _this.bussinesModelIzq,
            adicionados: _this.adicionados.length > 0 ? _this.adicionados.join(',') : '',
            filtroOr: _this.eliminados.length > 0 ? _this.eliminados.join(',') : '',
            grid: 'izq',
            modificar: (_this.scope && _this.scope.modificar) ? 'true' : 'false',
            filtroBq: (_this.buscar) ? _this.textBuscarIzq.getValue() : null
        };

        var filtro = new Array();
        if (_this.scope && _this.scope.modificar){
            baseParams.filtro = Ext.encode(filtro);
        }
        if (_this.valorCampo > 0) {
            var obj = {
                signo: 'not in,select',
                modelo: _this.modeloDer
            };
            obj[_this.campoIdNomenclador] = _this.valorCampo;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        }

        return baseParams;
    },
    onStDerBeforeLoad: function() {
        var _this = this;
        var baseParams = {
            modelo: _this.modeloIzq,
            idnom: _this.idIzq,
            bussines: _this.bussinesModelDer,
            join: 'm.' + _this.modeloDer + ' t',
            eliminados: _this.eliminados.length > 0 ? _this.eliminados.join(',') : '',
            filtroOr: _this.adicionados.length > 0 ? _this.adicionados.join(',') : '',
            grid: 'der',
            modificar: (_this.scope && _this.scope.modificar) ? 'true' : 'false',
            filtroBq: (_this.buscar) ? _this.textBuscarDer.getValue() : null
        };
        var filtro = new Array();

        if (_this.valorCampo > 0) {
            var obj = {
                signo: '= ?'
            };
            obj[_this.idDer] = _this.valorCampo;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        } else {
            var obj = {
                signo: '= ?'
            };
            obj[_this.idDer] = -1;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        }
        return baseParams;
    },
    getTotalCount: function() {
        return this.stGridDerecho.getCount()/* + this.adicionados.length - this.eliminados.length*/;
    },
    loadDatos: function() {
        this.stGridIzquierdo.reload();
        if (this.valorCampo > 0) {
            this.stGridDerecho.reload();
        }
    }
});
