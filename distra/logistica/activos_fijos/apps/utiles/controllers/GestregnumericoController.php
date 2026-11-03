<?php

/**
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 *
 */
class GestregnumericoController extends BaseController
{

    private $mComunAFT;
    private $mRegNumActivo;
    private $movRegNumActivo;
    private $sConfigActivos;
    private $_mMProducto;

    function init()
    {
        parent:: init();
        $this->sConfigActivos = new ConfiguracionActivosService();
        $this->mComunAFT = ComunAFTModel::getInstance();
        $this->mRegNumActivo = new RegNumericoActivoModel();
        $this->movRegNumActivo = new MovRegNumericoModel();
        $this->_mMProducto = new MaestroProductoModel();
        $this->mRegNumActivo->loadPluginsFromFile('listaplugins')->buildRelations();
        $this->movRegNumActivo->loadPluginsFromFile('listaplugins')->buildRelations();
    }

    public function gestregnumericoAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    /**
     * Función que carga los datos necesarios para abrir el componente Registro Numérico
     *
     * @return array Columnas que se van a mostrar
     */
    public function cargardatosgeneralesAction()
    {
        if ($this->uiParams['idtipomedio'] != 0) {
            try {
                $mRegNumericoView = new RegNumericoViewModel();

                $idnaturaleza = $this->uiParams['idtipomedio'];
                $estructura = 'Estructura';
                $idestruc = $this->global->$estructura->idestructura;

                $identidad = ($this->uiParams['idestructurapadre']) ? $this->uiParams['idestructurapadre'] : $idestruc;
                if ($idnaturaleza != null) {
                    $confTipomedio = new ConfiguracionActivosService($this->uiParams["tipo"]);
                    if ($idnaturaleza != -5) {
                      $usedep = true;
                    } else {
                      $usedep = false;
                    }
                    $columnasMostrar = $confTipomedio->getConfDatPorNaturaleza($idnaturaleza, $identidad, $usedep);
                }

                $datos_oper = $this->mComunAFT->getDatosInterfazByIdOperacion($this->uiParams['idoperacion']);

                
                //  Devuelve cuales columnas de las que se muestran son editables y cuales no.
                $columnas = $mRegNumericoView->getColumnasEditables($datos_oper, $columnasMostrar);

                $columnas = $mRegNumericoView->editColumnsByOper($datos_oper, $columnas);

                $this->objectHelper->synchronize($this, $columnas);
            } catch (Excepcion $e) {
                $this->codMsg = 3;
                $this->msg = $e->getMessage();
            }
        } else {
            die('Debe pasar el idtipomedio para poder cargar las columnas');
        }
    }


    /**
     * Borrar parámetros que estan vacíos
     *
     * @param $datos
     *
     * @return void
     */
    private function validarDatosGuardarEntrada(&$datos)
    {
        foreach ($datos->activos as $valueAux) {
            if (strlen($valueAux->fechaadq) <= 0) {
                unset($valueAux->fechaadq);
            }
            if (strlen($valueAux->fechaexpini) <= 0) {
                unset($valueAux->fechaexpini);
            }
            if (strlen($valueAux->fechaexpfin) <= 0) {
                unset($valueAux->fechaexpfin);
            }
            if (strlen($valueAux->garantia) <= 0) {
                unset($valueAux->garantia);
            }
            if (!is_numeric($valueAux->capacidad)) {
                unset($valueAux->capacidad);
            }
        }
    }

