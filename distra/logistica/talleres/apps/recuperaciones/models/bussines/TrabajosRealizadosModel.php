<?php


class TrabajosRealizadosModel extends ZendExt_Model
{
    private $_ordenTrabajoService, $_doctrineHelper;

    public function __construct()
    {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->_doctrineHelper = LogisticaDoctrineHelper::__init();
        $relationsInd[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMedio',
            'properties'   => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->_doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
    }

    public function getTrabajosRealizados($params)
    {
        $parametros = $this->getAuxiliar($params);        
        //$result = $ordenes = $this->_ordenTrabajoService->devolverOrdenesTrabajo($parametros, false);
        
        if ($parametros['origen'] == 'tecnico') {
            $tecnicosResponsables = $this->_ordenTrabajoService->cargarTecnicosDeActividadesEnOrdenes($parametros);
            foreach ($tecnicosResponsables as $i => $actv) {
                $arrIdTecnico[] = $actv['idresponsable'];
            }
            $parametros['idspersonas'] = $arrIdTecnico;
            $result = $this->_ordenTrabajoService->cargarTecnicos($parametros);
        } else { 
            $result = $ordenes = $this->_ordenTrabajoService->devolverOrdenesTrabajo($parametros, false);
            if ($parametros['origen'] == 'servicio') {
                foreach ($ordenes['datos'] as $i => $orden) {
                    $arrIdServicio[] = $orden['idservicio'];
                }
                $parametros['idservicio'] = $arrIdServicio;
                if ($parametros['denominacion']) {
                    $parametros['criterio'] = $parametros['denominacion'];
                }
                $result = $this->_ordenTrabajoService->cargarServicios($parametros);
            }
            //     else {
            //         if ($parametros['origen'] == 'producto') {
            //             $mproducto = new MaestroProductoModel();
            //
            //             $query = Doctrine_Query::create()->select('md.idindicador, indd.denominacion')
            //                 ->from('NomIndicador indd')->innerJoin('indd.DatMedio md');
            //             //$this->_ordenTrabajoService->getJoinMedioOrdenConMarcaModelo($query, 'md', 'nmar', 'nm');
            //             $mproducto->addQueryJoinIndicadorHoja($query, 'indd', 'indh', 1);
            //             $mproducto->configuracionHelper->getQueryJoinUnidadMedida(
            //                 $query, 'indd', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
            //             );
            //             $mproducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'indd');
            //             $result = array('datos' => $query->fetchArray(), 'cantidad' => $query->count());
            //
            //         }
            //     }
        }
        return $result;
    }

    public function getAuxiliar($params)
    {
        if ($params['criterio']) {
            if ($params['origen'] == 'producto') {
                $params['denominacionprod'] = $params['criterio'];
            } else {
                if ($params['origen'] == 'tecnico') {
                    $params['denominaciontecn'] = $params['criterio'];
                } else {
                    if ($params['origen'] == 'servicio') {
                        $params['denominacion'] = $params['criterio'];
                    }
                }
            }
            unset($params['criterio']);
        }
        return $params;
    }

    public function estaAperturadoSubsistema()
    {
        $logisticaGlobalFac = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $logisticaGlobalInv = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        return array('inv' => $logisticaGlobalInv, 'fac' => $logisticaGlobalFac);
    }


}
