<?php

/**
 * SubmayorController
 * Controlador de SubMayor de Activos
 *
 * @package   Activos Fijos
 * @author    Jorge Luis Cuellar Mondeja
 * @copyright ERP-Cuba
 * @version   2.0
 */
class SubmayorController extends ZendExt_Controller_Secure
{
    private $areaSeleccionada;

    public function init()
    {
        parent::init();
        $this->view->arrayJs = array($this->integrator->ayuda->devolverJS(),
            $this->pIntegrator->utilesGeneral->getJsReporte());
        $this->areaSeleccionada = $this->global->Estructura->idestructura;
    }

    public function submayorAction()
    {
        $this->render();
    }

    public function getImagenesDetallesAction()
    {
        $idindicador = $this->_request->getPost('idindicador');
        $result = Doctrine::getTable('DatImagenindicador')->findByDql(' idindicador = ?', array($idindicador));
        if (count($result) != 0) {
            $datos = $result->toArray();
        } else {
            $datos = array();
        }

        echo json_encode(array('data' => $datos));
    }

    public function getMediosSalidasAction()
    {
        
    }

    public function getconteoAction()
    {
        $parametros = json_decode(stripslashes($this->_request->getPost('parametros')));
        $arrayIdarearesp = json_decode(stripslashes($this->_request->getPost('arrayIdarearesp')));
        $idespecialidad = json_decode(stripslashes($this->_request->getPost('idespecialidad')));

        $parametrosAll = $this->_request->getPost();

        $codigo = $this->_request->getPost('codigo');
        $denominacion = $this->_request->getPost('denominacion');
        $nacionalidad = $this->_request->getPost('idpais');
        $modelo = $this->_request->getPost('idmodelo');
        $marca = $this->_request->getPost('idmarca');

        $cantidad = $this->_request->getPost('cantidad');
        $disponibilidad = $this->_request->getPost('disponibilidad');
        $idnaturaleza = $this->_request->getPost('idnaturaleza');

        if ($idespecialidad) {
            $parametros->idespecialidad = $idespecialidad;
        }
        if ($codigo) {
            $parametros->codigo = $codigo;
        }
        if ($denominacion) {
            $parametros->denominacion = $denominacion;
        }
        if ($modelo) {
            $parametros->modelo = $modelo;
        }
        if ($marca) {
            $parametros->marca = $marca;
        }
        if ($nacionalidad) {
            $parametros->siglasnacionalidad = $nacionalidad;
        }
        if ($cantidad) {
            $parametros->cantidad = $cantidad;
        }
        if ($disponibilidad) {
            $parametros->disponibilidad = $disponibilidad;
        }
        if ($idnaturaleza) {
            $parametros->idnaturaleza = $idnaturaleza;
        }

        if ($parametrosAll['salidas'] != 2) {
            $respuesta = SubmayorModel::GetConteoEntidad(
                    $this->_request->getPost('start'), $this->_request->getPost('limit'),
                    $arrayIdarearesp
                    , (array) $parametros
            );
        } else {

            $respuesta = SubmayorModel::GetConteoEntidadSalidas(
                    $this->_request->getPost('start'), $this->_request->getPost('limit'), $arrayIdarearesp,
                    (array) $parametros
            );
            foreach ($respuesta['datos'] as $index => $value) {
                $idespe = self::IdespecialidadRegimen($value['idespecialidad']);
                $conn = Zend_Registry::get('conexion');
                $sql = "SELECT ins.idregnunericoactivo
                        FROM mod_logactivofijotangible.dat_inscripcioninmueble ins
                        WHERE ins.idregnunericoactivo = {$value['idregnumerico']}";
                $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $respuesta['datos'][$index]['denominacioncolumnareporte'] = $idespe['denominacioncolumnareporte'];
                $respuesta['datos'][$index]['inscrito'] = (count($result) > 0) ? 1 : 0;
            }
        }

        $inmuebles = SubmayorModel::getInmuebles($arrayIdarearesp, $idespecialidad);

        if (count($respuesta['datos'] > 0)) {
            if ($respuesta['datos'][0]['idregnumerico'] || $respuesta['datos'][0]['codigo']) {
                $respuesta['datos'][0]['count'] = $inmuebles[0]['count'];
                $respuesta['datos'][0]['valorcontabletotal'] = round($inmuebles[0]['valorcontabletotal'], 2);
            }
        }

        echo json_encode($respuesta);
    }