    /**
     * Guardar los registros numéricos desde un proceso de entrada de medios
     *
     * @return array
     */
    public function guardarserieentradaAction()
    {
        /*try{*/
            $datosSerie = new stdClass();
            $datosSerie->activos = json_decode($this->uiParams['datos']);
            if ($this->uiParams['inventario']) {
                $datos = $this->mRegNumActivo->guardarRegNumericoActivoInventario($datosSerie);
            } else {     
                $this->validarDatosGuardarEntrada($datosSerie);
                if (count($datosSerie->activos)) {
                    $idmov = $datosSerie->activos[0]->idmovimiento;
                    $mov = Doctrine::getTable('DatMovimientos')->find($idmov);
                    $idoperacion = $mov->DatDocumento->idoperacion;
                    $datos_oper = $this->mComunAFT->getDatosInterfazByIdOperacion($idoperacion);
                }

                if($datosSerie->activos[0]->diferenciavalor){
					$operCond = $datos_oper['codigo'] == 'OPER_MOD_VALOR_DIS' 
									|| $datos_oper['codigo'] == 'OPER_MOD_VALOR'
									|| $datos_oper['codigo'] == 'OPER_MOD_VALOR_DIS_UH' 
									|| $datos_oper['codigo'] == 'OPER_MOD_VALOR_UH';
					
                    for($i = 0; $i < count($datosSerie->activos); $i++){
						
						if($datosSerie->activos[$i]->diferenciavalor && $datosSerie->activos[$i]->diferenciavalor < 0 && $operCond){
                            $datosSerie->activos[$i]->diferenciavalor = $datosSerie->activos[$i]->diferenciavalor *-1;
                        }
                        if($datosSerie->activos[$i]->diferenciavaloralternativo && $datosSerie->activos[$i]->diferenciavaloralternativo < 0 && $operCond){
							$datosSerie->activos[$i]->diferenciavaloralternativo = $datosSerie->activos[$i]->diferenciavaloralternativo *-1;
                        }

                        if($datosSerie->activos[$i]->diferenciadepreciacion && $datosSerie->activos[$i]->diferenciadepreciacion < 0 && $operCond){
							$datosSerie->activos[$i]->diferenciadepreciacion = $datosSerie->activos[$i]->diferenciadepreciacion *-1;
                        }

                        if($datosSerie->activos[$i]->diferenciadepreciacionalternativo && $datosSerie->activos[$i]->diferenciadepreciacionalternativo < 0 && $operCond){
							$datosSerie->activos[$i]->diferenciadepreciacionalternativo = $datosSerie->activos[$i]->diferenciadepreciacionalternativo *-1;
                        }
						
                        /*if($datosSerie->activos[$i]->diferenciavalor){
                            if($datosSerie->activos[$i]->diferenciavalor < 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR'){
                                    $datosSerie->activos[$i]->diferenciavalor = $datosSerie->activos[$i]->diferenciavalor *-1;
                                }
                            }
                            if($datosSerie->activos[$i]->diferenciavalor > 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR_DIS'){
                                    $datosSerie->activos[$i]->diferenciavalor = $datosSerie->activos[$i]->diferenciavalor *-1;
                                }
                            }
                        }

                        if($datosSerie->activos[$i]->diferenciavaloralternativo){
                            if($datosSerie->activos[$i]->diferenciavaloralternativo < 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR'){
                                    $datosSerie->activos[$i]->diferenciavaloralternativo = $datosSerie->activos[$i]->diferenciavaloralternativo *-1;
                                }
                            }
                            if($datosSerie->activos[$i]->diferenciavaloralternativo > 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR_DIS'){
                                    $datosSerie->activos[$i]->diferenciavaloralternativo = $datosSerie->activos[$i]->diferenciavaloralternativo *-1;
                                }
                            }
                        }

                        if($datosSerie->activos[$i]->diferenciadepreciacion){
                            if($datosSerie->activos[$i]->diferenciadepreciacion < 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR'){
                                    $datosSerie->activos[$i]->diferenciadepreciacion = $datosSerie->activos[$i]->diferenciadepreciacion *-1;
                                }
                            }
                            if($datosSerie->activos[$i]->diferenciadepreciacion > 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR_DIS'){
                                    $datosSerie->activos[$i]->diferenciadepreciacion = $datosSerie->activos[$i]->diferenciadepreciacion *-1;
                                }
                            }
                        }

                        if($datosSerie->activos[$i]->diferenciadepreciacionalternativo){
                            if($datosSerie->activos[$i]->diferenciadepreciacionalternativo < 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR'){
                                    $datosSerie->activos[$i]->diferenciadepreciacionalternativo = $datosSerie->activos[$i]->diferenciadepreciacionalternativo *-1;
                                }
                            }
                            if($datosSerie->activos[$i]->diferenciadepreciacionalternativo > 0){
                                if($datos_oper['codigo'] == 'OPER_MOD_VALOR_DIS'){
                                    $datosSerie->activos[$i]->diferenciadepreciacionalternativo = $datosSerie->activos[$i]->diferenciadepreciacionalternativo *-1;
                                }
                            }
                        }*/

                    }
                }
                $datos = $this->movRegNumActivo->salvarMovActivosEntrada($datosSerie, $datos_oper);
            }

            if ($datos['fail']) {
                $this->failure = true;
                $this->repetidos = $datos['fail'];
            } else {
                if ($datos == 2) {
                    $this->success = true;
                } else {
                    $this->failure = true;
                    $this->success = false;
                    $this->datos = $datos;
                }
            }
        /*}catch(Exception $exc){
            //print_r($exc->getMessage());die;
        }*/
    }

