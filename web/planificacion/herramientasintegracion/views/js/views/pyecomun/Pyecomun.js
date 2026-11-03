/**
 * Fichero que contiene los componentes que son comunes para el componente Curvaconflicto
 *
 * @author Ing. Roberto Yasel Garcia Quintana
 * @copyright XETID Cuba
 * @version 1.0
 * @namespace Planificacion.Integracion
 * @class Planificacion.Integracion.PanelProyecto
 * @parametros Object objetct: Objeto con los siguientes atributos
 *             concepto: Object: objeto que identifica el concepto al que se asociarán los proyectos:
 *             concepto  : String : Nombre de la clase por la que se asociarán los proyectos a un concepto, Ej. "DatProyectodelphi".
 *             campoid   : String : Nombre del campo por el que se relacionarán los proyectos a un concepto, Ej. "idproyectodelphi".
 *             nativo    : Boolean: "true" si el proyecto es creado desde la entidad "concepto", por defecto "false".
 * @eventos 'verproyecto' : Dispara el evento "verproyecto" al presionar el botón "Ver proyecto" y devuelve el record de proyecto seleccionado. Ej. "componenteProyecto.on('verproyecto', function(record){})"
 */
Planificacion.Integracion.PanelProyecto = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    initComponent: function () {
        var idCmp = this.id;
        var me = this;
        me.comps = ExtExtend.Components;

        me.controller = new Planificacion.Integracion.PyecomunController();
        me.concepto = this.concepto;
        me.validatorProyecto = new ExtExtend.FormValidator();

        /**
         * Boton que permite mostrar los detalles del proyecto seleccionado
         * @type {viewdashboard.view.GeneralPanelView.setToolTip.options.Ext.Button}
         */
        me.btnVerProyecto = new me.comps.Button({
            text: 'Ver proyecto',
            icon: perfil.dirImg + 'ver.png',
            iconCls: 'btn',
            tooltip: 'Ver proyecto',
            disabled: true,
            handler: function (obj) {
                me.fireEvent('verproyecto', me.smProyecto.getSelected().data);
            }
        });
        /**
         * Boton que permite mostrar la ayuda del componente
         * @type {Ext.idioma.docanexos.btnAyuda}
         */
        me.btnAyudaProyecto = new me.comps.buttons.btnAyuda({
            handler: function () {
                me.fireEvent('prueba', me.smProyecto.getSelected().data);
                //me.cargarAyuda();
            }
        });
        /**
         * Boton que permite recargar la interfaz de proyectos
         * @type {_.Components.buttons.btnActualizar}
         */
        me.btnRecargarProyecto = new me.comps.buttons.btnActualizar({
            handler: function () {
                me.stProyecto.reload({params: {concepto: Ext.encode(me.concepto), start: 0, limit: 20}});
            }
        });
        /**
         * Boton que permite guardar los datos de los proyectos modificados
         * @type {Secodena.Prospectiva.FactoresPanel.btnGuardar}
         */
        me.btnGuardarProyecto = new me.comps.buttons.btnGuardar({
            disabled: true,
            handler: function () {
                me.controller._insertItem('proyecto1', me);
                me.controller.guardarDatosProyectosXConcepto();
            }
        });
        // record del panel de proyectos
        me.recProyecto = Ext.data.Record.create([
            {name: 'idproyecto'},
            {name: 'denominacion'},
            {name: 'descripcion'},
            {name: 'fechaini'},
            {name: 'fechafin'},
            {name: 'escala'}
        ]);

        /**
         * Store del grid de proyectos para el proyecto Politica y Estrategia
         * @type {Ext.data.Store}
         */
        me.stProyecto = new Ext.data.Store({
            autoLoad: {
                params: {start: 0, limit: 20}
            },
            url: '/planificacion/herramientasintegracion/index.php/integracioncomun/getproyectos',
            reader: new Ext.data.JsonReader({
                root: 'root',
                totalProperty: 'cantidad_filas'
            }, me.recProyecto),
            listeners: {
                beforeload: function (s) {
                    s.baseParams = {
                        concepto: Ext.encode(me.concepto)
                    };
                    Secodena.mostrarMascara('msgProyecto1', 'Cargando');
                },
                load: function (s, r, o) {
                    Secodena.ocultarMascara('msgProyecto1');
                    me.initValidatorProyectos();
                }
            }
        });

        me.smProyecto = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (el) {
                    if (el.hasSelection()) {
                        if (el.getSelected().data.idproyecto) {
                            me.btnVerProyecto.enable();
                        }
                    } else {
                        me.btnVerProyecto.disable();
                    }
                }
            }
        });

        me.aux = [
            {hidden: true, dataIndex: 'idproyecto'},
            {header: 'Denominación', dataIndex: 'denominacion', width: 250, editor: new me.comps.fields.fieldDenom},
            {
                header: 'Descripción',
                dataIndex: 'descripcion',
                id: 'expandir&' + idCmp,
                editor: new me.comps.fields.fieldDescripcion
            },
            {header: 'Fecha de inicio', dataIndex: 'fechaini', width: 100, align: 'center'},
            {
                header: 'Fecha de fin',
                dataIndex: 'fechafin',
                width: 100,
                align: 'center',
                editor: new me.comps.fields.dateField({allowBlank: true, format: 'd/m/Y'})
            }
        ];

        if (me.concepto.concepto == 'DatEstudiocurvaconflicto') {
            me.checkEscala = new Ext.grid.CheckColumn({
                header: 'Barómetro',
                dataIndex: 'escala',
                tooltip: 'Aplicar barómetro de Heilderberg',
                align: 'center',
                width: 100
            });
            me.checkEscala.on('checkchange',
                function (rec, ck) {
                    if (rec.data.idproyecto) {
                        mostrarMensaje(1, 'El valor no puede ser modificado', function () {
                            me.smProyecto.getSelected().set('escala', !ck);
                        });
                    }
                }
            );
            me.aux.push(me.checkEscala);
        }
        me.cmProyecto = new Ext.grid.ColumnModel(me.aux);

        /**
         * rowEditorGrid de proyectos
         * @type {comps.containers.grids.rowEditorGrid}
         */
        me.gpProyecto = new me.comps.containers.grids.rowEditorGrid({
            store: me.stProyecto,
            cm: me.cmProyecto,
            sm: me.smProyecto,
            autoExpandColumn: 'expandir&' + idCmp,
            clicksToEdit: 2,
            insertPosition: 0,
            stripeRows: true,
            addButtonTTip: 'proyecto',
            delButtonTTip: 'proyecto',
            delButtonMsg: '¿Está seguro que quiere eliminar el proyecto seleccionado?',
            editable: true,
            anchor: '100%',
            region: 'center',
            plugins: (me.concepto.concepto == 'DatEstudiocurvaconflicto') ? [new me.comps.plugins.grid.changesValidator, me.checkEscala] : [new me.comps.plugins.grid.changesValidator],
            tbarButtons: [me.btnVerProyecto, '->', me.btnAyudaProyecto],
            bbar: [new Ext.PagingToolbar({
                pageSize: 20,
                width: 500,
                store: me.stProyecto,
                displayInfo: true,
                displayMsg: 'Mostrando de {0} - {1} de {2}',
                emptyMsg: "No hay resultados para mostrar."
            }), '->', me.btnRecargarProyecto, '-', me.btnGuardarProyecto],
            listeners: {
                rowcontextmenu: function (thisGrid, rowIndex, evtObj) {
                    evtObj.stopEvent();
                    thisGrid.getSelectionModel().selectRow(rowIndex);
                    itemsMenu = [
                        {
                            text: 'Ver proyecto',
                            icon: perfil.dirImg + 'ver.png',
                            handler: function () {
                                me.fireEvent('verproyecto', me.smProyecto.getSelected().data);
                            }
                        }
                    ];
                    contextMenu = new Ext.menu.Menu({
                        items: itemsMenu
                    });
                    contextMenu.showAt(evtObj.getXY());
                },
                validateedit: function (e) {
                    if (e.field == 'fechafin' && e.value != '') {
                        e.value = e.value.format('d/m/Y');
                    }
                }
            }
        });
        me.keys = [{
            key: 'i',
            alt: true,
            scope: me,
            stopEvent: true,
            fn: function () {
                if (!me.gpProyecto.addButton.disabled) {
                    me.gpProyecto.addButton.handler.call();
                }
            }
        }, {
            key: 'g',
            scope: me.gpProyecto,
            alt: true,
            stopEvent: true,
            fn: function () {
                if (!me.btnGuardarProyecto.disabled) {
                    me.btnGuardarProyecto.handler.call();
                }
            }
        }, {
            key: 'z',
            scope: me,
            alt: true,
            ctrl: true,
            stopEvent: true,
            fn: function () {
                me.btnRecargarProyecto.focus();
                me.btnRecargarProyecto.handler.call();
            }
        }, {
            key: 'h',
            scope: me,
            alt: true,
            stopEvent: true,
            fn: function () {
                me.btnAyudaProyecto.focus();
                me.btnAyudaProyecto.handler.call();
            }
        }
            , {
                key: Ext.EventObject.DELETE,
                scope: me.gpProyecto,
                stopEvent: true,
                fn: function () {
                    if (!me.gpProyecto.delButon.disabled) {
                        me.gpProyecto.delButon.handler.call();
                    }
                }

            }];
        // definiendo los items del panel
        this.items = [me.gpProyecto];
        me.initValidatorProyectos();

        Planificacion.Integracion.PanelProyecto.superclass.initComponent.call(me);
    },
    initValidatorProyectos: function () {
        var me = this;
        var fields = {grid: me.gpProyecto};
        var botones = [me.btnGuardarProyecto];
        me.initValidator(me.validatorProyecto, fields, botones);
    },
    cargarAyuda: function () {
        var me = this;
        var title = 'Ayuda';
        switch (me.concepto.concepto) {
            case 'DatEstudiomatrizimpactocruzado':
                referencia = '';
                break;
            case 'DatEstudiomatrizrelacion':
                referencia = '';
                break;
            case 'DatEstudiocurvaconflicto':
                referencia = '';
                break;
            case 'DatEstudiocausaefecto':
                referencia = '';
                break;
            case 'DatEstudiomatrizdofa':
                referencia = '';
                break;
            case 'DatEstudiomatrizdanalisispolitico':
                referencia = '';
                break;
            case 'DatEstudiogantt':
                referencia = '';
                break;
            case 'DatEstudiocausaefecto':
                referencia = '';
                break;


        }
        help.show(title, referencia);
    },
    initValidator: function (validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function (i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    }
});
Ext.reg('integracion-proyectos-panelproyecto', Planificacion.Integracion.PanelProyecto);

