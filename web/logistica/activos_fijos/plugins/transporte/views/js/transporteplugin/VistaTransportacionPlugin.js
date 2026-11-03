/**
 * Created by osmel on 14/05/15.
 */

Ext.ns('Ext.aft.plugins.Transportacion');
Ext.aft.plugins.Transportacion.ElementosGridTransportacionPlugin = {
    init: function(core_view) {
        var idioma = Ext.aft.plugins.Transportacion.Idioma;
        var readerstore = [
            {
                name: 'idtipocombustible'
            },
            {
                name: 'denomtipocombustible'
            },
            {
                name: 'nromatricula'
            },
            {
                name: 'nrocirculacion'
            },
            {
                name: 'nromotor1'
            },
            {
                name: 'nromotor2'
            },
            {
                name: 'indicativo'
            },
            {
                name: 'indiceconsumo'
            },
            {
                name: 'ficav'
            },
            {
                name: 'lot'
            },
            {
                name: 'capacidad'
            },
            {
                name: 'vin'
            }, {
                name: 'nollaveencendido'
            }, {
                name: 'vencimientoficav'
            }, {
                name: 'vencimientolot'
            }, {
                name: 'vencimientocirculacion'
            }, {
                name: 'expedicioncirculacion'
            }, {
                name: 'normacombustible'
            }, {
                name: 'cantpersonasentado'
            }, {
                name: 'cantpersonapie'
            }, {
                name: 'idgps'
            }, {
                name: 'idcategoriatransp'
            }, {
                name: 'endeposito'
            }, {
                name: 'kmasignado'
            }
        ];
        //Ext.LOG.RegNumOperativo.TreeGridRegistroNO.renderer
        var columnmodel = [{
            header: idioma.nromatrícula,
            width: 100,
            sortable: true,
            id: 'idnummatricula',
            dataIndex: 'nromatricula',
            filter: {
                type: 'numeric',
                dataIndex: 'indicativo'
            },
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.nrocirculacion,
            width: 105,
            sortable: true,
            id: 'idnumcirculacion',
            dataIndex: 'nrocirculacion',
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.nromotoruno,
            width: 100,
            id: 'idmotor1',
            sortable: true,
            dataIndex: 'nromotor1',
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.nromotordos,
            width: 100,
            id: 'idmotor2',
            sortable: true,
            dataIndex: 'nromotor2',
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.indicativo,
            width: 80,
            id: 'idindicativo',
            sortable: true,
            dataIndex: 'indicativo',
            filter: {
                type: 'numeric',
                dataIndex: 'indicativo'
            },
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.indiceconsumo,
            width: 105,
            id: 'idindiceconsumo',
            sortable: true,
            dataIndex: 'indiceconsumo',
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.tipocombustible,
            width: 120,
            id: 'idtipocombustible',
            sortable: true,
            dataIndex: 'denomtipocombustible',
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.ficav,
            dataIndex: 'ficav',
            sortable: true,
            id: 'idficav',
            // align: 'right',
            width: 70,
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.lot,
            dataIndex: 'lot',
            sortable: true,
            id: 'idlot',
            //align: 'right',
            width: 70,
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.capacidad,
            dataIndex: 'capacidad',
            sortable: true,
            id: 'idcapacidadt',
            // align: 'right',
            width: 70,
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: idioma.vin,
            sortable: true,
            dataIndex: 'vin',
            id: 'idvin',
            //align: 'right',
            width: 70,
            renderer: function (value, metaData, record) {
                if (record.data.color == 2 && value != null) {
                    return '<span style="color:#38910b;">' + value + '</span>';
                } else if (value != null) {
                    return value;
                }
            }
        }, {
            header: 'Nro. LLave encendodo',
            dataIndex: 'nollaveencendido',
            sortable: true,
            id: 'idnrollaveencendido',
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
        }, {
            header: 'Fecha expedici\xf3 circulaci\xf3n',
            dataIndex: 'expedicioncirculacion',
            sortable: true,
            id: 'idexpedicioncirculacion',
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
        }, {
            header: 'Fecha vencimiento circulaci\xf3n',
            dataIndex: 'vencimientocirculacion',
            sortable: true,
            id: 'idvencimientocirculacion',
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
        }, {
            header: 'Fecha vencimiento ficav',
            dataIndex: 'vencimientoficav',
            sortable: true,
            id: 'idvencimientoficav',
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
        }, {
            header: 'Fecha vencimiento lot',
            dataIndex: 'vencimientolot',
            sortable: true,
            id: 'idvencimientolot',
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
        }, {
            header: 'Norma de combustible',
            dataIndex: 'normacombustible',
            sortable: true,
            id: 'normacombustible',
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
        }, {
            header: 'Cantidad de personas sentadas',
            dataIndex: 'cantpersonasentado',
            sortable: true,
            id: 'cantpersonasentado',
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
        }, {
            header: 'Cantidad de personas de pie',
            dataIndex: 'cantpersonapie',
            sortable: true,
            id: 'cantpersonapie',
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
        }, {
            header: 'GPS',
            dataIndex: 'idgps',
            sortable: true,
            id: 'idgps',
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
        }, {
            header: 'Categor\xeda trasportaci\xf3n',
            dataIndex: 'idcategoriatransp',
            sortable: true,
            id: 'idcategoriatransp',
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
        }, {
            header: 'KM asignado',
            dataIndex: 'idkmasignado',
            sortable: true,
            id: 'idkmasignado',
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
        }, {
            header: 'En dep\xf3sito',
            dataIndex: 'endeposito',
            sortable: true,
            id: 'endeposito',
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
/*Ext.aft.plugins.Transportacion.GridDepreciacion = {
 init: function(core_view) {
 var idioma = Ext.aft.plugins.Transportacion.Idioma;
 
 var readerstore = [
 {
 name: 'nromatricula'
 },
 {
 name: 'numcirculacion'
 },
 {
 name: 'motor1'
 },
 {
 name: 'motor2'
 },
 {
 name: 'indicativo'
 },
 {
 name: 'indiceconsumo'
 }
 ];
 //
 var columnmodel = [{
 header: idioma.nromatrícula,
 width: 100,
 id: 'idnummatricula',
 dataIndex: 'nromatricula',
 renderer: core_view.activarColores
 }, {
 header: idioma.nrocirculacion,
 width: 100,
 id: 'idnumcirculacion',
 dataIndex: 'numcirculacion',
 renderer: core_view.activarColores
 
 }, {
 header: idioma.nromotoruno,
 width: 100,
 id: 'idmotor1',
 dataIndex: 'motor1',
 renderer: core_view.activarColores
 }, {
 header: idioma.nromotordos,
 width: 100,
 id: 'idmotor2',
 dataIndex: 'motor2',
 renderer: core_view.activarColores
 }, {
 header: idioma.indicativo,
 width: 100,
 id: 'idindicativo',
 dataIndex: 'indicativo',
 renderer: core_view.activarColores
 }, {
 header: idioma.indiceconsumo,
 width: 100,
 id: 'idindiceconsumo',
 dataIndex: 'indiceconsumo',
 renderer: core_view.activarColores
 }];
 
 
 core_view.readerstore = core_view.readerstore.concat(readerstore);
 core_view.columnmodel = core_view.columnmodel.concat(columnmodel);
 }
 };*/

Ext.aft.plugins.Transportacion.ConfDatosNaturalezas = {
    init: function(core_view) {

        var idioma = Ext.aft.plugins.Transportacion.Idioma;
        var col_store_transp = [
            {
                name: 'numchasis'
            },
            {
                name: 'nummatricula'
            },
            {
                name: 'numcirculacion'
            },
            {
                name: 'motor1'
            },
            {
                name: 'motor2'
            },
            {
                name: 'tipocombustible'
            },
            {
                name: 'indicativo'
            },
            {
                name: 'indiceconsumo'
            },
            {
                name: 'nrollaveencendido'
            },
            {
                name: 'ficav'
            },
            {
                name: 'lot'
            },
            {
                name: 'capacidad'
            },
            {
                name: 'vin'
            }, {
                name: 'vencimientoficav'
            }, {
                name: 'vencimientolot'
            }, {
                name: 'vencimientocirculacion'
            }, {
                name: 'expedicioncirculacion'
            }, {
                name: 'normacombustible'
            }, {
                name: 'cantpersonasentado'
            }, {
                name: 'cantpersonapie'
            }, {
                name: 'idgps'
            }, {
                name: 'idcategoriatransp'
            }, {
                name: 'endeposito'
            }, {
                name: 'kmasignado'
            }
        ];
        var cm_columns_transp = [
            {
                header: idioma.nromatrícula,
                width: 100,
                dataIndex: 'nummatricula',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'nummatricula',
                filter: {
                    type: 'numeric',
                    dataIndex: 'indicativo'
                }
            }, {
                header: idioma.nrocirculacion,
                width: 100,
                dataIndex: 'numcirculacion',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'numcirculacion'
            }, {
                header: idioma.nromotoruno,
                width: 100,
                dataIndex: 'motor1',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'motor1'
            }, {
                header: idioma.nromotordos,
                width: 100,
                dataIndex: 'motor2',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'motor2'
            }, {
                header: idioma.tipocombustible,
                width: 100,
                dataIndex: 'tipocombustible',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'tipocombustible'
            }, {
                header: idioma.indicativo,
                width: 130,
                dataIndex: 'indicativo',
                renderer: core_view.columRender,
                align: 'center',
                hidden: true,
                id: 'indicativo',
                filter: {
                    type: 'numeric',
                    dataIndex: 'indicativo'
                }

            }, {
                header: idioma.indiceconsumo,
                width: 130,
                dataIndex: 'indiceconsumo',
                renderer: core_view.columRender,
                align: 'center',
                //hidden: true,
                id: 'indiceconsumo'
            }, {
                header: idioma.nrollaveencendido,
                width: 130,
                dataIndex: 'nrollaveencendido',
                renderer: core_view.columRender,
                align: 'center',
                //hidden: true,
                id: 'nrollaveencendido'
            }, {
                header: idioma.ficav,
                width: 130,
                dataIndex: 'ficav',
                renderer: core_view.columRender,
                align: 'center',
                id: 'ficav'
            }, {
                header: idioma.lot,
                width: 130,
                dataIndex: 'lot',
                renderer: core_view.columRender,
                align: 'center',
                //hidden: true,
                id: 'lot'
            }, {
                header: idioma.capacidad,
                width: 130,
                dataIndex: 'capacidad',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'capacidad'
            }, {
                header: idioma.vin,
                width: 130,
                dataIndex: 'vin',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'vin'
            }, {
                header: idioma.expedicioncirculacion,
                width: 130,
                dataIndex: 'expedicioncirculacion',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'expedicioncirculacion'
            }, {
                header: idioma.vencimientocirculacion,
                width: 130,
                dataIndex: 'vencimientocirculacion',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'vencimientocirculacion'
            }, {
                header: idioma.vencimientoficav,
                width: 130,
                dataIndex: 'vencimientoficav',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'vencimientoficav'
            }, {
                header: idioma.vencimientolot,
                width: 130,
                dataIndex: 'vencimientolot',
                renderer: core_view.columRender,
                align: 'center',
                hidden: false,
                id: 'vencimientolot'
            }, {
            header: 'Norma de combustible',
            dataIndex: 'normacombustible',
            sortable: true,
            id: 'normacombustible',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
        }, {
            header: 'Cantidad de personas sentadas',
            dataIndex: 'cantpersonasentado',
            sortable: true,
            id: 'cantpersonasentado',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
        }, {
            header: 'Cantidad de personas de pie',
            dataIndex: 'cantpersonapie',
            sortable: true,
            id: 'cantpersonapie',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
        }, {
            header: 'GPS',
            dataIndex: 'idgps',
            sortable: true,
            id: 'idgps',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
        }, {
            header: 'Categor\xeda trasportaci\xf3n',
            dataIndex: 'idcategoriatransp',
            sortable: true,
            id: 'idcategoriatransp',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
        },{
            header: 'En dep\xf3sito',
            dataIndex: 'endeposito',
            sortable: true,
            id: 'endeposito',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
            },{
            header: 'KM asignado',
            dataIndex: 'kmasignado',
            sortable: true,
            id: 'kmasignado',
            // align: 'right',
            width: 135,
            renderer: core_view.columRender,
            default: true
            }
        ];
        var checkItemsTransp = [
            new Ext.form.Checkbox(
                    {
                        boxLabel: idioma.nromatrícula,
                        id: 'chknummatricula',
                        hideLabel: true,
                        name: 'nummatricula',
                        listeners: {
                            'check': function(abb, checked) {
                                core_view.datos['nummatricula'] = (checked) ? 1 : 0;
                            }
                        }

                    }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nrocirculacion,
                id: 'chknumcirculacion',
                hideLabel: true,
                name: 'numcirculacion',
                listeners: {
                    'check': function(abb, checked) {
                        core_view.datos['numcirculacion'] = (checked) ? 1 : 0;
                    }
                }
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nromotoruno,
                id: 'chkmotor1',
                hideLabel: true,
                name: 'motor1'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nromotordos,
                id: 'chkmotor2',
                hideLabel: true,
                name: 'motor2'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.tipocombustible,
                id: 'chktipocombustible',
                hideLabel: true,
                name: 'tipocombustible',
                listeners: {
                    'check': function(abb, checked) {
                        core_view.datos['tipocombustible'] = (checked) ? 1 : 0;
                    }
                }
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.tipocombustible,
                id: 'chktipocombustible',
                hideLabel: true,
                name: 'tipocombustible'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.indiceconsumo,
                id: 'chkindiceconsumo',
                hideLabel: true,
                name: 'indiceconsumo'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.nrollaveencendido,
                id: 'chknrollaveencendido',
                hideLabel: true,
                name: 'nrollaveencendido'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.indicativo,
                id: 'chkindicativo',
                hideLabel: true,
                name: 'indicativo'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.ficav,
                id: 'chkficav',
                hideLabel: true,
                name: 'ficav'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.lot,
                id: 'chklot',
                hideLabel: true,
                name: 'lot'
            }),
            new Ext.form.Checkbox(
            {
                boxLabel: idioma.capacidad,
                id: 'chkcapacidad',
                hideLabel: true,
                name: 'capacidad'
            }),
            new Ext.form.Checkbox(
            {
                boxLabel: 'En dep\xf3sito',
                id: 'chkendeposito',
                hideLabel: true,
                name: 'endeposito'
            }),
            new Ext.form.Checkbox({
                boxLabel: idioma.vin,
                id: 'chkvin',
                hideLabel: true,
                name: 'vin'
            }), new Ext.form.Checkbox({
                boxLabel: idioma.expedicioncirculacion,
                id: 'chkexpedicioncirculacion',
                hideLabel: true,
                name: 'expedicioncirculacion'
            }), new Ext.form.Checkbox({
                boxLabel: idioma.vencimientocirculacion,
                id: 'chkvencimientocirculacion',
                hideLabel: true,
                name: 'vencimientocirculacion'
            }), new Ext.form.Checkbox({
                boxLabel: idioma.vencimientoficav,
                id: 'chkvencimientoficav',
                hideLabel: true,
                name: 'vencimientoficav'
            }), new Ext.form.Checkbox({
                boxLabel: idioma.vencimientolot,
                id: 'chkvencimientolot',
                hideLabel: true,
                name: 'vencimientolot'
            }), 
            
            new Ext.form.Checkbox({
                boxLabel: 'Cantidad de personas de pie',
                id: 'chkcantpersonapie',
                hideLabel: true,
                name: 'cantpersonapie'
            }), new Ext.form.Checkbox({
                boxLabel: 'Cantidad de personas sentadas',
                id: 'chkcantpersonasentado',
                hideLabel: true,
                name: 'cantpersonasentado'
            }), new Ext.form.Checkbox({
                boxLabel: 'Norma de combustible',
                id: 'chknormacombustible',
                hideLabel: true,
                name: 'normacombustible'
            }), new Ext.form.Checkbox({
                boxLabel: 'GPS',
                id: 'chkidgps',
                hideLabel: true,
                name: 'idgps'
            }), new Ext.form.Checkbox({
                boxLabel: 'Categor\xeda trasportaci\xf3n',
                id: 'chkidcategoriatransp',
                hideLabel: true,
                name: 'idcategoriatransp'
            }), new Ext.form.Checkbox({
                boxLabel: 'KM asignado',
                id: 'chkkmasignado',
                hideLabel: true,
                name: 'kmasignado'
            })
        ];
        core_view.columsCM.splice(3, 0, {
            header: idioma.nrochasis,
            width: 100,
            dataIndex: 'numchasis',
            renderer: core_view.columRender,
            align: 'center',
            hidden: true,
            id: 'numchasis'
        });
        //core_view.checkItems[0].xtype = 'radio';
        Ext.apply(core_view.checkItems[0],{ listeners:{
            'check':function(ch, value){
                if(value){
                    if(Ext.getCmp('rbnumchasis'))
                        Ext.getCmp('rbnumchasis').setValue(false);
                }
            }
        }});
        core_view.checkItems.splice(1, 0, {
            xtype: 'checkbox',
            boxLabel: idioma.nrochasis,
            id: 'rbnumchasis',
            hideLabel: true,
            name: 'numserie',
            inputValue: '2'
        });
        if(core_view.checkItems[1].id == 'rbnumchasis') {
            Ext.apply(core_view.checkItems[1], {
                listeners: {
                    'check': function (ch, value) {
                        if (value) {
                            if (Ext.getCmp('numchasis'))
                                Ext.getCmp('numchasis').setValue(false);
                            if (Ext.getCmp('rbnumserie'))
                                Ext.getCmp('rbnumserie').setValue(false);
                        }
                    }
                }
            });
        }
        core_view.stColumnReader = core_view.stColumnReader.concat(col_store_transp);
        core_view.columsCM = core_view.columsCM.concat(cm_columns_transp);
        core_view.checkItems = core_view.checkItems.concat(checkItemsTransp);
        core_view.gestionarTipoMedio = core_view.gestionarTipoMedio.createInterceptor(function(config, concepto) {
            core_view.datos['numchasis'] = (Ext.getCmp('rbnumchasis').getValue()) ? 1 : 0;
            core_view.datos['nummatricula'] = (Ext.getCmp('chknummatricula').getValue()) ? 1 : 0;
            core_view.datos['numcirculacion'] = (Ext.getCmp('chknumcirculacion').getValue()) ? 1 : 0;
            core_view.datos['motor1'] = (Ext.getCmp('chkmotor1').getValue()) ? 1 : 0;
            core_view.datos['motor2'] = (Ext.getCmp('chkmotor2').getValue()) ? 1 : 0;
            core_view.datos['tipocombustible'] = (Ext.getCmp('chktipocombustible').getValue()) ? 1 : 0;
            core_view.datos['indicativo'] = (Ext.getCmp('chkindicativo').getValue()) ? 1 : 0;
            core_view.datos['indiceconsumo'] = (Ext.getCmp('chkindiceconsumo').getValue()) ? 1 : 0;
            core_view.datos['nrollaveencendido'] = (Ext.getCmp('chknrollaveencendido').getValue()) ? 1 : 0;
            core_view.datos['ficav'] = (Ext.getCmp('chkficav').getValue()) ? 1 : 0;
            core_view.datos['lot'] = (Ext.getCmp('chklot').getValue()) ? 1 : 0;
            core_view.datos['capacidad'] = (Ext.getCmp('chkcapacidad').getValue()) ? 1 : 0;
            core_view.datos['endeposito'] = (Ext.getCmp('chkendeposito').getValue()) ? 1 : 0;
            core_view.datos['vin'] = (Ext.getCmp('chkvin').getValue()) ? 1 : 0;
            core_view.datos['vencimientolot'] = (Ext.getCmp('chkvencimientolot').getValue()) ? 1 : 0;
            core_view.datos['vencimientoficav'] = (Ext.getCmp('chkvencimientoficav').getValue()) ? 1 : 0;
            core_view.datos['vencimientocirculacion'] = (Ext.getCmp('chkvencimientocirculacion').getValue()) ? 1 : 0;
            core_view.datos['expedicioncirculacion'] = (Ext.getCmp('chkexpedicioncirculacion').getValue()) ? 1 : 0;
            
            
            core_view.datos['cantpersonapie'] = (Ext.getCmp('chkcantpersonapie').getValue()) ? 1 : 0;
            core_view.datos['cantpersonasentado'] = (Ext.getCmp('chkcantpersonasentado').getValue()) ? 1 : 0;
            core_view.datos['normacombustible'] = (Ext.getCmp('chknormacombustible').getValue()) ? 1 : 0;
            core_view.datos['idgps'] = (Ext.getCmp('chkidgps').getValue()) ? 1 : 0;
            core_view.datos['idcategoriatransp'] = (Ext.getCmp('chkidcategoriatransp').getValue()) ? 1 : 0;
            core_view.datos['kmasignado'] = (Ext.getCmp('chkkmasignado').getValue()) ? 1 : 0;
            return true;
        });
    }
};

Ext.aft.plugins.Transportacion.ElementosGridTransportacionCodigoNew = {
    init: function(core_view) {

        var campos = this.getArrCampos();
        for (var i = 0; i < campos.length; i++) {
            core_view.addGridColumn(campos[i]);
        }
    },
    getArrCampos: function() {
        var idioma = Ext.aft.plugins.Transportacion.Idioma;
        return [
            {
                header: idioma.nromatrícula,
                width: 100,
                id: 'idnummatricula',
                dataIndex: 'nromatricula',
                filter: {
                    type: 'numeric',
                    dataIndex: 'indicativo'
                },
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            },
            {
                header: idioma.nrocirculacion,
                width: 100,
                id: 'idnumcirculacion',
                dataIndex: 'nrocirculacion',
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.nromotoruno,
                width: 100,
                id: 'idmotor1',
                dataIndex: 'nromotor1',
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.nromotordos,
                width: 100,
                id: 'idmotor2',
                dataIndex: 'nromotor2',
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.indicativo,
                width: 100,
                id: 'idindicativo',
                dataIndex: 'indicativo',
                filter: {
                    type: 'numeric',
                    dataIndex: 'indicativo'
                },
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.indiceconsumo,
                width: 100,
                id: 'idindiceconsumo',
                dataIndex: 'indiceconsumo',
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.tipocombustible,
                width: 100,
                id: 'idtipocombustible',
                dataIndex: 'denomtipocombustible',
                //default: true,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            }, {
                header: idioma.ficav,
                dataIndex: 'ficav',
                id: 'idficav',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.lot,
                dataIndex: 'lot',
                id: 'idlot',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.capacidad,
                dataIndex: 'capacidad',
                id: 'idcapacidadt',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: idioma.vin,
                dataIndex: 'vin',
                id: 'idvin',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Nro. LLave encendodo',
                dataIndex: 'nollaveencendido',
                id: 'idnrollaveencendido',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Fecha expedici\xf3 circulaci\xf3n',
                dataIndex: 'expedicioncirculacion',
                id: 'idexpedicioncirculacion',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Fecha vencimiento circulación',
                dataIndex: 'vencimientocirculacion',
                id: 'idvencimientocirculacion',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Fecha vencimiento ficav',
                dataIndex: 'vencimientoficav',
                id: 'idvencimientoficav',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Fecha vencimiento lot',
                dataIndex: 'vencimientolot',
                id: 'idvencimientolot',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }
        
        
        , {
                header: 'Cantidad de personas de pie',
                dataIndex: 'cantpersonapie',
                id: 'idcantpersonapie',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Cantidad de personas sentadas',
                dataIndex: 'cantpersonasentado',
                id: 'idcantpersonasentado',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Norma de combustible',
                dataIndex: 'normacombustible',
                id: 'idnormacombustible',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'GPS',
                dataIndex: 'idgps',
                id: 'ididgps',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            }, {
                header: 'Categor\xeda trasportaci\xf3n',
                dataIndex: 'idcategoriatransp',
                id: 'ididcategoriatransp',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
                //default: true
            },{
                header: 'En dep\xf3sito',
                dataIndex: 'endeposito',
                sortable: true,
                id: 'endeposito',
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
            },{
                header: 'KM asignado',
                dataIndex: 'kmasignado',
                sortable: true,
                id: 'kmasignado',
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
    }
};



