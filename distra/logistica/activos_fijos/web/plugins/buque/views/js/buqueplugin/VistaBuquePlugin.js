/**
 * Created by osmel on 14/05/15.
 */

Ext.ns('Ext.aft.plugins.buque');

Ext.aft.plugins.buque.ElementosGridBuquePlugin = {
    init: function (core_view) {

        var idioma = Ext.aft.plugins.buque.Idioma;
        var readerstore = [
            {
                name: 'codigo'
            }, {
                name: 'nombre'
            }, {
                name: 'nrooficial'
            }, {
                name: 'nroimo'
            }, {
                name: 'idcasaclasifc'
            }, {
                name: 'velocidad'
            }, {
                name: 'letrallamada'
            }, {
                name: 'telex'
            }, {
                name: 'fax'
            }, {
                name: 'correo'
            }, {
                name: 'calado'
            }, {
                name: 'eslora'
            }, {
                name: 'manga'
            }, {
                name: 'muerto'
            }, {
                name: 'neto'
            }, {
                name: 'bruto'
            }, {
                name: 'idbandera'
            }, {
                name: 'denombandera'
            }, {
                name: 'denomcasaclasific'
            },

        ];
        //Ext.LOG.RegNumOperativo.TreeGridRegistroNO.renderer
        var columnmodel = [{
            header: idioma.codigo,
            width: 100,
            sortable: true,
            id: 'idcodigo',
            dataIndex: 'codigo',
           /* filter: {
                type: 'textfield',
                dataIndex: 'codigo'
            },*/
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        },
            {
                header: idioma.nombre,
                width: 105,
                sortable: true,
                id: 'idnombre',
                dataIndex: 'nombre',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.bandera,
                width: 100,
                id: 'idbandera',
                sortable: true,
                dataIndex: 'denombandera',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.nrooficial,
                width: 100,
                id: 'idnrooficial',
                sortable: true,
                dataIndex: 'nrooficial',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.nroimo,
                width: 80,
                id: 'idnroimo',
                sortable: true,
                dataIndex: 'nroimo',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.casaclasific,
                width: 105,
                id: 'idcasaclasifc',
                sortable: true,
                dataIndex: 'denomcasaclasific',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.velocidad,
                width: 120,
                id: 'idvelocidad',
                sortable: true,
                dataIndex: 'velocidad',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.letrallamada,
                dataIndex: 'letrallamada',
                sortable: true,
                id: 'idletrallamada',
                // align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.telex,
                dataIndex: 'telex',
                sortable: true,
                id: 'idtelex',
                //align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.fax,
                dataIndex: 'fax',
                sortable: true,
                id: 'idfax',
                // align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.correo,
                sortable: true,
                dataIndex: 'correo',
                id: 'idcorreo',
                //align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.calado,
                dataIndex: 'calado',
                sortable: true,
                id: 'idcalado',
                //align: 'right',
                width: 130,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.eslora,
                dataIndex: 'eslora',
                sortable: true,
                id: 'ideslora',
                //align: 'right',
                width: 160,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.manga,
                dataIndex: 'manga',
                sortable: true,
                id: 'idmanga',
                // align: 'right',
                width: 160,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.muerto,
                dataIndex: 'muerto',
                sortable: true,
                id: 'idmuerto',
                //align: 'right',
                width: 150,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.neto,
                dataIndex: 'neto',
                sortable: true,
                id: 'idneto',
                // align: 'right',
                width: 135,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.bruto,
                dataIndex: 'bruto',
                sortable: true,
                id: 'idbruto',
                // align: 'right',
                width: 135,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            }
        ];
        core_view.readerstore = core_view.readerstore.concat(readerstore);
        core_view.columnmodel = core_view.columnmodel.concat(columnmodel);
    }
};

