Ext.ns('Ext.aft.grupo');
/**
 * Jorge Luis Cuellar Mondeja
 */
Ext.apply(Ext.form.VTypes, {
    daterange: function(val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
                //this.dateRangeMax = date;
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }
});
Ext.aft.grupo = {
    init: function(etiquetas) {
        var _self = this;
        this.etiq = etiquetas;

        this.initFormatos();

        this.btnAdicionarGrupos = new Ext.Button({
            iconCls: 'adicionar',
            text: _self.etiq.lbBtnAdicionar,
            tooltip: _self.etiq.lbTtBtnAdicionarGrupo
        });

        this.btnModificarGrupos = new Ext.Button({
            disabled: true,
            iconCls: 'modificar',
            text: _self.etiq.lbBtnModificar,
            tooltip: _self.etiq.lbTtBtnModificarGrupo
        });

        this.btnEliminarGrupos = new Ext.Button({
            disabled: true,
            iconCls: 'eliminar',
            text: _self.etiq.lbBtnEliminar,
            tooltip: _self.etiq.lbTtEliminarGrupo
        });

        this.btnBuscarGrupos = new Ext.Button({
            iconCls: 'buscar',
            //text: _self.etiq.lbTtBtnBuscarArbol,
            tooltip: _self.etiq.lbTtBtnBuscarArbol,
        });
        this.btnLimpiar = new Ext.Button({
            text: '',
            tooltip: _self.etiq.lbTtBtnLimpiarTree,
            iconCls: 'limpiar'
        });

        this.btnAdicionarSubgrupos = new Ext.Button({
            disabled: true,
            iconCls: 'adicionar',
            text: _self.etiq.lbBtnAdicionar,
            tooltip: _self.etiq.lbTtBtnAdicionarSubGrupo
        });

        this.btnModificarSubgrupos = new Ext.Button({
            disabled: true,
            iconCls: 'modificar',
            text: _self.etiq.lbBtnModificar,
            tooltip: _self.etiq.lbTtBtnModificarSubGrupo
        });

        this.btnEliminarSubGrupos = new Ext.Button({
            disabled: true,
            iconCls: 'eliminar',
            text: _self.etiq.lbBtnEliminar,
            tooltip: _self.etiq.lbTtBtnEliminarSubGrupo
        });

        this.btnImprimirSubGrupos = new Ext.Button({
            disabled: false,
            iconCls: 'imprimir',
            text: _self.etiq.lbBtnImprimir,
            tooltip: _self.etiq.lbTtBtnImprimirSubGrupo,
            handler: function() {
                _self.getReportes();
            }
        });

        this.btnAyudaGrupos = new Ext.Button({
            iconCls: 'ayuda',
            text: _self.etiq.lbBtnAyuda,
            tooltip: _self.etiq.lbTtBtnAyuda,
            id: 'btnayudagrupoSubgrupo',
            referencia: '/configuracion/maestroproductos/index.php/gestgruposubgrupo/gestgruposubgrupo'
        });

        this.grid = new Ext.aft.grupo.grid({
            etiq: _self.etiq,
            region: 'center',
            id: 'gpSubgrupoEntidad',
            btnAdicionarSubgrupos: _self.btnAdicionarSubgrupos,
            btnModificarSubgrupos: _self.btnModificarSubgrupos,
            btnEliminarSubGrupos: _self.btnEliminarSubGrupos,
            btnImprimirSubGrupos : _self.btnImprimirSubGrupos,
            fnConfBotones: _self.confBotones,
            main: _self
        });

        this.tree = new Ext.aft.grupo.tree({
            etiq: _self.etiq,
            region: 'west',
            id: 'arborGrupoSubGrupo',
            btnAdicionarGrupos: _self.btnAdicionarGrupos,
            btnModificarGrupos: _self.btnModificarGrupos,
            btnEliminarGrupos: _self.btnEliminarGrupos,
            btnBuscarGrupos: _self.btnBuscarGrupos,
            btnLimpiar: _self.btnLimpiar,
            fnConfBotones: _self.confBotones,
            main: _self
        });

        Ext.aft.grupo.stComboFormat = new Ext.data.Store({
            url: 'getFormatos',
            id: 'idstoreFormat',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idstComboFormat'
            }, [
                {
                    name: 'idformato'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'partes'
                }
            ]),
        });

        var vp = new Ext.Viewport({
            layout: 'border',
            items: [_self.tree, new Ext.Panel({
                    region: 'center',
                    layout: 'border',
                    tbar: [_self.btnAdicionarSubgrupos, _self.btnModificarSubgrupos, _self.btnEliminarSubGrupos, _self.btnImprimirSubGrupos,'->', _self.btnAyudaGrupos],
                    items: [_self.grid, {
                            title: '-',
                            id: 'pSouth',
                            region: 'south',
                            height: 252,
                            hidden: true,
                            collapsible: true,
                            hideCollapseTool: true,
                            collapseMode: 'mini',
                            autoScroll: true,
                            animCollapse: false,
                            animate: false,
                            split: true,
                            collapsed: true,
                            titleCollapse: true,
                            layout: 'fit',
                            //items: [Erp.aft.gpAtributosDinamicos]
                        }]
                })]
        });

        /**
         *   Hot keys
         **/

        document.onkeyup = function(e) {
            //Hot Keys del arbol
            if (e.ctrlKey) {
                if (e.which == Ext.EventObject.I) {//Adicionar
                    if (_self.btnAdicionarGrupos) {
                        if (_self.btnAdicionarGrupos.isVisible() && _self.btnAdicionarGrupos.disabled == false && _self.validDisplayBloked()) {
                            _self.btnAdicionarGrupos.fireEvent('click');
                        }
                    }
                }
                if (e.which == Ext.EventObject.M) {//Modificar
                    if (_self.btnModificarGrupos) {
                        if (_self.btnModificarGrupos.isVisible() && _self.btnModificarGrupos.disabled == false && _self.validDisplayBloked()) {
                            _self.btnModificarGrupos.fireEvent('click');
                        }
                    }
                }
                if (e.which == Ext.EventObject.B) {//Buscar
                    if (_self.btnBuscarGrupos) {
                        if (_self.btnBuscarGrupos.isVisible() && _self.btnBuscarGrupos.disabled == false && _self.validDisplayBloked()) {
                            _self.btnBuscarGrupos.fireEvent('click');
                        }
                    }
                }
                if (e.which == Ext.EventObject.L) {//Buscar
                    if (_self.btnLimpiar) {
                        if (_self.btnLimpiar.isVisible() && _self.btnLimpiar.disabled == false && _self.validDisplayBloked()) {
                            _self.btnLimpiar.fireEvent('click');
                        }
                    }
                }
            } else
            //Hot Keys del grid
            if (e.altKey) {
                if (e.which == Ext.EventObject.I) {//Adicionar
                    if (_self.btnAdicionarSubgrupos) {
                        if (_self.btnAdicionarSubgrupos.isVisible() && _self.btnAdicionarSubgrupos.disabled == false && _self.validDisplayBloked()) {
                            _self.btnAdicionarSubgrupos.fireEvent('click');
                        }
                    }
                }
                if (e.which == Ext.EventObject.M) {//Modificar
                    if (_self.btnModificarSubgrupos) {
                        if (_self.btnModificarSubgrupos.isVisible() && _self.btnModificarSubgrupos.disabled == false && _self.validDisplayBloked()) {
                            _self.btnModificarSubgrupos.fireEvent('click');
                        }
                    }
                }
                if (e.which == Ext.EventObject.B) {//Buscar
                    if (_self.grid.btnBuscar) {
                        if (_self.grid.btnBuscar.isVisible() && _self.grid.btnBuscar.disabled == false && _self.validDisplayBloked()) {
                            _self.grid.btnBuscar.fireEvent('click');
                        }
                    }
                }
                if (e.which == Ext.EventObject.L) {//Limpiar
                    if (_self.grid.btnLimpiar) {
                        if (_self.grid.btnLimpiar.isVisible() && _self.grid.btnLimpiar.disabled == false && _self.validDisplayBloked()) {
                            _self.grid.btnLimpiar.handler();
                        }
                    }
                }
            }

            if (e.ctrlKey && e.which == Ext.EventObject.DELETE)
            {
                if (_self.btnEliminarGrupos)
                {
                    if (_self.btnEliminarGrupos.isVisible() && _self.btnEliminarGrupos.disabled == false && _self.validDisplayBloked())
                    {
                        _self.btnEliminarGrupos.fireEvent('click');
                    }
                }

            } else if (e.which == Ext.EventObject.DELETE)
            {
                if (_self.btnEliminarSubGrupos) {
                    if (_self.btnEliminarSubGrupos.isVisible() && _self.btnEliminarSubGrupos.disabled == false && _self.validDisplayBloked()) {
                        _self.btnEliminarSubGrupos.fireEvent('click');
                    }
                }
            }
            if (e.altKey && e.which == Ext.EventObject.H) {
                _self.btnAyudaGrupos.handler();
            }
        }

    },
    validDisplayBloked: function() {
        var _self = this;
        var result = false;
        if (Ext.Msg.isVisible() != true && _self.winNoActiva()) {
            result = true;
        }
        return result;
    },
    winNoActiva: function() {
        var _self = this;
        var result = true;
        if (!_self.grid.ventana && !_self.tree.ventana) {
            return result;
        } else if (_self.grid.ventana && _self.grid.ventana.isVisible()) {
            return false;
        } else if (_self.tree.ventana && _self.tree.ventana.isVisible()) {
            return false;
        }
        return result;
    },
    initFormatos: function() {

        /* Ext.Ajax.request({
         url: 'obtenerpartesformato',
         method: 'POST',
         callback: function(options, success, response) {
         var rd = Ext.decode(response.responseText);
         var longitudformato = rd.longitudformato;
         Ext.aft.grupo.longitudtodosniveles = 0;
         Ext.aft.grupo.arrLongitudFormato = Array();
         
         for (var i = 0; i < longitudformato; i++) {
         Ext.aft.grupo.arrLongitudFormato[i] = rd.data[i].longitud;
         Ext.aft.grupo.longitudtodosniveles += parseInt(rd.data[i].longitud);
         }
         Ext.MessageBox.hide();
         }
         });*/
    },
    getReportes:function(_self){
        //LOG.util.report.Idioma = {};
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/datosmaestros/DatosmaestrosListadotasa',
                    params: {
                    idestructuracomun : v_estructura
                    },
                    isList:true
                }
            ]
        });
        this.tipoReportes.view();
    },
    confBotones: function(_self) {

        if (Ext.aft.grupoNodeSeleccionado.id == 0) {

            _self.btnAdicionarGrupos.enable();
            _self.btnModificarGrupos.disable();
            _self.btnEliminarGrupos.disable();
            _self.btnModificarSubgrupos.disable();

            _self.btnAdicionarSubgrupos.disable();

        } else {
            _self.btnEliminarGrupos.enable();
            _self.btnModificarGrupos.enable();
            _self.btnModificarSubgrupos.enable();

            if (Ext.aft.grupoNodeSeleccionado.id != 0 && Ext.aft.grupoNodeSeleccionado.leaf) {
                _self.btnAdicionarSubgrupos.enable();
                _self.btnAdicionarGrupos.disable();
            } else {
                _self.btnAdicionarSubgrupos.disable();
                _self.btnAdicionarGrupos.enable();
            }
        }
        if (_self.grid.getSelectionModel().getSelections().length > 0) {
            _self.btnModificarSubgrupos.enable();
            _self.btnEliminarSubGrupos.enable();
        }
        else {
            _self.btnModificarSubgrupos.disable();
            _self.btnEliminarSubGrupos.disable();
        }
    },