    /**
     * Cargar todos los registros numéricos de un movimiento
     *
     * @return array
     */
    public function cargarseriesdemovimientoAction()
    {   
      $parametros = (array) json_decode(stripslashes($this->uiParams['parametros']));
        $datosBsusqueda = (array) json_decode(stripslashes($this->uiParams['datas']));
        $parametrosOT = $this->uiParams;
        unset($parametrosOT['parametros']);
        unset($parametrosOT['datas']);

        $parametros = array_merge($parametros, $parametrosOT);
        $parametros = array_merge($parametros, $datosBsusqueda);

        if ($this->uiParams['tipo_interfaz']) {
            $parametros['tipo_interfaz'] = $this->uiParams['tipo_interfaz'];
        }

        $this->mComunAFT->configStartAndLimitInParams(
            $parametros, $parametros['start'], $parametros['limit']
        );

        if ($parametros['inventario'] && !$parametros['seriesdisponibles']) {
            $respuesta = $this->mRegNumActivo->getMediosDisponibles($parametros);
        } else {

            $resultado = $this->mRegNumActivo->cargarMovimientosActivos($parametros);
         
            $cfg = $this->sConfigActivos->getConfiguracionPG($parametros['idestructurapadre'], $this->uiParams['tipo']);
            //$resultado['query']->
            //$datRegNumAct = new DatRegnumericoActivo();
             $relations[] = array(
                 'cardinalidad' => 'one', 'relation' => 'NomGruposubgrupo',
                 'properties' => array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo')
             );
             $relations[] = array(
                 'cardinalidad' => 'one', 'relation' => 'NomNaturaleza',
                 'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza')
             ); 
            
             $this->doctrineHelper->tryInyectRelactions(new DatRegnumericoActivo, $relations);

            $this->_mMProducto->addQueryNomIndicador($resultado['query'], 'p', 'inn', 'innh', false, 'ngs');
            // $this->_mMProducto->addQueryJoinIndicadorHoja($resultado['query'], 'inn', 'innh', 1);

            $resultado['query']->leftJoin('rn.DatRegnumericoActivo rna')
              ->leftJoin('rna.NomNaturaleza n')
              ->leftJoin('inn.NomNaturaleza nn')
              ->leftJoin('rna.NomGruposubgrupo ngsg')
              ->leftJoin('rn.DatRegnumericoActivo drna')
              /*->addSelect('COALESCE(n.denominacion,nn.denominacion) as naturaleza,COALESCE(n.idnaturaleza,inn.idnaturaleza) as idnaturaleza, COALESCE(rna.idgruposubgrupo,innh.idgruposubgrupo) as idgruposubgrupo,COALESCE(ngsg.denominacion,ngs.denominacion) as gruposubgrupo,
              COALESCE(rna.denominacion,inn.denominacion) as denominacion,drna.actividad,drna.colorprim,drna.colorsec,drna.denomestadotecnico, drna.vidautil, drna.tasafiscal, drna.porcientorecuperacion, drna.categoria, drna.denomarearesp, drna.fechaexpini')*/;

            if ($parametros['codigooperacion'] == 'OPER_MOD_PROPIEDAD') {
                $relations[] = array(
                    'cardinalidad' => 'one', 'relation' => 'NomGruposubgrupo',
                    'properties' => array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo')
                );
                $relations[] = array(
                    'cardinalidad' => 'one', 'relation' => 'NomNaturaleza',
                    'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza')
                );

                $this->doctrineHelper->tryInyectRelactions(new DatMovRegnumericoActivo, $relations);

                $resultado['query']->leftJoin('mrna.NomNaturaleza nmrna')
                    ->leftJoin('mrna.NomGruposubgrupo ngsgma')
                    ->addSelect('COALESCE(COALESCE(nmrna.denominacion,n.denominacion),nn.denominacion) as naturaleza,COALESCE(COALESCE(nmrna.idnaturaleza,n.idnaturaleza),inn.idnaturaleza) as idnaturaleza, 
                    COALESCE(COALESCE(mrna.idgruposubgrupo,rna.idgruposubgrupo),innh.idgruposubgrupo) as idgruposubgrupo,COALESCE(COALESCE(ngsgma.denominacion,ngsg.denominacion),ngs.denominacion) as gruposubgrupo, 
                    COALESCE(rna.denominacion,inn.denominacion) as denominacion,drna.actividad,drna.colorprim,drna.colorsec,drna.denomestadotecnico, 
                    drna.vidautil, drna.tasafiscal, drna.porcientorecuperacion, drna.categoria, drna.denomarearesp, drna.fechaexpini');

            } else {
                $resultado['query']->addSelect('COALESCE(n.denominacion,nn.denominacion) as naturaleza,COALESCE(n.idnaturaleza,inn.idnaturaleza) as idnaturaleza, COALESCE(rna.idgruposubgrupo,innh.idgruposubgrupo) as idgruposubgrupo,COALESCE(ngsg.denominacion,ngs.denominacion) as gruposubgrupo, 
              COALESCE(rna.denominacion,inn.denominacion) as denominacion,drna.actividad,drna.colorprim,drna.colorsec,drna.denomestadotecnico, drna.vidautil, drna.tasafiscal, drna.porcientorecuperacion, drna.categoria, drna.denomarearesp, drna.fechaexpini');
            }
            
            $data = $resultado['query']->fetchArray();
            foreach ($data as $key => $rn) {
                if ($data[$key]['nroinventario'] != "") {
                   // $data[$key]['nroinventario'] = $cfg[0]['prefijo'] .'-'. $data[$key]['nroinventario'];
                }
             //   $data[$key]['nrochasis'] = $data[$key]['nrochasis'];
                $data[$key]['tipocombustible'] = $data[$key]['denomtipocombustible'];
                $data[$key]['colorprim'] = $data[$key]['DatRegnumericoActivo']['colorprim'];
                $data[$key]['actividad'] = $data[$key]['DatRegnumericoActivo']['actividad'];
                $data[$key]['colorsec'] = $data[$key]['DatRegnumericoActivo']['colorsec'];
                // $data[$key]['denomestadotecnico'] = $data[$key]['DatRegnumericoActivo']['denomestadotecnico'];
                $data[$key]['vidautil'] = $data[$key]['DatRegnumericoActivo']['vidautil'];
                $data[$key]['tasafiscal'] = $data[$key]['DatRegnumericoActivo']['tasafiscal'];
                $data[$key]['porcientorecuperacion'] = $data[$key]['DatRegnumericoActivo']['porcientorecuperacion'];
                $data[$key]['categoria'] = $data[$key]['DatRegnumericoActivo']['categoria'];
                $data[$key]['denomarearesp'] = $data[$key]['DatRegnumericoActivo']['denomarearesp'];
                //se redefine el idresponsable que en realidad es el id persona
                // $data[$key]['idresponsable'] = $data[$key]['idpersona'];
                // if($rn['vidautil'] && $rn['fechaexpini']){
                //     $dateInicial = split('/', $rn['fechaexpini']); 
                //     $anno = $dateInicial[2]+$rn['vidautil'];                   
                //     $data[$key]['fechaexpfin'] = $dateInicial[0].'/'.$dateInicial[1].'/'.$anno;
                // }
                // if($rn['vidautil'] && $rn['fechaexpfin']){
                //     $dateFinal = split('/', $rn['fechaexpfin']); 
                //     $anno = $dateFinal[2]-$rn['vidautil'];
                //     $data[$key]['fechaexpini'] = $dateInicial[0].'/'.$dateInicial[1].'/'.$anno;
                // }
                
            }
            
            $respuesta = array('datos' => $data,
                'total' => $resultado['query']->count(),
                'idregnumericos' => $resultado['idregnumericos']);
        }

        if ($parametros['inventario']) {
            foreach ($respuesta['datos'] as &$resp) {
                // if ($parametros['first']) {
                //     if (array_search($resp['idregnumerico'], $parametros['negros']) !== false
                //     ) {
                //         $resp['color'] = 'negro';
                //     } else {
                //         if (array_search($resp['idregnumerico'], $parametros['rojos']) !== false
                //         ) {
                //             $resp['color'] = 'rojo';
                //         }
                //     }
                // }
                if(!$resp['color']){
                    $resp['color'] = -1;
                }
            }
        }

        $this->objectHelper->synchronize($this, $respuesta);
    }