Ext.aft.plugins.buque.ConfDatosNaturalezas = {
    init: function (core_view) {
        var idioma = Ext.aft.plugins.buque.Idioma;
        var col_store_buque = [
            {
                name: 'codigo'
            },
            {
                name: 'nombre'
            },
            {
                name: 'bandera'
            },
            {
                name: 'idbandera'
            },
            {
                name: 'nrooficial'
            },
            {
                name: 'idcasaclasific'
            },
            {
                name: 'casaclasific'
            },
            {
                name: 'velocidad'
            },
            {
                name: 'letrallamada'
            },
            {
                name: 'telex'
            },
            {
                name: 'fax'
            },
            {
                name: 'correo'
            },
            {
                name: 'calado'
            }, {
                name: 'eslora'
            }, {
                name: 'manga'
            }, {
                name: 'muerto'
            }, {
                name: 'neto'
            }, {
                name: 'bruto'
            }, {
                name: 'nroimo'
            }
        ];
        var cm_columns_buque = [
            {
                header: idioma.codigo,
                width: 100,
                dataIndex: 'codigo',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'codigo'
            },
            {
                header: idioma.nombre,
                width: 100,
                dataIndex: 'nombre',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'nombre'
            },
            {
                header: idioma.bandera,
                width: 100,
                dataIndex: 'bandera',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'bandera'
            },
            {
                header: idioma.nrooficial,
                width: 100,
                dataIndex: 'nrooficial',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'nrooficial'
            }, {
                header: idioma.nroimo,
                width: 100,
                dataIndex: 'nroimo',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'nroimo'
            }, {
                header: idioma.casaclasific,
                width: 100,
                dataIndex: 'casaclasific',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'casaclasific'
            }, {
                header: idioma.velocidad,
                width: 130,
                dataIndex: 'velocidad',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'velocidad'

            }, {
                header: idioma.letrallamada,
                width: 130,
                dataIndex: 'letrallamada',
                renderer: core_view.columRender,
                align: 'center',
                //hidden: true,
                id: 'letrallamada'
            }, {
                header: idioma.telex,
                width: 130,
                dataIndex: 'telex',
                renderer: core_view.columRender,
                align: 'center',
                //hidden: true,
                id: 'telex'
            }, {
                header: idioma.fax,
                width: 130,
                dataIndex: 'fax',
                renderer: core_view.columRender,
                align: 'center',
                id: 'fax'
            }, {
                header: idioma.correo,
                width: 130,
                dataIndex: 'correo',
                renderer: core_view.columRender,
                align: 'center',
                //hidden: true,
                id: 'correo'
            }, {
                header: idioma.calado,
                width: 130,
                dataIndex: 'calado',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'calado'
            }, {
                header: idioma.eslora,
                width: 130,
                dataIndex: 'eslora',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'eslora'
            }, {
                header: idioma.manga,
                width: 130,
                dataIndex: 'manga',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'manga'
            }, {
                header: idioma.muerto,
                width: 130,
                dataIndex: 'muerto',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'muerto'
            }, {
                header: idioma.neto,
                width: 130,
                dataIndex: 'neto',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'neto'
            }, {
                header: idioma.bruto,
                width: 130,
                dataIndex: 'bruto',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'bruto'
            }
        ];
        var checkItemsBuque = [
            new Ext.form.Checkbox({
                boxLabel: idioma.codigo,
                id: 'chkcodigo',
                hideLabel: true,
                name: 'codigo'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nombre,
                id: 'chknombre',
                hideLabel: true,
                name: 'nombre'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.bandera,
                id: 'chkbandera',
                hideLabel: true,
                name: 'bandera'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nrooficial,
                id: 'chknrooficial',
                hideLabel: true,
                name: 'nrooficial'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nroimo,
                id: 'chknroimo',
                hideLabel: true,
                name: 'nroimo'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.casaclasific,
                id: 'chkcasaclasific',
                hideLabel: true,
                name: 'casaclasific'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.velocidad,
                id: 'chkvelocidad',
                hideLabel: true,
                name: 'velocidad'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.letrallamada,
                id: 'chkletrallamada',
                hideLabel: true,
                name: 'letrallamada'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.telex,
                id: 'chktelex',
                hideLabel: true,
                name: 'telex'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.fax,
                id: 'chkfax',
                hideLabel: true,
                name: 'fax'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.correo,
                id: 'chkcorreo',
                hideLabel: true,
                name: 'correo'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.calado,
                id: 'chkcalado',
                hideLabel: true,
                name: 'calado'
            }),
            new Ext.form.Checkbox(
                {
                    boxLabel: idioma.eslora,
                    id: 'chkeslora',
                    hideLabel: true,
                    name: 'eslora'
                }),
            new Ext.form.Checkbox(
                {
                    boxLabel: idioma.manga,
                    id: 'chkmanga',
                    hideLabel: true,
                    name: 'manga'
                }),
            new Ext.form.Checkbox({
                boxLabel: idioma.muerto,
                id: 'chkmuerto',
                hideLabel: true,
                name: 'muerto'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.neto,
                id: 'chkneto',
                hideLabel: true,
                name: 'neto'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.bruto,
                id: 'chkbruto',
                hideLabel: true,
                name: 'bruto'
            })
        ];

        core_view.stColumnReader = core_view.stColumnReader.concat(col_store_buque);
        core_view.columsCM = core_view.columsCM.concat(cm_columns_buque);
        core_view.checkItems = core_view.checkItems.concat(checkItemsBuque);
        core_view.gestionarTipoMedio = core_view.gestionarTipoMedio.createInterceptor(function (config, concepto) {
            core_view.datos['nombre'] = (Ext.getCmp('chknombre').getValue()) ? 1 : 0;
            core_view.datos['codigo'] = (Ext.getCmp('chkcodigo').getValue()) ? 1 : 0;
            core_view.datos['bandera'] = (Ext.getCmp('chkbandera').getValue()) ? 1 : 0;
            core_view.datos['nrooficial'] = (Ext.getCmp('chknrooficial').getValue()) ? 1 : 0;
            core_view.datos['nroimo'] = (Ext.getCmp('chknroimo').getValue()) ? 1 : 0;
            core_view.datos['casaclasific'] = (Ext.getCmp('chkcasaclasific').getValue()) ? 1 : 0;
            core_view.datos['velocidad'] = (Ext.getCmp('chkvelocidad').getValue()) ? 1 : 0;
            core_view.datos['letrallamada'] = (Ext.getCmp('chkletrallamada').getValue()) ? 1 : 0;
            core_view.datos['telex'] = (Ext.getCmp('chktelex').getValue()) ? 1 : 0;
            core_view.datos['fax'] = (Ext.getCmp('chkfax').getValue()) ? 1 : 0;
            core_view.datos['correo'] = (Ext.getCmp('chkcorreo').getValue()) ? 1 : 0;
            core_view.datos['calado'] = (Ext.getCmp('chkcalado').getValue()) ? 1 : 0;
            core_view.datos['eslora'] = (Ext.getCmp('chkeslora').getValue()) ? 1 : 0;
            core_view.datos['manga'] = (Ext.getCmp('chkmanga').getValue()) ? 1 : 0;
            core_view.datos['muerto'] = (Ext.getCmp('chkmuerto').getValue()) ? 1 : 0;
            core_view.datos['neto'] = (Ext.getCmp('chkneto').getValue()) ? 1 : 0;
            core_view.datos['bruto'] = (Ext.getCmp('chkbruto').getValue()) ? 1 : 0;
            return true;
        });
    }
};