//    getAyuda: function (etiq) {
//        var title = etiq.lbTtBtnAyuda;
//        var referencia = 'logistica/gestion de transporte/configuracion/Gestion Grupo subgrupo';
//        help.show(title, referencia);
//    }
};

/**
 * niveles a moverse para llegar a la controladora de
 * AtributosdinamicosController
 */
var niveles_a_subir = '../../../utiles/index.php/';
var hfIdtabla = new Ext.form.Hidden();
var hfIdtablaGeneral = new Ext.form.Hidden();
var hfCaso = new Ext.form.Hidden();
var hfIdComponente = new Ext.form.Hidden();
var hfDescripcionComponente = new Ext.form.Hidden();

Ext.QuickTips.init();
perfil = window.parent.parent.UCID.portal.perfil;
perfil.etiquetas = Object();

/*load(niveles_a_subir, hfIdtabla, hfCaso, hfIdComponente, hfDescripcionComponente, hfIdtablaGeneral);
 hfIdtabla.setValue(- 1);
 hfIdtablaGeneral.setValue(- 1);*/

UCID.portal.cargarEtiquetas('gestgruposubgrupo', initIU);

function initIU() {
    Ext.aft.grupo.init(perfil.etiquetas);
}

Ext.aft.actualizarIdesTablaGeneral = function(idtabla) {
    var arreglo;

    if (Ext.aft.origen == 'grid') {
        var record = Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected();

        arreglo = record.get('arrTablasGeneral');
        arreglo += ',' + idtabla;

        Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().set('arrTablasGeneral', arreglo);
        Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().commit();

        if (record.get('idtablageneral') < 0) {
            Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().set('idtablageneral', idtabla);
            Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().commit();
        }
        actualizarGridAtrbDinamicos(Ext.encode(record.get('arrTablas')), Ext.encode(record.get('arrTablasGeneral')));
    } else {
        arreglo = Ext.aft.grupoNodeSeleccionado.attributes.arrTablasGeneral;
        arreglo[arreglo.length] = idtabla;
        Ext.aft.grupoNodeSeleccionado.attributes.arrTablasGeneral = arreglo;

        if (Ext.aft.grupoNodeSeleccionado.attributes.idtablageneral < 0) {
            Ext.aft.grupoNodeSeleccionado.attributes.idtablageneral = idtabla;
        }

        actualizarGridAtrbDinamicos(Ext.encode(Ext.aft.grupoNodeSeleccionado.attributes.arrTablas), Ext.encode(Ext.aft.grupoNodeSeleccionado.attributes.arrTablasGeneral));
    }
}