    /**
     * Cargar todos los registros numéricos disponibles para usar en un movimiento
     *
     * @return array
     */
    public function cargarseriesdisponiblesAction()
    {
        $parametrosParam = array();
        if ($this->uiParams['parametros']) {
            $parametrosParam = (array) json_decode(stripslashes($this->uiParams['parametros']));
        }

        $parametros = $this->uiParams;
        unset($parametros['parametros']);
        unset($parametros['id']);

        $this->mComunAFT->configStartAndLimitInParams($parametros, $this->uiParams['start'], $this->uiParams['limit']);

        $parametros['idsRegNumNoMostrar'] = json_decode(stripslashes($this->uiParams['idregnumericos_quitar']));
        $parametros = array_merge($parametros, (array) $parametrosParam);


        /*
         * Esto desaparece con el idestadooperacion
          //  Estatus técnicos de los medios, configurados para la operación
          $parametros['estados'] = 
         * $this->sConfigActivos->getIdsEstadosInicialesPorOperacion($parametros['idoperacion']);
         * 

          if (count($parametros['estados'])) {
          $this->objectHelper->synchronize($this, $this->mRegNumActivo->getMediosDisponibles($parametros));

          } else {
          $this->datos = array();
          $this->total = 0;
          }
         */
        /*$this->mRegNumActivo->getMediosDisponibles($parametros)*/
        
        $this->objectHelper->synchronize($this, $this->mRegNumActivo->getCargarSerieDisponible($parametros));
    }

