/**
 Uso:Componente para anexar o asociar documentos o archivos a  personas.

 * ---------------------------------------------

 * 19 de abril de 2012 |   Persona
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.pvd.persona.anexosdocumentospersona');
Ext.QuickTips.init();
Ext.pvd.persona.anexosdocumentospersona.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    }
};
var utils = new Ext.pvd.persona.anexosdocumentospersona.Utils();
Ext.QuickTips.init();
var _this = null;
/*Componente panelAnexosdocumentospersona*/
Ext.pvd.persona.anexosdocumentospersona.panelAnexosdocumentospersona = Ext.extend(Ext.Panel, {
   region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    frame: false,
    border: false,
    idCmp: this.idCmp,
    idpersona: this.idpersona,
    espaciotrabajo: this.espaciotrabajo,
    referencia: this.referencia,
    hideBorders: true,
    /*listeners: {
        render: function () {
            this.disable();
        }
    },*/
    initComponent: function () {
        this.btnAdicionar = new Ext.Button({
            disabled: false,
            id: 'btnAdicionar' + this.idCmp,
            iconCls: 'adicionar',
            text: 'Adicionar',
            tooltip: 'Adicionar documento',
            handler: function () {
                if (this.espaciotrabajo != -1) {
                    var winUploadAnexo = new Ext.comun.components.WinSearchUpload({
                        module_reference: this.referencia,
                        espaciotrabajo: this.espaciotrabajo,
                        listeners: {
                            'inserted': function (value) {
                                this.guardarDocumentoAnexo(value.iddocumento);
                            }.createDelegate(this)
                        }
                    });
                    winUploadAnexo.show();
                    winUploadAnexo.doLayout();
                    //winUploadAnexo.on('inserted', function(valor){})
                } else {
                    mostrarMensaje(1, "No puede adicionar un documento no existe un espacio de trabajo asociado a la persona.");
                }

            }.createDelegate(this)

        });
        this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEliminar' + this.idCmp,
            iconCls: 'eliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar documento',
            handler: function () {
                if (this.smDocpersona.hasSelection()) {
                    mostrarMensaje(2, 'Est&aacute; seguro que desea eliminar el documento seleccionado?', function (boton) {
                        if (boton == 'ok') {
                            var fila = this.smDocpersona.getSelected();
                            PVD.mostrarMascara('ideliminardocumentos', 'Por favor espere...', 'Eliminando documento anexo');
                            Ext.Ajax.request({
                                url: '/pvd/comun/index.php/anexosdocumentospersonacomp/eliminardocumentodelapersona',
                                method: 'POST',
                                params: {
                                    idpersonadocumento: fila.data.idpersonadocumento,
                                    iddocumento: fila.data.iddocumento
                                },
                                callback: function (options, success, response) {
                                    PVD.ocultarMascara('ideliminardocumentos');
                                    var respuesta = Ext.decode(response.responseText);
                                    if (respuesta.codigo == 1) {
                                        mostrarMensaje(1, respuesta.mensaje);
                                        this.stDocpersona.removeAll();
                                        this.stDocpersona.load({params: {limit: 15, start: 0}});
                                    } else {
                                        mostrarMensaje(3, respuesta.mensaje);
                                    }

                                }.createDelegate(this)
                            });
                        } else return;
                    }.createDelegate(this));
                } else mostrarMensaje(1, 'Debe seleccionar un documento.');
            }.createDelegate(this)
        });
        this.btnAbrir = new Ext.Button({
            disabled: true,
            id: 'btnAbrir' + this.idCmp,
            iconCls: 'abrir',
            text: 'Abrir',
            tooltip: 'Abrir documento',
            handler: function () {
                if (this.smDocpersona.hasSelection()) {
                    var fila = this.smDocpersona.getSelected();
                    PVD.mostrarMascara('idabrirdocumentos', 'Por favor espere...', 'Abriendo documento anexo');
                    Ext.Ajax.request({
                        url: '/pvd/comun/index.php/anexosdocumentospersonacomp/abrirdocumentodelapersona',
                        method: 'POST',
                        params: {iddocumento: fila.data.iddocumento},
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idabrirdocumentos');
                            var respuesta = Ext.decode(response.responseText);
                            window.open(respuesta.contenido.url);

                        }.createDelegate(this)
                    });
                } else mostrarMensaje(1, 'Debe seleccionar un documento.');
            }.createDelegate(this)
        });

        this.recDocpersona = [{name: 'idpersonadocumento'}, {name: 'tipoDocumento'}, {name: 'nombre'}, {name: 'iddocumento'}];
        this.stDocpersona = new Ext.data.Store({
            url: '/pvd/comun/index.php/anexosdocumentospersonacomp/cargardocumentospersona',
            baseParams: {idpersona: this.idpersona},
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idpersonadocumento',
                totalProperty: 'cantidad'
            }, this.recDocpersona)
        });

        this.smDocpersona = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    this.btnEliminar.enable();
                    this.btnAbrir.enable();
                }.createDelegate(this)
            }
        });

        this.pgtbDocpersona = new Ext.PagingToolbar({
            pageSize: 15,
            store: this.stDocpersona,
            emptyMsg: '0 Resultados para mostrar',
            displayInfo: true,
            displayMsg: 'Resultados del {0} - {1} de {2}'
        });

        this.gpDocpersona = new Ext.grid.GridPanel({
            id: 'gpDocpersona' + this.idCmp,
            region: 'center',
            store: this.stDocpersona,
            frame: false,
            border: false,
            hideBorders: true,
            loadMask: 'Cargando...',
            stripeRows: true,
            enableColumnMove: false,
            sm: this.smDocpersona,
            columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idpersonadocumento'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'iddocumento'
            }, new Ext.grid.RowNumberer(), {
                header: 'Tipo de documento',
                width: 150,
                dataIndex: 'tipoDocumento', menuDisabled: true
            }, {
                header: 'Denominacion',
                width: 300,
                dataIndex: 'nombre', menuDisabled: true
            }],
            bbar: this.pgtbDocpersona,
            tbar: [this.btnAdicionar, this.btnEliminar, this.btnAbrir]
        });


        this.items = [this.gpDocpersona];
        Ext.pvd.persona.anexosdocumentospersona.panelAnexosdocumentospersona.superclass.initComponent.call(this);
    },
    cargarDocumentosAnexos: function (pidpersona) {
        this.stDocpersona.removeAll();
        Ext.Ajax.request({
            url: '/pvd/comun/index.php/anexosdocumentospersonacomp/verificarespaciotrabajo',
            method: 'POST',
            params: {idpersona: pidpersona},
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                this.idpersona = pidpersona;
                if (respuesta.codigo == 1) {
                    this.enable();
                    this.espaciotrabajo = respuesta.espaciotrabajo;
                    this.stDocpersona.baseParams.idpersona = this.idpersona;
                    this.stDocpersona.load({params: {limit: 15, start: 0}});
                } else {
                    this.espaciotrabajo = -1;
                    mostrarMensaje(3, respuesta.mensaje);
                }

            }.createDelegate(this)
        });
    },
    guardarDocumentoAnexo: function (piddocumento) {
        Ext.Ajax.request({
            url: '/pvd/comun/index.php/anexosdocumentospersonacomp/adicionardocumentoapersona',
            method: 'POST',
            params: {idpersona: this.idpersona, iddocumento: piddocumento},
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.codigo == 1) {
                    this.stDocpersona.load({params: {limit: 15, start: 0}});
                } else {
                    mostrarMensaje(3, respuesta.mensaje);
                }

            }.createDelegate(this)
        });
    }
});


Ext.pvd.persona.anexosdocumentospersona.panelAnexosdocumentospersona.windGest = Ext.extend(Ext.Window, {
    model: true,
    autoScroll: true,
    constrain: true,
    initComponent: function () {
        var self = this;


        this.btnCancel = new Ext.Button({
            id: 'btnCancel' + self.id,
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function () {
                self.close();
            }
        });

        this.btnAcept = new Ext.Button({
            id: 'btnAceptbtnAceptEst' + self.id,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            disabled: true,
            handler: function () {


            }
        });

        this.doc = new Ext.pvd.persona.anexosdocumentospersona.panelAnexosdocumentospersona({

            idpersona: this.idpersona
        });

        this.items = [this.doc];

        this.buttons = [this.btnCancel, this.btnAcept];

        Ext.pvd.persona.anexosdocumentospersona.panelAnexosdocumentospersona.windGest.superclass.initComponent.call(this);
    }
});