Ext.aft.actualizarIdesTabla = function(idtabla) {
    var arreglo;

    if (Ext.aft.origen == 'grid') {
        var record = Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected();
        arreglo = record.get('arrTablas');
        arreglo += ',' + idtabla;

        Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().set('arrTablas', arreglo);
        Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().commit();

        if (record.get('idtabla') < 0) {
            Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().set('idtabla', idtabla);
            Ext.getCmp('gpSubgrupoEntidad').getSelectionModel().getSelected().commit();
        }

        actualizarGridAtrbDinamicos(Ext.encode(record.get('arrTablas')), Ext.encode(record.get('arrTablasGeneral')));
    } else {

        Ext.aft.grupoNodeSeleccionado.attributes.arrTablas += ',' + idtabla;

        if (Ext.aft.grupoNodeSeleccionado.attributes.idtabla < 0) {
            Ext.aft.grupoNodeSeleccionado.attributes.idtabla = idtabla;
        }

        actualizarGridAtrbDinamicos(Ext.encode(Ext.aft.grupoNodeSeleccionado.attributes.arrTablas), Ext.encode(Ext.aft.grupoNodeSeleccionado.attributes.arrTablasGeneral));
    }
}
function devolverLogitudFormato(idformato, nivel) {

    var indexRecord = Ext.aft.grupo.stComboFormat.find('idformato', idformato);
    var longitud;

    var recordFormat = Ext.aft.grupo.stComboFormat.getAt(indexRecord);

    var arrayPartes = (idformato) ? recordFormat.data.partes : [];
    for (var i = 0; i < arrayPartes.length; i++) {
        if (arrayPartes[i].nivel == nivel) {
            longitud = arrayPartes[i].longitud;
            break;
        }
    }
    return longitud;
}

function actualizarGridAtrbDinamicos(idtabla, idtablageneral, funcion) {
    Erp.aft.stAtributosDinamicos.load({
        params: {
            idtabla: idtabla,
            idtablageneral: idtablageneral
        },
        callback: function() {
            Ext.getCmp('pSouth').expand();
            Ext.aft.grupo.rowIndexOld = -1;
            if (funcion)
                eval('funcion');
        }
    });
}