    /**
     * Eliminar registros numéricos de un movimiento de entrada
     *
     * @return bool
     */
    public function eliminarserieentradaAction()
    {
        try {
            $parametros = $this->uiParams;
            $parametros['movimientos'] = (array) json_decode(stripslashes($this->uiParams['movimientos']));
            $this->mRegNumActivo->eliminarNroSerieEntrada($parametros);
            $this->success = true;
        } catch (Exception $e) {
            $this->failure = true;
            $this->msg = $e->getMessage();
        }
    }

    /**
     * Cargar los datos auxiliares para llenar los combos de los atributos a registrar a los registros numÃ©ricos
     * de un movimiento
     *
     * @return array
     */
    public function cargarcombogrideditableAction()
    {
        try {
            $tipoCombo = $this->uiParams['tipocombo'];

            $nombreId = ($this->uiParams['nombreid']) ? $this->uiParams['nombreid'] : 'id';
            $nombreDenominacion = ($this->uiParams['nombredenominacion']) ? 
                $this->uiParams['nombredenominacion'] : 'denominacion';

            $nombreInfo = ($this->uiParams['info']) ? $this->uiParams['info'] : 'info';
            $parametros = json_decode(stripslashes($this->uiParams['parametros']));

            $mRegNumericoView = new RegNumericoViewModel();
            $this->datos = $mRegNumericoView->cargarCombo(
                $tipoCombo, $nombreId, $nombreDenominacion, $nombreInfo, $parametros
            );
        } catch (Exception $e) {
            $this->failure = true;
            $this->msg = $e->getMessage();
        }
    }

