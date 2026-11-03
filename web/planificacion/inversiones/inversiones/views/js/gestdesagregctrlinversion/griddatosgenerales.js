/*analisisinversiones.view.js
 * Vista general de los datos de la inversion
 * @author: Yosniel
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.GridInversiones = function (params) {
    var scope = this;
    this.columnasCmp = [];
    this.columnasMA = [];
    this.columnasMAeditable = [];
    this.columnasCmpUSD = [];
    this.columnasCmpEditable = [];
    this.cmPP = [];
    this.columnasCmpUSDEditable = [];
    this.dataIndexUSD = [];
    this.dataIndexCUP = [];
    this.dataIndexUSDEditable = [];

    this.dataIndexCUPEditable = [];

    this.cmEquipoEditable = [];
    this.datIndEquipoEditable = [];

    this.datIndcmPP = [];
    this.dataIndexMA = [];
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando'
    });
    this.stInversion = new Ext.data.Store({
        url: 'getInversiones',
        reader: new Ext.data.JsonReader({
            root: "data"/*,
             id: 'idinversion'*/
        }, [{
            name: 'idinversion'
        }, {
            name: 'denominacion'
        }, {
            name: 'codigo'
        }, {
            name: 'fechainicio'
        }, {
            name: 'fechafin'
        }, {
            name: 'provincia'
        }, {
            name: 'forma'
        }, {
            name: 'programa'
        }, {
            name: 'tipoinv'
        }, {
            name: 'objetivo'
        }]),
        listeners: {
            beforeload: function (th) {
                //return false;
            }
        }
    });

    this.smInversion = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (t, row, record) {
                var idinvers = new Array();
                records = t.getSelections();
                for (var i = 0; i < records.length; i++) {
                    idinvers.push(records[i].data.idinversion);
                }

                Ext.Ajax.request({
                    url: 'getColumMA',
                    params: {
                        idinvers: idinvers
                    },
                    callback: function (options, success, response) {
                        responseDataMA = Ext.decode(response.responseText);
                        for (i = 0; i < responseDataMA.length; i++) {
                            scope.columnasMA[i] = {
                                codigoiso: responseDataMA[i].codigoiso,
                                header: 'Plan ' + ' (M' + responseDataMA[i].codigoiso + ')',
                                tooltip: 'Plan ' + ' (M' + responseDataMA[i].codigoiso + ')',
                                width: 200,
                                sortable: true,
                                dataIndex: responseDataMA[i].idmonedaentidad
                            };
                            scope.columnasMAeditable[i] = {
//                                id: Math.round(),   ponerle un id randon
                                codigoiso: responseDataMA[i].codigoiso,
                                header: 'Plan ' + ' (M' + responseDataMA[i].codigoiso + ')',
                                tooltip: 'Plan ' + ' (M' + responseDataMA[i].codigoiso + ')',
                                width: 200,
                                sortable: true,
                                dataIndex: responseDataMA[i].idmonedaentidad,
                                editor: new Ext.form.NumberField({
                                    disabledClass: 'disabled-component',
                                    regexText: 'Los valores deben ser n\xFAmeros enteros',
                                    selectOnFocus: true,
                                    emptyText: 'Seleccione...',
                                    allowBlank: false
                                })
                            };
                            scope.dataIndexMA[i] = {
                                name: responseDataMA[i].idmonedaentidad
                            };
                        }
                    }
                });

//                Ext.Ajax.request({
//                    url: 'getEntidadModelo',
//                    params: {
//                        identidad: record.json.idestructuracomun
//                    },
//                    callback: function(options, success, response) {
//                        responseDataEquipo = Ext.decode(response.responseText);
//                        for (i = 0; i < responseDataEquipo.length; i++) {
//                            scope.cmEquipoEditable[i] = {
//                                header: responseDataEquipo[i].denominacion,
//                                tooltip: responseDataEquipo[i].denominacion,
//                                width: 100,
//                                sortable: true,
//                                dataIndex: responseDataEquipo[i].identidadmodelo,
//                                editor: new Ext.form.NumberField({
//                                    disabledClass: 'disabled-component',
//                                    regexText: 'Los valores deben ser n\xFAmeros enteros',
//                                    selectOnFocus: true,
//                                    emptyText: 'Seleccione...',
//                                    allowBlank: false
//                                })
//                            };
//                            scope.datIndEquipoEditable[i] = {
//                                name: responseDataEquipo[i].identidadmodelo
//                            };

//                            scope.cmPP[i] = {
//                                header: 'PP (' + responseDataEquipo[i].denominacion + ')',
//                                tooltip: responseDataEquipo[i].denominacion,
//                                width: 100,
//                                sortable: true,
//                                dataIndex: 'pp-' + responseDataEquipo[i].identidadmodelo,
//                                editor: new Ext.form.NumberField({
//                                    disabledClass: 'disabled-component',
//                                    regexText: 'Los valores deben ser n\xFAmeros enteros',
//                                    selectOnFocus: true,
//                                    emptyText: 'Seleccione...',
//                                    allowBlank: false
//                                })
//                            };
//                            scope.datIndcmPP[i] = {
//                                name: 'pp-' + responseDataEquipo[i].identidadmodelo
//                            };
//                        }
//                    }
//                });

//                Ext.Ajax.request({
//                    url: 'getMonedaEntidad',
//                    params: {
//                        identidad: record.json.idestructuracomun
//                    },
//                    callback: function(options, success, response) {
//                        responseDataMonedaEntidad = Ext.decode(response.responseText);
//                        for (i = 0; i < responseDataMonedaEntidad.length; i++) {
//                            scope.cmPP[i] = {
//                                header: 'PP (' + responseDataMonedaEntidad[i].codigoiso + ')',
//                                tooltip: responseDataMonedaEntidad[i].denominacion,
//                                width: 100,
//                                sortable: true,
//                                dataIndex: 'pp-' + responseDataMonedaEntidad[i].idmonedaentidad,
//                                editor: new Ext.form.NumberField({
//                                    disabledClass: 'disabled-component',
//                                    regexText: 'Los valores deben ser n\xFAmeros enteros',
//                                    selectOnFocus: true,
//                                    emptyText: 'Seleccione...',
//                                    allowBlank: false
//                                })
//                            };
//                            scope.datIndcmPP[i] = {
//                                name: 'pp-' + responseDataMonedaEntidad[i].idmonedaentidad
//                            };
//                        }
//                    }
//                });

//                Ext.Ajax.request({
//                    url: 'getCmpInversion',
//                    params: {
//                        idinvers: idinvers
//                    },
//                    callback: function(options, success, response) {
//                        responseData = Ext.decode(response.responseText);
//                        for (i = 0; i < responseData.length; i++) {
//                            scope.columnasCmpEditable[i] = {
//                                codigoiso: responseData[i].codigoiso,
//                                id: 'col' + i + Math.random(),
//                                header: responseData[i].denominacion + ' (' + responseData[i].codigoiso + ')',
//                                tooltip: responseData[i].denominacion + ' (' + responseData[i].codigoiso + ')',
//                                width: 100,
//                                sortable: true,
//                                dataIndex: responseData[i].idetapainversion + '-' + responseData[i].idmonedaentidad,
//                                editable: true,
//                                selectable: true,
//                                editor: new Ext.form.NumberField({
//                                    disabledClass: 'disabled-component',
//                                    regexText: 'Los valores deben ser n\xFAmeros enteros',
//                                    selectOnFocus: true,
//                                    emptyText: 'Seleccione...',
//                                    allowBlank: false
//                                })
//                            };
//                            scope.dataIndexCUPEditable[i] = {
//                                name: responseData[i].idetapainversion + '-' + responseData[i].idmonedaentidad
//                            };
//
//                            scope.columnasCmp[i] = {
//                                codigoiso: responseData[i].codigoiso,
//                                header: responseData[i].denominacion + ' (' + responseData[i].codigoiso + ')',
//                                tooltip: responseData[i].denominacion + ' (' + responseData[i].codigoiso + ')',
//                                width: 100,
//                                sortable: true,
//                                dataIndex: responseData[i].idetapainversion + '-' + responseData[i].idmonedaentidad
//                            };
//                            scope.dataIndexCUP[i] = {
//                                name: responseData[i].idetapainversion + '-' + responseData[i].idmonedaentidad
//                            };
//                            scope.getJr();
//                        }
//                    }
//                });
            }
        }
    });


    this.cmInversion = new Ext.grid.ColumnModel([{
        header: 'C\xF3digo',
        tooltip: 'C\xF3digo',
        width: 100,
        sortable: true,
        dataIndex: 'codigo'
    }, {
        header: 'Denominaci\xF3n',
        tooltip: 'Denominaci\xF3n',
        width: 200,
        sortable: true,
        dataIndex: 'denominacion'
    }, {
        header: 'Tipo de inversi\xF3n',
        tooltip: 'Tipo de inversi\xF3n',
        width: 100,
        sortable: true,
        dataIndex: 'tipoinv'
    }, {
        header: 'Estado plan actual',
        tooltip: 'Estado plan actual',
        width: 100,
        sortable: true,
        dataIndex: 'orden'
    }, {
        header: 'Forma de propiedad',
        tooltip: 'Forma de propiedad',
        width: 100,
        sortable: true,
        dataIndex: 'forma'
    }, {
        header: 'Provincia',
        tooltip: 'Provincia',
        width: 100,
        sortable: true,
        dataIndex: 'provincia'
    }, {
        header: 'Programa',
        tooltip: 'Programa',
        width: 100,
        sortable: true,
        dataIndex: 'programa'
    }, {
        header: 'Fecha inicio',
        tooltip: 'Fecha inicio',
        width: 100,
        sortable: true,
        dataIndex: 'fechainicio'
    }, {
        header: 'Fecha fin',
        tooltip: 'Fecha fin',
        width: 100,
        sortable: true,
        dataIndex: 'fechafin'
    }, {
        header: 'Naturaleza',
        tooltip: 'Naturaleza',
        width: 100,
        sortable: true,
        dataIndex: 'orden'
    }, {
        header: 'Medio ambiente',
        tooltip: 'Medio ambiente',
        width: 100,
        sortable: true,
        dataIndex: 'orden'
    }, {
        header: 'Objetivo de la inversi\xF3n',
        tooltip: 'Objetivo de la inversi\xF3n',
        width: 100,
        sortable: true,
        dataIndex: 'objetivo'
    }, {
        header: 'Efecto en COMEX',
        tooltip: 'Efecto en COMEX',
        width: 100,
        sortable: true,
        dataIndex: 'orden'
    }
    ]);

    this.gpInversiones = new Ext.grid.EditorGridPanel({
        frame: true,
        id: 'gpInversiones' + params.id,
//            autoScroll: true,
        region: params.region,
        disable: false,
        store: this.stInversion,
        sm: this.smInversion,
        height: 200,
        clicksToEdit: 2,
        cm: this.cmInversion,
        bbar: (params.paginado) ? new Ext.PagingToolbar({
            pageSize: 20,
            id: 'gpPiedatainver',
            store: this.stInversion,
            displayInfo: true
        }) : ''
    });

    this.gridDataGralInversion = function () {
        return this.gpInversiones;
    };

    this.actualizarGrid = function (idEntidad, idejercicio, ejercicio, idInvers, vigente, ventana) {
        this.mymask.show();
        this.stInversion.load({
            params: {
                identidad: idEntidad,
                idejercicio: idejercicio,
                ejercicio: ejercicio,
                idinversion: Ext.encode(idInvers),
                vigente: (vigente) ? 1 : 0
            },
            callback: function () {
                scope.mymask.hide();
                if (ventana) {
                    ventana.show();
                }
            }
        });
    };

    this.getSeleccion = function () {
        return this.smInversion.getSelected();
    };

    this.getSeleccions = function () {
        return this.smInversion.getSelections();
    };

    /* this.getCmPrueba = function() {
     this.cmPlan = [];
     this.cmPlan.push({
     header: 'Plan total',
     tooltip: 'Plan total',
     width: 100,
     sortable: true,
     dataIndex: 'plantotalCUP'
     });
     var bool = false;
     for (i = 0; i < this.columnasCmp.length; i++) {
     if (this.columnasCmp[i].codigoiso == 'USD' && !bool) {
     bool = true;
     this.cmPlan.push(this.cmPP[0]);
     this.cmPlan.push({
     header: 'Fondos b\xE1sicos (MP)',
     tooltip: 'Fondos b\xE1sicos (MP)',
     width: 100,
     sortable: true,
     dataIndex: 'fondosbas',
     editable: true
     }, {
     header: 'Importaci\xF3n (MUSD)',
     tooltip: 'Importaci\xF3n (MUSD) incluye pp y kw',
     width: 100,
     sortable: true,
     dataIndex: 'importaciones'
     });
     }
     this.cmPlan.push(this.columnasCmp[i]);
     }

     if (this.cmPP.length)
     this.cmPlan.push(this.cmPP[1]);
     this.cmPlan.push({
     header: 'Contrataci\xF3n externa (MUSD)',
     tooltip: 'Contrataci\xF3n externa (MUSD)',
     width: 100,
     sortable: true,
     dataIndex: 'contexter'
     });
     return this.cmPlan;
     }; */

    this.getCm = function () {
        this.cmPlan = [];
        this.cmPlan.push({
            header: 'Plan total',
            tooltip: 'Plan total',
            width: 100,
            sortable: true,
            dataIndex: 'plantotalCUP'
        });
        var bool = false;
        for (i = 0; i < this.columnasCmp.length; i++) {
            if (this.columnasCmp[i].codigoiso == 'USD' && !bool) {
                bool = true;
                this.cmPlan.push(this.cmPP[0]);
                this.cmPlan.push({
                    header: 'Fondos b\xE1sicos (MP)',
                    tooltip: 'Fondos b\xE1sicos (MP)',
                    width: 100,
                    sortable: true,
                    dataIndex: 'fondosbas',
                    editable: true
                }, {
                    header: 'Importaci\xF3n (MUSD)',
                    tooltip: 'Importaci\xF3n (MUSD) incluye pp y kw',
                    width: 100,
                    sortable: true,
                    dataIndex: 'importaciones'
                });
            }
            this.cmPlan.push(this.columnasCmp[i]);
        }

        if (this.cmPP.length)
            this.cmPlan.push(this.cmPP[1]);
        this.cmPlan.push({
            header: 'Contrataci\xF3n externa (MUSD)',
            tooltip: 'Contrataci\xF3n externa (MUSD)',
            width: 100,
            sortable: true,
            dataIndex: 'contexter'
        });
        return new Ext.grid.ColumnModel(this.cmPlan);
    };

    this.getCmEditable = function (id) {
        this.cmPlanEditable = [];
        this.cmPlanEditable.push({
            header: 'Plan total',
            tooltip: 'Plan total',
            width: 100,
            sortable: true,
            dataIndex: 'plantotalCUP'
        });
        var boolEditable = false;
        for (i = 0; i < this.columnasCmpEditable.length; i++) {
            if (this.columnasCmpEditable[i].codigoiso == 'USD' && !boolEditable) {
                boolEditable = true;
                this.cmPlanEditable.push(this.cmPP[0]);
                this.cmPlanEditable.push({
                    header: 'Fondos b\xE1sicos (MP)',
                    tooltip: 'Fondos b\xE1sicos (MP)',
                    width: 100,
                    sortable: true, editable: true,
                    dataIndex: 'fondosbas',
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                        selectOnFocus: true,
                        emptyText: 'Seleccione...',
                        allowBlank: false
                    })
                }, {
                    header: 'Importaci\xF3n (MUSD)',
                    tooltip: 'Importaci\xF3n (MUSD) incluye pp y kw',
                    width: 100,
                    sortable: true,
                    dataIndex: 'importaciones'
                });
            }
            this.cmPlanEditable.push(this.columnasCmpEditable[i]);
        }

        this.cmPlanEditable.push(this.cmPP[1]);
        this.cmPlanEditable.push({
            header: 'Contrataci\xF3n externa (MUSD)',
            tooltip: 'Contrataci\xF3n externa (MUSD)',
            width: 100,
            sortable: true,
            dataIndex: 'contexter',
            editor: new Ext.form.NumberField({
                disabledClass: 'disabled-component',
                regexText: 'Los valores deben ser n\xFAmeros enteros',
                selectOnFocus: true,
                emptyText: 'Seleccione...',
                allowBlank: false
            })
        });
        var cmIEditable = new Ext.grid.ColumnModel(this.cmPlanEditable);
        return cmIEditable;
    };

    this.getJr = function () {
        this.jr = [];
        this.jr.push({
            name: 'plantotalCUP'
        });

        for (i = 0; i < this.dataIndexCUP.length; i++) {
            this.jr.push(this.dataIndexCUP[i]);
        }

        for (i = 0; i < this.datIndcmPP.length; i++) {
            this.jr.push(this.datIndcmPP[i]);
        }

        this.jr.push({
            name: 'fondosbas'
        }, {
            name: 'importaciones'
        });

        for (i = 0; i < this.dataIndexUSD.length; i++) {
            this.jr.push(this.dataIndexUSD[i]);
        }

        this.jr.push({
            name: 'contexter'
        });

        return this.jr;
    };

    this.fnCmEquipos = function () {
        this.cmEquipos = [];
        this.cmEquipos.push({
            header: 'Plan total',
            tooltip: 'Plan total',
            width: 100,
            sortable: true,
            dataIndex: 'total'
        });
        for (i = 0; i < this.cmEquipoEditable.length; i++) {
            this.cmEquipos.push(this.cmEquipoEditable[i]);
        }
        return new Ext.grid.ColumnModel(this.cmEquipos);
    };

    this.fnCmMA = function () {
        this.cmMA = [];
        for (i = 0; i < this.columnasMA.length; i++) {
            this.cmMA.push(this.columnasMA[i]);
        }
        return new Ext.grid.ColumnModel(this.cmMA);
    };

    this.fnCmMAEditable = function () {
        this.cmEditableMA = [];
        for (i = 0; i < this.columnasMAeditable.length; i++) {
            this.cmEditableMA.push(this.columnasMAeditable[i]);
        }
        return new Ext.grid.ColumnModel(this.cmEditableMA);
    };

    this.getJrMA = function () {
        this.jrMA = [];
        for (i = 0; i < this.dataIndexMA.length; i++) {
            this.jrMA.push(this.dataIndexMA[i]);
        }
        return this.jrMA;
    };

    this.fnCmPlanEquipos = function () {
        this.cmPlanEquipos = [];
        this.cmPlanEquipos.push({
            header: 'Denominaci\xF3n',
            tooltip: 'Plan descripci\xF3n EQ AUTOM',
            width: 250,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: 'Descripci\xF3n',
            tooltip: 'Plan descripci\xF3n EQ AUTOM',
            width: 100,
            sortable: true,
            dataIndex: 'descripcion'
        }, {
            header: 'Plan (MP)',
            tooltip: 'Plan (MP) Equipos',
            width: 100,
            sortable: true,
            dataIndex: 'importe'
        }, {
            header: 'Plan (MUSD)',
            tooltip: 'Plan (MUSD) Equipos',
            width: 100,
            sortable: true,
            dataIndex: 'importedivisa'
        }, {
            header: 'Total unidades',
            tooltip: 'Plan total unidades',
            width: 100,
            sortable: true,
            dataIndex: 'total'
        });
            for (i = 0; i < this.cmEquipoEditable.length; i++) {
            this.cmPlanEquipos.push(this.cmEquipoEditable[i]);
        }
        console.log(this.cmEquipoEditable)
        this.cmPlanEquipos.push({
            header: 'Organo que satisface',
            tooltip: 'Plan organo que satisface',
            width: 100,
            sortable: true,
            dataIndex: 'orgrect'
        }, {
            header: 'Adquirir',
            tooltip: 'Plan adquirir',
            width: 100,
            sortable: true,
            dataIndex: 'adquirir'
        }, {
            header: 'Pa\xEDs',
            tooltip: 'Plan pa\xEDs',
            width: 100,
            sortable: true,
            dataIndex: 'comprarpais'
        }, {
            header: 'Comprar',
            tooltip: 'Plan comprar',
            width: 100,
            sortable: true,
            dataIndex: 'comprar'
        });
        return new Ext.grid.ColumnModel(this.cmPlanEquipos);
    };

    this.getJrPlanEquipos = function () {
        this.jrPlanEquipos = [];
        this.jrPlanEquipos.push({
            name: 'idindicador'
        }, {
            name: 'cantidad'
        }, {
            name: 'importe'
        }, {
            name: 'total'
        }, {
            name: 'importedivisa'
        }, {
            name: 'idadquisicion'
        }, {
            name: 'idcomprar'
        }, {
            name: 'adquirir'
        }, {
            name: 'comprar'
        }, {
            name: 'comprarpais'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'idindicador'
        });

        for (i = 0; i < this.datIndEquipoEditable.length; i++) {
            this.jrPlanEquipos.push(this.datIndEquipoEditable[i]);
        }
        return this.jrPlanEquipos;
    };

    this.getJrEquipos = function () {
        this.jrEquipos = [];
        this.jrEquipos.push({
            name: 'total'
        });

        for (i = 0; i < this.datIndEquipoEditable.length; i++) {
            this.jrEquipos.push(this.datIndEquipoEditable[i]);
        }
        return this.jrEquipos;
    };

};
