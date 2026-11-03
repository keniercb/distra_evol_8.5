/**
 *  Adrian Fernandez
 *  24/07/2013
 */
Ext.ns('Ext.erp');

Ext.erp.initIUnomEstaticos = function() {
    Ext.QuickTips.init();
    UCID.portal.cargarAcciones(window.frameElement.id, function() {
        var viewport = new Ext.erp.viewPortNomencladores({
            title: 'Configuraciones'
        });
        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'CFGESTUBIC':
                        viewport.addNodoTree('Configuración de estructura y ubicación', 'estructuraubicacion', '/logistica/utiles/ubicacion/index.php/estructuraubicacion/');
                        break;
                    case 'CFGTRANS':
                        viewport.addNodoTree('Configuración transportación', 'tripulacion', '/logistica/transportacion/configuracion/index.php/tripulacion/');
                        break;
                    case 'CFGFACT':
                        viewport.addNodoTree('Configuraci\xf3n facturación', 'conffacturacion', '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/');
                        break;
                    case 'CFGDIST':
                        viewport.addNodoTree('Configuración de distribución', 'configuraciondistribucion', '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/');
                        break;
                    case 'CFGPROD':
                        viewport.addNodoTree('Configuración producción', 'configuracion', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        break;
                    case 'CFGTALL':
                        viewport.addNodoTree('Configuración de talleres', 'configuraciontalleres', '/logistica/talleres/configuracion/index.php/configuraciontalleres/');
                    //case 'CFGTALL':
                        viewport.addNodoTree('Configuración de tipos de medios', 'configuracionmediostaller', '/logistica/talleres/configuracion/index.php/configuracionmediostaller/');
                   // case 'CFGTALL':
                        viewport.addNodoTree('Configuración de las actividades', 'configuracionactividades', '/logistica/talleres/configuracion/index.php/configuracionactividades/');
                    //case 'CFGTALL':
                        viewport.addNodoTree('Configuración de facturación', 'configuracionfacturacion', '/logistica/talleres/configuracion/index.php/configuracionfacturacion/');
                        viewport.addNodoTree('Configuración de paralización', 'configuracionparalizacion', '/logistica/talleres/configuracion/index.php/configuracionparalizacion/');
                        break;
                    case 'CFGINV':
                        viewport.addNodoTree('Configuración de inventario', 'configuracioninventario', '/logistica/inventario/configuracion/index.php/configuracioninventario/');
                        break;
                    case 'CFGAFT':
                        viewport.addNodoTree('Configuración activo fijo', 'configuracionactivosfijos', '/logistica/activos_fijos/configuracion/index.php/configuracionactivosfijos/');
                        break;
                    case 'CFGCMAFT':
                        viewport.addNodoTree('Configuración de control de piezas a medios', 'configuracioncontrolmedios', '/logistica/activos_fijos/configuracion/index.php/configuracioncontrolmedios/');
                        break;
                    case 'CFGSMAFT':
                        viewport.addNodoTree('Configuración de sistemas para mantenimiento', 'confsistemamedioactividad', '/logistica/activos_fijos/configuracion/index.php/confsistemamedioactividad/');
                        break;
                    case 'CFGPMAFT':
                        viewport.addNodoTree('Configuración de planificación para mantenimiento', 'confplanificacionmantenimiento', '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento/');
                        break;
                    case 'CFGPED':
                        viewport.addNodoTree('Configuración de pedido', 'configuracionpedido', '/logistica/distribucion/configuracion/index.php/configuracionpedido/');
                        break;
                    case 'CFGBAL':
                        viewport.addNodoTree('Configuración de los almacenes', 'configuracionbalanceo', '/logistica/distribucion/configuracion/index.php/configuracionbalanceo/');
                        break;
                     case 'CFGCCO':
                        viewport.addNodoTree('Configuración del código de las operaciones ', 'configuraciondelcodigo', '/logistica/distribucion/configuracion/index.php/configuraciondelcodigo/');
                        break;
                        /**  Configuracion de Reserva estatal  **/
                    case 'CFGRSRV':
                        viewport.addNodoTree('Configuraci\xf3n de la reserva', 'confcuadrobasicoreset', '/logistica/reserva/configuracion/index.php/confcuadrobasicoreset/');
                        break;
                        /** CONFIGURACIÓN GENERAL DE COMPRA **/
                    case 'CFGCOMP':
                        viewport.addNodoTree('Configuraci\xf3n general de compra', 'configuraciongeneralcompra', '/logistica/compra/configuracion/index.php/configuraciongeneralcompra/');
                    case 'CFGCTAPROD':
                        viewport.addNodoTree('Configuraci\xf3n de cartera de productos y proveedores', 'confcarteraproducto', '/logistica/compra/configuracion/index.php/confcarteraproducto/');
                    case 'CFGAPVT':
                        viewport.addNodoTree('Configuraci\xf3n de aprovisionamiento', 'confaprovisionamiento', '/logistica/compra/configuracion/index.php/confaprovisionamiento/');
                        break;
                        /** FIN **/
                    case 'CFCALID':
                        viewport.addNodoTree('Configuraci\xf3n de calidad', 'configuracioncalidad', '/logistica/controlcalidad/configuracion/index.php/configuracioncalidad/');
                        break;
                        /*CONFIGURACIÓN GENERAL ATRIMONIO*/
                    case 'CFGPATRI':
                        viewport.addNodoTree('Configuración patrimonio', 'confpatrimonio', '/logistica/activos_fijos/patrimonio/configuracion/index.php/confpatrimonio/');
                        break;

                    /*CONGIGURACION GENERAL CONTENEDORES*/
                    case 'CFGCONT': viewport.addNodoTree(
                        'Configuraci\xf3n de contenedores', 'confcontenedores',
                        '/logistica/contenedores/configuracion/index.php/confcontenedores/'
                    );
                    break;
                    case 'CFGFARM':
                        viewport.addNodoTree('Cuadro b\xe1sico', 'configuracionfarmacia', '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/');
                    break;
                    case 'CONFGENERAL':
                        viewport.addNodoTree('Configuración de farmacia', 'configuraciongeneral', '/logistica/farmacia/configuracion/index.php/configuraciongeneral/');
                    break;
                    /*CONGIGURACION GENERAL PRODUCCION*/
                    case 'CFGACTIVIDAD':
                        viewport.addNodoTree('Configuración de actividades', 'actividades', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        break;
                    case 'CFGAREASPROD':
                        viewport.addNodoTree('Configuración de las áreas productivas', 'areasproductivas', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        break;
                    case 'CFGDEPPROD':
                        viewport.addNodoTree('Configuración depositos', 'depositos', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        break;
                    case 'CONFPROD':
                        viewport.addNodoTree('Configuración de los almacenes', 'confproduccion', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        viewport.addNodoTree('Configuración de los equipos', 'confequipos', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        viewport.addNodoTree('Configuración de actividades y centros de costo', 'confactividades', '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/');
                        break;

                    /*CONGIGURACION GENERAL COMBUSTIBLE*/
                    case 'CFGCOMB':
                        viewport.addNodoTree('Configuración de importación de ficheros', 'configuracionventas', '/logistica/combustible/configuracion/index.php/configuracionventas/');

                        viewport.addNodoTree('Configuración de surtidores', 'configuracionsurtidores', '/logistica/combustible/configuracion/index.php/configuracionsurtidores/');
                        break;
                }  console.log(acciones_reportes[i].abreviatura)
            }
            if(viewport.treeMenu.root.childNodes.length == 1){
                viewport.treeMenu.fireEvent('click', viewport.treeMenu.root.childNodes[0]);
                viewport.selectTab(viewport.treeMenu.root.childNodes[0]);
                viewport.treeMenu.collapse();
            }
        } else {
            mostrarMensaje(1, 'Debe configurar los recursos para esta acción.');
        }

//        viewport.addNodoTree('Configuración general', 'configuraciongeneral', '/logistica/utiles/configuracion/index.php/configuraciongeneral/');
//        viewport.addNodoTree('Configuración del almac\xe9n', 'configuracioninventario', '/logistica/inventario/configuracion/index.php/configuracioninventario/');
//        viewport.addNodoTree('Configuración de facturación', 'conffacturacion', '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/');
//        viewport.addNodoTree('Configuración de distribución', 'configuraciondistribucion', '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/');
//        viewport.addNodoTree('Configuración de talleres', 'configuraciontalleres', '/logistica/talleres/configuracion/index.php/configuraciontalleres/');

    });
};
Ext.erp.initIUnomEstaticos();