    /**
     *
     */
    private function actualizarCantMovimiento($idMovimiento, $cantidad, $operacion = '-')
    {
        $movimiento = Doctrine::getTable('DatMovimientos')->find($idMovimiento);
        $movimiento->cantidad = "{$movimiento->cantidad} $operacion $cantidad";
        $movimiento->save();
    }

    /**
     *
     */
    public function getTreeTipoMedioDepreciarAction()
    {
        $arrIdesRegNum = json_decode(stripslashes($this->uiParams['idregnum']));
        $noDepreciados = json_decode(stripslashes($this->uiParams['nodepreciados']));

        if ($this->uiParams['action'] == "true") {
            $this->mRegNumActivo->getDepreciarMedios($noDepreciados, true);
        }

        $respuesta = $this->mRegNumActivo->getHacerMovDeRegNumDepreciados(
            $arrIdesRegNum, $this->uiParams['iddocumento']
        );

        $this->actualizarCantMovimiento($this->uiParams['idmovimiento'], count($arrIdesRegNum));
        $this->objectHelper->synchronize($this, $respuesta);
    }

    /**
     *
     */
    public function getTrasladarRegNumInmueblesAction()
    {
        $arrIdesRegNumTraslado = json_decode(stripslashes($this->uiParams['idregnumTraslado']));

        $parametros['idestructuracomunop'] = $this->uiParams['idestructura'];

        $this->mComunAFT->configStartAndLimitInParams(
            $parametros, $this->_request->getPost('start'), $this->_request->getPost('limit')
        );

        $parametros['modulo'] = true;

        //  Para saber si hay algún medio que ya deprecio. 
        $arrRegNumDepreciados = $this->mRegNumActivo->getBuscarRegNumDepreciado(
            $arrIdesRegNumTraslado, $this->uiParams['idestructurapadre'], true
        );

        $cantidad = 0;
        foreach ($arrRegNumDepreciados as $key => $depreciados) {
            if ($depreciados['esta'] == "negro") {
                $noDeprecio[$cantidad] = $depreciados['idregnumerico'];
                $cantidad++;
            }
            $arrIdesRegNumDepreciados[$key] = $depreciados['idregnumerico'];
        }

        $this->mRegNumActivo->getTrasladarIdRegNum($arrIdesRegNumTraslado, $parametros);

        if ($cantidad) {

            $this->failure = true;
            $this->nodepreciados = true;
            $this->arraytotal = $arrIdesRegNumDepreciados;
            $this->nodepreciosarray = $noDeprecio;
        } else {

            $this->mRegNumActivo->getHacerMovDeRegNumDepreciados(
                $arrIdesRegNumTraslado, $this->uiParams['iddocumento']
            );

            $this->actualizarCantMovimiento($this->uiParams['idmovimiento'], count($arrIdesRegNumTraslado));

            $this->failure = true;
            $this->nodepreciados = false;
        }
    }

    /**
     *
     */
    public function adicionarseriesnoentradaNoDepreciadosAction()
    {
        $this->uiParams['depreciacion'] = true;
        self::adicionarseriesnoentradaAction();
    }

    /**
     *
     */
    public function getCargarTreeGridInmueblesAction()
    {
        $parametros = array();
        $parametros['modulo'] = true;
        $parametros['_id'] = $this->uiParams['anode'];
        $parametros['anode'] = $this->uiParams['anode'];

        $this->mComunAFT->configStartAndLimitInParams(
            $parametros, $this->uiParams['start'], $this->uiParams['limit']
        );

        if (!empty($this->uiParams['idestructuracomunop'])) {
            $parametros['idestructuraop'] = $this->uiParams['idestructuracomunop'];
        }

        if (!empty($parametros['_id'])) {
            $parametros['asignado'] = 2;
        } else {
            $parametros['arrayidregNum'] = json_decode(stripslashes($this->uiParams['arrayidregNum']));
        }

        $this->objectHelper->synchronize($this, $this->mRegNumActivo->getMediosDisponibles($parametros));
    }