    /**
     * Cargar los datos de la entidad en la cual se encuentra el usuario
     */
    public function getentidadAction()
    {
        $ent = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
        $idespecialidad = self::getcargaridespecialidad();

        if ($idespecialidad) {
            $index = 0;
            foreach ($idespecialidad as $idespc) {
                $datos['idespecialidad'][$index] = $idespc['idespecialidad'];
                $datos['denominacionespecialidad'][$index] = $idespc['denominacionespecialidad'];
                $index++;
            }
        }
        $idusuario = $this->global->Perfil->idusuario;
        $datos['entidad'] = $ent[0]->denominacion;
        $datos['identidad'] = $ent[0]->idestructura;

        echo (json_encode($datos));
    }

    public function getcargaridespecialidad()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $obj = new ConfiguracionService();
        $idespecialidad = $obj->getEspdadoUsuario($idusuario);
        $denominacionespecialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($idespecialidad[0]['idespecialidad']);

        if (count($idespecialidad) == 1) {
            $denominacionespecialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($idespecialidad[0]['idespecialidad']);
            $datos[0]['idespecialidad'] = $denominacionespecialidad[0]->idespecialidad;
            $datos[0]['denominacionespecialidad'] = $denominacionespecialidad[0]->denespecialidad;
            return $datos;
        } else {
            $index = 0;
            foreach ($idespecialidad as $idespe) {
                $denominacionespecialidad = $especialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($idespe['idespecialidad']);
                $datos[$index]['idespecialidad'] = $denominacionespecialidad[0]->idespecialidad;
                $datos[$index]['denominacionespecialidad'] = $denominacionespecialidad[0]->denespecialidad;
                $index++;
            }
            return $datos;
        }
    }

    /**
     * Para dar la vista detallada por nomenclatura
     * Esto creo que no se usa
     */
    /* public function getdatosmedioAction()
      {
      $idactivofijo = $this->_request->getPost('idactivofijo');

      $service = new NomactivofijotangibleService();


      $respuesta = $service->getEspecificacionSubMayor($idactivofijo);

      echo json_encode($respuesta);
      } */

    /**
     * Mostrar los números de serie de una nomenclatura determinada
     */
    public function IdespecialidadRegimen($idespecialidad)
    {
        if ($idespecialidad) {
            $conn = Zend_Registry::get('conexion');
            $sql = "SELECT DISTINCT nesp.denespecialidad, nesp.codespecialidad,espagrup.denominacioncolumnareporte
                    FROM mod_datosmaestros.nom_indicador i
                    INNER JOIN mod_nomencladores.nom_especialidad nesp on nesp.idespecialidad = i.idespecialidad
                    INNER JOIN mod_logactivofijotangible.conf_espagrupareporte espagrup on espagrup.idespecialidad = i.idespecialidad
                    where nesp.idespecialidad = '$idespecialidad'; ";
            $idespecialidad = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            return $idespecialidad[0];
        } else {
            return 0;
        }
    }

    public function getregistronumericoAction()
    {
        $parametrosOll = $this->_request->getPost();

        $start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $parametrosOll['start'] = $start;
        $parametrosOll['limit'] = $limit;
        $parametrosOll['arrayIdarearesp'] = json_decode($parametrosOll['arrayIdarearesp']);
        $parametrosOll['idespecialidad1'] = json_decode(stripslashes($this->_request->getPost('idespecialidad')));

        if ($parametrosOll['salidas'] != 2) {//Para los disponibles
            $respuesta = SubmayorModel::GetConteoRegNumericosEntidad(
                    $start, $limit, $parametrosOll['arrayIdarearesp'], $parametrosOll['idindicador'], array(),
                    $parametrosOll['conproducto'], $parametrosOll
            );
            foreach ($respuesta['datos'] as $index => $value) {

                $idespe = self::IdespecialidadRegimen($value['idespecialidad']);
                $respuesta['datos'][$index]['denominacioncolumnareporte'] = $idespe['denominacioncolumnareporte'];

                $conn = Zend_Registry::get('conexion');
                $sql = "SELECT ins.idregnunericoactivo
                        FROM mod_logactivofijotangible.dat_inscripcioninmueble ins
                        WHERE ins.idregnunericoactivo = {$value['idregnumerico']}";
                $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $respuesta['datos'][$index]['inscrito'] = (count($result) > 0) ? 1 : 0;
            }
        } else {//Para los que han salido de la entidad
            $respuesta = SubmayorModel::GetConteoRegNumericosEntidadSalidas($parametrosOll,
            $parametrosOll['arrayIdarearesp'], $parametrosOll['conproducto'], $parametrosOll['idindicador']);
        }
        $inmuebles = SubmayorModel::getInmuebles($parametrosOll['arrayIdarearesp'], $parametrosOll['idespecialidad1']);
       
        if ($respuesta['datos'][0]['idregnumerico']) {
            $respuesta['datos'][0]['count'] = $inmuebles[0]['count'];
            $respuesta['datos'][0]['valorcontabletotal'] = round($inmuebles[0]['valorcontabletotal'], 2);
        }       
        foreach ($respuesta['datos'] as $index => $value) {
            if ($value['esmodulo'] == 2) {
                $valorcontabletotal = SubmayorModel::getContorValorInmueble($value['ordender'], $value['ordenizq'],
                        $value['idarearesp']);
                $respuesta['datos'][$index]['totalvalorcontableinmueble'] = $valorcontabletotal[0]['valorcontable'];
            }
        }        
        echo json_encode($respuesta);
    }

    public function graficardepreciacionAction()
    {
        $respDatos = SubmayorModel::GetGraficaDepreciacion($this->_request->getPost('idregistronumerico'));
        echo json_encode($respDatos);
    }

    public function getResponsablesAction()
    {
        $respDatos = SubmayorModel::getResponsables();
        echo json_encode($respDatos);
    }

    public function getmovimientosregistroAction()
    {
        $parametros = $this->_request->getPost();
        $parametros ['start'] = $this->_request->getPost('start');
        $parametros ['limit'] = $this->_request->getPost('limit');
        $parametros ['idregnumerico'] = $this->_request->getPost('idregnumerico');
        $model = new SubmayorModel();
        $parametros['arrayIdarearesp'] = json_decode(stripslashes($this->_request->getPost('arrayIdarearesp')));
        $parametros['idespecialidad'] = json_decode(stripslashes($this->_request->getPost('idespecialidad')));        
        $datos = $model->cargarDatosListadoDocRegNum($parametros);
        echo json_encode($datos);
    }

    public function generarReporteAction()
    {
        $parametros = json_decode($this->_request->getPost('parametros'));
        if ($parametros->reporte == 17) {
            $conn = Zend_Registry::get('conexion');
            $idespecialidad = ($parametros->idespecialidad != NULL) ? $parametros->idespecialidad : 'NULL';
            $sql = "SELECT * FROM mod_logactivofijotangible.f_aft_srm107({$parametros->idindicador},{$parametros->idestructuraop[0]}, $idespecialidad)";
            $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $data = array();
            $cont = 0;
            $conuntPage = 1;
            $countInterno = 0;
            $entrada = 0;
            $salida = 0;
            foreach ($datos as $key => $value) {
                if ($cont == 8) {
                    $countInterno++;
                    $val = array(
                        'countInterno' => $countInterno,
                        'codigo' => '',
                        'denominacion' => '',
                        'codigooperacion' => '',
                        'nombreum' => '',
                        'fechacontable' => '',
                        'operacion' => '',
                        'nrodoc' => 'Va al',
                        'nroserie' => 'Folio '.($conuntPage + 1),
                        'nroinventario' => '',
                        'entrada' => $entrada,
                        'salida' => $salida,
                        'ubicacion' => '',
                        'estado' => '',
                        'existencia' => $entrada - $salida,
                        'sumvalor' => $datos[$key - 1]['sumvalor'],
                    );
                    $data[] = $val;
                    $cont = 0;
                    $conuntPage++;
                    $countInterno++;
                    $val = array(
                        'countInterno' => $countInterno,
                        'codigo' => '',
                        'denominacion' => '',
                        'codigooperacion' => '',
                        'nombreum' => '',
                        'fechacontable' => '',
                        'operacion' => '',
                        'nrodoc' => 'Viene',
                        'nroserie' => 'del Folio '.($conuntPage - 1),
                        'nroinventario' => '',
                        'entrada' => $entrada,
                        'salida' => $salida,
                        'ubicacion' => '',
                        'estado' => '',
                        'existencia' => $entrada - $salida,
                        'sumvalor' => $datos[$key - 1]['sumvalor'],
                    );

                    $data[] = $val;
                    $cont++;
                } else {
                    $entrada += ($value['entrada'] == 1) ? 1 : 0;
                    $salida += ($value['salida'] == 1) ? 1 : 0;
                    $value['countInterno'] = $countInterno;
                    $ubic = $value['entidad'];
                    $ubic .= ($value['estructura']) ? ('('.$value['estructura'].')') : '';
                    $value['ubicacion'] = $ubic;
                    $data[] = $value;
                    $cont++;
                }
            }
            $datos = $data;
            $arraydatopie = array();
        } else if ($parametros->reporte == 33) {
            $conn = Zend_Registry::get('conexion');
            $idespecialidad = ($parametros->idespecialidad != NULL) ? $parametros->idespecialidad : 'NULL';
            $sql = "SELECT * FROM mod_logactivofijotangible.f_aft_srm107_cantidades_test({$parametros->idindicador},{$parametros->idestructuraop[0]},'{$parametros->fecha}', $idespecialidad)";
            $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else if ($parametros->reporte == 15) {
            $conn = Zend_Registry::get('conexion');
            $idespecialidad = ($parametros->idespecialidad != NULL) ? $parametros->idespecialidad : 'NULL';
            $sql = "SELECT * FROM mod_logactivofijotangible.f_ultimomovimiento(".$parametros->idestructuraop[0].", $idespecialidad)";
            $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else
        if ($parametros->reporte == 16 || $parametros->reporte == 20) {
            $conn = Zend_Registry::get('conexion');
            $idespecialidad = ($parametros->idespecialidad != NULL) ? $parametros->idespecialidad : 'NULL';
            $sql = "SELECT * FROM mod_logactivofijotangible.f_sirm1y2(".$parametros->idestructuraop[0].",".$parametros->tipo.", $idespecialidad)";
            $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else if ($parametros->reporte == 24) {
            $idespecialidad = ($parametros->idespecialidad != NULL) ? $parametros->idespecialidad : 'NULL';
            $datos = SubmayorModel::GetDatosReporte($parametros->idestructuraop, $idespecialidad);
        } else if ($parametros->reporte == 21) {
            $conn = Zend_Registry::get('conexion');
            $date = str_replace('/', '-', $parametros->fechaini);
            $fechaini = date('Y-m-d', strtotime($date));
            $date = str_replace('/', '-', $parametros->fechafin);
            $fechafin = date('Y-m-d', strtotime($date));
            $idespecialidad = ($parametros->idespecialidad != NULL) ? $parametros->idespecialidad : 'NULL';
            $sql = "SELECT * FROM mod_logactivofijotangible.f_sirm4({$parametros->idestructuraop[0]},"."'$fechaini'".","."'$fechafin'".",$idespecialidad)";
            $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {

            $datos = SubmayorModel::GetConteoRegNumericosEntidad(false, false, $parametros->idestructuraop,
                    $parametros->idindicador, (array) $parametros, true, array(), $parametros->entidad,
                    $parametros->arearesp);
            $datos = (array) $datos['datos'];
            $valortotal = 0;
            foreach ($datos as $key => $value) {
                $valortotal += $datos[$key]['valorcontable'];
            }
            if (count($parametros->idestructuraop) == 1) {
                if ($parametros->idespecialidad != NULL) {
                    $especialidad = SubmayorModel::ObtenerEspecialidadPorId($parametros->idespecialidad);
                    $cantidad = count($especialidad) - 1;
                    if (count($especialidad) > 1) {
                        foreach ($especialidad as $index => $idesp) {
                            if ($index == $cantidad) {
                                $coma = "";
                            } else {
                                $coma = ",";
                            }
                            $parametros->especialidad .= $idesp['denespecialidad'].$coma;
                        }
                    } else {
                        if (count($especialidad) == 1) {
                            $parametros->especialidad = $especialidad[0]['denespecialidad'];
                        }
                    }
                } else {
                    $parametros->especialidad = '';
                }

                if ($parametros->reporte == 18) {
                    array_push($datos,
                        array('numerodeldocumento' => '',
                        'nroinventario' => 'TOTAL',
                        'codigo' => '',
                        'valorcontable' => $valortotal,
                        'denominacion' => ''));
                }
            } else {
                if ($parametros->idespecialidad != NULL) {
                    $idespecialidad = $parametros->idespecialidad;

                    $cantidad = count($idespecialidad) - 1;
                    if (count($idespecialidad) > 1) {
                        foreach ($idespecialidad as $index => $idesp) {
                            if ($index == $cantidad) {
                                $coma = "";
                            } else {
                                $coma = ",";
                            }
                            $especialidad = $this->integrator->parametros->ObtenerEspecialidadPorId($idesp);
                            $parametros->especialidad .= $especialidad[0]->denespecialidad.$coma;
                        }
                    } else {
                        $especialidad = $this->integrator->parametros->ObtenerEspecialidadPorId($idespecialidad);
                        $parametros->especialidad = $especialidad[0]->denespecialidad;
                    }
                } else {
                    $parametros->especialidad = '';
                }
                if ($parametros->reporte == 18) {
                    array_push($datos,
                        array('numerodeldocumento' => '',
                        'nroinventario' => 'TOTAL',
                        'codigo' => '',
                        'valorcontable' => $valortotal,
                        'denominacion' => ''));
                }
            }
        }

        $arregloDatos = array('dataSources' => array('datoGeneral' => (array) $parametros, 'datoCuerpo' => $datos,
                'datoPie' => array())); //
        echo json_encode($arregloDatos);
    }

    /**
     * Metodo para cargar el nomenclador de nacionalidad
     * para el combo de la busqueda avanzada
     */
    public function getNacionalidadesAction()
    {
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 10;

        if ($this->_request->getPost('query')) {
            $query = $this->_request->getPost('query');
            $where = "  where p.nombrepais iLike '%$query%' ";
        }
        $sql = "select * from mod_nomencladores.nom_pais p $where offset $start limit $limit";
        $sql1 = "select count(*) as cant from mod_nomencladores.nom_pais p $where ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        $cantidad = $conn->fetchAll($sql1);
        echo json_encode(array('data' => $result, 'total' => $cantidad[0]['cant']));
    }

    public function getMarcasAction()
    {
        $parametros = $this->_request->getPost();
        $objsubM = new SubmayorModel();
        $datos = $objsubM->getMarcas($parametros);
        echo json_encode($datos);
    }

    public function getModelosAction()
    {
        $parametros = $this->_request->getPost();
        $objsubM = new SubmayorModel();
        $datos = $objsubM->getModelos($parametros);
        echo json_encode($datos);
    }

    public function getEstadosAction()
    {
        $parametros = $this->_request->getPost();
        $obj = new EstatusModel();
        $estatus = $obj->GetEstatusTecnico($parametros);
        echo json_encode($estatus);
    }

    public function getDatosMovimientoAction()
    {
        $parametros = $this->_request->getPost();
        $obj = new SubmayorModel();
        $result = $obj->getDatosMovimiento($parametros);
        echo json_encode($result);
    }

    public function getdatosEspecificosDocAction()
    {
        $parametros = $this->_request->getPost();
        $obj = new SubmayorModel();
        $result = $obj->getdatosEspecificosDoc($parametros);
        echo json_encode($result);
    }

    public function cargarComboEjercicioAction()
    {
        $identidad = $this->_request->getPost('idestructura');
        $obj = new SubmayorModel();
        $arrDatos = $obj->cargarComboEjercicios($identidad);
        echo json_encode($arrDatos);
    }

    public function cargarComboPeriodoAction()
    {
        $periodos = $this->integrator->parametros->ObtenerPeriodos($this->_request->getPost('idejercicio'));
        echo json_encode(array('datos' => $periodos));
    }

    public function getespecialidadAction()
    {
        $denominacionespecialidad = $especialidad = ZendExt_IoC::getInstance()->integrator->parametros->ObtenerEspecialidadPorId($this->_request->getPost('idespecialidad'));
        echo json_encode(array('datos' => $denominacionespecialidad[0]->denespecialidad));
    }

    /**
     * @method getEspecialidades
     * @return array Especialidades de la entidad
     */
    public function getEspecialidadesAction()
    {
        //$id=$this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);	
//		echo json_encode(array('datos' =>$this->integrator->parametros->ObtenerEspecialidadPorId($id[0]->idespecialidad)));
        echo json_encode(array('datos' => $this->integrator->parametros->ObtenerEspecialidadesHojas()));
    }

    public function getNaturalezaAction()
    {
        $parametros = new stdClass();
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $datos = SubmayorModel::cargarTiposMedios($parametros);
        echo json_encode(array('total' => $datos['cantidad'], 'datos' => $datos['datos']/* , 'col_muestra' => $col_muestra */));
    }

    public function getultimoidmovAction()
    {
        $idregnumerico = $this->_request->getPost('idregnumerico');
        $result = ProxyRegNumericoService::getUltimoIdMovRegNum($idregnumerico);
        $result = array('idmovregnumerico' => $result[0]);
        echo json_encode($result);
    }

    public function exportarResumenAction()
    {

        $params = $this->_request->getPost();
        $params['idarea'] = json_decode($this->_request->getPost('idarea'));


        SubmayorModel::exportarResumenRegistroNum($params);
    }

    public function actualizarAreaAction()
    {
        $this->areaSeleccionada = $this->_request->getPost('idarea');

        echo json_encode(array('cod' => 1));
    }

}