Ext.aft.plugins.buque.ElementosGridBuqueCodigoNew = {
    init: function (core_view) {

        var campos = this.getArrCampos();
        for (var i = 0; i < campos.length; i++) {
            core_view.addGridColumn(campos[i]);
        }
    },
    getArrCampos: function () {
        var idioma = Ext.aft.plugins.buque.Idioma;
        return [
            {
                header: idioma.codigo,
                width: 100,
                sortable: true,
                id: 'idcodigo',
                dataIndex: 'codigo',
                filter: {
                    type: 'string',
                    dataIndex: 'codigo'
                },
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.nombre,
                width: 105,
                sortable: true,
                id: 'idnombre',
                dataIndex: 'nombre',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.bandera,
                width: 100,
                id: 'idbandera',
                sortable: true,
                dataIndex: 'denombandera',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.nrooficial,
                width: 100,
                id: 'idnrooficial',
                sortable: true,
                dataIndex: 'nrooficial',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.nroimo,
                width: 80,
                id: 'idnroimo',
                sortable: true,
                dataIndex: 'nroimo',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.casaclasific,
                width: 105,
                id: 'idcasaclasifc',
                sortable: true,
                dataIndex: 'denomcasaclasific',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.velocidad,
                width: 120,
                id: 'idvelocidad',
                sortable: true,
                dataIndex: 'velocidad',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.letrallamada,
                dataIndex: 'letrallamada',
                sortable: true,
                id: 'idletrallamada',
                // align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.telex,
                dataIndex: 'telex',
                sortable: true,
                id: 'idtelex',
                //align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.fax,
                dataIndex: 'fax',
                sortable: true,
                id: 'idfax',
                // align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.correo,
                sortable: true,
                dataIndex: 'correo',
                id: 'idcorreo',
                //align: 'right',
                width: 70,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: idioma.calado,
                dataIndex: 'calado',
                sortable: true,
                id: 'idcalado',
                //align: 'right',
                width: 130,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.eslora,
                dataIndex: 'eslora',
                sortable: true,
                id: 'ideslora',
                //align: 'right',
                width: 160,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.manga,
                dataIndex: 'manga',
                sortable: true,
                id: 'idmanga',
                // align: 'right',
                width: 160,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.muerto,
                dataIndex: 'muerto',
                sortable: true,
                id: 'idmuerto',
                //align: 'right',
                width: 150,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.neto,
                dataIndex: 'neto',
                sortable: true,
                id: 'idneto',
                // align: 'right',
                width: 135,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            },
            {
                header: idioma.bruto,
                dataIndex: 'bruto',
                sortable: true,
                id: 'idbruto',
                width: 135,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                },
                default: true
            }
        ];
    }
};