    /**
     *
     */
    public function adicionarseriesnoentradaAction()
    {
        $datosSerie = (array) json_decode(stripslashes($this->uiParams['parametros']));
        $arrModulos = array();
        $arrIdesRegNum = array();
        if (!$this->uiParams['depreciacion']) {
            foreach ($datosSerie as $index => $regNumerico) {
                array_push($arrIdesRegNum, $regNumerico->idregnumerico);
            }
            if (class_exists('RegNumericoModuloModel')) {
                $mModuloRegNum = new RegNumericoModuloModel();
                $arrModulos = $mModuloRegNum->getSonModulos($arrIdesRegNum[0], $datosSerie[0]->idarearesp, false);
            }
        }

        if (count($arrModulos) > 0) {
            $this->idregNum = $arrModulos;
            $this->idregnuminicialNum = $arrIdesRegNum;
        } else {

            $arrIdesMovRegNum = $this->mRegNumActivo->adicionarRegNumericoActivoNoEntrada(
                $datosSerie, $this->uiParams['idoperacion'], $this->uiParams['idestructura']
            );
            if ($arrIdesMovRegNum && /*!$arrIdesMovRegNum['codigo'] && */count($arrIdesMovRegNum) > 0) {
                $this->datos = $arrIdesMovRegNum;
            } else {
                $this->failure = true;
                if ($arrIdesMovRegNum['codigo'] && $arrIdesMovRegNum['codigo'] == 1) {
                    $this->codigo = '001';
                }
            }
        }
    }

    /**
     *
     */
    public function depreciarmedioAction()
    {
        $params = json_decode($this->uiParams['params']);
        $arrIdesRegNumericos = json_decode($this->uiParams['idregnum']);

        $parametros = array();

        if ($arrIdesRegNumericos) {
            for ($i = 0; $i < count($arrIdesRegNumericos); $i++) {
                for ($j = 0; $j < count($params); $j++) {
                    if ($arrIdesRegNumericos[$i]->esta == "negro" && 
                        $arrIdesRegNumericos[$i]->idregnumerico == $params[$j]->idregnumerico
                    ) {
                        array_push($parametros, $params[$j]->idregnumerico);
                    }
                }
            }
        } else {
            for ($j = 0; $j < count($params); $j++) {
                array_push($parametros, $params[$j]->idregnumerico);
            }
        }

        $this->mRegNumActivo->getDepreciarMedios($parametros);

        $arrIdesMovRegNum = $this->mRegNumActivo->adicionarRegNumericoActivoNoEntrada(
            $params, $this->uiParams['idoperacion'], $this->uiParams['idestructura']
        );

        if ($arrIdesMovRegNum && !$arrIdesMovRegNum['codigo'] && count($arrIdesMovRegNum) > 0) {
            $this->objectHelper->synchronize($this, $arrIdesMovRegNum);
        } else {
            $this->failure = true;
            if ($arrIdesMovRegNum['codigo'] && $arrIdesMovRegNum['codigo'] == 1) {
                $this->codigo = '001';
            }
        }
    }

    /**
     *
     */
    public function getultimoidmovAction()
    {
        $rnService = new RegNumericoService();
        $respuesta = $rnService->getUltimoIdMovRegNumerico($this->uiParams['idregnumerico']);

        $this->objectHelper->synchronize($this, array('idmovregnumerico' => $respuesta[0]));
    }

