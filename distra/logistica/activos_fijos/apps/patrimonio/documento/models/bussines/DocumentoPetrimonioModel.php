<?php

/**
 *
 */
class DocumentoPetrimonioModel extends DocumentoLogisticaModel
{
    private $_sEstrComposicion;
    //protected $_sContabilidad;
    //protected $_sRecHumanos;
    //protected $_sMovimiento;
    //protected $_sRegNumerico;
    //protected $_mMaestroProd;
    //protected $_mProdLog;
    //protected $_mRegNumerico;
    //protected $_mRegNumActivo;
    private $_mComunAFT;

    //protected $_oDatDocumento;

    /**
     *
     */
    public function __construct()
    {
        $this->_mComunAFT = ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        parent::__construct(
            array('alias' => 'MMAFT', 'noexception' => true, 'subsistema' => LogisticaGlobal::SUBSISTEMA_PATRIMONIO)
        );

        $this->estados = array(
            1 => 'Elaboración', 2 => 'Preparado', 3 => 'Aprobado', 5 => 'Anulado', 6 => 'Cancelado'
        );
//        $this->slogiticaDoc = $this->documentosHelper;        
        //$this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();





        $this->_sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        //$this->_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        //$this->_sRecHumanos = ServiciosRecursosHumanosHelper::__init();
        // Se comentario para mejorar rendimiento
        /* $this->_sMovimiento = new MovimientoService();
          $this->_sRegNumerico = new RegNumericoService();

          $this->_mMaestroProd = new MaestroProductoModel();
          $this->_mProdLog = new LogisticaProductoModel();
          $this->_mRegNumerico = new RegNumericoModel();
          $this->_mRegNumActivo = new RegNumericoActivoModel();
          $this->_oDatDocumento = new DatDocumentoActivo();
         */
        
    }

    // Este es el que hay que modificar para cargar los documentos a la hora de adicionar,
    // siempre y cuando que vengan los parametros de: areasseleccionada= arearesp y idestructura = 100000532
    // El parametro $paraLosDocumentos es para saber si se esta llamadno esta funcion para cargar los tipos de
    // documentos en dependencia de las operaciones.
    /**
     *
     */
    public function getOperaciones($parametros, $paraLosDocumentos = false)
    {      
        if (!$parametros['iddoc'] && !$paraLosDocumentos) {
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                $parametros['operacionEspecifica'], false, false, false, $parametros['idestructura'], 0,
                $parametros['idfuncionalidad']
            );
        } else {
            $configServ = new ConfiguracionActivosService();
            $result = $configServ->getConfiguracionPG($this->global->Estructura->idestructura, 1);
            $flag = $this->objectHelper->getBooleanStr($result[0]['contabilidad']);
            $operaciones = self::getOperacionesAux($flag, $parametros);
        }

        if (
            $parametros['operacionEspecifica'] && $parametros['operacionEspecifica'] == 17 && count($operaciones) == 0
        ) {
            /**
             *  Exepción lanzada para el caso de no encontrarse operaciones configuradas para el caso de una recepción
             *  de un traslado desde otra entidad
             */
            throw new ZendExt_Exception('LOG_AFT_DOC_007');
        }

        return $operaciones;
    }

    /**
     * @param $flag
     * @param $parametros
     *
     * @return array
     */
    public function getOperacionesAux($flag, $parametros)
    {
        if ($flag && $flag != 'false') {
            if ($this->configuracionHelper->subsistemaAperturado(
                    $this->global->Estructura->idestructura, $parametros['subsistema']//LogisticaGlobal::SUBSISTEMA_AFT
                ) == 0
            ) {
                // Estoy en carga inicial y solo debo cargar operacion apertura
                $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                    $parametros['operacionEspecifica'], false, 'OPER_APERTURA', false, $parametros['idestructura'],
                    $parametros['iddoc'], $parametros['idfuncionalidad']
                );
            } else {
                // No estoy en carga inicial y no se pueden cargar las aperturas
                $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                    $parametros['operacionEspecifica'], false, false, false, $parametros['idestructura'],
                    $parametros['iddoc'], $parametros['idfuncionalidad']
                );

                foreach ($operaciones as $pos => $oper) {
                    if ($oper['codigo'] == 'OPER_APERTURA') {
                        unset($operaciones[$pos]);
                        break;
                    }
                }
                $operaciones = array_values($operaciones);
            }
        } else {
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                $parametros['operacionEspecifica'], false, false, false, $parametros['idestructura'],
                $parametros['iddoc'], $parametros['idfuncionalidad']
            );
        }
        return $operaciones;
    }

    /**
     * @param $operaciones
     * @param $arrIdDocs
     * @param $parametros
     */
    public function auxGetTiposDocumentos($operaciones, &$arrIdDocs, $parametros)
    { 
       
        foreach ($operaciones as $operacion) {

            if ($operacion['codigo'] != 'OPER_DEPRECIACION' && (array_search($operacion['iddoc'], $arrIdDocs) === false)
            ) {
                if ($parametros['operacionesEntrada'] != -1) {
                    if ($operacion['tipo'] == 'entrada' && $operacion['autogenerada'] == '0') {
                        array_push($arrIdDocs, $operacion['iddoc']);
                    }
                } else {
                    self::auxGetTiposDocumentosDos($operacion, $arrIdDocs, $parametros);
                }
            }
        }        
    }

    /*     * *
     * @param $operacion
     * @param $arrIdDocs
     * @param $parametros
     */

    public function auxGetTiposDocumentosDos($operacion, &$arrIdDocs, $parametros)
    {
        if ($parametros['areaseleccionada'] == 'arearesp' && $operacion['codigo'] != 'OPER_INV_TOTAL') {
            array_push($arrIdDocs, $operacion['iddoc']);
        } else {
            if (($operacion['codigo'] == 'OPER_INV_TOTAL' || $operacion['codigo'] == 'OPER_INV_PARCIAL') && ($parametros['areaseleccionada'] == 'otra' || $parametros['areaseleccionada'] == 'entidad')
            ) {
                array_push($arrIdDocs, $operacion['iddoc']);
            }
        }
    }

    /**
     * @param $parametros
     *
     * @return array
     * @throws ZendExt_Exception
     */
    public function getTiposDocumentosPatrimonio($parametros)
    {
        $documentos = array();
        $arrIdDocs = array();
        $operaciones = $this->getOperaciones($parametros, true);
        self::auxGetTiposDocumentos($operaciones, $arrIdDocs, $parametros);        
        $arrTipoDocs = $this->configuracionHelper->documentosPorSubsistemaEntidad(
            $parametros['subsistema'], $parametros['idestructura'], array()
        );
        
        foreach ($arrIdDocs as $iddoc) {
            foreach ($arrTipoDocs as $docsSubSistema) {
                if ($docsSubSistema->iddoc == $iddoc) {
                    array_push($documentos, $docsSubSistema);
                }
            }
        }        
        return $documentos;
    }

}
