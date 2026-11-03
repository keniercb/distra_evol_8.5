<?php

/**
 *
 */
class DocEntregaTemporalModel extends DocumentoActivoModel
{
    protected $_arrOperaciones;
    protected $_mComunAFT;
    protected $_sConfGeneral;
    protected $_sRecHumanos;
    protected $_mProdLog;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
        $this->_arrOperaciones = array(
            'OPER_REC_ENTREG_TEMP'
        );
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_sRecHumanos = ServiciosRecursosHumanosHelper::__init();
    }

    /**
     * Método que crea un documento con los registros numéricos entregados temporalmente
     */
    public function getRegNumEntregados($parametros)
    {
        $sRegNumActivo = new RegNumActivoService();
        $mProdLog = new LogisticaProductoModel();
        $sRecHumanos = ServiciosRecursosHumanosHelper::__init();
        $mMaestroProd = new MaestroProductoModel();
        $mRegNumerico = new RegNumericoModel();
        $mRegNumActivo = new RegNumericoActivoModel();
        $arrIdesOperEntregaTemp = $this->_mComunAFT->getArrayIdOperacionesUtilizadas(
            false, false, 'OPER_ENTREG_TEMPORAL', false
        );
        $datos = array();
        $total = 0;

        if (is_array($arrIdesOperEntregaTemp) && count($arrIdesOperEntregaTemp) > 0) {

            // FROM
            // Registro numérico
            $query = $mRegNumerico->getQueryRegNumerico('rn', true);

            $query->addSelect('rn.idregnumerico');

            // Registro numérico activo
            $mRegNumActivo->addJoinModel($query, 'rn', 'ra', false);

            // Movimiento de registro numérico
            $mMovRegNum = new MovRegNumericoModel();
            $mMovRegNum->addJoinModelMy($query, 'rn', 'mrn', 1);

            $query->addSelect('mrn.idmovregnumerico');
            // Movimiento de registro numérico activo
            $sRegNumActivo->getJoinMovRegNumericoActivo($query, 'mra', 'mrn', true, false, false);

            // Responsable del medio - relación con persona
            $query->innerJoin('mra.DatResponsable dr');
            $sRecHumanos->agregarDqlDatosPersona($query, 'dr', 'dper', true, '', true);

            // Movimiento
            $query->innerJoin('mrn.DatMovimientos m');

            // Documento
            $query->innerJoin('m.DatDocumento d');
            $query->addSelect(
                'd.iddocumento AS iddocumento, d.nrodoc AS nrodoc,
                 d.idestructuracomun AS idestructuracomun, d.iddoc AS iddoc'
            );

            // Operación del documento
            $query = $this->_sConfGeneral->addQueryJoinOperacion($query, 'd', 'op', true);
            $this->_sConfGeneral->addQuerySelectOperacion($query, 'op');

            // Relación con el producto
            $mProdLog->getJoinDatProducto($query, 'rn', 'p');

            // Relación con nomenclador de producto
            $mMaestroProd->addQueryNomIndicador($query, 'p', 'i', 'ih', $parametros, false, 2, false);

            // Relación con marcas y modelos
            $mMaestroProd->addQueryJoinMarcaModelo($query, 'ih', 'ma', 'mo', true, true);

            // WHERE
            $parametros['idestructura'] = $parametros['idarearesp'];

            $mProdLog->addFiltersQueryDatProducto($query, 'p', $parametros, true);

            $query->whereIn('op.codigooperacion', array('OPER_ENTREG_TEMPORAL', 'OPER_REC_ENTREG_TEMP'));
            $query->addWhere('d.estado = ?', array(3));
            $query->orderBy('d.cronologia DESC');

            if ($parametros['nodocumento']) {
                $query->addWhere('d.nrodoc = ?', array($parametros['nodocumento']));
            }

            if ($parametros['registro']) {
                $query->addWhere("rn.nroserie iLike '%{$parametros['registro']}%");
            }

            if ($parametros['matricula']) {
                $query->addWhere("rt.nromatricula iLike '%{$parametros['matricula']}%");
            }

            if ($parametros['marca']) {
                $query->addWhere("ma.idmarca = ?", array($parametros['marca']));
            }

            if ($parametros['modelo']) {
                $query->addWhere("mo.idmodelo = ?", array($parametros['modelo']));
            }

            $total = $query->count();

            if ($parametros['limit']) {

                $this->_mComunAFT->configStartAndLimitInParams($parametros, $parametros['start'], $parametros['limit']);
                $query->offset($parametros['start'])->limit($parametros['limit']);
            }

            $datos = $query->fetchArray();
        }

        return array('datos' => $datos, 'total' => $total);
    }

    public function addDocDeEntregaTemporal($parametros)
    {
        /*if($parametros['revaluado']){
            $revaluado = $parametros['revaluado'];
        }
        ini_set('memory_limit', '2048M');
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $sRegNumActivo = new RegNumActivoService();

        $sRegNumActivo->initReNumActivoModel();
        $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();

        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, $parametros['codigooperacion'], false, $parametros['idestructuraEntidad']
        );
        if (count($operaciones) == 0) {
            throw new Exception('LOG_AFT_DOC_008');
        } else {
            $parametros['idoperacion'] = $operaciones[0]['idoperacion'];

            $doc = $this->_sConfGeneral->obtenerOperaciones(null, null, null, $parametros['idoperacion']);
            $parametros['iddoc'] = $doc[0]['iddocentidad'];
            $valores = array();
            $cEstructura = 'Estructura';
            $identidad = ($parametros['idestructuraEntidad']) ? $parametros['idestructuraEntidad'] : 
                ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
            $ultimoNroDoc = new DocumentoActivoModel();
            $parametros['nrodoc'] = $ultimoNroDoc->devolverUltimoNumeroDoc($parametros['iddoc'], $identidad) + 1;
            foreach ($parametros['datos'] as $key => $value) {
                $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                $datos = $objDatRegnumericoActivo->toArray();
                foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                    $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin($value->idregnumerico);
                    $datos = array_merge($datos, $objDatRegnumericoActivoTransp->toArray());
                }
                
                $valores[$key] = $datos;
                $datDocumento = $this->adicionarDocumento($parametros);
                //$datDocumento->$cDatDocumentoActivo->synchronizeWithArray($parametros);
                //print_r($datDocumento->toArray());die;
                $datDocumento->{get_class($this->_oDatDocumento)}->synchronizeWithArray($parametros);
               
                if ($parametros['datos']) {
                    $parametros = $parametros['datos'];
                    $valores = array();                   
                    foreach ($parametros as $key => $value) {

                        $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find(
                            $value->idregnumerico
                        );                       
                        if($value->importereevaluado && $value->depreciacionreevaluado){
                           $objDatRegnumericoActivo->valorcontable = $value->importereevaluado;
                           $objDatRegnumericoActivo->valorcontablealternativo = 0;
                           $objDatRegnumericoActivo->depreciacionacumulada = $value->depreciacionreevaluado;                           
                           $objDatRegnumericoActivo->depreciacionacumuladaalternativo = 0;
                        }                       
                        $datos = $objDatRegnumericoActivo->toArray();
                        foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                            $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin(
                                $value->idregnumerico
                            );
                            $datos = array_merge(
                                $objDatRegnumericoActivo->toArray(), $objDatRegnumericoActivoTransp->toArray()
                            );
                        }

                        $datos['idprod'] = $value->idprod;
                        $valores[$key] = $datos;
                    }
                }
                new DatMovRegnumerico();
                new DatMovRegnumericoActivo();
                $datDocumento = $this->_sMovimiento->crearMovimiento($valores, $datDocumento); 
                
                if($revaluado){
                  //  $datDocumento->estado = 3;
                }
                $datDocumento->save();
                $datos = $this->setDatosInterfazRegNumerico($datDocumento);
                $datos['iddocumento'] = $datDocumento['iddocumento'];
                return $datos;
            }
        }*/


        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $sRegNumActivo = new RegNumActivoService();
        $sRegNumActivo->initReNumActivoModel();
        $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();
        $sMovimiento = new MovimientoService();

        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, $parametros['codigooperacion'], false, $parametros['idestructuraEntidad']
        );
        
        if (count($operaciones) == 0) {
            throw new Exception('LOG_AFT_DOC_008');
        } else {
            $parametros['idoperacion'] = $operaciones[0]['idoperacion'];

            // fixme ** Poner este servicio en las cosas del helper
            $documento = $this->_sConfGeneral->obtenerOperaciones(null, null, null, $parametros['idoperacion']);
            $parametros['iddoc'] = $documento[0]['iddocentidad'];
            $valores = array();

            foreach ($parametros['datosEntregTemp'] as $key => $value) {

                $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                
                

                foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                    $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin($value->idregnumerico);
                }
				if($objDatRegnumericoActivoTransp){
					$datos = array_merge($objDatRegnumericoActivo->toArray(), $objDatRegnumericoActivoTransp->toArray());
				}else{
					$datos = $objDatRegnumericoActivo->toArray();
				}
                
                $valores[$key] = $datos;
                $value->idoperacion = $parametros['idoperacion'];
                $value->iddoc = $parametros['iddoc'];
                $datDocumento = $this->adicionarDocumento((array)$value);


                $datDocumento->$cDatDocumentoActivo->synchronizeWithArray($parametros);
                if ($parametros['datosEntregTemp']) {
                    $parametros = $parametros['datosEntregTemp'];

                    $valores = array();
                    foreach ($parametros as $key => $value) {

                        $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find(
                            $value->idregnumerico
                        );
                        $objRn = Doctrine::getTable('DatRegnumerico')->find($value->idregnumerico);
                        $objRn->enproceso = 1;
                        $objRn->save();

                        foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                            $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin(
                                $value->idregnumerico
                            );
                        }
                        if($objDatRegnumericoActivoTransp){
							$datos = array_merge(
								$objDatRegnumericoActivo->toArray(), $objDatRegnumericoActivoTransp->toArray()
							);	
						}else{
							$datos = $objDatRegnumericoActivo->toArray();
						}
						
                        $datos['idprod'] = $value->idprod;
                        $valores[$key] = $datos;
                    }
                }

                new DatMovRegnumerico();
                new DatMovRegnumericoActivo();
                $datDocumento = $sMovimiento->crearMovimiento($valores, $datDocumento);
                //print_r($datDocumento->toArray());
                //die;
                $datDocumento->save();
                return $this->setDatosInterfazRegNumerico($datDocumento);
            }
        }
    }

    public function getEntregadoTemporal($param)
    {
        $this->_arrOperaciones = array('OPER_ALQUILER', 'OPER_ENTREG_TEMPORAL', 'OPER_PRESTAMO', 'OPER_USUFRUCTO',
            'OPER_ARRENDAMIENTO');
        $regNumServiceAFT = new RegNumActivoService();
        ini_set('memory_limit', '2048M');

       /* $datos['datos'] = $regNumServiceAFT->getRegNumEntregadosReparacion(
            $param, $this->_arrOperaciones, array(4, 2), 'entregadostemp'
        );  */
        $datos['datos'] = $regNumServiceAFT->getRegNumPorEstadoOperacion($param, array(2, 3, 4));
        $cEstructura = 'Estructura';
        $identidad = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;

        foreach ($datos['datos'] as $i => $arrayDat) {
            $operacionesSubsistema = $this->_sConfGeneral->obtenerOperaciones(
                $identidad, $this->idsubsistema, $arrayDat['iddocumento'], $arrayDat['idoperacion']
            );
            $datos['datos'][$i]['denomOperacion'] = $operacionesSubsistema[0]['denominacion'];
            $datos['datos'][$i]['codigooperacion'] = $operacionesSubsistema[0]['codigooperacion'];
            if ($datos['datos'][$i]['denomconfmedio'] && $datos['datos'][$i][$datos['datos'][$i]['identificador']]) {
                $datos['datos'][$i]['denomidmedio'] = $datos['datos'][$i]['denomconfmedio'].': '.
                    $datos['datos'][$i][$datos['datos'][$i]['identificador']];
            }
        }
        return $datos;
    }

}