    /**
     *
     */
    public function gestconteoinventariototalAction()
    {
        $datos = json_decode($this->uiParams['datos']);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    /**
     *
     */
    public function getmarcasAction()
    {
        $this->objectHelper->synchronize($this, $this->mRegNumActivo->getMarcas($this->uiParams));
    }

    /**
     *
     */
    public function getmodelosAction()
    {
        $this->objectHelper->synchronize($this, $this->mRegNumActivo->getModelos($this->uiParams));
    }

    /**
     *
     */
    public function getcolorprimarioAction()
    {
        $this->datos = NomencladoresActivosService::getColoresHabilitadosEntidad($this->uiParams['idestructura']);
    }

    /**
     * Para el sistema de Talleres
     */
    public function getcargarregnummediosAction()
    {
        $this->uiParams['arrRNnomostrar'] = json_decode(stripcslashes($this->uiParams['arrRNnomostrar']));
        $this->objectHelper->synchronize($this, $this->mRegNumActivo->cargarGridCentral($this->uiParams));
    }

    /**
     * Para el sistema de Talleres
     */
    public function getCargarEnviadosATallerAction()
    {  
        $this->uiParams['arrRNnomostrar'] = json_decode(stripcslashes($this->uiParams['arrRNnomostrar']));

        if ($this->uiParams['criterio']) {
            if (is_numeric($this->uiParams['criterio'])) {
                $this->uiParams['codigo'] = $this->uiParams['criterio'];
            } else {
                $this->uiParams['denominacion'] = $this->uiParams['criterio'];
            }
        }

        $mDocEnvReparar = new DocEnviadoRepararModel();        
        $datos = $mDocEnvReparar->getEnviadosAReparar($this->uiParams);

        if ($datos['error'] != 4) {

            foreach ($datos['datos'] as &$value) {
                /*$estructura = ServiciosEstructuraComposicionHelper::__init()->getEstructura(
                    $value['idestructuracomun']
                );*/
                $estructura = $this->integrator->metadatos->DameEstructura(
                    $value['idestructuracomun']
                );

                $value['estructuradenom'] = $estructura[0]->denominacion;
                $value['marca-modelo'] = $value['marca'];
                if (strlen($$value['modelo'])) {
                    $value['marca-modelo'] .= ' - '.$$value['modelo'];
                }
            }

            $this->objectHelper->synchronize($this, $datos);
        }
    }

    /**Para la gestion de monedas**/
    public function cargarTipoMonedasAction()
    {
        $this->objectHelper->synchronize($this, $this->movRegNumActivo->cargarTipoMonedas());
    }

    public function cargarMonedasAction()
    {

        $this->objectHelper->synchronize($this, $this->movRegNumActivo->cargarMonedas($this->uiParams));
    }

    public function eliminarMonedaAction()
    {
        $this->objectHelper->synchronize($this, $this->movRegNumActivo->eliminarMoneda($this->uiParams));
    }
	
	public function replicardatosmovimientoAction(){
		$idmovimientorn  = $this->uiParams['idmovregnumerico'];
		
		$conn = Zend_Registry::get('conexion');
		$var = $conn->fetchAll(
			"SELECT * FROM \"mod_logactivofijotangible\".\"f_replicar_datos_mov\"" .
			"($idmovimientorn)"
		);
		$this->success = true;
	}

	public function getactivosfijosserviceAction() {

	    $params = $this->uiParams;
        $params['idregistrosExcluir'] = json_decode($params['idregistrosExcluir']);

        $regNumericoModel = new RegNumericoModel();
        $this->datos = $regNumericoModel->getActivosWinService($params);
	    $this->success = true;
    }

    public function getresponsablesuebAction() {
        $params = $this->uiParams;
        $params['identidad'] = json_decode($params['identidad']);
        $criterio = isset($params['criterio']) ? $params['criterio'] : '';
        $start = isset($params['start']) ? (int)$params['start'] : 0;
        $limit = isset($params['limit']) ? (int)$params['limit'] : 30;
        
        $regNumericoModel = new RegNumericoModel();
        $data = $regNumericoModel->obtenerResponsablesEntidad(
            $params['identidad'], 
            $criterio, 
            $start, 
            $limit
        );
    $this->cantidad = isset($data['total']) ? (int)$data['total'] : 0;
        $this->datos    = isset($data['rows']) ? $data['rows'] : [];
        $this->success  = true;
}


}
