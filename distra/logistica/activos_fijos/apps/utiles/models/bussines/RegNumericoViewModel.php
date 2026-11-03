<?php

/**
 * Clase que implementa todos los métodos relacionados con la visualización del componente de registro numérico
 * en su vista de grid, de entradas y salidas
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class RegNumericoViewModel extends BaseModel
{

    private $sConfActivos;
    private $sNomEstTec;

    public function __construct()
    {
        parent::__construct();
        $this->sConfActivos = new ConfiguracionActivosService();
        $this->sNomEstTec = new NomEstatustecnico();
    }

    /**
     * @param      $tipocombo                Es el identificador del combo que se va a cargar.
     * @param null $nombreid                 Es el nombre por el cual desde la vista se pide 
     * el identificador de cada record de los
     *                                       datos devueltos.
     * @param null $nombredenominacion       Es el nombre por el cual desde la vista se pide la denominacion de cada
     *                                       record de los datos devueltos.
     * @param      $nombreinfo               Es el nombre por el cual desde la vista se pide una 
     * informacion adicional de cada
     * record de los datos devueltos para cuando se cargue el combo aparezcan los tooltip.
     *
     * @return array
     */
    public function cargarCombo(
    $tipocombo, $nombreid = 'id', $nombredenominacion = 'denominacion', $nombreinfo = 'info', $parametros = array()
    )
    {
        // $this->jsonResponse($this->configuracionHelper->obtenerDatosArbolNaturaleza($this->uiParams));
        $estr = 'Estructura';
        $idEstr = ZendExt_GlobalConcept::getInstance()->$estr->idestructura;
        $idEstructura = ($parametros->idestructura) ? $parametros->idestructura : $idEstr;
        $sNomGen = new NomencladoresActivosService();
        
        
        switch ($tipocombo) {
            case 'gruposubgrupo': {

                $datos = $sNomGen->getCargarGrupos();
                $idnomenclador = 'idgruposubgrupo';
                $denominacionnomenclador = 'denominacionlarga';
                $infonomenclador[] = 'gruposubgrupo';
            }
            break;
            case 'idgruposubgrupo': {

                $datos = $sNomGen->getCargarGrupos();
                $idnomenclador = 'idgruposubgrupo';
                $denominacionnomenclador = 'denominacionlarga';
                $infonomenclador[] = 'gruposubgrupo';
            }
            break;
            case 'naturaleza': {
               // $datos = ServiciosConfiguracionGeneralHelper::__init()->obtenerDatosArbolNaturaleza();
                $datos = $sNomGen->getCargarNaturalezas();
                $idnomenclador = 'idnaturaleza';
                $denominacionnomenclador = 'text';
                $infonomenclador[] = 'naturaleza';
            }
            break;
            case 'idnaturaleza': {
                // $datos = ServiciosConfiguracionGeneralHelper::__init()->obtenerDatosArbolNaturaleza();
                 $datos = $sNomGen->getCargarNaturalezas();
                 $idnomenclador = 'idnaturaleza';
                 $denominacionnomenclador = 'text';
                 $infonomenclador[] = 'naturaleza';
             }
             break;
            case 'colorprim': {

                    $datos = $sNomGen->getColoresHabilitados('idcolorprim');
                    $idnomenclador = 'idcolorprim';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'colorprim';
                }
                break;
            case 'idcolorprim': {

                    $datos = $sNomGen->getColoresHabilitados('idcolorprim');
                    $idnomenclador = 'idcolorprim';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'colorprim';
                }
                break;
            case 'colorsec': {

                    $datos = $sNomGen->getColoresHabilitados("idcolorsec");
                    $idnomenclador = 'idcolorsec';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'colorsec';
                }
                break;
            
            case 'idcolorsec': {

                    $datos = $sNomGen->getColoresHabilitados("idcolorsec");
                    $idnomenclador = 'idcolorsec';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'colorsec';
                }
                break;
            case 'denomestadotecnico': {

                    /* if ($parametros->idoperacion) {

                      if ($parametros->idregnumerico) {
                      $regNumericoActivo = Doctrine::getTable(
                      'DatRegNumericoActivo'
                      )->find(
                      $parametros->idregnumerico
                      );
                      $idestadoActualRN = $regNumericoActivo->idestatustecnico;

                      $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      $parametros->idoperacion, $idestadoActualRN, $idEstructura
                      );
                      } else {
                      $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      $parametros->idoperacion, false, $idEstructura
                      );
                      }
                      } else {
                      $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      false, false, $idEstructura
                      );
                      } */
                    /* $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      false, false, $idEstructura
                      ); */
                    $datos = $this->sNomEstTec->getEstatusTecUsanEntidad($idEstructura);
                     // print_r($datos);die;
                    $idnomenclador = 'idproximoestado';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'denomestadotecnico';
                }
                break;
            case 'idestatustecnico': {

                    /* if ($parametros->idoperacion) {

                      if ($parametros->idregnumerico) {
                      $regNumericoActivo = Doctrine::getTable(
                      'DatRegNumericoActivo'
                      )->find(
                      $parametros->idregnumerico
                      );
                      $idestadoActualRN = $regNumericoActivo->idestatustecnico;

                      $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      $parametros->idoperacion, $idestadoActualRN, $idEstructura
                      );
                      } else {
                      $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      $parametros->idoperacion, false, $idEstructura
                      );
                      }
                      } else {
                      $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      false, false, $idEstructura
                      );
                      } */
                    /* $datos = $this->sConfActivos->getCfgEstadosPorOperacion(
                      false, false, $idEstructura
                      ); */                
                    $datos = $this->sNomEstTec->getEstatusTecUsanEntidad($idEstructura);

                    $idnomenclador = 'idproximoestado';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'denomestadotecnico';
                }
                break;
            case 'tipomotor': {
                    
                    $datos = $sNomGen->getTipoMotores();
                    $idnomenclador = 'idtipomotor';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'tipomotor';
                }
                break;
            case 'actividad': {
                    
                    $datos = $sNomGen->getActividades();
                    $idnomenclador = 'idactividad';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'actividad';
                }
                break;
            case 'idactividad': {
                    
                    $datos = $sNomGen->getActividades();
                    $idnomenclador = 'idactividad';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'actividad';
                }
                break;
            case 'categoria': {

                    $datos = $this->sConfActivos->getCategorias($idEstructura)['datos'];
                    $idnomenclador = 'idcategoria';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'categoria';
                    $infonomenclador[] = 'denominacion';
                }
                break;
            case 'tipocombustible': {

                    $datos = $sNomGen->getTipoCombustible();
                    $idnomenclador = 'idtipocombustible';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'tipocombustible';
                }
                break;
            case 'idtipocombustible': {
                    
                    $datos = $sNomGen->getTipoCombustible();
                    $idnomenclador = 'idtipocombustible';
                    $denominacionnomenclador = 'denominacion';
                    $infonomenclador[] = 'denominacion';
                    $infonomenclador[] = 'tipocombustible';
                }
                break;
            default: {
                    die('El tipo de combo no esta definido');
                }
            
        }

       // print_r($datos);die;
        if (!function_exists('_walk_datoscombo')) {

            /**
             * Esta funcion recorre lo que devuelve del servicio en dependencia del nomenclador, y a le 
             * adiciona a cada uno de los items que devuelve un id($dato[$params['nombreid']]),una 
             * denominacion y una informacion adicional(para el tooltip) para que en la vista sean tratados 
             * todos los combos de la misma manera.
             */
            function _walk_datoscombo(&$dato, $pos, $params)
            {
                if ($params['nombreid']) {
                    $dato[$params['nombreid']] = $dato[$params['idnomenclador']];
                }

                if ($params['nombredenominacion']) {
                    $dato[$params['nombredenominacion']] = $dato[$params['denominacionnomenclador']];
                }
                if ($params['info'] && $params['infonomenclador']) {
                    $informacion = '';

                    for ($i = 0; $i < count($params['infonomenclador']); $i++) {
                        $informacion .= $dato{$params['infonomenclador'][$i]};
                        if ($i < count($params['infonomenclador']) - 1) {
                            $informacion .= ' -> ';
                        }
                    }
                    $dato[$params['info']] = $informacion;
                }
            }

        }

        $params = array();
        $params['nombreid'] = $nombreid;
        $params['nombredenominacion'] = $nombredenominacion;
        $params['info'] = $nombreinfo;
        $params['idnomenclador'] = $idnomenclador;
        $params['denominacionnomenclador'] = $denominacionnomenclador;
        $params['infonomenclador'] = $infonomenclador;

        array_walk($datos, '_walk_datoscombo', $params);
       // print_r($datos);die;
        return $datos;
    }

    public function getColumnasEditables($datos, $colamostrar)
    {
      //  print_r('dgfdgf');die;
        $arrAux = array();
        foreach ($colamostrar as &$columna) {

            if (is_array($datos['campos_editables'])) {
                foreach ($datos['campos_editables'] as $campo) {
                    if ($columna->name == $campo) {
                        $columna->editable = true;
                        break;
                    } else {
                        $columna->editable = false;
                    }
                }
            } elseif ($datos['campos_editables'] != '1' && $datos['campos_editables'] != '0' &&
                !is_array($datos['campos_editables'])
            ) {
                if ($columna->name == $datos['campos_editables']) {

                    $columna->editable = true;
                } else {
                    $columna->editable = false;
                }
            } elseif ($datos['campos_editables'] == '1') {

                //  Todas son editables excepto la que se especifique que no lo es
                if (!isset($columna->editable)) {
                    $columna->editable = true;
                }
            } elseif ($datos['campos_editables'] == '0') {
                if (!isset($columna->editable)) {
                    $columna->editable = false;
                }
            }

            if ($columna->name != 'importe' && $columna->name != 'usufructo') {
                array_push($arrAux, $columna);
            } elseif ($datos['tipo'] == 'no_entrada') {

                if ($datos['codigo'] == 'OPER_USUFRUCT') {
                    if ($columna->name != 'importe') {
                        array_push($arrAux, $columna);
                    }
                } else {
                    if ($columna->dataIndex != 'usufructo') {
                        array_push($arrAux, $columna);
                    }
                }
            }
            
            if($columna->autogenerado){
                 $columna->editable = false;
            }           
        }

        $colaMostrar['columnas'] = $arrAux;         
        return $colaMostrar;
    }

    public function devolverColumnas($idtipomedio, $idgruposubgrupo, $idEstructura)
    {
        $columnas = array('columnas' => array());
        $grupo = false;    
        $cont = 0;
        $sConfigActivos = new ConfiguracionActivosService();
        $result = $sConfigActivos->findTipoMedioById($idtipomedio);

        //Esta variable define si es un aft o un util y herramienta(-1) o un Partes piezas y Agregados(-2)
        $esAFT = ($idtipomedio != -1 && $idtipomedio != -2) ? true : false;
        if ($idEstructura == -1) {
            $idEstructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
        }
        $objConfPG = $this->sConfActivos->getConfiguracionPG($idEstructura);
        if ($idgruposubgrupo != -1) {
            $grupo = ServiciosConfiguracionGeneralHelper::__init()
                ->obteneCualquierGrupoPorID($idgruposubgrupo);

            if (count($grupo)) {
                $grupo = $grupo[0]['NomGruposubgrupohoja'];
            } else {
                $grupo = false;
            }
        }

        $dobleEncabezado = true;

        foreach ($result as $columna) {
            if (!$columna['numserie'] && $columna['numchasis']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nroserie',
                    'allowBlank' => true,
                    'width' => 150,
                    'duplicar' => false,
                    'obligatorio' => true,
                    'regex' => "^([a-zA-Z0-9]+)([-_/.\s]?[a-zA-Z0-9])*$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbNumchasis', 'tooltip' => 'lbNumchasis'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            } else {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nroserie',
                    'allowBlank' => true,
                    'minLength' => 1,
                    'width' => 150,
                    'maxLength' => 80,
                    'duplicar' => false,
                    'obligatorio' => true,
                    'regex' => "^([a-zA-Z0-9]+)([-_/.\s]?[a-zA-Z0-9])*$",
                    'regexp' => "^([a-zA-Z0-9]+)([-_/.\s]?[a-zA-Z0-9])*$"
                );

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroSerie', 'tooltip' => 'lbNroSerie'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['numinventario']) {
                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'nroinventario',
                    'width' => 150,
                    'maxLength' => 30,
                    'minLength' => 1,
                    'duplicar' => false,
                    'obligatorio' => false,
                    'regex' => "^[1-9]+$",
                    'regexp' => "^[1-9]+$"
                );

                if ($objConfPG[0]['autogenerado'] == 1) {
                    $sNivel['editable'] = false;
                }

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroInventario',
                        'tooltip' => 'lbNroInventario'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }


                $cont++;
            }

            if ($columna['nummatricula']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nromatricula',
                    'width' => 80,
                    'duplicar' => false,
                    'obligatorio' => false,
                    'regex' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$",
                    'regexp' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$"
                );

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroMatricula',
                        'tooltip' => 'lbNroMatricula'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['numcirculacion']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nrocirculacion',
                    'width' => 100,
                    'duplicar' => false,
                    'obligatorio' => false,
                    'regex' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$",
                    'regexp' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroCirculacion',
                        'tooltip' => 'lbNroCirculacion'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['capacidad']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'capacidad',
                    'allowBlank' => true,
                    'minLength' => 1,
                    'width' => 80,
                    'maxLength' => 9,
                    'duplicar' => false, 'obligatorio' => false,
                    'regex' => "^[1-9]+$",
                    'regexp' => "^[1-9]+$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbCapacidad', 'tooltip' => 'lbCapacidad'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }
            if ($columna['kmasignado']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'kmasignado',
                    'allowBlank' => true,
                    'minLength' => 1,
                    'width' => 80,
                    'maxLength' => 9,
                    'duplicar' => false, 'obligatorio' => false,
                    'regex' => "^[1-9]+$",
                    'regexp' => "^[1-9]+$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbKmasignado', 'tooltip' => 'lbKmasignado'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['colorprim']) {

                $sNivel = array('tipo' => 'combo',
                    'dataIndex' => 'colorprim',
                    'width' => 100,
                    'duplicar' => false,
                    'obligatorio' => false);

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroColor1', 'tooltip' => 'lbNroColor1'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['colorsec']) {

                $sNivel = array('tipo' => 'combo',
                    'dataIndex' => 'colorsec',
                    'width' => 100,
                    'duplicar' => false,
                    'obligatorio' => false);

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroColor2', 'tooltip' => 'lbNroColor2'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['motor1']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nromotor1',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => false,
                    'obligatorio' => false,
                    'regex' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$",
                    'regexp' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroMotor1', 'tooltip' => 'lbNroMotor1'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['motor2']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nromotor2',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => false,
                    'obligatorio' => false,
                    'regex' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$",
                    'regexp' => "^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroMotor2', 'tooltip' => 'lbNroMotor2'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            $sNivel = array('tipo' => 'numberfield',
                'dataIndex' => 'valoradquisicion',
                'align' => 'right',
                'width' => 80,
                'duplicar' => true,
                'allowBlank' => true,
                'obligatorio' => false,
                'regexp' => "^[0-9]{1,19}(.)[0-9]{0,2}$",
                'regex' => "[0-9.]");

            $columnas['columnas'][$cont] = array(array('header' => 'lbNroValorAdquisicion',
                    'tooltip' => 'lbNroValorAdquisicion'));

            if ($dobleEncabezado) {
                array_push($columnas['columnas'][$cont], $sNivel);
            } else {
                $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            }

            $cont++;

            if ($columna['valorcontable'] || ($objConfPG[0]['depreciacion'] && $esAFT)
            ) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'valorcontable',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'allowBlank' => true,
                    'obligatorio' => false,
                    'regexp' => "^[0-9]{1,19}(.)[0-9]{0,2}$",
                    'regex' => "[0-9.]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbNroValorContable',
                        'tooltip' => 'lbNroValorContable'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            $sNivel = array('tipo' => 'numberfield',
                'dataIndex' => 'importe',
                'align' => 'right',
                'width' => 80,
                'duplicar' => false,
                'allowBlank' => false,
                'obligatorio' => false,
                'regexp' => "^[0-9]{1,19}(.)[0-9]{0,2}$",
                'regex' => "[0-9.]");

            $columnas['columnas'][$cont] = array(array('header' => 'lbImporte',
                    'tooltip' => 'lbImporte',
                    'align' => 'right'
            ));

            if ($dobleEncabezado) {
                array_push($columnas['columnas'][$cont], $sNivel);
            } else {
                $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            }

            $cont++;

            $sNivel = array('tipo' => 'textfield',
                'dataIndex' => 'usufructo',
                'id' => 'usufructo',
                'hideable' => false,
                'align' => 'left',
                'width' => 120, 'duplicar' => false,
                'allowBlank' => true,
                'regexp' => "/^([\d\s]*)+$/",
                'regex' => "/[\d\s]/");

            $columnas['columnas'][$cont] = array(array('header' => 'lbUsufructo',
                    'tooltip' => 'lbUsufructo'));

            if ($dobleEncabezado) {
                array_push($columnas['columnas'][$cont], $sNivel);
            } else {
                $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            }

            $cont++;

            if ($objConfPG[0]['depreciacion']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'depreciacionacumulada',
                    'width' => 80,
                    'align' => 'right',
                    'duplicar' => true,
                    'obligatorio' => true,
                    'minLength' => 1,
                    'regexp' => "^[0-9]{1,19}(.)[0-9]{0,2}$",
                    'regex' => "[0-9.]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbDepreciacionAcumulada',
                        'tooltip' => 'lbDepreciacionAcumulada'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['vidautil'] || ($objConfPG[0]['depreciacion'] && $esAFT)
            ) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'vidautil',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => true,
                    'minLength' => 1,
                    'regexp' => "^[0-9]{1,19}$",
                    'value' => ($grupo) ? $grupo['vidautil'] : '',
                    'readOnly' => ($grupo) ? true : false,
                    'regex' => "[0-9.]",
                    'allowDecimals' => true);

                $columnas['columnas'][$cont] = array(array('header' => 'lbVidaUtil', 'tooltip' => 'lbVidaUtil'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['tasafiscal'] || ($objConfPG[0]['depreciacion'] && $esAFT)
            ) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'tasafiscal',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => true,
                    'minLength' => 1,
                    'value' =>
                    ($grupo) ? $grupo['tasafiscal'] : '',
                    'readOnly' => ($grupo) ? true : false,
                    'regexp' => "^[0-9]{1,19}$",
                    'regex' => "[0-9.]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbTasaFiscal', 'tooltip' => 'lbTasaFiscal'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['porcientorecuperacion'] || ($objConfPG[0]['depreciacion'] && $esAFT)
            ) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'porcientorecuperacion',
                    'width' => 80,
                    'align' => 'right',
                    'duplicar' => true,
                    'obligatorio' => true,
                    'minLength' => 1,
                    'value' => ($grupo) ? $grupo['porcientorecuperacion'] : '',
                    'readOnly' => ($grupo) ? true : false,
                    'regexp' => "^[0-9]{1,3}$",
                    'regex' => "[0-9.]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbProcientoRecuperacion',
                        'tooltip' => 'lbProcientoRecuperacion'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['actividad'] || ($objConfPG[0]['depreciacion'] && $esAFT)
            ) {

                $sNivel = array('tipo' => 'combo',
                    'dataIndex' => 'actividad',
                    'width' => 100,
                    'duplicar' => true,
                    'obligatorio' => true);

                $columnas['columnas'][$cont] = array(array('header' => 'lbActividad', 'tooltip' => 'lbActividad'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['responsable']) {
                if (ComunAFTModel::integradoPersona()) {

                    $sNivel = array('tipo' => 'win_responsable',
                        'dataIndex' => 'responsable',
                        'width' => 180,
                        'duplicar' => true,
                        'obligatorio' => false);

                    $columnas['columnas'][$cont] = array(array('header' => 'lbResponsable',
                            'tooltip' => 'lbResponsable'));
                } else {

                    $sNivel = array('tipo' => 'combo',
                        'dataIndex' => 'responsable',
                        'width' => 180,
                        'duplicar' => true,
                        'obligatorio' => false);

                    $columnas['columnas'][$cont] = array(array('header' => 'lbResponsable',
                            'tooltip' => 'lbResponsable'));
                }

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            $sNivel = array('tipo' => 'win_ubicacion',
                'dataIndex' => 'ubicacion',
                'width' => 180,
                'duplicar' => true,
                'obligatorio' => false);

            $columnas['columnas'][$cont] = array(array('header' => 'lbUbicacion', 'tooltip' => 'lbUbicacion'));

            if ($dobleEncabezado) {
                array_push($columnas['columnas'][$cont], $sNivel);
            } else {
                $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            }

            $cont++;

            if (
                $columna['fechaadq'] || $columna['fechaexpini'] ||
                $columna['fechaexpfin'] || $objConfPG[0]['depreciacion']
            ) {
                $colspan = 0;
                $columnas['columnas'][$cont][0] = null;
                if ($columna['fechaadq'] || $objConfPG[0]['depreciacion']) {
                    $colspan++;
                    $columnas['columnas'][$cont][1] = array('colspan' => 3,
                        'tipo' => 'date',
                        'dataIndex' => 'fechaadq',
                        'width' => 70,
                        'align' => 'center',
                        'header' => 'lbCmFechaAdquisicion',
                        'tooltip' => 'lbCmFechaAdquisicion',
                        'duplicar' => true,
                        'obligatorio' => (!$objConfPG[0]['explotacionadquisicion'] && $objConfPG[0]['depreciacion']) ? true : false,
                        'ordencronologico' => 2);
                    $cont++;
                }

                if ($columna['fechaexpini'] || $objConfPG[0]['depreciacion']) {
                    $colspan++;
                    $columnas['columnas'][$cont][1] = array('colspan' => 3,
                        'tipo' => 'date',
                        'align' => 'center',
                        'dataIndex' => 'fechaexpini',
                        'width' => 70,
                        'header' => 'lbCmFechaExpInicio',
                        'tooltip' => 'lbCmFechaExpInicio',
                        'duplicar' => true,
                        'obligatorio' => ($objConfPG[0]['explotacionadquisicion'] && $objConfPG[0]['depreciacion']) ? true : false,
                        'ordencronologico' => 3);
                    $cont++;
                }

                if ($columna['fechaexpfin'] || $objConfPG[0]['depreciacion']) {
                    $colspan++;
                    $columnas['columnas'][$cont][1] = array('colspan' => 3,
                        'tipo' => 'date',
                        'align' => 'center',
                        'dataIndex' => 'fechaexpfin',
                        'width' => 70,
                        'header' => 'lbCmFechaExpFin',
                        'tooltip' => 'lbCmFechaExpFin',
                        'duplicar' => true,
                        'obligatorio' => false,
                        'ordencronologico' => 4);
                    $cont++;
                }

                $columnas['columnas'][$cont - $colspan][0] = array(
                    'header' => 'lbCmFecha',
                    'tooltip' => 'lbCmFecha',
                    'align' => 'center',
                    'colspan' => $colspan,
                );
            }

            if ($columna['annofabricacion']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'annofabricacion',
                    'align' => 'center',
                    'width' => 70,
                    'regexp' => "^[0-9]{4}$",
                    'regex' => "[0-9.]",
                    'duplicar' => true,
                    'obligatorio' => false,
                    'maxLength' => 4,
                    'ordencronologico' => 1,
                    'allowDecimals' => true);

                $columnas['columnas'][$cont] = array(array('header' => 'lbAnnoF', 'tooltip' => 'lbAnnoF'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['kilometraje'] || $objConfPG[0]['depreciacion']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'kilometraje',
                    'align' => 'right',
                    'width' => 130,
                    'duplicar' => false,
                    'obligatorio' => false,
                    'regexp' => "^[0-9]{1,9}$",
                    'regex' => "[0-9]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbkilometraje', 'tooltip' => 'lbRecurso'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['tipocombustible']) {

                $sNivel = array('tipo' => 'combustible',
                    'dataIndex' => 'tipocombustible',
                    'width' => 100, 'duplicar' => true,
                    'obligatorio' => false);

                $columnas['columnas'][$cont] = array(array('header' => 'lbTipoCombustible',
                        'tooltip' => 'lbTipoCombustible'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['indiceconsumo']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'indiceconsumo',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false,
                    'regexp' => "^[0-9]{1,9}$",
                    'regex' => "[0-9]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbIndiceconsumo',
                        'tooltip' => 'lbIndiceconsumo'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['indicativo']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'indicativo',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false,
                    'regexp' => "^[\w]{0,50}$",
                    'regex' => "^[\w]{0,50}$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbIndicativo', 'tooltip' => 'lbIndicativo'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }
            // if ($columna['denominacion']) {

            //     $sNivel = array('tipo' => 'textfield',
            //         'dataIndex' => 'denominacion',
            //         'align' => 'right',
            //         'width' => 80,
            //         'duplicar' => true,
            //         'obligatorio' => false,
            //         'regexp' => "^[\w]{0,50}$",
            //         'regex' => "^[\w]{0,50}$");

            //     $columnas['columnas'][$cont] = array(array('header' => '', 'tooltip' => ''));

            //     // if ($dobleEncabezado) {
            //     //     array_push($columnas['columnas'][$cont], $sNivel);
            //     // } else {
            //     //     $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            //     // }

            //     $cont++;
            // }
            // if ($columna['gruposubgrupo']) {

            //     $sNivel = array('tipo' => 'combo',
            //         'dataIndex' => 'gruposubgrupo',
            //         'align' => 'right',
            //         'width' => 80,
            //         'duplicar' => true,
            //         'obligatorio' => false,
            //         'regexp' => "^[\w]{0,50}$",
            //         'regex' => "^[\w]{0,50}$");

            //     $columnas['columnas'][$cont] = array(array('header' => 'lbGrupo', 'tooltip' => 'lbGrupo'));

            //     if ($dobleEncabezado) {
            //         array_push($columnas['columnas'][$cont], $sNivel);
            //     } else {
            //         $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            //     }

            //     $cont++;
            // }
            // if ($columna['naturaleza']) {

            //     $sNivel = array('tipo' => 'combo',
            //         'dataIndex' => 'naturaleza',
            //         'align' => 'right',
            //         'width' => 80,
            //         'duplicar' => true,
            //         'obligatorio' => false,
            //         'regexp' => "^[\w]{0,50}$",
            //         'regex' => "^[\w]{0,50}$");

            //     $columnas['columnas'][$cont] = array(array('header' => 'lbNaturaleza', 'tooltip' => 'lbNaturaleza'));

            //     if ($dobleEncabezado) {
            //         array_push($columnas['columnas'][$cont], $sNivel);
            //     } else {
            //         $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
            //     }

            //     $cont++;
            // }

            if ($columna['nollaveencendido']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'nollaveencendido',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false,
                    'regexp' => "^[\w]{0,50}$",
                    'regex' => "^[\w]{0,50}$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbNollaveEncendido',
                        'tooltip' => 'lbNollaveEncendido'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['ficav']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'ficav',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false,
                    'regexp' => "^[\w]{0,50}$",
                    'regex' => "^[\w]{0,50}$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbFICAV', 'tooltip' => 'lbFICAV'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['lot']) {

                $sNivel = array('tipo' => 'textfield',
                    'dataIndex' => 'lot',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false,
                    'regexp' => "^[\w]{0,50}$",
                    'regex' => "^[\w]{0,50}$");

                $columnas['columnas'][$cont] = array(array('header' => 'lbLOT', 'tooltip' => 'lbLOT'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['estado'] || $objConfPG[0]['depreciacion']) {

                $sNivel = array('tipo' => 'combo',
                    'dataIndex' => 'denomestadotecnico',
                    'width' => 180,
                    'duplicar' => true,
                    'obligatorio' => true);

                $columnas['columnas'][$cont] = array(array('header' => 'lbEstado', 'tooltip' => 'lbEstado'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['categoria']) {

                $sNivel = array('tipo' => 'combo',
                    'dataIndex' => 'categoria',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false);

                $columnas['columnas'][$cont] = array(array('header' => 'lbCategoria', 'tooltip' => 'lbCategoria'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }

            if ($columna['garantia']) {

                $columnas['columnas'][$cont][1] = array(
                    'colspan' => 3,
                    'tipo' => 'numberfield',
                    'dataIndex' => 'recursoconsumidomax',
                    'header' => 'lbRecursoConsumidoMax',
                    'tooltip' => 'lbRecursoConsumidoMax',
                    'align' => 'right',
                    'width' => 100,
                    'duplicar' => true,
                    'allowBlank' => true,
                    'obligatorio' => true,
                    'regexp' => "^[0-9]{1,19}(.)[0-9]{0,2}$",
                    'regex' => "[0-9.]");
                $cont++;

                $columnas['columnas'][$cont][1] = array(
                    'colspan' => 3,
                    'tipo' => 'date',
                    'align' => 'center',
                    'dataIndex' => 'fechainicialgarantia',
                    'width' => 100,
                    'header' => 'lbFechaIniGarantia',
                    'tooltip' => 'lbFechaIniGarantia',
                    'duplicar' => true,
                    'obligatorio' => true);

                $cont++;

                $columnas['columnas'][$cont][1] = array(
                    'colspan' => 3,
                    'tipo' => 'date',
                    'align' => 'center',
                    'dataIndex' => 'fechafingarantia',
                    'width' => 100,
                    'header' => 'lbFechaFinGarantia',
                    'tooltip' => 'lbFechaFinGarantia',
                    'duplicar' => true,
                    'obligatorio' => true);

                $cont++;

                $columnas['columnas'][$cont - $colspan][0] = array(
                    'header' => 'lbGarantia',
                    'tooltip' => 'lbGarantia',
                    'align' => 'center',
                    'colspan' => $colspan
                );

                /*
                  $sNivel = array('tipo'        => 'check',
                  'dataIndex'   => 'garantia',
                  'width'       => 58,
                  'duplicar'    => true,
                  'obligatorio' => false);

                  $columnas['columnas'][$cont] = array(array('header' => 'lbGarantia', 'tooltip' => 'lbGarantia'));

                  if ($dobleEncabezado) {
                  array_push($columnas['columnas'][$cont], $sNivel);
                  } else {
                  $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                  }

                  $cont++; */
            }

            if ($columna['kilometraje']) {

                $sNivel = array('tipo' => 'numberfield',
                    'dataIndex' => 'odometro',
                    'align' => 'right',
                    'width' => 80,
                    'duplicar' => true,
                    'obligatorio' => false,
                    'regexp' => "^[0-9]{1,9}$",
                    'regex' => "[0-9]");

                $columnas['columnas'][$cont] = array(array('header' => 'lbOdometro', 'tooltip' => 'lbOdometro'));

                if ($dobleEncabezado) {
                    array_push($columnas['columnas'][$cont], $sNivel);
                } else {
                    $columnas['columnas'][$cont][0] = array_merge($columnas['columnas'][$cont][0], $sNivel);
                }

                $cont++;
            }
        }

        $columnas['dobleEncabezado'] = $dobleEncabezado;

       // print_r($columnas);die;
        return $columnas;
    }

    public function editColumnsByOper($oper_data, $columnas){

        switch ($oper_data['codigo']){
            case 'OPER_MOD_VALOR':{
                return $this->editColumnsForModValor($columnas);
            }
            case 'OPER_MOD_VALOR_DIS':{
                return $this->editColumnsForModValor($columnas);
            }
            case 'OPER_MOD_VALOR_UH':{
                return $this->editColumnsForModValorUH($columnas);
            }
            case 'OPER_MOD_VALOR_DIS_UH':{
                return $this->editColumnsForModValorUH($columnas);
            }
            default:
                return $columnas;
        }
    }

    private function editColumnsForModValor($columnas){

        $diferenciaValor = new stdClass();
        $diferenciaValor->label = 'Diferencia de valor';
        $diferenciaValor->sortable = 1;
        $diferenciaValor->name = 'diferenciavalor';
        $diferenciaValor->descripcion = 'Diferencia del valor';
        $diferenciaValor->allowBlank = 1;
        $diferenciaValor->default = 1;
        $diferenciaValor->tipo = 'numberfield';
        $diferenciaValor->editable = true;

        $diferenciaDepre = new stdClass();
        $diferenciaDepre->label = 'Diferencia de depreciación';
        $diferenciaDepre->sortable = 1;
        $diferenciaDepre->name = 'diferenciadepreciacion';
        $diferenciaDepre->descripcion = 'Diferencia de depreciación';
        $diferenciaDepre->allowBlank = 1;
        $diferenciaDepre->default = 1;
        $diferenciaDepre->tipo = 'numberfield';
        $diferenciaDepre->editable = true;

        $valorfinal = new stdClass();
        $valorfinal->label = 'Valor final';
        $valorfinal->sortable = 1;
        $valorfinal->name = 'valorfinal';
        $valorfinal->descripcion = 'Valor final';
        $valorfinal->allowBlank = 1;
        $valorfinal->default = 1;
        $valorfinal->tipo = 'numberfield';
        $valorfinal->editable = false;

        $depreciacionfinal = new stdClass();
        $depreciacionfinal->label = 'Depreciación final';
        $depreciacionfinal->sortable = 1;
        $depreciacionfinal->name = 'depreciacionfinal';
        $depreciacionfinal->descripcion = 'Depreciación final';
        $depreciacionfinal->allowBlank = 1;
        $depreciacionfinal->default = 1;
        $depreciacionfinal->tipo = 'numberfield';
        $depreciacionfinal->editable = false;

        $valorresidualfinal = new stdClass();
        $valorresidualfinal->label = 'Valor residual final';
        $valorresidualfinal->sortable = 1;
        $valorresidualfinal->name = 'valorresidualfinal';
        $valorresidualfinal->descripcion = 'Valor residual final';
        $valorresidualfinal->allowBlank = 1;
        $valorresidualfinal->default = 1;
        $valorresidualfinal->tipo = 'numberfield';
        $valorresidualfinal->editable = false;

        

        array_push($columnas['columnas'], $diferenciaValor, $diferenciaDepre, $valorfinal, $depreciacionfinal, $valorresidualfinal);

        return $columnas;
    }

    private function editColumnsForModValorUH($columnas){

        $diferenciaValor = new stdClass();

        $diferenciaValor->label = 'Diferencia de valor';
        $diferenciaValor->sortable = 1;
        $diferenciaValor->name = 'diferenciavalor';
        $diferenciaValor->descripcion = 'Diferencia del valor';
        $diferenciaValor->allowBlank = 1;
        $diferenciaValor->default = 1;
        $diferenciaValor->tipo = 'numberfield';
        $diferenciaValor->editable = true;

        $valorfinal = new stdClass();
        $valorfinal->label = 'Valor final';
        $valorfinal->sortable = 1;
        $valorfinal->name = 'valorfinal';
        $valorfinal->descripcion = 'Valor final';
        $valorfinal->allowBlank = 1;
        $valorfinal->default = 1;
        $valorfinal->tipo = 'numberfield';
        $valorfinal->editable = false;

        array_push($columnas['columnas'], $diferenciaValor, $valorfinal);

        return $columnas;
    }

}