//------------------------------------------------------------------------------------------------------------------ GRAFICO ORGANIGRAMA CAUSA EFECTO
Planificacion.Integracion.WindowOrganigrama = ExtExtend.Class({
    $extend: Ext.Window,
    modal: true,
    closeAction: 'destroy',
    title: 'Diagrama de causa-efecto',
    resizable: true,
    constrain: true,
    layout: 'border',
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.controller = (this.controller) ? this.controller : new Planificacion.Integracion.PyecomunController();

        me.width = (this.width) ? this.width : 1000;
        me.height = (this.height) ? this.height : 600;

        me.etiquetas = me.controller._getLabel('Causaefecto');
        me.directorioImagenes = this.dirImg;
        me.idproyecto = this.idproyecto ? this.idproyecto : null;

        me.btnExportar = new comps.buttons.btnExportar({
            handler: function () {
                alert('Exportar');
            }
        });
        me.graficoOrganigrama = new Planificacion.Integracion.PanelOrganigrama({
            controller: me.controller,
            objefecto: me.objefecto,
            region: 'center'
        });
        me.items = [me.graficoOrganigrama];
        me.tbar = ['->', me.btnExportar];
        me.keys = [
            {
                key: 'e',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnExportar.handler.call();
                }
            }
        ];
        Planificacion.Integracion.WindowOrganigrama.superclass.initComponent.call(me);
    }
});
Ext.reg('integracion-causaefecto-windoworganigrama', Planificacion.Integracion.WindowOrganigrama);


