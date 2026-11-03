/**
 * @name componentes.CmpRegUnico - Componente para la configuración de los registros únicos.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Eddy Santana Navarro
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.RegUnico = Ext.extend(Ext.Panel, {
    id: 'pRegUnico',
    title: 'Criterios de unicidad de las personas',
    tabTip: 'Configurar llaves para registro &uacute;nico',
    layout: 'border',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function() {
        var self = this;
        //Boton para mostrar la ayuda del sistema.
        this.btnAyudaRegUnico = new Ext.Button({
            id: 'btnAyudaRegUnico',
            iconCls: 'ayuda',
            text: this.idioma.btnAyudaRegUnico_text,
            tooltip: this.idioma.btnAyudaRegUnico_tooltip
        });

        //Boton para marcar un criterio como unico.
        this.btnUnico = new Ext.Button({
            id: 'btnUnico',
            iconCls: 'uno',
            text: this.idioma.btnUnico_text,
            tooltip: this.idioma.btnUnico_tooltip,
            disabled: true,
            listeners: {
                click: function() {
                    var idsRegistros = new Array();
                    var records = self.gpRegistroUnico.getSelectionModel().getSelections();
                    var total = records.length;
                    for (var i = 0; i < total; i++) {
                        idsRegistros[i] = records[i].get('idregistrounico');
                    }
                    mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea marcar el(los) criterio(s) como &uacute;nico(s)?', function unico(btnPresionado) {
                        if (btnPresionado == 'ok') {
                            PVD.mostrarMascara('marcarUnico', 'Por favor espere...', 'Marcando criterio(s) como &uacute;nico(s)');
                            Ext.Ajax.request({
                                url: '/pvd/maestro/configuraciones/index.php/registrounico/marcarUnico',
                                method: 'POST',
                                params: {
                                    idsRegistros: Ext.encode(idsRegistros)
                                    //idregistrounico: self.gpRegistroUnico.getSelectionModel().getSelected().get('idregistrounico')
                                },
                                callback: function(options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    PVD.ocultarMascara('marcarUnico');
                                    if (responseData.success) {
                                        Ext.MessageBox.show({
                                            title: 'Informaci&oacute;n',
                                            msg: 'El(Los) criterio(s) ha(n) sido marcado(s) como &uacute;nico(s) satisfactoriamente.',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        self.stCfgRegistroUnico.reload();
                                    }
                                }
                            });
                            self.btnUnico.focus();
                        } else {
                            self.btnUnico.focus();
                        }
                    });
                }
            }
        });

        //Boton para marcar un criterio como no unico.
        this.btnNoUnico = new Ext.Button({
            id: 'btnNoUnico',
            iconCls: 'mas',
            text: this.idioma.btnNoUnico_text,
            tooltip: this.idioma.btnNoUnico_tooltip,
            disabled: true,
            listeners: {
                click: function() {
                    var idsRegistros = new Array();
                    var records = self.gpRegistroUnico.getSelectionModel().getSelections();
                    var total = records.length;
                    for (var i = 0; i < total; i++) {
                        idsRegistros[i] = records[i].get('idregistrounico');
                    }
                    mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea marcar el(los) criterio(s) como no &uacute;nico(s)?', function nounico(btnPresionado) {
                        if (btnPresionado == 'ok') {
                            PVD.mostrarMascara('marcarNoUnico', 'Por favor espere...', 'Marcando criterio(s) como no &uacute;nico(s)');
                            Ext.Ajax.request({
                                url: '/pvd/maestro/configuraciones/index.php/registrounico/marcarNoUnico',
                                method: 'POST',
                                params: {
                                    idsRegistros: Ext.encode(idsRegistros)
                                    //idregistrounico: self.gpRegistroUnico.getSelectionModel().getSelected().get('idregistrounico')
                                },
                                callback: function(options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    PVD.ocultarMascara('marcarNoUnico');
                                    if (responseData.success) {
                                        Ext.MessageBox.show({
                                            title: 'Informaci&oacute;n',
                                            msg: 'El(Los) criterio(s) ha(n) sido marcado(s) como no &uacute;nico(s) satisfactoriamente.',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        self.stCfgRegistroUnico.reload();
                                    }
                                }
                            });
                            self.btnNoUnico.focus();
                        } else {
                            self.btnNoUnico.focus();
                        }
                    });
                }
            }
        });

        //Store para el grid
        this.stCfgRegistroUnico = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/registrounico/obtenerCfgRegistroUnico',
            reader: new Ext.data.JsonReader({
                totalProperty: 'quantity',
                root: 'data',
                id: 'idregistrounico'
            }, [
                {name: 'idregistrounico'},
                {name: 'criterio'},
                {name: 'unico'},
                {name: 'esquema'},
                {name: 'tabla'},
                {name: 'campo'}
            ]),
            listeners: {
                load: function() {
                    self.btnUnico.disable();
                    self.btnNoUnico.disable();
                }
            }
        });
        this.stCfgRegistroUnico.load();

        this.smRegistroUnico = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.smRegistroUnico.on('selectionchange', function(ssm, indiceFila, record) {
            if (ssm.getSelections().length == 1) {
                if (ssm.getSelected().get('unico') == 1) {
                    self.btnUnico.disable();
                    self.btnNoUnico.enable();
                } else {
                    self.btnUnico.enable();
                    self.btnNoUnico.disable();
                }
            } else {
                if (ssm.getSelections().length > 1) {
                    this.habilitar = true;
                    this.habilitarNoUnico = true;
                    var records = ssm.getSelections();
                    //console.debug(records);
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].data.unico == '1') {
                            this.habilitar = false;
                        }
                    }
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].data.unico == '2') {
                            this.habilitarNoUnico = false;
                        }
                    }
                    if (this.habilitar) {
                        self.btnUnico.enable();
                    } else {
                        self.btnUnico.disable();
                    }
                    if (this.habilitarNoUnico) {
                        self.btnNoUnico.enable();
                    } else {
                        self.btnNoUnico.disable();
                    }
                } else {
                    self.btnUnico.disable();
                    self.btnNoUnico.disable();
                }
            }
        });

        //Grid panel para el listado de llaves.
        this.gpRegistroUnico = new Ext.grid.GridPanel({
            store: this.stCfgRegistroUnico,
            tbar: [this.btnUnico, this.btnNoUnico, '->', this.btnAyudaRegUnico],
            border: false,
            autoScroll: true,
            sm: this.smRegistroUnico,
            region: 'center',
            enableDragDrop: true,
            columns: [
                {hidden: true, dataIndex: 'idregistrounico'},
                {header: 'Criterio', width: 150, dataIndex: 'criterio'},
                {header: '&Uacute;nico', width: 70, dataIndex: 'unico',
                    renderer: function(value, metadata, record, rowIndex, colIndex, store)
                    {
                        if (value == null) {
                            return '';
                        }
                        if (value == 1) {
                            return 'S&iacute;';
                        } else if (value == 2) {
                            return 'No';
                        }
                    }
                },
                {header: 'Esquema', width: 200, dataIndex: 'esquema'},
                {header: 'Tabla', width: 200, dataIndex: 'tabla'},
                {header: 'Campo', width: 200, dataIndex: 'campo'}
            ]
        });
        this.items = [this.gpRegistroUnico];
        Pvd.Maestro.Configuraciones.RegUnico.superclass.initComponent.call(this);
    }
});