Planificacion.Integracion.PanelOrganigrama = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    initComponent: function () {
        var idCmp = this.id;
        var me = this;
        me.comps = ExtExtend.Components;
        me.controller = /*(this.controller) ? this.controller :*/ new Planificacion.Integracion.PyecomunController();
        me.etiquetas = me.controller._getLabel('Cuestionario');
        //-------------------------------------------------------------------------------------------------------------- ELEMENTOS DEL GRID
        me.idproyecto = (this.idproyecto) ? this.idproyecto : null;
        //-------------------------------------------------------------------------------------------------------------- Hipotesis
        me.panel = new Ext.Panel({
            region: 'center',
            html: '<div class="ceLeyenda" id="organigramaCausaefecto"></div>'
        });

        this.items = [me.panel];

        me.on('render', function () {
            me.controller._insertItem('objeto', me);
            me.controller.obtenerDatosOrganigrama();
        })
        Planificacion.Integracion.PanelOrganigrama.superclass.initComponent.call(me);
    },
    mostrarGrafico: function (data) {
        var me = this;

        var nodes = data.nodes;
        var edges = data.edges;

        var data = {
            nodes: nodes,
            edges: edges
        };

        var container = document.getElementById('organigramaCausaefecto');

        var options = {
            nodes: {
                //shape: 'dot',
                //size: 30,
                font: {
                    size: 10,
                    color: '#2B1B17' // Negro
                }/*,
                 borderWidth: 2,
                 scaling: {
                 min: 30,
                 max: 32
                 }*/
            },
            edges: {
                //width: 2,
                //color: 'gray',
                font: {
                    size: 20,
                    color: '#000000'
                },
                smooth: false/*{
                 type: 'continuous'
                 }/*,
                 length: 200*/
            },
            groups: {
                //useDefaultGroups: false,
                'efecto': {
                    shape: 'box',
                    color: "#C5000B" // red
                },
                'categoria': {
                    shape: 'box',
                    color: '#2B7CE9' // orange
                },
                'causa': {
                    shape: 'box',
                    color: '#109618' // green
                }
            },
            layout: {
                hierarchical: {
                    direction: 'RL',
                    sortMethod: 'directed'
                }
            }
        };

        network = new vis.Network(container, data, options);
    }
});
Ext.reg('integracion-causaefecto-panelorganigrama', Planificacion.Integracion.PanelOrganigrama);