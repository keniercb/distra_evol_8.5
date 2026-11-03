<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.phpmailer.php');
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.smtp.php');

include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class GestionarreportesycertificacionesController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();

        $this->datosModelo->estado[] = array('valor' => 1, 'denominacion' => 'Elaborado');
        $this->datosModelo->estado[] = array('valor' => 2, 'denominacion' => 'Conformado');
        $this->datosModelo->estado[] = array('valor' => 3, 'denominacion' => 'Aprobado');
    }

    public function gestionarreportesycertificacionesAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->scriptevaluaciones = $this->pIntegrator->evaluaciones->getUIPeriodosEvaluativos();
        //$this->view->idioma = $this->global->Perfil->idioma;
        $this->render();

    }

    public function obtenerconfiguracioninicialAction()
    {
        $this->datosModelo->idusuario = $this->global->Perfil->idusuario;
        echo json_encode($this->datosModelo);
    }

    public function obtenerreportesycertificacionesactualAction()
    {
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        $objRC = new DatReportesCertificaciones();
        $r = $objRC->obtenerListadoReportesCertificacionesActual($idconfreportescertificaciones, $identidad, $inicio, $limite);
        foreach ($r as &$v) {
            list(, , $anno) = explode('/', $v['fechainicio']);
            $v['anno'] = (1 / $anno) . '-' . $anno;
        }
        $c = $objRC->cantidadReportesCertificacionesActual($idconfreportescertificaciones, $identidad);  
        $cant = $c[0]['cantidad'];
        echo json_encode(array('datos' => $r, 'cantidad' => $cant));

    }

    public function obtenerreportesycertificacioneshistoricoAction()
    {
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        $pos = 0;
        $arrResult = array();
        $objRC = new HisReportesCertificaciones();
        $r = $objRC->obtenerListadoReportesCertificacionesHis($idconfreportescertificaciones, $identidad, $inicio, $limite);
        $fecha = getdate();
        $annoActual = $fecha['year'];
        foreach ($r as $i => &$v) {
            list(, , $anno) = explode('/', $v['fechainicio']);
            $v['anno'] = (1 / $anno) . '-' . $anno;
            if ($annoActual != $anno) {
                $arrResult[$pos] = $v;
                $pos++;
            }
        }

        $contadorResult = count($r);

        //Esto era lo que estaba
        /*$r = $objRC->obtenerListadoReportesCertificacionesHistorico($idconfreportescertificaciones, $identidad, $inicio, $limite, 1);
        $c = $objRC->obtenerCantidadReportesCertificacionesHistorico($idconfreportescertificaciones, $identidad);*/
        echo json_encode(array('datos' => $r, 'cantidad' => $contadorResult));

    }

    public function adicionarreportesycertificacionesAction()
    {
        $arregloDatos['estado'] = $this->_getParam('estado');
        $arregloDatos['fechafin'] = $this->_getParam('fechafin');
        $arregloDatos['fechainicio'] = $this->_getParam('fechainicio');
        $arregloDatos['idconfreportescertificaciones'] = $this->_getParam('idconfreportescertificaciones');
        $arregloDatos['identidad'] = $this->_getParam('identidad');
        $arregloDatos['tiposeleccionpersonas'] = $this->_getParam('tiposeleccionpersonas');
        $arregloDatos['descripcion'] = $this->_getParam('descripcion');
        $arregloDatos['idusuario'] = $this->global->Perfil->idusuario;


        $objModel = new DatReportesCertificacionesModel();

        $idreportescertificaciones = $objModel->adicionarReportesCertificaciones($arregloDatos);
        //Si es un reporte en el que se adicionan todas las personas automaticamente
        if ($arregloDatos['tiposeleccionpersonas'] == 1) {
            //Buscar todas las personas nombradas en cargo en la entidad
            $objDatCargosOcupados = new DatCargosOcupados();
            $objM = new DatElementosReportesCertificacionesModel();
            $personas = $objDatCargosOcupados->obtenerIDPersonasOcupanCargos($arregloDatos['identidad']);
            unset($arregloDatos);
            if (count($personas) > 0) {
                $objM->adicionarElementosReportesCertificaciones($personas, $idreportescertificaciones, 0);
            }
            $r->codigo = 'ADD-1';
            echo json_encode($r);
            //Si es un reporte donde se insertan las personas manualmente
        } else {
            $r->codigo = 'ADD-1';
            echo json_encode($r);
        }

    }

    public function cambiarestadoelaboradoAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $objDatReportesCertificaciones = new DatReportesCertificaciones();

        $objTableDatReportes = $objDatReportesCertificaciones->obtenerObjReporteDadoId($idreportescertificaciones);
        $objTableDatReportes->estado = 1;
        $objTableDatReportes->datos = '';
        $objTableDatReportes->save();

        echo json_encode('ok');
    }

    public function modificarreportesycertificacionesAction()
    {

        $id = $this->_getParam('idreportescertificaciones');
        $arregloDatos['estado'] = $this->_getParam('estado');
        $arregloDatos['fechafin'] = $this->_getParam('fechafin');
        $arregloDatos['fechainicio'] = $this->_getParam('fechainicio');
        $arregloDatos['idconfreportescertificaciones'] = $this->_getParam('idconfreportescertificaciones');
        $arregloDatos['identidad'] = $this->_getParam('identidad');
        $arregloDatos['descripcion'] = $this->_getParam('descripcion');

        $objModel = new DatReportesCertificacionesModel();

        $objModel->modificarReportesCertificaciones($id, $arregloDatos);

        $r->codigo = 'MOD-1';
        echo json_encode($r);
    }

    public function eliminarreportesycertificacionesAction()
    {

        $estado = $this->_getParam('estadodelete');
        $id = $this->_getParam('idreportescertificaciones');
        $objModel = new DatReportesCertificacionesModel();

        $objModel->eliminarReportesCertificaciones($id, $estado);

        $r->codigo = 'DEL-1';
        echo json_encode($r);
    }

    public function activarreporteeliminadoAction()
    {

        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $objModel = new DatReportesCertificacionesModel();

        $objModel->activarReporteEliminado($idreportescertificaciones);

        $r->codigo = 'ACT';
        echo json_encode($r);
    }

    public function obtenerdatosconfiguracionvariablesAction()
    {
        $id = $this->_getParam('idconfreportescertificaciones');
        $obj = new DatReportesCertificaciones();
        $r = $obj->obtenerDatosConfVariables($id);
        echo json_encode($r);
    }

    public function obtenerelementosreportescertificacionesAction()
    {
        $historico = $this->_getParam('historico');
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $tipoelemento = $this->_getParam('tipoelemento');
        $textobuscar = $this->_getParam('textobuscar');
        $buscar = ($textobuscar == '' || $textobuscar == null) ? 0 : 1;
        $identidad = $this->_getParam('identidad');
        //Obteniendo el estado del reporte
        $objDRC = new DatReportesCertificaciones();
        $datosreporte = $objDRC->obtenerReportesCertificaciones($idreportescertificaciones);
        $estado = (!empty($datosreporte)) ? $datosreporte[0]['estado'] : 1;
        $objE = ($historico == 0) ? new DatElementosReportesCertificaciones() : new HisElementosReportesCertificaciones();
        if ($estado == 3) {//Si el reporte está aprobado
            $datos = unserialize($datosreporte[0]['datos']); //print_r($datos);die;
            //Para los casos de resportes ya aprobados que no tengan serializados datos se busca en datelementos y datvariables
            $datos = ($datos) ? $datos : $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
            if ($buscar != 1) {//sin filtro de búsqueda
                $r = (!empty($datosreporte)) ? $datos : null;
            } else {//con filtro de búsqueda
                $r = array();
                foreach ($datos as $i => $persona) {
                    $restocadena = stristr($persona['nombreyapellidos'], $textobuscar);
                    if (!empty($restocadena))
                        $r[] = $persona;
                }
            }
        } else {//Si el reporte está elaborado
            if ($buscar != 1) {//sin filtro de búsqueda
                $r = $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
            } else {//con filtro de búsqueda
                $r = $objE->obtenerElementosReportesCertificacionesBuscarPersona($idreportescertificaciones, $textobuscar, $identidad);
            }
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datCarOcup = new DatCargosOcupados();        

        foreach ($r as $p => $persona) {
            $ordenunico = "";
            $idcargo = $datCarOcup->obtenerIdCargoXIdCargoOcupado($persona['idcargosocupados']);
            if ($idcargo) {
                $sql = "SELECT ordenunico FROM mod_estructuracomp.nom_filaestruc where idfila = $idcargo;";            
                $ordenunico = $conn->fetchOne($sql);
            }

            $nombreplantilla = (!empty($persona['plantilla'])) ? $persona['plantilla'] : 'Sin plantilla nominal';
            $r[$p]['ordenunico'] = $ordenunico;
            if ($nombreplantilla != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['plantilla']);
                $longorden = strlen($ordenplantilla . '');
                $r[$p]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
            } else {
                $r[$p]['plantilla'] = 'z-' . $nombreplantilla;
            }
        }
        /*if ($historico == 0) {
            $objE = new DatElementosReportesCertificaciones();
            if ($buscar != 1) {
                if ($tipoelemento == 1) {
                    $r = $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
                }
            } else {
                if ($tipoelemento == 1) {
                    $r = $objE->obtenerElementosReportesCertificacionesBuscarPersona($idreportescertificaciones, $textobuscar, $identidad);
                }
            }
        } else {
            $objE = new HisElementosReportesCertificaciones();
            if ($buscar != 1) {
                if ($tipoelemento == 1) {
                    $r = $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);

                }
            } else {
                if ($tipoelemento == 1) {
                    $r = $objE->obtenerElementosReportesCertificacionesBuscarPersona($idreportescertificaciones, $textobuscar, $identidad);
                }
            }
        }*/
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function actualizarReporteEvaluacionesAction()
    {
        $obj = new stdClass();
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        $idreportescertificaciones = $this->_request->getPost('idreportescertificaciones');

        //Eliminando los valores del reporte actual
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "delete from mod_nomina.dat_elementosreportescertificaciones where idreportescertificaciones = ?";
        $conn->execute($sql, array($idreportescertificaciones));

        //Creando un arreglo indexado por idplanilla, idindicador con el idvariablesconfreportescertificaciones
        $objConfigReporte = new ConfigCausaInasistenciaModel();
        $arrayCamposReporte = $objConfigReporte->obtenerCamposEvaluacionXIdReporteCertif($idconfreportescertificaciones);
        if (empty($arrayCamposReporte)) {
            $obj->error = 'NO-CONFIG-NOMINA';
            echo json_encode($obj);
            return;
        }
        $arrayPlanillas = array();
        foreach ($arrayCamposReporte as $camporep) {
            list($idindicador, $idplanilla) = explode('_', $camporep['idcausa']);
            $arrayPlanillas[$idplanilla][$idindicador] = $camporep['idvariablesconfreportescertificaciones'];
        }

        //Arreglo con las evaluaciones de las personas del proceso evaluativo
        $iocObj = ZendExt_Ioc_Inter::getInstance();
        $arrpersonasevaluaciones = $iocObj->evaluaciones->getEvaluadosByPeriodo($idperiodoproceso);
        $personanoevaluada = "";
        $conn->beginTransaction();
        foreach ($arrpersonasevaluaciones as $conteval => $rperseval) {
            //Buscando las personas no evaluadas
            if ($rperseval['estado'] == 0) {
                //Dame los datos de la persona no evaluada
                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		        where dp.idpersona = ?;";
                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($rperseval['idpersona']));
                $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                if ($personanoevaluada == "") {
                    $personanoevaluada = $nombreapp . ", ";
                } else {
                    $personanoevaluada = $personanoevaluada . " " . $nombreapp . ", ";
                }
            } else if ($rperseval['estado'] == 1 && $rperseval['valor'] != "") {
                //Salvando en DatElementosReportesCertificaciones
                $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado)
                VALUES ({$idreportescertificaciones}, {$rperseval['idpersona']}, 0) returning idelementosreportescertificaciones;";
                $r = $conn->fetchAll($sql);
                $idelemento = $r[0]['idelementosreportescertificaciones'];
                foreach ($arrayPlanillas as $idplanilla => $arridindicador) {
                    $valor = 0;
                    $idvariablesconfreportescertificaciones = 0;//print_r($rperseval['indicadores']);die;
                    if ($idplanilla == 0) {//Indicadores que son la evaluacion final
                        $valor = (!empty($rperseval['valor'])) ? $rperseval['valor'] : 0;
                        $idvariablesconfreportescertificaciones = $arridindicador[-1];

                        $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)
						VALUES ({$idelemento}, {$idvariablesconfreportescertificaciones}, {$valor});";
                        $conn->execute($sql);
                    } else {
                        foreach ($rperseval['indicadores'] as $indicadorpersona) {
                            //Si la persona es de esa planilla
                            if ($idplanilla == $rperseval['idplanilla']) {
                                foreach ($arridindicador as $idindicador => $variable) {
                                    //Si machean los indicadores de la configuracion y los de la evaluacion de la persona
                                    if ($indicadorpersona['idindicador'] == $idindicador) {
                                        $valor = (!empty($indicadorpersona['valorindicador'])) ? $indicadorpersona['valorindicador'] : 0;
                                        $idvariablesconfreportescertificaciones = $variable;
                                        //Salvando en DatVariablesElementosReportesCertificaciones
                                        if ($idvariablesconfreportescertificaciones != 0) {
                                            $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
										VALUES ({$idelemento}, {$idvariablesconfreportescertificaciones}, {$valor});";
                                            $conn->execute($sql);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $conn->commit();
        //Cambiandole el estado al reporte para q no pueda ser editado una vez actualizado
        $objDatReportesCertificacionesSave = Doctrine::getTable('DatReportesCertificaciones')->find($idreportescertificaciones);
        $objDatReportesCertificacionesSave->estado = 1;
        $objDatReportesCertificacionesSave->save();

        $obj->personasnoevaluadas = $personanoevaluada;
        echo json_encode($obj);
    }

    public function actualizarReporteTalleresAction(){
        $idreportecertificaciones = $this->_request->getPost('idreportecertificaciones');
        $identidad = $this->_request->getPost('identidad');
        $idconfreporte = $this->_request->getPost('idconfreporte');
        $datreportes = new DatReportesCertificaciones();
        $confvariables = new ConfVariablesReportesCertificaciones();
        $objdatelementos = new DatElementosReportesCertificaciones();
        $objconfigcausas = new ConfigCausaInasistencia();  
        $datosreporte = $datreportes->obtenerObjReporteDadoId($idreportecertificaciones);
        $fechainicio = $datosreporte->fechainicio;
        $fechafin = $datosreporte->fechafin;
        //Elementos del reporte
        $arrelementosreporte = $objdatelementos->obtenerElementosReportesCertificacionesPersona($idreportecertificaciones, $identidad);
        $arraypersonas = array();
        $cont = 0;

        //Obteniendo las personas
        foreach ($arrelementosreporte as $i => $valor){
            if($valor['idelemento'] != null){
                $arraypersonas[$cont] = $valor['idelemento'];
                $cont++;  
            }
        }

        //Si no hay personas que traiga todas las que ocupan cargos en la entidad
        $flag = false;
        if (empty($arraypersonas)) {
            $flag = true;
            $rpersonascargos = DatCargosOcupados::obtenerPersonasOcupanCargos($identidad);
            foreach ($rpersonascargos as $pers) {
                if (!empty($pers['idpersona'])) {
                    $arraypersonas[] = $pers['idpersona'];
                }
            }
        }
        //Obteniendo la configuracion
        $configuracion = ConfigCausaInasistencia::obtenerConfiguracion($idconfreporte);
        //Formando el arreglo de las causas
        $arraycausas = array();
        $contador = 0;
        foreach ($configuracion as $i => $valor) {
            $causas = explode(';', $valor['idcausa']);
            $configuracion[$i]['arrayidcausas'] = $causas;
            foreach ($causas as $idcausa) {
                $arraycausas[$contador] = $idcausa;
                $contador++;
            }
        }

        
        $arraycausas = array_values(array_unique($arraycausas));
        $personasapa = $this->integrator->logistica->getTrabajoOperariosSalarios($identidad,$fechainicio,$fechafin);
        //Eliminando las personas que no tienen valoes en las causas
        foreach ($personasapa as $p => $person) {
            $sumhoras = 0;
            $sumdias = 0;
            foreach ($person as $idcampo => $val) {
                if ($idcampo != 'idpersona') {
                    list($monto) = explode('_', $idcampo);
                    if ($noct == 'montoacobrar') {
                        $sumhoras += $val;
                        $sumdias += 0;
                    } else {//Demas causas
                        $sumhoras += (is_numeric($idcampo)) ? $val['horas'] : $val;
                        $sumdias += (is_numeric($idcampo)) ? $val['dias'] : $val;
                    }
                }
            }
            if ($sumhoras == 0 && $sumdias == 0) {
                unset($personasapa[$p]);
            }
        }
        $personasapa = array_values($personasapa);
        //Eliminando los valores del reporte actual
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        foreach ($personasapa as $i => $valor) {
            $personasapa[$i]['idsconfvariable'] = $configuracion;
            //Eliminando en DatElementosReportesCertificaciones
            $sqld = "DELETE FROM mod_nomina.dat_elementosreportescertificaciones
         WHERE idreportescertificaciones= ? and idelemento = ?";
            $r = $conn->execute($sqld, array($idreportecertificaciones, $valor['idpersona']));
            //Salvando en DatElementosReportesCertificaciones
            $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado)
   VALUES ({$idreportecertificaciones}, {$valor['idpersona']}, 0) returning idelementosreportescertificaciones;";
            $r = $conn->fetchAll($sql);
            $idelementosreportescertificaciones = $r[0]['idelementosreportescertificaciones'];
            foreach ($configuracion as $c => &$conf) {
                $conf['idelementosreportescertificaciones'] = $idelementosreportescertificaciones;
            }
            //Recorriendo la configuracion de las causas
            foreach ($personasapa[$i]['idsconfvariable'] as $j => $confvar) {
                //Sumando todas las causas para una misma variable
                $sumacausas = 0;
                list($indicador) = explode('_', $confvar['idcausa']);
                //Demas causas
                    foreach ($confvar['arrayidcausas'] as $idcausa) {
                        if (is_array($valor[$idcausa])) {
                            $sumacausas += ($confvar['horasdias'] == 2) ? $valor[$idcausa]['dias'] : $valor[$idcausa]['horas'];
                        } else {
                            $sumacausas += $valor[$indicador];
                        }
                    }
                

                $existe = ConfigCausaInasistencia::existeIdVariable($confvar['idvariablesconfreportescertificaciones']);
                if ($existe != 0) {
                    //$idcausa = ConfigCausaInasistencia::obtenerCausaXIdVariable($confvar['idvariablesconfreportescertificaciones']);
                    if ($sumacausas >= 0) {
                        $sql = "delete from mod_nomina.dat_variableselementosreportescertificaciones where idvariableselementosreportescertificaciones = ?";
                        $conn->execute($sql, array($confvar['idvariableselementosreportescertificaciones']));
                        $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
      VALUES ({$idelementosreportescertificaciones}, {$confvar['idvariablesconfreportescertificaciones']}, {$sumacausas});";
                        $conn->execute($sql);
                    }
                } else {
                    $sql = "delete from mod_nomina.dat_variableselementosreportescertificaciones where idvariableselementosreportescertificaciones = ?";
                    $conn->execute($sql, array($confvar['idvariableselementosreportescertificaciones']));
                    $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
            VALUES ({$idelementosreportescertificaciones}, {$confvar['idvariablesconfreportescertificaciones']}, 0);";
                    $conn->execute($sql);
                }
            }
        }
        $conn->commit();
        //Cambiandole el estado al reporte para q no pueda ser editado una vez actualizado
        $objDatReportesCertificacionesSave = Doctrine::getTable('DatReportesCertificaciones')->find($idreportecertificaciones);
        $objDatReportesCertificacionesSave->estado = 1;
        $objDatReportesCertificacionesSave->save();
        echo json_encode('OK');
       // print_r($personasapa);die;    
    }

    public function adicionarelementosreportescertificacionesAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        $idconfreporte = $this->_getParam('idconfreporte');
        $elementos = json_decode(stripslashes($this->_getParam('elementos')));
        $aprobado = 0;
        $arrIdsEl = array();
        $objM = new DatElementosReportesCertificacionesModel();
        $arrIdsEl = $objM->adicionarElementosReportesCertificaciones($elementos, $idreportescertificaciones, $aprobado);
        //Si el reporte es de vacaciones insertar el acumulado en dias e importe por persona
        $this->calcularacumuladoDiaseImporte($idreportescertificaciones, $arrIdsEl, $identidad);
        $comportamiento = ConfReportesCertificaciones::obtenerComportamiento($idconfreporte);

        //Reintegros
        if ($comportamiento == 6) {
            $this->obtenerReintegroCUPPersonas($idreportescertificaciones, $arrIdsEl, $identidad);
        }
        //Actualizando las personas insertadas en el reporte en ElaborarPagos
        $pers_rep = $this->obtenerPeriodoPagoReporte($idreportescertificaciones, $identidad);
        if (count($pers_rep) > 0) {
            $objElaborarPago = new ElaborarpagosController();
            $objElaborarPago->adicionarpersonasperiodo($pers_rep['idelaborarpagos'], $pers_rep['identidad'], $pers_rep['idperiodopago'],
                $pers_rep['modoseleccionpersonas'], $pers_rep['idtipopago'], $pers_rep['fechainicio'], $pers_rep['fechafin']);
        }
        $r->codigo = 'ADD-1';
        //$this->calcularFormulasReporte($idreportescertificaciones, $arrIdsEl, $identidad, $idconfreporte);
        echo json_encode($r);
    }

    public function calcularFormulasReporte($idreportescertificaciones, $arrIdsEl, $identidad, $idconfreporte)
    {
        $objConfCalendario = new ConfCalendarioSNC();
        $objRegistroSalario = new GestRegistroSalarioTiempoServicioModel();
        $objDatGestionarNominas = new DatGestionarNominasModel();
        $objDatVariablesReporte = new DatVariablesElementosReportesCertificaciones();
        $arrreporte = DatReportesCertificaciones::obtenerReportesCertificaciones($idreportescertificaciones);
        $arrannomes = explode('/', $arrreporte[0]['fechainicio']);
        $arrConfVariables = ConfVariablesReportesCertificaciones::obtenerTosoVariablesExpresionMatematica($idconfreporte);
        foreach ($arrConfVariables as $rvar) {
            $arrformulaind = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($rvar['idexpresionmatematica']);
            if (count($arrformulaind) > 0) {
                $mesesreporte = ConfReportesCertificaciones::obtenerMesesReporte($idconfreporte);
                $expresion = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($rvar['idexpresionmatematica']));
                $expmostrar = $expresion[0]['expresionacalcular'];
                //Recorriendo los elementos para obtener las variables configuradas
                foreach ($arrIdsEl as $i => $value) {
                    $arrayind = array();
                    $conteval = 0;
                    //Buscar salario x idpersona e identidad
                    $objDatElementosReportesCertificaciones = Doctrine::getTable('DatElementosReportesCertificaciones')->find($value);
                    $idpersona = $objDatElementosReportesCertificaciones->idelemento;
                    //Buscar el valor de la expresion matematica
                    foreach ($arrformulaind as $rif) {
                        $arraynom = array();
                        $rexplode = explode('_', $rif);
                        if ($rexplode[0] == 'CM') {
                            $tiposnominas = $rvar['tiposnomina'];
                            $snc225 = $objRegistroSalario->calcularSalarioTotalPersonaSNC($idpersona, $identidad, $mesesreporte, $tiposnominas);
                            $arrayind[$conteval]['idindicador'] = $rif;
                            $arrayind[$conteval]['valor'] = ($snc225->cantidadmeses) ? $snc225->cantidadmeses : 0;
                            $conteval++;
                        } else if ($rexplode[0] == 'ST') {
                            $tiposnominas = $rvar['tiposnomina'];
                            $snc225 = $objRegistroSalario->calcularSalarioTotalPersonaSNC($idpersona, $identidad, $mesesreporte, $tiposnominas);
                            $arrayind[$conteval]['idindicador'] = $rif;
                            $arrayind[$conteval]['valor'] = ($snc225->totalsalariosnc) ? $snc225->totalsalariosnc : 0;
                            $conteval++;
                        } else if ($rexplode[0] == 'DA') {
                            $diashab = $objConfCalendario->obtenerDiasHabiles($arrannomes[1], $arrannomes[2]);
                            $arrayind[$conteval]['idindicador'] = $rif;
                            $arrayind[$conteval]['valor'] = ($diashab) ? $diashab : 0;
                            $conteval++;
                        } else if ($rexplode[0] == 'F') {
                            $valor = $objDatVariablesReporte->obtenerValorVariablexIdConfVariableFeschasReporte($rexplode[1], $idpersona, $identidad, $arrreporte[0]['fechainicio'], $arrreporte[0]['fechafin']);
                            $arrayind[$conteval]['idindicador'] = $rif;
                            $arrayind[$conteval]['valor'] = ($valor) ? $valor : 0;
                            $conteval++;
                        } else if ($rexplode[0] == 'VAR') {
                            $arrayind[$conteval]['idindicador'] = $rif;
                            $arrayind[$conteval]['valor'] = ($elementos[$ie]->$rexplode[1]) ? $elementos[$ie]->$rexplode[1] : 0;
                            $conteval++;
                        } else {
                            $arrayind[$conteval]['idindicador'] = $rif;
                            $arrayind[$conteval]['valor'] = 0;
                            $conteval++;
                        }

                    }
                    //Evaluando la formula
                    $salario = 0;
                    $valorfind = $objDatGestionarNominas->EvaluarExpresionMatematica($arrayind, $expmostrar);
                    ($valorfind->codigo == 1) ? $salario = number_format($valorfind->valor, $rvar['lugaresdecimales'], '.', '') : 0;
                    //Datvariable para salvar por el idelementoreporte y el idconfreporte
                    $iddatvariables = DatVariablesElementosReportesCertificaciones::obtenerDatVariablesElementosReportesCertificacionesXConf($value, $rvar['idvariablesconfreportescertificaciones']);
                    $objDatVariabresSave = DatVariablesElementosReportesCertificaciones::getByid($iddatvariables[0]['idvariableselementosreportescertificaciones']);
                    $objDatVariabresSave->valor = $salario;
                    $objDatVariabresSave->save();
                }
            }
        }
        return;

    }

    public function obtenerReintegroCUPPersonas($idreportescertificaciones, $arrIdsEl, $identidad)
    {
        $objDatElementosReporte = new DatElementosReportesCertificaciones();
        $objDatVariables = new DatVariablesElementosReportesCertificaciones();
        $objReintegro = new DatReintegros();
        foreach ($arrIdsEl as $rel) {
            $arrelementos = $objDatElementosReporte->obtenerTodosElementosReportesCertificacionesXIdElm($rel);
            $totalacumuladocup = $objReintegro->obtenerAcumulacionTotalPersonaEntidadCUP($arrelementos[0]['idelemento'], $identidad, '01');
            //Si la persona tiene acumulaciones para la moneda CUP
            if ($totalacumuladocup > 0) {
                $totalliquidadocup = $objReintegro->obtenerLiquidacionTotalPersonaEntidadCUP($arrelementos[0]['idelemento'], $identidad, '01');
                $saldocupreintegrar = $totalacumuladocup - $totalliquidadocup;
                $arrdatvariables = $objDatVariables->obtenerVariablesElementosReportesCertificaciones(array($rel));
                $objModDatVariables = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($arrdatvariables[0]['idvariableselementosreportescertificaciones']);
                $objModDatVariables->valor = $saldocupreintegrar;
                $objModDatVariables->save();
            }

        }
    }

    public function calcularacumuladoDiaseImporte($idreportescertificaciones, $arrIdsEl, $identidad)
    {
        //Busco si el reporte se de vacaciones.
        $sqlconfreporte = "select ctrep.deresultados
        from mod_nomina.conf_tiporeportescertificaciones ctrep
        inner join mod_nomina.dat_reportescertificaciones crep on (crep.idconfreportescertificaciones = ctrep.idconfreportescertificaciones)
        where crep.idreportescertificaciones = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloconfreporte = $conn->fetchAll($sqlconfreporte, array($idreportescertificaciones));
        //Tipo de Configuracion del reporte
        $tipocampo = $arregloconfreporte[0]['deresultados'];

        //cvtrep.lugaresdecimales
        //number_format(0, $arregloidvariableliqimporte[0]['lugaresdecimales'], '.', '');


        //Si el reporte es de vacaciones
        if ($tipocampo == 2) {
            //Busco la variable de la cant de dias acumulados (tipovariable=3).
            $sqlvariabledias = "select cvtrep.idvariablesconfreportescertificaciones, cvtrep.lugaresdecimales
        from mod_nomina.conf_variablestiporeportescertificaciones cvtrep
        inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = cvtrep.idconfreportescertificaciones)
        inner join mod_nomina.dat_reportescertificaciones crep on (crep.idconfreportescertificaciones = ctrep.idconfreportescertificaciones)
        where cvtrep.tipovariable = 3 and crep.idreportescertificaciones = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arregloidvariabledias = $conn->fetchAll($sqlvariabledias, array($idreportescertificaciones));
            //Id variable para salvar en bd con los dias acumulados
            $idvariabledias = $arregloidvariabledias[0]['idvariablesconfreportescertificaciones'];
            //Busco la variable del importe acumulados (tipovariable=4).
            $sqlvariableimporte = "select cvtrep.idvariablesconfreportescertificaciones, cvtrep.lugaresdecimales
        from mod_nomina.conf_variablestiporeportescertificaciones cvtrep
        inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = cvtrep.idconfreportescertificaciones)
        inner join mod_nomina.dat_reportescertificaciones crep on (crep.idconfreportescertificaciones = ctrep.idconfreportescertificaciones)
        where cvtrep.tipovariable = 4 and crep.idreportescertificaciones = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arregloidvariableimporteac = $conn->fetchAll($sqlvariableimporte, array($idreportescertificaciones));
            //Id variable para salvar en bd los importes acumulados
            $idvariableimporteac = $arregloidvariableimporteac[0]['idvariablesconfreportescertificaciones'];
            //Recorro el array de idelementosreportecert para buscar por persona su acumulado en dias e importe
            $objHisVacaciones = new HisVacacionesPersonaModel();
            foreach ($arrIdsEl as $i => $value) {
                $objDatElementosReportesCertificaciones = Doctrine::getTable('DatElementosReportesCertificaciones')->find($value);
                $idpersona = $objDatElementosReportesCertificaciones->idelemento;
                //Calculo el importe y los dias acumulados
                $diasacumulados = $objHisVacaciones->calcularDiasAcumulados($idpersona, $identidad, $arregloidvariabledias[0]['lugaresdecimales']);
                $importeacumulado = $objHisVacaciones->calcularImporteAcumulado($idpersona, $identidad, $arregloidvariableimporteac[0]['lugaresdecimales']);
                if ($diasacumulados == -1 && $importeacumulado == -1) {
                    $sqlcargainicial = "select dvac.tiempoacumuladoinicial, dvac.importeacumuladoinicial
            from mod_nomina.dat_vacacionespersona dvac
            where dvac.idpersona = ? and dvac.identidad = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arreglocargainicial = $conn->fetchAll($sqlcargainicial, array($idpersona, $identidad));
                    //$diasacumulados = $arreglocargainicial[0]['tiempoacumuladoinicial'];
                    $diasacumulados = number_format ($arreglocargainicial[0]['tiempoacumuladoinicial'], ((!empty($arregloidvariabledias[0]['lugaresdecimales'])) ? $arregloidvariabledias[0]['lugaresdecimales'] : 2), '.', '');
                    //$importeacumulado = $arreglocargainicial[0]['importeacumuladoinicial'];
                    $importeacumulado = number_format ($arreglocargainicial[0]['importeacumuladoinicial'], ((!empty($arregloidvariableimporteac[0]['lugaresdecimales'])) ? $arregloidvariableimporteac[0]['lugaresdecimales'] : 2), '.', '');
                }
                //Borrando los datos de datvariables
                $r = Doctrine_Query::create()
                    ->select('idvariableselementosreportescertificaciones')
                    ->from('DatVariablesElementosReportesCertificaciones')
                    ->where('idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?', array($objDatElementosReportesCertificaciones->idelementosreportescertificaciones, $idvariabledias))
                    ->fetchOne()
                    ->idvariableselementosreportescertificaciones;
                $n = Doctrine_Query::create()
                    ->select('idvariableselementosreportescertificaciones')
                    ->from('DatVariablesElementosReportesCertificaciones')
                    ->where('idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?', array($objDatElementosReportesCertificaciones->idelementosreportescertificaciones, $idvariableimporteac))
                    ->fetchOne()
                    ->idvariableselementosreportescertificaciones;

                if ($r && $n) {
                    //Salvo las variables
                    $objDatVariablesElementosReportesCertificacionesDias = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($r);
                    $objDatVariablesElementosReportesCertificacionesImporte = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($n);
                    //Salvando el obj de los dias acumulados
                    $objDatVariablesElementosReportesCertificacionesDias->valor = $diasacumulados;
                    $objDatVariablesElementosReportesCertificacionesDias->save();
                    //Salvando el obj del importe acumulados
                    $objDatVariablesElementosReportesCertificacionesImporte->valor = $importeacumulado;
                    $objDatVariablesElementosReportesCertificacionesImporte->save();
                } else {
                    $objDatVariablesElementosReportesCertificacionesDias = new DatVariablesElementosReportesCertificaciones();
                    $objDatVariablesElementosReportesCertificacionesImporte = new DatVariablesElementosReportesCertificaciones();
                    //Salvando el obj de los dias acumulados
                    $objDatVariablesElementosReportesCertificacionesDias->valor = $diasacumulados;
                    $objDatVariablesElementosReportesCertificacionesDias->idelementosreportescertificaciones = $value;
                    $objDatVariablesElementosReportesCertificacionesDias->idvariablesconfreportescertificaciones = $idvariabledias;
                    $objDatVariablesElementosReportesCertificacionesDias->save();
                    //Salvando el obj de los dias acumulados
                    $objDatVariablesElementosReportesCertificacionesImporte->valor = $importeacumulado;
                    $objDatVariablesElementosReportesCertificacionesImporte->idelementosreportescertificaciones = $value;
                    $objDatVariablesElementosReportesCertificacionesImporte->idvariablesconfreportescertificaciones = $idvariableimporteac;
                    $objDatVariablesElementosReportesCertificacionesImporte->save();
                }

            }
            return 'COD-1';
        } else {
            return 'COD-0';
        }
    }

    public function calcularAcumuladoVacacionesAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        //Array de Elementos
        $arrElementos = DatElementosReportesCertificaciones::obtenerArrIdElementosXIdReporte($idreportescertificaciones);
        $arridEl = array();
        foreach ($arrElementos as $rel){
            $arridEl[] = $rel['idelementosreportescertificaciones'];
        }
        //Guardando nuevamente el Acumulados en tiempo e Importe en el Reporte de Vacaciones
        $acumdiasimp = $this->calcularacumuladoDiaseImporte($idreportescertificaciones, $arridEl, $identidad);
        if($acumdiasimp){
            //Busco la variable de la cant de dias a disfrutar (tipovariable=1).
            $sqlvariabledias = "select cvtrep.idvariablesconfreportescertificaciones
        from mod_nomina.conf_variablestiporeportescertificaciones cvtrep
        inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = cvtrep.idconfreportescertificaciones)
        inner join mod_nomina.dat_reportescertificaciones rep on (rep.idconfreportescertificaciones = ctrep.idconfreportescertificaciones)
        where cvtrep.tipovariable = 1 and rep.idreportescertificaciones = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arregloidvariabledias = $conn->fetchAll($sqlvariabledias, array($idreportescertificaciones));
            //Id variable de los dias a disfrutar
            $idvariabledias = $arregloidvariabledias[0]['idvariablesconfreportescertificaciones'];
            //Busco los dias que tienen las personas del reporte.
            $sqlvalordias = "select velrep.idvariableselementosreportescertificaciones, velrep.valor, delrep.idelementosreportescertificaciones, delrep.idelemento
        from mod_nomina.dat_variableselementosreportescertificaciones velrep
        inner join mod_nomina.dat_elementosreportescertificaciones delrep on (delrep.idelementosreportescertificaciones = velrep.idelementosreportescertificaciones)
        inner join mod_nomina.dat_reportescertificaciones drep on (drep.idreportescertificaciones = delrep.idreportescertificaciones)
        where velrep.idvariablesconfreportescertificaciones = ? and drep.idreportescertificaciones = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            //Array con los id persona y la cantidad de dias
            $arreglovaloresdias = $conn->fetchAll($sqlvalordias, array($idvariabledias, $idreportescertificaciones));
            //Busco las personas que no les da el acumulado
            $arraypersonassinacumulado = array();
            $contpersonassinacumulado = 0;
            $objHisVacaciones = new HisVacacionesPersonaModel();
            foreach ($arreglovaloresdias as $i => $value) {
                $acumulado = $objHisVacaciones->validarAcumuladoVacaciones($value['idelemento'], $value['valor'], $identidad);
                if ($acumulado == -1) {
                    $arraypersonassinacumulado[$contpersonassinacumulado]['idpersona'] = $value['idelemento'];
                    $contpersonassinacumulado++;
                }
            }
            //Si hay personas que no les da el acumulado; return las personas
            if (count($arraypersonassinacumulado) > 0) {
                $nombrecompleto = "";
                foreach ($arraypersonassinacumulado as $c => $v) {
                    //Dame los datos de la persona que no le da el acumulado
                    $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		           where dp.idpersona = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($v['idpersona']));
                    $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                    if ($nombrecompleto == "") {
                        $nombrecompleto = $nombreapp . ", ";
                    } else {
                        $nombrecompleto = $nombrecompleto . " " . $nombreapp . ", ";
                    }
                }
                //Busco la variable de la liquidacion en importe (tipovariable=1).
                $sqlvariableliqimporte = "select cvtrep.idvariablesconfreportescertificaciones, cvtrep.lugaresdecimales
          from mod_nomina.conf_variablestiporeportescertificaciones cvtrep
          inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = cvtrep.idconfreportescertificaciones)
          inner join mod_nomina.dat_reportescertificaciones rep on (rep.idconfreportescertificaciones = ctrep.idconfreportescertificaciones)
          where cvtrep.tipovariable = 2 and rep.idreportescertificaciones = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arregloidvariableliqimporte = $conn->fetchAll($sqlvariableliqimporte, array($idreportescertificaciones));
                //Id variable de los dias a disfrutar para eliminar los importes
                $idvariableliqimporte = $arregloidvariableliqimporte[0]['idvariablesconfreportescertificaciones'];
                foreach ($arreglovaloresdias as $i => $value) {
                    //Busco el idvariable del importe de vacaciones.
                    $sqlidvariable = "select velrep.idvariableselementosreportescertificaciones
	        from mod_nomina.dat_variableselementosreportescertificaciones velrep
	        inner join mod_nomina.dat_elementosreportescertificaciones delrep on (delrep.idelementosreportescertificaciones = velrep.idelementosreportescertificaciones)
	        inner join mod_nomina.dat_reportescertificaciones drep on (drep.idreportescertificaciones = delrep.idreportescertificaciones)
			where velrep.idvariablesconfreportescertificaciones = ? and delrep.idelementosreportescertificaciones = ? and drep.idreportescertificaciones = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    //Array con el idvariable de la liquidacion en importe
                    $arreglovariableliq = $conn->fetchAll($sqlidvariable, array($idvariableliqimporte, $value['idelementosreportescertificaciones'], $idreportescertificaciones));
                    if (count($arreglovariableliq) > 0) {
                        $idvariableselementosreportescertificaciones = $arreglovariableliq[0]['idvariableselementosreportescertificaciones'];
                        $objDatVariable = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($idvariableselementosreportescertificaciones);
                        //$objDatVariable->valor = 0;
                        $objDatVariable->valor = number_format(0, $arregloidvariableliqimporte[0]['lugaresdecimales'], '.', '');
                        $objDatVariable->save();
                    }
                }
                $obj->cod = -1;
                $obj->personassinacumulado = $nombrecompleto;
                echo json_encode($obj);
                //Sino calculo el promedio en importe y se lo multiplico a la cantidad de dias a disfrutar
            } else {
                //Busco la variable de la liquidacion en importe (tipovariable=1).
                $sqlvariableliqimporte = "select cvtrep.idvariablesconfreportescertificaciones, cvtrep.lugaresdecimales
          from mod_nomina.conf_variablestiporeportescertificaciones cvtrep
          inner join mod_nomina.conf_tiporeportescertificaciones ctrep on (ctrep.idconfreportescertificaciones = cvtrep.idconfreportescertificaciones)
          inner join mod_nomina.dat_reportescertificaciones rep on (rep.idconfreportescertificaciones = ctrep.idconfreportescertificaciones)
          where cvtrep.tipovariable = 2 and rep.idreportescertificaciones = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arregloidvariableliqimporte = $conn->fetchAll($sqlvariableliqimporte, array($idreportescertificaciones));
                //Id variable de los dias a disfrutar
                $idvariableliqimporte = $arregloidvariableliqimporte[0]['idvariablesconfreportescertificaciones'];
                //print_r($arregloidvariableliqimporte[0]['lugaresdecimales']);die;
                foreach ($arreglovaloresdias as $i => $value) {
                    //Calculo el importe a liquidarle a la persona segun la cant de dias a disfrutar
                    $importealiquidar = $objHisVacaciones->calcularImporteaLiquidar($value['idelemento'], $value['valor'], $identidad, $arregloidvariableliqimporte[0]['lugaresdecimales']);
                    //Busco el idvariable del importe de vacaciones.
                    $sqlidvariable = "select velrep.idvariableselementosreportescertificaciones
	        from mod_nomina.dat_variableselementosreportescertificaciones velrep
	        inner join mod_nomina.dat_elementosreportescertificaciones delrep on (delrep.idelementosreportescertificaciones = velrep.idelementosreportescertificaciones)
	        inner join mod_nomina.dat_reportescertificaciones drep on (drep.idreportescertificaciones = delrep.idreportescertificaciones)
			where velrep.idvariablesconfreportescertificaciones = ? and delrep.idelementosreportescertificaciones = ? and drep.idreportescertificaciones = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    //Array con el idvariable de la liquidacion en importe
                    $arreglovariableliq = $conn->fetchAll($sqlidvariable, array($idvariableliqimporte, $value['idelementosreportescertificaciones'], $idreportescertificaciones));
                    $idvariableselementosreportescertificaciones = $arreglovariableliq[0]['idvariableselementosreportescertificaciones'];
                    if ($idvariableselementosreportescertificaciones) {
                        //Busco el obj de DatVariables por el idvariable de la liquidacion
                        $objDatVariableSaveImporte = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($idvariableselementosreportescertificaciones);
                        //print_r($objDatVariableSaveImporte);die;
                        $objDatVariableSaveImporte->valor = $importealiquidar;
                        $objDatVariableSaveImporte->save();
                    } else {
                        //Si no existe el iddatvariablesreporte
                        $objDatVariableSaveImporte = new DatVariablesElementosReportesCertificaciones();
                        //print_r($objDatVariableSaveImporte);die;
                        $objDatVariableSaveImporte->idvariablesconfreportescertificaciones = $idvariableliqimporte;
                        $objDatVariableSaveImporte->idelementosreportescertificaciones = $value['idelementosreportescertificaciones'];
                        $objDatVariableSaveImporte->valor = $importealiquidar;
                        $objDatVariableSaveImporte->save();
                    }
                }
                $obj->cod = 1;
                echo json_encode($obj);
            }
        }
    }

    public function calcularSalarioPromedioAction()
    {
        //Get all params
        $cantidadmesespost = $this->_request->getPost('cantidadmeses');
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        $arrayelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $arrayidelementosrep = Zend_Json::decode(stripslashes($this->_getParam('arrayidelementosrep')));
        $arrayidspersonas = Zend_Json::decode(stripslashes($this->_getParam('idspersonas')));
        $objElaborarPagos = new stdClass();
        $contobjElaborarPagos = 0;
        $datelaborarpagos = new DatElaborarPagos();
        $identidad = $this->global->Estructura->idestructura;
        $arraydatoselaborarpago = array();
        $contarraydatoselaborarpago = 0;
        $confvariablestiporeporte = new ConfVariablesReportesCertificaciones();
        $datvariablestiporeporte = new DatVariablesElementosReportesCertificaciones();
        $variableportipo = $confvariablestiporeporte->obtenerIdVariablesPorTipo($idconfreportescertificaciones, -1);
        if (count($variableportipo) == 0) {
            $s->codigo = 'NOVARIABLETIPOSALARIOPROMEDIOCONFIGURADA';
            $s->datos = array();
        }
        //Obteniendo los datos de elaborar pago
        foreach ($arrayelaborarpagos as $i => $value) {
            $relabpago = $datelaborarpagos->obtenerPeriodosPagoEntidad($value);
            $relabpago[0]['flag'] = 0;
            $arraydatoselaborarpago[$contarraydatoselaborarpago] = $relabpago[0];
            $contarraydatoselaborarpago++;
        }
        $ar = array();
        //Armando el obj con los periodos de pago del mismo mes de pago
        for ($i = 0; $i < count($arraydatoselaborarpago); $i++) {
            $contdatos = 0;
            $arrmi = explode('/', $arraydatoselaborarpago[$i]['fechapago']);
            $mespagoi = $arrmi[1];
            $ar[$i] = $mespagoi;
            $objElaborarPagos->mespago[$contobjElaborarPagos]->mes = $mespagoi;
            for ($j = $i + 1; $j < count($arraydatoselaborarpago); $j++) {
                $arrmj = explode('/', $arraydatoselaborarpago[$j]['fechapago']);
                $mespagoj = $arrmj[1];
                if ($mespagoi == $mespagoj && $arraydatoselaborarpago[$j]['flag'] == 0) {
                    $objElaborarPagos->mespago[$contobjElaborarPagos]->datos[$contdatos] = $arraydatoselaborarpago[$j];
                    $arraydatoselaborarpago[$j]['flag'] = 1;
                    $contdatos++;
                }
            }
            if ($arraydatoselaborarpago[$i]['flag'] == 0) {
                $objElaborarPagos->mespago[$contobjElaborarPagos]->datos[$contdatos] = $arraydatoselaborarpago[$i];
                $arraydatoselaborarpago[$i]['flag'] = 1;
                $contobjElaborarPagos++;
            }
        }
        $cantidadmeses = count($objElaborarPagos->mespago);
        //Si los meses q pasa por params el user es ayor q los meses de los periodos de pago
        if ($cantidadmeses > count($objElaborarPagos->mespago)) {
            $s->codigo = 'c';
            $s->datos = array();
            echo json_encode($s);
        }
        //Ordenando el objeto por las fechas de pago
        $objElaborarPagos = $this->ordenarPeriodosPorFechaPago($objElaborarPagos);

        //Buscando el concepto q representa el salario
        $objCRM = new NomConceptoRM();
        $idcrmPagoSalario = $objCRM->obtenerConceptoPagoSalario();
        if ($idcrmPagoSalario == -1) {
            $s->codigo = 'NOCRMPAGOSALARIO';
            $s->datos = array();
            echo json_encode($s);
        }
        //Recorriendo las personas del reporte para calcular el salario promedio
        $contarraypersonassalariostotales = 0;
        $arraypersonassalariostotales = array();
        $datNominaDatos = new DatNominaDatos();
        foreach ($arrayidspersonas as $v => $ridp) {
            $cantidadmesespersona = 0;
            $arraypersonassalariostotales[$contarraypersonassalariostotales]['idpersona'] = $ridp;
            $arraypersonassalariostotales[$contarraypersonassalariostotales]['idelementosreporte'] = $arrayidelementosrep[$v];
            $arraypersonassalariostotales[$contarraypersonassalariostotales]['cantidadmesesperiodospago'] = $cantidadmeses;
            $arraypersonassalariostotales[$contarraypersonassalariostotales]['salariomeses'] = '';
            //Recorriendo el obj de los pagos organizados por las fechas de pago
            foreach ($objElaborarPagos->mespago as $im => $rm) {
                $salariototal = 0;
                //Recorriendo los periodos de pago para obtener las nominas
                foreach ($rm->datos as $iep => $rep) {
                    $datosNomina = $datNominaDatos->obtenerDatosNominaPorElaborarPago($rep['idelaborarpagos']);
                    if (count($datosNomina) > 0) {
                        //Recorriendo el array de DatNominaDatos
                        foreach ($datosNomina as $idn => $rdn) {
                            $objEstructura = unserialize($rdn['estructura']);
                            $idcolumnaPagar = $this->buscarColumnaApagar($objEstructura, $idcrmPagoSalario);
                            $arrvalores = unserialize($rdn['valores']);
                            //Recorriendo a las personas para ver en cual se encuentra la corrida
                            foreach ($arrvalores as $ivp => $rvp) {
                                $rids = explode('-', $rvp['id']);
                                $idpersona = $rids[0];
                                if ($ridp == $idpersona) {
                                    $salariototal = $salariototal + $rvp["c$idcolumnaPagar"];
                                }
                            }
                        }
                    }
                }
                if ($arraypersonassalariostotales[$contarraypersonassalariostotales]['salariomeses'] == '') {
                    $arraypersonassalariostotales[$contarraypersonassalariostotales]['salariomeses'] = $salariototal;
                } else {
                    $arraypersonassalariostotales[$contarraypersonassalariostotales]['salariomeses'] = $arraypersonassalariostotales[$contarraypersonassalariostotales]['salariomeses'] . '_' . $salariototal;
                }
                if ($salariototal > 0) {
                    $cantidadmesespersona++;
                }
            }
            $arraypersonassalariostotales[$contarraypersonassalariostotales]['mesespersona'] = $cantidadmesespersona;
            $contarraypersonassalariostotales++;

        }
        $contarraypersonasreporte = 0;
        $contarraypersonassintiempo = 0;
        $arraypersonasreporte = array();
        $arraypersonassintiempo = array();
        foreach ($arraypersonassalariostotales as $iap => $rap) {
            $sumasalarios = 0;
            $rexplodeimportes = explode('_', $rap['salariomeses']);
            /*if($rap['mesespersona']<$cantidadmesespost){
                $arraypersonassintiempo[$contarraypersonassintiempo]['idpersona'] = $rap['idpersona'];
                $arraypersonassintiempo[$contarraypersonassintiempo]['idelementosreporte'] = $rap['idelementosreporte'];
                $contarraypersonassintiempo++;
            }else{*/
            foreach ($rexplodeimportes as $iei => $rei) {
                //print_r($cantidadmesespost);die;
                //if($iei<$cantidadmesespost){
                $sumasalarios = $sumasalarios + $rei;
                //}
            }
            $promedio = number_format($sumasalarios / $cantidadmesespost, 2, '.', '');
            $arraypersonasreporte[$contarraypersonasreporte]['idpersona'] = $rap['idpersona'];
            $arraypersonasreporte[$contarraypersonasreporte]['idelementosreporte'] = $rap['idelementosreporte'];
            $arraypersonasreporte[$contarraypersonasreporte]['promedio'] = $promedio;
            $contarraypersonasreporte++;
            //}
        }
        $nombrefinal = "";
        //Datos de las personas q no tienen salario promedio pq no les da el tiempo
        foreach ($arraypersonassintiempo as $ipsr => $rpst) {
            //Datos de las personas q no tienen salario promedio pq no les da el tiempo
            $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		           where dp.idpersona = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($rpst['idpersona']));
            $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
            if ($nombrefinal == "") {
                $nombrefinal = $nombreapp;
            } else {
                $nombrefinal = $nombrefinal . ", " . $nombreapp;
            }
            //Borrando el dato del salario promedio anterior
            $datosvariableselemento = $datvariablestiporeporte->obtenerVariablesElementosReportesCertificaciones(array($rpst['idelementosreporte']));
            //Recorriendo los datvariables para salvar el salario promedio
            foreach ($datosvariableselemento as $ivde => $rvde) {
                if ($rvde['idvariablesconfreportescertificaciones'] == $variableportipo[0]['idvariablesconfreportescertificaciones']) {
                    $datvariablesave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rvde['idvariableselementosreportescertificaciones']);
                    $datvariablesave->valor = 0;
                    $datvariablesave->save();
                }
            }
        }
        //Recorriendo los elementos del reporte para eliminar posibles valores que tenga en confvariables
        foreach ($arraypersonasreporte as $kpr => $rpr) {
            //Obteniendo los datvariables de este idelemento
            $datosvariableselemento = $datvariablestiporeporte->obtenerVariablesElementosReportesCertificaciones(array($rpr['idelementosreporte']));
            //Recorriendo los datvariables para salvar el salario promedio
            foreach ($datosvariableselemento as $ive => $rve) {
                if ($rve['idvariablesconfreportescertificaciones'] == $variableportipo[0]['idvariablesconfreportescertificaciones']) {
                    $datvariablesave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rve['idvariableselementosreportescertificaciones']);
                    if ($rpr['promedio'] != '') {
                        $datvariablesave->valor = $rpr['promedio'];
                        $datvariablesave->save();
                    } else {
                        $datvariablesave->valor = 0;
                        $datvariablesave->save();
                    }
                }
            }
        }
        $objfinal->personassintiempo = $nombrefinal;
        $s->codigo = 'OK';
        $s->datos = $objfinal;
        echo json_encode($s);
    }

    public function obtenerPersonasConMenosMesesAction()
    {
        $arrayidspersonas = Zend_Json::decode(stripslashes($this->_getParam('arrayidpersonas')));
        $identidad = $this->global->Estructura->idestructura;

        //Cantidad de meses***********************************************
        //Capturando la cantidad de meses a calcularle el salario(subsidio)
        $sqlCantidadMeses = "select cvgv.valor from mod_nomina.nom_variableglobal nvg
                     inner join mod_nomina.conf_variableglobalvalor cvgv on (cvgv.idvariableglobal = nvg.idvariableglobal)
		             where nvg.calculosubsidio = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $cantMeses = $conn->fetchAll($sqlCantidadMeses, array(1));
        $cantidad_meses = $cantMeses[0]['valor'];

        //Agrupando el salario total de cada persona********************************************
        $datvariablestiporeporte = new DatRegistroSalarioTiempoServicio();
        $arraySalarios = array();
        $arraySalariosPersonasXMesAux = array();
        foreach ($arrayidspersonas as $k => $idpersona) {
            $posSal = 0;
            $arraySalariosPersonasXMesAux[$k] = $datvariablestiporeporte->obtenerListadoDatRegistroSalarioOrdenadoAnnosMesesDESC($idpersona, $identidad); //if($idpersona==0){print_r($idpersona);die;}
            $arraySalariosPersonasXMes = array();
            $m = 0;
            foreach ($arraySalariosPersonasXMesAux[$k] as $salario) {
                $arraySalariosPersonasXMes[$m]['idpersona'] = $salario['idpersona'];
                $arraySalariosPersonasXMes[$m]['anno'] = $salario['anno'];
                $arraySalariosPersonasXMes[$m]['idmes'] = $salario['idmes'];
                $arraySalariosPersonasXMes[$m]['salario'] = $salario['salariodevengadoreporte'];
                $m++;
            }
            $pos = 1;
            foreach ($arraySalariosPersonasXMes as $i) {
                if (($i['idpersona'] == $arraySalariosPersonasXMes[$pos]['idpersona']) &&
                    ($i['anno'] == $arraySalariosPersonasXMes[$pos]['anno']) &&
                    ($i['idmes'] == $arraySalariosPersonasXMes[$pos]['idmes'])
                ) {
                    if ($i['salario'] === null) {
                        $arraySalarios[$k][$posSal] += 0;
                    } else {
                        $arraySalarios[$k][$posSal] += $i['salario'];
                    }
                } else {
                    $arraySalarios[$k][$posSal] += $i['salario'];
                    $posSal++;
                }
                $pos++;
            }
        }
        $datos = array();
        $posArrDatos = 0;
        foreach ($arraySalarios as $e => $persona) {
            if (count($persona) < $cantidad_meses) { //Si no llega a la cantidad de meses especificada
                //Datos de las personas q no tienen salario promedio pq no les da la cantidad de meses en Licencia Maternidad
                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		                             where dp.idpersona = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($arrayidspersonas[$e]));
                if ($arrdatpersona[0]['snombre'] == "") {
                    $datos[$posArrDatos]['idpersona'] = $arrayidspersonas[$e];
                    $datos[$posArrDatos]['nombrecompleto'] = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                    $posArrDatos++;
                } else {
                    $datos[$posArrDatos]['idpersona'] = $arrayidspersonas[$e];
                    $datos[$posArrDatos]['nombrecompleto'] = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                    $posArrDatos++;
                }
            }
        }
        echo json_encode(array('datos' => $datos, 'cantidad' => count($datos)));
    }

    public function calcularSalarioPromedioSNCAction()
    {
        //Get all params
        $idreportescertificaciones = $this->_request->getPost('idreportescertificaciones');
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        $arrayidelementosrep = Zend_Json::decode(stripslashes($this->_getParam('arrayidelementosrep')));
        $arrayidspersonas = Zend_Json::decode(stripslashes($this->_getParam('idspersonas')));
        $identidad = $this->global->Estructura->idestructura;

        //En el caso de que Licencia Maternidad sin semanas
        $arrayidspersonassinsemanas = Zend_Json::decode(stripslashes($this->_getParam('idspersonassinsemanas')));
        $arraycantsemanasxpersona = Zend_Json::decode(stripslashes($this->_getParam('arraycantsemanasxpersona')));

        $confvariablestiporeporte = new ConfVariablesReportesCertificaciones();
        $variableportipo = $confvariablestiporeporte->obtenerIdVariablesPorTipo($idconfreportescertificaciones, -1);

        if (count($variableportipo) == 0) {
            $s->codigo = 'NOVARIABLETIPOSALARIOPROMEDIOCONFIGURADA';
            $s->datos = array();
            echo json_encode($s);
        } else {
            //Capturando el tipo de reporte
            $sqlTipoReporteCertif = "select deresultados from mod_nomina.conf_tiporeportescertificaciones
		           where idconfreportescertificaciones = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $tipoRepo = $conn->fetchAll($sqlTipoReporteCertif, array($idconfreportescertificaciones));
            $tipoRepo = $tipoRepo[0]['deresultados'];

            //Cantidad de meses o semanas***********************************************
            $cantidad_meses = 0;
            $cantidad_semanas = 0;

            //Capturando la cantidad de meses a calcularle el salario(subsidio)
            $sqlCantidadMeses = "select cvgv.valor from mod_nomina.nom_variableglobal nvg
                     inner join mod_nomina.conf_variableglobalvalor cvgv on (cvgv.idvariableglobal = nvg.idvariableglobal)
		             where nvg.calculosubsidio = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $cantMeses = $conn->fetchAll($sqlCantidadMeses, array(1));
            $cantidad_meses = $cantMeses[0]['valor'];

            //Capturando la cantidad de semanas a calcularle el salario(licencias de maternidad)
            $sqlCantidadSemanas = "select cvgv.valor from mod_nomina.nom_variableglobal nvg
                     inner join mod_nomina.conf_variableglobalvalor cvgv on (cvgv.idvariableglobal = nvg.idvariableglobal)
		             where nvg.calculosubsidio = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $cantSemanas = $conn->fetchAll($sqlCantidadSemanas, array(2));
            $cantidad_semanas = $cantSemanas[0]['valor'];
//            $s = null;

            //Si existen campos nulos o con valor cero
            if (($cantidad_meses === null && $cantidad_semanas === null) || ($cantidad_meses === 0 && $cantidad_semanas === 0)) {
                if ($tipoRepo == 3) {
                    $s->codigo = 'CANTIDADMESESSEMANASNULL';
                    $s->datos = array();
                    echo json_encode($s);
                    return;
                } elseif ($tipoRepo == 8) {
                    $s->codigo = 'CANTIDADMESESNULL';
                    $s->datos = array();
                    echo json_encode($s);
                    return;
                }
            } else {
                if ($cantidad_meses === null || $cantidad_meses === 0) {
                    $s->codigo = 'CANTIDADMESESNULL';
                    $s->datos = array();
                    echo json_encode($s);
                    return;
                }
                if (($cantidad_semanas === null || $cantidad_semanas === 0) && $tipoRepo == 3) {
                    $s->codigo = 'CANTIDADSEMANASNULL';
                    $s->datos = array();
                    echo json_encode($s);
                    return;
                }
            }

            //Agrupando el salario total de cada persona********************************************
            $datvariablestiporeporte = new DatRegistroSalarioTiempoServicio();
            $arraySalarios = array();
            $arraySalariosPersonasXMesAux = array();
            foreach ($arrayidspersonas as $k => $idpersona) {
                $posSal = 0;
                $arraySalariosPersonasXMesAux[$k] = $datvariablestiporeporte->obtenerListadoDatRegistroSalarioOrdenadoAnnosMesesDESC($idpersona, $identidad);
                $arraySalariosPersonasXMes = array();
                $m = 0;
                foreach ($arraySalariosPersonasXMesAux[$k] as $salario) {
                    $arraySalariosPersonasXMes[$m]['idpersona'] = $salario['idpersona'];
                    $arraySalariosPersonasXMes[$m]['anno'] = $salario['anno'];
                    $arraySalariosPersonasXMes[$m]['idmes'] = $salario['idmes'];
                    $arraySalariosPersonasXMes[$m]['salario'] = $salario['salariodevengado'];
                    // $arraySalariosPersonasXMes[$m]['salario'] = $salario['salariodevengadoreporte'];
                    $m++;
                }
                $pos = 1;
                foreach ($arraySalariosPersonasXMes as $i) {
                    if (($i['idpersona'] == $arraySalariosPersonasXMes[$pos]['idpersona']) &&
                        ($i['anno'] == $arraySalariosPersonasXMes[$pos]['anno']) &&
                        ($i['idmes'] == $arraySalariosPersonasXMes[$pos]['idmes'])
                    ) {
                        if ($i['salario'] === null) {
                            $arraySalarios[$idpersona][$posSal] += 0;
                        } else {
                            $arraySalarios[$idpersona][$posSal] += $i['salario'];
                        }
                    } else {
                        $arraySalarios[$idpersona][$posSal] += $i['salario'];
                        $posSal++;
                    }
                    $pos++;
                }
            }

            //Calculando el promedio para cada persona en dependencia del tipo de reporte**********************
            // 8 --> Subsidios   ;  3 --> licencia de maternidad
            $datos = array();
            $posArrDatos = 0;
            $arrayPromedioSalarioXPersona = array();
            if ($tipoRepo == 8) { // Tipo de Reporte -- Notificación de Subsidios
                foreach ($arraySalarios as $idp => $persona) {
                    $sumaTotalSalariosXPersona = 0;
                    if (count($persona) >= $cantidad_meses) { //Si hay la cantidad de meses especificada
                        //sumando todos los salarios de esta persona
                        for ($v = 0; $v < $cantidad_meses; $v++) {
                            if ($persona[$v] === null) {
                                $sumaTotalSalariosXPersona += 0;
                            } else {
                                $sumaTotalSalariosXPersona += $persona[$v];
                            }
                        }
                        //hallando el salario promedio de esta persona
                        $arrayPromedioSalarioXPersona[$idp] = number_format($sumaTotalSalariosXPersona / $cantidad_meses, 2, '.', '');
                    } else { //Si no llega a la cantidad de meses especificada
                        for ($v = 0; $v < count($persona); $v++) {
                            if ($persona[$v] === null) {
                                $sumaTotalSalariosXPersona += 0;
                            } else {
                                $sumaTotalSalariosXPersona += $persona[$v];
                            }
                        }
                        //hallando el salario promedio de esta persona
                        $arrayPromedioSalarioXPersona[$idp] = number_format($sumaTotalSalariosXPersona / count($persona), 2, '.', '');
                    }

                }
            } elseif ($tipoRepo == 3) { // Tipo de Reporte -- Reporte de Licencia de Maternidad
                $arrayDatosPersonasSinProm = array();
                if (count($arrayidspersonassinsemanas) == 0) { //Si todas las personas tienen la cantidad de meses especificada
                    //Asociando las semanas a las personas
                    foreach ($arraySalarios as $idp => $persona) {
                        $sumaTotalSalariosXPersona = 0;
                        //sumando todos los salarios de esta persona
                        for ($v = 0; $v < $cantidad_meses; $v++) {
                            if ($persona[$v] === null) {
                                $sumaTotalSalariosXPersona += 0;
                            } else {
                                $sumaTotalSalariosXPersona += $persona[$v];
                            }
                        }
                        //hallando el salario promedio de esta persona
                        $arrayPromedioSalarioXPersona[$idp] = number_format($sumaTotalSalariosXPersona / $cantidad_semanas, 2, '.', '');
                    }
                } else { //Si existen personas que no tienen la cantidad de meses especificada
                    $arraypersonassemanas = array();
                    foreach ($arrayidspersonassinsemanas as $ips => $rps) {
                        $arraypersonassemanas[$rps] = $arraycantsemanasxpersona[$ips];
                    }
                    foreach ($arraySalarios as $idp => $persona) {
                        $sumaTotalSalariosXPersona = 0;
                        //sumando todos los salarios de esta persona
                        for ($v = 0; $v < $cantidad_meses; $v++) {
                            if ($persona[$v] === null) {
                                $sumaTotalSalariosXPersona += 0;
                            } else {
                                $sumaTotalSalariosXPersona += $persona[$v];
                            }
                        }
                        $validarTieneSemanasParams = $this->validarExisteSemanas($idp, $arrayidspersonassinsemanas);
                        if ($validarTieneSemanasParams) {
                            foreach ($arrayidspersonassinsemanas as $ipss => $rpss) {
                                if ($idp == $rpss) {
                                    //hallando el salario promedio de esta persona
                                    $arrayPromedioSalarioXPersona[$idp] = number_format($sumaTotalSalariosXPersona / $arraypersonassemanas[$rpss], 2, '.', '');
                                    break;
                                }
                            }
                        } else {
                            $arrayPromedioSalarioXPersona[$idp] = number_format($sumaTotalSalariosXPersona / $cantidad_semanas, 2, '.', '');
                        }

                    }
                }
            }
            //Capturando el id de conf_variablestiporeportescertificaciones
            $sqlIdSalarioVarTipoRepCert = "select idvariablesconfreportescertificaciones from mod_nomina.conf_variablestiporeportescertificaciones
		           where idconfreportescertificaciones = ? and tipovariable = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrIdSalarioVarTipoRepCert = $conn->fetchAll($sqlIdSalarioVarTipoRepCert, array($idconfreportescertificaciones, -1));
            $idSalarioVarTipoRepCert = $arrIdSalarioVarTipoRepCert[0]['idvariablesconfreportescertificaciones'];
            //$arrayidelementosrep
            foreach ($arrayPromedioSalarioXPersona as $l => $rpr) {
                $datospersonareporte = DatElementosReportesCertificaciones::obtenerIdElementosReportesCertificacionesXIdReporteIdPersona($idreportescertificaciones, $l);
                //Capturando el id de conf_variablestiporeportescertificaciones
                $sqlIdVarEleRepCert = "select idvariableselementosreportescertificaciones from mod_nomina.dat_variableselementosreportescertificaciones
		           where idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datosvariableselemento = $conn->fetchAll($sqlIdVarEleRepCert, array($datospersonareporte[0]['idelementosreportescertificaciones'], $idSalarioVarTipoRepCert));
                //Recorriendo los datvariables para salvar el salario promedio
                $datvariablesave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($datosvariableselemento[0]['idvariableselementosreportescertificaciones']);
                if ($rpr != '') {
                    $datvariablesave->valor = $rpr;
                    $datvariablesave->save();
                } else {
                    $datvariablesave->valor = 0.00;
                    $datvariablesave->save();
                }

            }
            $s->codigo = 'OK';
            $s->datos = $datos;
            echo json_encode($s);
        }
    }

    public function validarExisteSemanas($idp, $arrayidspersonassinsemanas)
    {
        $respuesta = false;
        foreach ($arrayidspersonassinsemanas as $rpr) {
            if ($rpr == $idp) {
                $respuesta = true;
                break;
            }
        }
        return $respuesta;
    }

    public function actualizarReporteAntiguedadAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idreportescertificaciones = $this->_request->getPost('idreportescertificaciones');
        $arrayPersonasElementos = DatReportesCertificacionesModel::getElementosReporte($identidad, $idreportescertificaciones);
        $arrayActualizado = DatVariablesElementosReportesCertificacionesModel::setVariablesvalor($arrayPersonasElementos, $idreportescertificaciones);
        echo json_encode('ok');
    }

    public function buscarDatosSalarioNominasAction()
    {
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        $idreportescertificaciones = $this->_request->getPost('idreportescertificaciones');
        $arridelaborarpagos = json_decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $arrconfvariable = ConfVariablesReportesCertificaciones::getVariableconfiguracionreporte($idconfreportescertificaciones);
        $idvariablesconfreportescertificaciones = $arrconfvariable[0]['idvariablesconfreportescertificaciones'];
        $objDatNominaDatos = new DatNominaDatos();
        $objDatElementosReporte = new DatElementosReportesCertificaciones();
        $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
        $objConfModeloNomina = new ConfigModeloNomina();
        $objConfEstructuraNomina = new ConfigEstructurarModelosNomina();
        //Recorriendo los periodos de pago para actualizar los valores del campo de salario
        if ($idvariablesconfreportescertificaciones) {
            foreach ($arridelaborarpagos as $rep) {
                $rtiponomina = $objConfModeloNomina->obtenerIdTiposNominaporTipoPago($rep);
                $rcamponomina = $objConfEstructuraNomina->obtenerCampoParaActualizarReportesCertificaciones($rtiponomina[0]['idtiponomina']);
                $camponomina = $rcamponomina[0]['idestructuramodelodomina'];
                if ($camponomina) {
                    //Buscando el campo de la nomina
                    $arrdatosnomina = $objDatNominaDatos->obtenerDatosNominaPorElaborarPago($rep);
                    //Datos de las nominas
                    foreach ($arrdatosnomina as $dn) {
                        $valores = unserialize($dn['valores']);
                        //Recorriendo las personas
                        foreach ($valores as $rv) {
                            $rexplode = explode('-', $rv['id']);
                            $idpersona = $rexplode[0];
                            //Si existe la persona en el reporte se suma el valor del salario mas lo que tenia en el reporte
                            $existepersonareporte = $objDatElementosReporte->existePersonaReporte($idreportescertificaciones, $idpersona);
                            $existe = $existepersonareporte[0]['count'];
                            //Si la persona esta en el reporte
                            if ($existe > 0) {
                                //Obtener el idelementosreporte para actualizar y el id datvariable
                                $ridelementoreporte = $objDatElementosReporte->devolverElementos($idreportescertificaciones, $idpersona);
                                $idelementoreporte = $ridelementoreporte[0]['idelementosreportescertificaciones'];
                                //Buscando el idvariable de este elemento
                                $ridvariable = $objDatVariablesElementosReportesCertificaciones->obtenerIdVariablesElementosReportesCertificaciones($idelementoreporte);
                                $objDatVariableElementoSave = $objDatVariablesElementosReportesCertificaciones->getByid($ridvariable[0]['idvariableselementosreportescertificaciones']);
                                $objDatVariableElementoSave->valor = $objDatVariableElementoSave->valor + $rv["c$camponomina"];
                                $objDatVariableElementoSave->save();
                                //print_r($objDatVariableElementoSave);die;
                            } else {
                                //Salvando los elementos en el reporte
                                $objDatElementosReporteSave = new DatElementosReportesCertificaciones();
                                $objDatElementosReporteSave->idreportescertificaciones = $idreportescertificaciones;
                                $objDatElementosReporteSave->idelemento = $idpersona;
                                $objDatElementosReporteSave->save();
                                $idelementosreportescertificaciones = $objDatElementosReporteSave->idelementosreportescertificaciones;
                                //Salvando en la variable
                                $objDatVariableElementoSave = new DatVariablesElementosReportesCertificaciones();
                                $objDatVariableElementoSave->idelementosreportescertificaciones = $idelementosreportescertificaciones;
                                $objDatVariableElementoSave->idvariablesconfreportescertificaciones = $idvariablesconfreportescertificaciones;
                                $objDatVariableElementoSave->valor = $rv["c$camponomina"];
                                $objDatVariableElementoSave->save();
                            }


                        }
                    }
                } else {
                    echo json_encode('NO-CAMPO-NOMINA');
                }
            }
        } else {
            echo json_encode('NO-VARIABLE-REPORTE');
        }
        echo json_encode('OK');


    }

    private function ordenarPeriodosPorFechaPago($objElaborarPagos)
    {
        if (count($objElaborarPagos->mespago) > 0) {
            for ($i = 0; $i < count($objElaborarPagos->mespago); $i++) {
                for ($j = $i + 1; $j < count($objElaborarPagos->mespago); $j++) {
                    if ($objElaborarPagos->mespago[$i]->mes < $objElaborarPagos->mespago[$j]->mes) {
                        $aux = $objElaborarPagos->mespago[$i];
                        $objElaborarPagos->mespago[$i] = $objElaborarPagos->mespago[$j];
                        $objElaborarPagos->mespago[$j] = $aux;
                    }
                }
            }
            foreach ($objElaborarPagos->mespago as $k => $objep) {
                if (!is_array($objep->datos)) {
                    unset($objElaborarPagos->mespago[$k]);
                    array_values($objElaborarPagos->mespago[$k]);
                }
            }
            return $objElaborarPagos;
        } else {
            return $objElaborarPagos;
        }
    }

    private function buscarColumnaApagar($objEstructura, $idcrmPagoSalario)
    {
        //print_r($idcrmPagoSalario);die;
        foreach ($objEstructura as $k => $e) {
            if ($e->tipocamposcalcular == 3) {
                foreach ($e->camposcalcular as $i => $cc) {
                    if ($cc->campo == $idcrmPagoSalario) {
                        //print_r($e->id);die;
                        return $e->id;
                    }
                }
            }

        }

        return -1;
    }

    public function actualizarReportePagoDestajoAction()
    {
        //Get Params
        $idreportecertificaciones = $this->_request->getPost('idreportecertificaciones');
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        $identidad = $this->_request->getPost('identidad');
        //Datos del reporte
        $datreportes = new DatReportesCertificaciones();
        $objdatelementos = new DatElementosReportesCertificaciones();
        $objDatPersonaBrigada = new DatPersonaBrigada();

        $datosreporte = $datreportes->obtenerObjReporteDadoId($idreportecertificaciones);

        //Elementos del reporte
        $arrelementosreporte = $objdatelementos->obtenerElementosReportesCertificacionesPersona($idreportecertificaciones, $identidad);

        $arraypersonas = array();
        $cont = 0;
        $fechainicio = $datosreporte->fechainicio;
        $fechafin = $datosreporte->fechafin;

        //Obteniendo las personas
        foreach ($arrelementosreporte as $i => $valor) {
            if ($valor['idelemento'] != null) {
                $arraypersonas[$cont] = $valor['idelemento'];
                $cont++;
            }
        }

        $personades = $objDatPersonaBrigada->obtenerPersonaBrigadaDadoId($arraypersonas);

        foreach ($personades as $k => $value) {
            $personades[$k]['idelementosreportescertificaciones'] = $objdatelementos->obtenerIDelementosreportescertificaciones($value['idpersona'], $idreportecertificaciones);
        }
        
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        foreach ($personades as $i => $valor) {

            $idpersona = $valor['idpersona'];
            $idvariable = ConfVariablesReportesCertificaciones::obtenetIdPorDenominacion();//print_r($idvariable);die;

            //Eliminando en DatElementosReportesCertificaciones
            $sqld = "DELETE FROM mod_nomina.dat_elementosreportescertificaciones
                WHERE idreportescertificaciones = $idreportecertificaciones and idelemento = $idpersona;";
            $conn->execute($sqld);

            //Salvando en DatElementosReportesCertificaciones
            $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado, mesinicialsnc)
            VALUES (
                $idreportecertificaciones, 
                $idpersona, 
                0,
                NULL)  returning idelementosreportescertificaciones;";
            $r = $conn->fetchAll($sql);

            $idelementosreportescertificaciones = $r[0]['idelementosreportescertificaciones'];
            $monto = $valor['montocobrar'];

            $sqlisert = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones
                    (idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)
                VALUES 
                    ($idelementosreportescertificaciones, $idvariable, $monto);";
            $conn->execute($sqlisert);

        }
        $conn->commit();
        //Cambiandole el estado al reporte para q no pueda ser editado una vez actualizado
        $objDatReportesCertificacionesSave = Doctrine::getTable('DatReportesCertificaciones')->find($idreportecertificaciones);
        $objDatReportesCertificacionesSave->estado = 1;
        $objDatReportesCertificacionesSave->save();
        echo json_encode('OK');
    }

    //Actualizar en GestionarreportesycertificacionesController
    public function actualizarReporteAusenciasServicioAction()
    {
        //Get Params
        $idreportecertificaciones = $this->_request->getPost('idreportecertificaciones');
        $idconfreporte = $this->_request->getPost('idconfreporte');
        $identidad = $this->_request->getPost('identidad');
        $idreportecertificaciones = $this->_request->getPost('idreportecertificaciones');
        //Datos del reporte
        $datreportes = new DatReportesCertificaciones();
        $confvariables = new ConfVariablesReportesCertificaciones();
        $objdatelementos = new DatElementosReportesCertificaciones();
        $objconfigcausas = new ConfigCausaInasistencia();
        $datosreporte = $datreportes->obtenerObjReporteDadoId($idreportecertificaciones);

        //Elementos del reporte
        $arrelementosreporte = $objdatelementos->obtenerElementosReportesCertificacionesPersona($idreportecertificaciones, $identidad);

        $arraypersonas = array();
        $cont = 0;
        $fechainicio = $datosreporte->fechainicio;
        $fechafin = $datosreporte->fechafin;

        //Obteniendo las personas
        foreach ($arrelementosreporte as $i => $valor) {
            if ($valor['idelemento'] != null) {
                $arraypersonas[$cont] = $valor['idelemento'];
                $cont++;
            }
        }

        //Si no hay personas que traiga todas las que ocupan cargos en la entidad
        $flag = false;
        if (empty($arraypersonas)) {
            $flag = true;
            $rpersonascargos = DatCargosOcupados::obtenerPersonasOcupanCargos($identidad);
            foreach ($rpersonascargos as $pers) {
                if (!empty($pers['idpersona'])) {
                    $arraypersonas[] = $pers['idpersona'];
                }
            }
        }

        //Obteniendo la configuracion
        $configuracion = ConfigCausaInasistencia::obtenerConfiguracion($idconfreporte);
        //Formando el arreglo de las causas
        $arraycausas = array();
        $contador = 0;
        foreach ($configuracion as $i => $valor) {
            $causas = explode(';', $valor['idcausa']);
            $configuracion[$i]['arrayidcausas'] = $causas;
            foreach ($causas as $idcausa) {
                $arraycausas[$contador] = $idcausa;
                $contador++;
            }
        }
        $arraycausas = array_values(array_unique($arraycausas));

        //Personas del apa
        $personasapa = ZendExt_IoC_Inter::getInstance()->regimentrabajo->GetAPA($arraypersonas, $fechainicio, $fechafin, $arraycausas,$identidad);
        //print_r($personasapa);die;
        //Eliminando las personas que no tienen valoes en las causas
        foreach ($personasapa as $p => $person) {
            $sumhoras = 0;
            $sumdias = 0;
            foreach ($person as $idcampo => $val) {
                if ($idcampo != 'idpersona') {
                    //Nocturnidad
                    list($noct) = explode('_', $idcampo);
                    if ($noct == 'noct') {
                        $sumhoras += $val;
                        $sumdias += 0;
                    } else {//Demas causas
                        $sumhoras += (is_numeric($idcampo)) ? $val['horas'] : $val;
                        $sumdias += (is_numeric($idcampo)) ? $val['dias'] : $val;
                    }
                }
            }
            if ($sumhoras == 0 && $sumdias == 0) {
                unset($personasapa[$p]);
            }
        }
        $personasapa = array_values($personasapa);
        //print_r($personasapa);die;

        foreach($personasapa as $p => $person){
            foreach($person as $idcampo => $campo){
                if($idcampo != 'idpersona'){
                    if($campo['mesanteriorcertificado']){
                        $personasapa[$p]['mesanteriorcertificado'] =/*'1/'. */$campo['mesanteriorcertificado'];
                    }
                }
            }
        }

        //Eliminando los valores del reporte actual
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $sql = "select * from mod_nomina.dat_elementosreportescertificaciones where idreportescertificaciones = $idreportecertificaciones";
        $arr = $conn->fetchAll($sql);
        //print_r($arr);die;
        foreach ($personasapa as $i => $valor) {
            //print_r($valor);die;
            $personasapa[$i]['idsconfvariable'] = $configuracion;
            //print_r($configuracion);die;
            //Eliminando en DatElementosReportesCertificaciones
            $sqld = "DELETE FROM mod_nomina.dat_elementosreportescertificaciones
         WHERE idreportescertificaciones= ? and idelemento = ?";
            $r = $conn->execute($sqld, array($idreportecertificaciones, $valor['idpersona']));
            $idpersona = $valor['idpersona'];
            $mesanteriorcertificado = $valor['mesanteriorcertificado'];
            if ($mesanteriorcertificado == 1) {
                $mesanterior = 12;
            } else {
                $mesanterior = $mesanteriorcertificado -1;
            }
            
            //Salvando en DatElementosReportesCertificaciones
            $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado, mesinicialsnc)
            VALUES (
                $idreportecertificaciones, 
                $idpersona, 
                0 ,$mesanterior)  returning idelementosreportescertificaciones;";
            $r = $conn->fetchAll($sql); //print_r($sql);die;
            $idelementosreportescertificaciones = $r[0]['idelementosreportescertificaciones'];
            foreach ($configuracion as $c => &$conf) {
                $conf['idelementosreportescertificaciones'] = $idelementosreportescertificaciones;
            }
            //Recorriendo la configuracion de las causas
            foreach ($personasapa[$i]['idsconfvariable'] as $j => $confvar) {
                //print_r($confvar);print_r($valor);die;
                //Sumando todas las causas para una misma variable
                $sumacausas = 0;
                list($noct) = explode('_', $confvar['idcausa']);
                if ($noct == 'noct') {//Nocturnidad
                    $sumacausas += $valor[$confvar['idcausa']];
                } else {             //Demas causas
                    foreach ($confvar['arrayidcausas'] as $idcausa) {

                        if (is_array($valor[$idcausa])) {
                            $sumacausas += ($confvar['horasdias'] == 2) ? $valor[$idcausa]['dias'] : $valor[$idcausa]['horas'];
                        } else {
                            $sumacausas += $valor[$idcausa];
                        }
                    }
                }

                $existe = ConfigCausaInasistencia::existeIdVariable($confvar['idvariablesconfreportescertificaciones']);
                if ($existe != 0) {
                    //$idcausa = ConfigCausaInasistencia::obtenerCausaXIdVariable($confvar['idvariablesconfreportescertificaciones']);
                    if ($sumacausas >= 0) {
                        $sql = "delete from mod_nomina.dat_variableselementosreportescertificaciones where idvariableselementosreportescertificaciones = ?";
                        $conn->execute($sql, array($confvar['idvariableselementosreportescertificaciones']));
                        $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
      VALUES ({$idelementosreportescertificaciones}, {$confvar['idvariablesconfreportescertificaciones']}, {$sumacausas});";
                        $conn->execute($sql);
                    }
                } else {
                    $sql = "delete from mod_nomina.dat_variableselementosreportescertificaciones where idvariableselementosreportescertificaciones = ?";
                    $conn->execute($sql, array($confvar['idvariableselementosreportescertificaciones']));
                    $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
            VALUES ({$idelementosreportescertificaciones}, {$confvar['idvariablesconfreportescertificaciones']}, 0);";
                    $conn->execute($sql);
                }
            }
        }
        //Si el reporte es de vacaciones se calcula el saldo en tiempo e  importe de las vacaciones
        $tiporeporte = ConfReportesCertificaciones::obtenerComportamiento($idconfreporte);
        if ($tiporeporte == 2) {
            $arrIdsEl = $objdatelementos->obtenerIdElementosXIdReporte($idreportecertificaciones);
            $arrElementos = array();
            foreach ($arrIdsEl as $el => $arrel) {
                $arrElementos[] = $arrel['idelementosreportescertificaciones'];
            }
            $this->calcularacumuladoDiaseImporte($idreportecertificaciones, $arrElementos, $identidad);
        }
        $conn->commit();
        //Cambiandole el estado al reporte para q no pueda ser editado una vez actualizado
        $objDatReportesCertificacionesSave = Doctrine::getTable('DatReportesCertificaciones')->find($idreportecertificaciones);
        $objDatReportesCertificacionesSave->estado = 1;
        $objDatReportesCertificacionesSave->save();
        echo json_encode('OK');
    }

    /*public function actualizarReporteAusenciasServicioAction()
    {
        //Get Params
        $idreportecertificaciones = $this->_request->getPost('idreportecertificaciones');
        $idconfreporte = $this->_request->getPost('idconfreporte');
        $identidad = $this->_request->getPost('identidad');
        $idreportecertificaciones = $this->_request->getPost('idreportecertificaciones');
        //Datos del reporte
        $datreportes = new DatReportesCertificaciones();
        $confvariables = new ConfVariablesReportesCertificaciones();
        $objdatelementos = new DatElementosReportesCertificaciones();
        $objconfigcausas = new ConfigCausaInasistencia();
        $datosreporte = $datreportes->obtenerObjReporteDadoId($idreportecertificaciones);

        //Elementos del reporte
        $arrelementosreporte = $objdatelementos->obtenerElementosReportesCertificacionesPersona($idreportecertificaciones, $identidad);

        $arraypersonas = array();
        $cont = 0;
        $fechainicio = $datosreporte->fechainicio;
        $fechafin = $datosreporte->fechafin;

        //Obteniendo las personas
        foreach ($arrelementosreporte as $i => $valor) {
            if ($valor['idelemento'] != null) {
                $arraypersonas[$cont] = $valor['idelemento'];
                $cont++;
            }
        }

        //Si no hay personas que traiga todas las que ocupan cargos en la entidad
        $flag = false;
        if (empty($arraypersonas)) {
            $flag = true;
            $rpersonascargos = DatCargosOcupados::obtenerPersonasOcupanCargos($identidad);
            foreach ($rpersonascargos as $pers) {
                if (!empty($pers['idpersona'])) {
                    $arraypersonas[] = $pers['idpersona'];
                }
            }
        }

        //Obteniendo la configuracion
        $configuracion = ConfigCausaInasistencia::obtenerConfiguracion($idconfreporte);
        //Formando el arreglo de las causas
        $arraycausas = array();
        $contador = 0;
        foreach ($configuracion as $i => $valor) {
            $causas = explode(';', $valor['idcausa']);
            $configuracion[$i]['arrayidcausas'] = $causas;
            foreach ($causas as $idcausa) {
                $arraycausas[$contador] = $idcausa;
                $contador++;
            }
        }
        $arraycausas = array_values(array_unique($arraycausas));


        //Personas del apa
        $personasapa = ZendExt_IoC_Inter::getInstance()->regimentrabajo->GetAPA($arraypersonas, $fechainicio, $fechafin, $arraycausas);
        //print_r($personasapa);die;
        //Eliminando las personas que no tienen valores en las causas
        foreach ($personasapa as $p => $person) {
            $sumhoras = 0;
            $sumdias = 0;
            foreach ($person as $idcampo => $val) {
                if ($idcampo != 'idpersona') {
                    $sumhoras += (is_numeric($idcampo)) ? $val['horas'] : $val;
                    $sumdias += (is_numeric($idcampo)) ? $val['dias'] : $val;
                }
            }
            if ($sumhoras == 0 && $sumdias == 0){
                unset($personasapa[$p]);
            }

        }
        $personasapa = array_values($personasapa);
        //print_r($personasapa);die;

        //Eliminando los valores del reporte actual
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        foreach ($personasapa as $i => $valor) {
            $personasapa[$i]['idsconfvariable'] = $configuracion;
            //Eliminando en DatElementosReportesCertificaciones
            $sqld = "DELETE FROM mod_nomina.dat_elementosreportescertificaciones
					WHERE idreportescertificaciones= ? and idelemento = ?";
            $r = $conn->execute($sqld, array($idreportecertificaciones, $valor['idpersona']));
            //Salvando en DatElementosReportesCertificaciones
            $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado)
			VALUES ({$idreportecertificaciones}, {$valor['idpersona']}, 0) returning idelementosreportescertificaciones;";
            $r = $conn->fetchAll($sql);
            $idelementosreportescertificaciones = $r[0]['idelementosreportescertificaciones'];
            foreach ($configuracion as $c => &$conf) {
                $conf['idelementosreportescertificaciones'] = $idelementosreportescertificaciones;
            }
            //Recorriendo la configuracion de las causas
            foreach ($personasapa[$i]['idsconfvariable'] as $j => $confvar) {
                //Sumando todas las causas para una misma variable
                $sumacausas = 0;
                foreach ($confvar['arrayidcausas'] as $idcausa) {
                    if(is_array($valor[$idcausa])){
                        $sumacausas += ($confvar['horasdias'] == 2) ? $valor[$idcausa]['dias'] : $valor[$idcausa]['horas'];
                    }else{
                        $sumacausas += $valor[$idcausa];
                    }
                }

                $existe = ConfigCausaInasistencia::existeIdVariable($confvar['idvariablesconfreportescertificaciones']);
                if ($existe != 0) {
                    //$idcausa = ConfigCausaInasistencia::obtenerCausaXIdVariable($confvar['idvariablesconfreportescertificaciones']);
                    if ($sumacausas >= 0) {
                        $sql = "delete from mod_nomina.dat_variableselementosreportescertificaciones where idvariableselementosreportescertificaciones = ?";
                        $conn->execute($sql, array($confvar['idvariableselementosreportescertificaciones']));
                        $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
					      VALUES ({$idelementosreportescertificaciones}, {$confvar['idvariablesconfreportescertificaciones']}, {$sumacausas});";
                        $conn->execute($sql);
                    }
                } else {
                    $sql = "delete from mod_nomina.dat_variableselementosreportescertificaciones where idvariableselementosreportescertificaciones = ?";
                    $conn->execute($sql, array($confvar['idvariableselementosreportescertificaciones']));
                    $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
					  				VALUES ({$idelementosreportescertificaciones}, {$confvar['idvariablesconfreportescertificaciones']}, 0);";
                    $conn->execute($sql);
                }
            }
        }
        //Si el reporte es de vacaciones se calcula el saldo en tiempo e  importe de las vacaciones
        $tiporeporte = ConfReportesCertificaciones::obtenerComportamiento($idconfreporte);
        if ($tiporeporte == 2) {
            $arrIdsEl = $objdatelementos->obtenerIdElementosXIdReporte($idreportecertificaciones);
            $arrElementos = array();
            foreach ($arrIdsEl as $el => $arrel) {
                $arrElementos[] = $arrel['idelementosreportescertificaciones'];
            }
            $this->calcularacumuladoDiaseImporte($idreportecertificaciones, $arrElementos, $identidad);
        }
        $conn->commit();
        //Cambiandole el estado al reporte para q no pueda ser editado una vez actualizado
        $objDatReportesCertificacionesSave = Doctrine::getTable('DatReportesCertificaciones')->find($idreportecertificaciones);
        $objDatReportesCertificacionesSave->estado = 1;
        $objDatReportesCertificacionesSave->save();
        echo json_encode('OK');
    }*/

    public function modificarelementosreportescertificacionesAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $elementos = json_decode(stripslashes($this->_getParam('elementos')));
        $variables = json_decode(stripslashes($this->_getParam('variables')));
        $idtipoconfreportescertificaciones = json_decode(stripslashes($this->_getParam('idtipoconfreportescertificaciones')));
        $estado = $this->_getParam('estado');
        $aprobar = $this->_getParam('aprobar');
        $conformar = $this->_getParam('conformar');
        $idconfreporte = $this->_getParam('idconfreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        $accion = $this->_getParam('accion');
        $objdatelementos = new DatElementosReportesCertificaciones();
        $objDRC = new DatReportesCertificaciones();
        $datosreporte = $objDRC->obtenerReportesCertificaciones($idreportescertificaciones);
        $periodoinicio = $datosreporte[0]['fechainicio'];
        $periodofin = $datosreporte[0]['fechafin'];
        $periodo = $periodoinicio . '-' . $periodofin;

        //Si tiene variables con expresiones matematicas se calculan las variables
        $cantidadexpmat = ConfVariablesReportesCertificaciones::obtenerVariablesExpresionMatematica($idconfreporte);
        if ($cantidadexpmat > 0 && $accion == 'REC') {
            $elementos = $this->calcularVariablesExpresionMatematica($idreportescertificaciones, $identidad, $idconfreporte, $elementos, $periodo);
        }
        if ($estado == 1) {
            $objM = new DatVariablesElementosReportesCertificacionesModel();
            //
            $objM->modificarElementosReportesCertificaciones($elementos, $variables, $idtipoconfreportescertificaciones, $idreportescertificaciones);
            //Si el reporte es de vacaciones se calcula el saldo en tiempo e  importe de las vacaciones
            $comportamiento = ConfReportesCertificaciones::obtenerComportamiento($idconfreporte);
            if ($comportamiento == 2) {
                $arrIdsEl = $objdatelementos->obtenerIdElementosXIdReporte($idreportescertificaciones);
                $arrElementos = array();
                foreach ($arrIdsEl as $el => $arrel) {
                    $arrElementos[] = $arrel['idelementosreportescertificaciones'];
                }
                $this->calcularacumuladoDiaseImporte($idreportescertificaciones, $arrElementos, $identidad);
            }
            $r->codigo = 'MOD-1';
        } else if ($estado == 2 && $conformar == -1) {
            $objM = new DatElementosReportesCertificacionesModel();
            $objM->modificararrElementosReportesCertificaciones($idreportescertificaciones, $elementos);
            $r->codigo = 'MOD-1';
        } else if ($estado == 2 && $conformar == 1) {
            $objM = new DatReportesCertificacionesModel();
            $objM->cambiarEstadoReportesCertificaciones($idreportescertificaciones, $estado);
            $r->codigo = 'CONFORMAR-1';
        } else if ($estado == 3) {
            $objM = new DatReportesCertificacionesModel();
            $objE = new DatElementosReportesCertificaciones();
            $datos = $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
            $objM->cambiarEstadoReportesCertificaciones($idreportescertificaciones, $estado, $datos);
            $r->codigo = 'APROBAR-1';
        }

        echo json_encode($r);

    }

    public function calcularVariablesExpresionMatematica($idreportescertificaciones, $identidad, $idconfreporte, $elementos, $periodo)
    {
        $iocInterno = ZendExt_IoC_Inter::getInstance();
        $objConfCalendario = new ConfCalendarioSNC();
        $objDatGestionarNominas = new DatGestionarNominasModel();
        $objRegistroSalario = new GestRegistroSalarioTiempoServicioModel();
        $objDatVariablesReporte = new DatVariablesElementosReportesCertificaciones();
        $arrexpresionescalcular = ConfVariablesReportesCertificaciones::obtenerTosoVariablesExpresionMatematica($idconfreporte);
        $arrreporte = DatReportesCertificaciones::obtenerReportesCertificaciones($idreportescertificaciones);
        $arrannomes = explode('/', $arrreporte[0]['fechainicio']);
        //Expresionesmatematicas
        if (count($arrexpresionescalcular) > 0) {
            $arrexpresionesmatematicas = array();
            //Sincronizando las formulas
            foreach ($arrexpresionescalcular as $rcvar) {
                if ($rcvar['idexpresionmatematica']) {
                    $arrexpresionesmatematicas[] = $rcvar['idexpresionmatematica'];
                }
                if ($rcvar['idexpresionmatematicahistoriconominasreportes']) {
                    $arrexpresionesmatematicas[] = $rcvar['idexpresionmatematicahistoriconominasreportes'];
                }

            }
            $respuesta = $iocInterno->comun->GuardarExpresionesMatematicas($arrexpresionesmatematicas);
            if ($respuesta == 'ok') {
                foreach ($arrexpresionescalcular as $idvar=> $rexp) {
                    if (count($elementos) > 0) {
                        foreach ($elementos as $ie => $pe) {
                            $idpersona = $pe->idelemento;
                            $mesinicial = null;
                            if($rexp['idvariablesconfreportescertiicacionesmesinicial']){
                                $mesinicial = $pe->$rexp['idvariablesconfreportescertiicacionesmesinicial'];
                            }
                            elseif($pe->mesinicialsnc){
                                $mesinicial = $pe->mesinicialsnc;
                            }//nuevo
                            try {                            
                                  $mesesreporte = ConfReportesCertificaciones::obtenerMesesReporte($idconfreporte);
                                  // Validar que $mesesreporte no sea null o vacío
                                  if (empty($mesesreporte) || $mesesreporte === null) {
                                      throw new Exception("El valor de 'mesesreporte' obtenido por ConfReportesCertificaciones::obtenerMesesReporte($idconfreporte), es nulo para el reporte con ID: $idconfreporte ; se asume el valor por defecto 12 para GestRegistroSalarioTiempoServicioModel.calcularSalarioTotalPersonaSNC");
                                  }
                        
                            } catch (Exception $e) {
                                  // Registrar el error y continuar con valor por defecto
                                  error_log("Error en calcularVariablesExpresionMatematica: " . $e->getMessage());
                                  $mesesreporte = 12; // Valor por defecto o según lógica de negocio
                            }//nuevo   
                            //$mesesreporte = ConfReportesCertificaciones::obtenerMesesReporte($idconfreporte);
                            //Valor de la variable en base de datos
                            $valorvariable = $objDatVariablesReporte->obtenerValorDatVariablesElementosReportesCertificacionesXConf($pe->idelementosreportescertificaciones, $rexp['idvariablesconfreportescertificaciones']);
                            $arrformulaind = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($rexp['idexpresionmatematica']);
                            $expresion = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($rexp['idexpresionmatematica']));
                            $expmostrar = $expresion[0]['expresionacalcular'];
                            $arrayind = array();
                            $conteval = 0;
                            foreach ($arrformulaind as $rif) {
                                $arraynom = array();
                                $rexplode = explode('_', $rif);
                                //Cantidad de meses
                                if ($rexplode[0] == 'CM') {
                                    $tiposnominas = $rexp['tiposnomina'];
                                    $snc225 = $objRegistroSalario->calcularSalarioTotalPersonaSNC($idpersona, $identidad, $mesesreporte, $tiposnominas, $mesinicial, $rexp['lugaresdecimales'], $periodo);
                                    $arrayind[$conteval]['idindicador'] = $rif;
                                    $arrayind[$conteval]['valor'] = ($snc225->cantidadmeses) ? $snc225->cantidadmeses : 0;
                                    $conteval++;
                                    //Salario total
                                } else if ($rexplode[0] == 'ST') {
                                    $tiposnominas = $rexp['tiposnomina'];
                                    $snc225 = $objRegistroSalario->calcularSalarioTotalPersonaSNC($idpersona, $identidad, $mesesreporte, $tiposnominas, $mesinicial, $rexp['lugaresdecimales'], $periodo);
                                    $arrayind[$conteval]['idindicador'] = $rif;
                                    $arrayind[$conteval]['valor'] = ($snc225->totalsalariosnc) ? $snc225->totalsalariosnc : 0;
                                    $conteval++;
                                    //Dias habiles
                                } else if ($rexplode[0] == 'DA') {
                                    $diashab = $objConfCalendario->obtenerDiasHabiles($arrannomes[1], $arrannomes[2]);
                                    $arrayind[$conteval]['idindicador'] = $rif;
                                    $arrayind[$conteval]['valor'] = ($diashab) ? $diashab : 0;
                                    $conteval++;
                                    //Valor de otro reporte
                                } else if ($rexplode[0] == 'F') {
                                    $valor = $objDatVariablesReporte->obtenerValorVariablexIdConfVariableFeschasReporte($rexplode[1], $idpersona, $identidad, $arrreporte[0]['fechainicio'], $arrreporte[0]['fechafin']);
                                    $arrayind[$conteval]['idindicador'] = $rif;
                                    $arrayind[$conteval]['valor'] = ($valor) ? $valor : 0;
                                    $conteval++;
                                    //Variable del mismo reporte
                                } else if ($rexplode[0] == 'VAR') {
                                    $arrayind[$conteval]['idindicador'] = $rif;
                                    $arrayind[$conteval]['valor'] = ($elementos[$ie]->$rexplode[1]) ? $elementos[$ie]->$rexplode[1] : 0;
                                    $conteval++;
                                } else {
                                    $arrayind[$conteval]['idindicador'] = $rif;
                                    $arrayind[$conteval]['valor'] = 0;
                                    $conteval++;
                                }

                            }
                            $valorfind = $objDatGestionarNominas->EvaluarExpresionMatematica($arrayind, $expmostrar);
                            ($valorfind->codigo == 1) ? $elementos[$ie]->$rexp['idvariablesconfreportescertificaciones'] = number_format($valorfind->valor, $rexp['lugaresdecimales'], '.', '') : 0;
                            //}
                        }
                    }
                }
            }
        }
        return $elementos;
    }

    public function eliminarelementosreportescertificacionesAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        $elementos = json_decode(stripslashes($this->_getParam('elementos')));
        $objM = new DatElementosReportesCertificacionesModel();
        $objM->eliminarElementosReportesCertificaciones($idreportescertificaciones, $elementos);

        //Actualizando las personas restantes en el reporte en ElaborarPagos
        $pers_rep = $this->obtenerPeriodoPagoReporte($idreportescertificaciones, $identidad);
        if (count($pers_rep) > 0) {
            $objElaborarPago = new ElaborarpagosController();
            $objElaborarPago->adicionarpersonasperiodo($pers_rep['idelaborarpagos'], $pers_rep['identidad'], $pers_rep['idperiodopago'],
                $pers_rep['modoseleccionpersonas'], $pers_rep['idtipopago'], $pers_rep['fechainicio'], $pers_rep['fechafin']);
        }

        $r->codigo = 'DEL-1';
        echo json_encode($r);
    }

    public function importardatosreporteausenciasAction()
    {

        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $identidad = $this->_getParam('identidad');
        $arrayCiNoMachean = array();
        $textCiNoMachean = '';

        //Para archivos xls. OJO no pincha para .xlsx
        $inputFileType = 'Excel5';
        $dir_file = $_FILES['fileUpload']['tmp_name'];
        //Creando un Reader de PhpExcel para 2005
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objReader->setReadDataOnly(true);
        //Si la direccion del archivo existe
        if (file_exists($dir_file)) {

            //Cargando el archivo
            $objPHPExcel = $objReader->load($dir_file);
            //Obteniendo los datos en un array
            $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            if (count($worksheettoarray) > 1) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();

                try {
                $arreporte = DatReportesCertificaciones::obtenerObjReporteDadoId($idreportescertificaciones);
                $idconftiporep = $arreporte->idconfreportescertificaciones;
                //Limpio los valores previos que pudo tener el reporte
                $arridelementosreporte = DatElementosReportesCertificaciones::obtenerIdElementosReportesCertificacionesXIdReporte($idreportescertificaciones);
                if (count($arridelementosreporte) > 0) {
                    foreach ($arridelementosreporte as $contelem => $relem) {
                        $arridvariablesxidelemento = DatVariablesElementosReportesCertificaciones::obtenerIdVariablesElementosReportesCertificaciones($relem['idelementosreportescertificaciones']);
                        foreach ($arridvariablesxidelemento as $contvar => $rvariables) {
                            $datvariableeliminar = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rvariables['idvariableselementosreportescertificaciones']);
                            $datvariableeliminar->delete();
                        }
                        $datelementoseliminar = DatElementosReportesCertificaciones::obtenerObjDatElementosReportesCertificacionesDadoId($relem['idelementosreportescertificaciones']);
                        $datelementoseliminar->delete();
                    }
                }
                //Buscando los datos de la configuracion
                $sqlConfImportar = "select * from mod_rrhhmaestro.conf_importarexcel
						            where identidad = ? and iddominio = 4 and idelemento = ?;";

                $arrconfimportar = $conn->fetchAll($sqlConfImportar, array($identidad, $idconftiporep));
                $columnaclavebusqueda = preg_split("/[\\s]+/", trim($arrconfimportar[0]['columnaclavebusqueda']))[0];

                //Recorro el array para salvar los datos en el reporte
                $pos = 0;
                //$objDatVariablesElementosReportesCertificaciones = new Doctrine_Collection('DatVariablesElementosReportesCertificaciones');
                foreach ($worksheettoarray as $i => $arrworksheet) {

                    if ($i >= $arrconfimportar[0]['filainicial']) {
                        //Dame los datos de la primera persona pasandole su # de carnet
                        $sqlDatosPersona = "select dp.idpersona from mod_persona.dat_persona dp
						   inner join mod_persona.dat_docidentidad dpdoc on(dpdoc.idpersona = dp.idpersona)
						   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona and dco.identidad = ?)
						   where dpdoc.numero ilike ? and dp.feliminado is null and dpdoc.principal = 1;";
                        $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($identidad, $arrworksheet["$columnaclavebusqueda"]));
                        if ($arrdatpersona[0]['idpersona'] != "" || $arrdatpersona[0]['idpersona'] != null) {
                            $sqlimp = "select * from mod_rrhhmaestro.conf_importarcamposexcel
						            where idimportarexcel = ?;";
                            $arrimportarind = $conn->fetchAll($sqlimp, array($arrconfimportar[0]['idimportarexcel']));

                            //Salvando en DatElementosReportesCertificaciones
                            $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado)
                            VALUES (?, ?, 0) returning idelementosreportescertificaciones;";
                            $r = $conn->fetchAll($sql, array($idreportescertificaciones, $arrdatpersona[0]['idpersona']));
                            $idelemento = $r[0]['idelementosreportescertificaciones'];

                            foreach ($arrimportarind as $iim => $rimp) {
                                //Salvando en DatVariablesElementosReportesCertificaciones
                                $columna = explode(":", $rimp['columnafila'])[0];
                                $valor = ($arrworksheet["$columna"] != "" || $arrworksheet["$columna"] != null) ? $arrworksheet["$columna"] : 0;
                                $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones (idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
                                VALUES (?, ?, ?);";
                                $conn->execute($sql, array($idelemento, $rimp['idcampo'], $valor));
                            }
                        } else {
                            array_push($arrayCiNoMachean, $arrworksheet["$columnaclavebusqueda"]);
                            $textCiNoMachean = $textCiNoMachean . ' , ' . $arrworksheet["$columnaclavebusqueda"];
                        }
                    }
                }
                //$objDatVariablesElementosReportesCertificaciones->save();
                $conn->commit();

                $r['success'] = true;
                $r['cipersonasnomachean'] = $arrayCiNoMachean;
                $r['personasnomachean'] = (count($arrayCiNoMachean) > 0) ? true : false;
                $r['textpersonasnomachean'] = $textCiNoMachean;
                echo json_encode($r);
            } catch (Exception $e) {
                $conn->rollback();
                error_log("Error en importardatosreporteausencias: " . $e->getMessage());
                echo json_encode(array(
                    'success' => false,
                    'error' => 'Error al importar los datos: ' . $e->getMessage()
                ));
            }
                return;
            } else {
                echo json_encode('NOPERSONA');
            }
        } else {
            echo json_encode('NOFILE');
        }
    }

    public function importardatosreportedescuentosnoaplicadosAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        //Para archivos xls. OJO no pincha para .xlsx
        $inputFileType = 'Excel5';
        $dir_file = $_FILES['fileUpload']['tmp_name'];
        //Creando un Reader de PhpExcel para 2005
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objReader->setReadDataOnly(true);
        //Si la direccion del archivo existe
        if (file_exists($dir_file)) {
            //Cargando el archivo
            $objPHPExcel = $objReader->load($dir_file);
            //Obteniendo los datos en un array
            $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            if (count($worksheettoarray) > 1) {
                //Limpio los valores previos que pudo tener el reporte
                $arridelementosreporte = DatElementosReportesCertificaciones::obtenerIdElementosReportesCertificacionesXIdReporte($idreportescertificaciones);
                if (count($arridelementosreporte) > 0) {
                    foreach ($arridelementosreporte as $contelem => $relem) {
                        $arridvariablesxidelemento = DatVariablesElementosReportesCertificaciones::obtenerIdVariablesElementosReportesCertificaciones($relem['idelementosreportescertificaciones']);
                        foreach ($arridvariablesxidelemento as $contvar => $rvariables) {
                            $datvariableeliminar = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rvariables['idvariableselementosreportescertificaciones']);
                            $datvariableeliminar->delete();
                        }
                        $datelementoseliminar = DatElementosReportesCertificaciones::obtenerObjDatElementosReportesCertificacionesDadoId($relem['idelementosreportescertificaciones']);
                        $datelementoseliminar->delete();
                    }
                }
                //Obteniendo el campo del reporte donde se debe guardar
                $confvariable = ConfVariablesReportesCertificaciones::obtenerIdVariablesDescuentosNoAplicados();
                //Recorro el array para salvar los datos en el reporte
                $pos = 0;
                $objDatVariablesElementosReportesCertificaciones = new Doctrine_Collection('DatVariablesElementosReportesCertificaciones');
                foreach ($worksheettoarray as $i => $arrworksheet) {
                    //_printr($arrworksheet);die;
                    if ($i > 1) {
                        //Dame los datos de la primera persona pasandole su # de carnet
                        $sqlDatosPersona = "select dp.idpersona from mod_persona.dat_persona dp
						   inner join mod_persona.dat_docidentidad dpdoc on(dpdoc.idpersona = dp.idpersona)
						   where dpdoc.numero ilike '" . $arrworksheet['A'] . "' and dp.feliminado is null and dpdoc.principal = 1;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
                        if ($arrdatpersona[0]['idpersona'] != "" || $arrdatpersona[0]['idpersona'] != null) {
                            //Salvando la persona en DatElementoReporte
                            $objDatElementoInsertar = new DatElementosReportesCertificaciones();
                            $objDatElementoInsertar->idreportescertificaciones = $idreportescertificaciones;
                            $objDatElementoInsertar->idelemento = $arrdatpersona[0]['idpersona'];
                            $objDatElementoInsertar->aprobado = 0;
                            $objDatElementoInsertar->save();
                            //Salvando por posciones
                            $objDatVariablesElementosReportesCertificaciones[$pos]->idelementosreportescertificaciones = $objDatElementoInsertar->idelementosreportescertificaciones;
                            $objDatVariablesElementosReportesCertificaciones[$pos]->idvariablesconfreportescertificaciones = $confvariable[0]['idvariablesconfreportescertificaciones'];
                            $objDatVariablesElementosReportesCertificaciones[$pos]->valor = (abs($arrworksheet['C']) != "" || abs($arrworksheet['C']) != null) ? abs($arrworksheet['C']) : 0;
                            ++$pos;
                        }
                    }
                }
                $objDatVariablesElementosReportesCertificaciones->save();
                $r['success'] = true;
                echo json_encode($r);
                return;
            } else {
                echo json_encode('NOPERSONA');
            }
        } else {
            echo json_encode('NOFILE');
        }
    }

    public function importardatosreportetrtAction()
    {
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        //Para archivos xls. OJO no pincha para .xlsx
        $inputFileType = 'Excel5';
        $dir_file = $_FILES['fileUpload']['tmp_name'];
        //Creando un Reader de PhpExcel para 2005
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objReader->setReadDataOnly(true);
        //Si la direccion del archivo existe
        if (file_exists($dir_file)) {
            //Cargando el archivo
            $objPHPExcel = $objReader->load($dir_file);
            //Obteniendo los datos en un array
            $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            if (count($worksheettoarray) > 1) {
                //Limpio los valores previos que pudo tener el reporte
                $arridelementosreporte = DatElementosReportesCertificaciones::obtenerIdElementosReportesCertificacionesXIdReporte($idreportescertificaciones);
                if (count($arridelementosreporte) > 0) {
                    foreach ($arridelementosreporte as $contelem => $relem) {
                        $arridvariablesxidelemento = DatVariablesElementosReportesCertificaciones::obtenerIdVariablesElementosReportesCertificaciones($relem['idelementosreportescertificaciones']);
                        foreach ($arridvariablesxidelemento as $contvar => $rvariables) {
                            $datvariableeliminar = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($rvariables['idvariableselementosreportescertificaciones']);
                            $datvariableeliminar->delete();
                        }
                        $datelementoseliminar = DatElementosReportesCertificaciones::obtenerObjDatElementosReportesCertificacionesDadoId($relem['idelementosreportescertificaciones']);
                        $datelementoseliminar->delete();
                    }
                }
                //Recorro el array para salvar los datos en el reporte
                $pos = 0;
                $objDatVariablesElementosReportesCertificaciones = new Doctrine_Collection('DatVariablesElementosReportesCertificaciones');
                foreach ($worksheettoarray as $i => $arrworksheet) {
                    //print_r($arrworksheet);die;
                    if ($i > 1) {
                        //Dame los datos de la primera persona pasandole su # de carnet
                        $sqlDatosPersona = "select dp.idpersona from mod_persona.dat_persona dp
						   inner join mod_persona.dat_docidentidad dpdoc on(dpdoc.idpersona = dp.idpersona)
						   where dpdoc.numero ilike '" . $arrworksheet['A'] . "' and dp.feliminado is null and dpdoc.principal = 1;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
                        if ($arrdatpersona[0]['idpersona'] != "" || $arrdatpersona[0]['idpersona'] != null) {
                            //Salvando la persona en DatElementoReporte
                            $objDatElementoInsertar = new DatElementosReportesCertificaciones();
                            $objDatElementoInsertar->idreportescertificaciones = $idreportescertificaciones;
                            $objDatElementoInsertar->idelemento = $arrdatpersona[0]['idpersona'];
                            $objDatElementoInsertar->aprobado = 0;
                            $objDatElementoInsertar->save();
                            //Buscando el con variable
                            $confvariable = ConfVariablesReportesCertificaciones::obtenerIdVariablesTRT();

                            //Salvando por posciones
                            $objDatVariablesElementosReportesCertificaciones[$pos]->idelementosreportescertificaciones = $objDatElementoInsertar->idelementosreportescertificaciones;
                            $objDatVariablesElementosReportesCertificaciones[$pos]->idvariablesconfreportescertificaciones = $confvariable[0]['idvariablesconfreportescertificaciones'];
                            $objDatVariablesElementosReportesCertificaciones[$pos]->valor = ($arrworksheet['C'] != "" || $arrworksheet['C'] != null) ? $arrworksheet['C'] : 0;
                            ++$pos;

                        }
                    }
                }
                $objDatVariablesElementosReportesCertificaciones->save();
                $r['success'] = true;
                echo json_encode($r);
                return;
            } else {
                echo json_encode('NOPERSONA');
            }
        } else {
            echo json_encode('NOFILE');
        }
    }

    public function ExportarAction()
    {
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $historico = $this->_getParam('historico');
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $tipoelemento = $this->_getParam('tipoelemento');
        $identidad = $this->_getParam('identidad');
        $tipodocumento = $this->_getParam('tipodocumento');
        $tipoexcel = $this->_getParam('tipoexcel');
        $objM = new ReporteExportarExcelModel();
        $objM->exportarReporte($idconfreportescertificaciones, $idreportescertificaciones, $tipoelemento, $historico, $identidad, $tipodocumento, $tipoexcel);
        echo json_encode('OK');
    }

    public function ExportarModeloSC404Action()
    {
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $historico = $this->_getParam('historico');
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $tipoelemento = $this->_getParam('tipoelemento');
        $identidad = $this->_getParam('identidad');
        $tipodocumento = $this->_getParam('tipodocumento');
        $idpersona = $this->_getParam('idpersona');
        $objM = new ReporteExportarExcelModel();
        $objM->fnExportarReporteSC404($idconfreportescertificaciones, $idreportescertificaciones, $tipoelemento, $historico, $identidad, $tipodocumento, $idpersona);
        echo json_encode('OK');
    }

    public function actualizarReporteDesdeReporteAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        //Arbol de reportes actuales
        $arbol[0]['id'] = 'rootactual';
        $arbol[0]['text'] = 'Reportes';
        $arbol[0]['leaf'] = false;
        $arbol[0]['parent'] = false;
        $arbol[0]['children'] = $this->buscarHijosActuales($identidad, $idconfreportescertificaciones); //print_r($arbol);die;
        echo json_encode($arbol);

    }

    private function buscarHijosActuales($identidad, $idconfreportescertificaciones)
    {
        $arbol = array();
        $arrayidvariablesrepanterior = array();
        $arrvariablesreporteanterior = ConfReportesCertificaciones::obtenerVariablesReportesAnterioresXIdConfReporte($idconfreportescertificaciones);
        foreach ($arrvariablesreporteanterior as $rvarra) {
            $arrayidvariablesrepanterior[] = $rvarra['idvariablesconfreportescertificacionesreportesanteriores'];
        }
        if (count($arrayidvariablesrepanterior) > 0) {
            $arrtiporeportes = ConfReportesCertificaciones::obtenerTiposReportesCertificacionesXIdVariablesReportesAnteriores($arrayidvariablesrepanterior);
            foreach ($arrtiporeportes as $i => $value) {
                //Arreglo de variables
                $arrayvariables = ConfVariablesReportesCertificaciones::obtenerVariablesReportesCertificacionesByIdReporte($value['idconfreportescertificaciones']);
                $arbol[$i]['id'] = 'c' . $value['idconfreportescertificaciones'];
                $arbol[$i]['text'] = $value['denominacion'];
                $arbol[$i]['leaf'] = (count($arrayvariables) > 0) ? false : true;
                $arbol[$i]['parent'] = 'rootactual';
                $arbol[$i]['children'] = $this->buscarHijosReportesActuales($value['idconfreportescertificaciones'], $arrayvariables, $identidad);
            }
        }

        return $arbol;
    }

    private function buscarHijosReportesActuales($idconfreportescertificaciones, $arrayvariables, $identidad)
    {
        $arrayreportes = DatReportesCertificaciones::obtenerReportesCertificacionesActual($idconfreportescertificaciones, $identidad);
        $arbol = array();
        foreach ($arrayreportes as $i => $rvariable) {
            $arbol[$i]['id'] = $rvariable['idreportescertificaciones'];
            $arbol[$i]['text'] = $rvariable['fechainicio'] . '-' . $rvariable['fechafin'];
            //$arbol[$i]['leaf'] = false;
            $arbol[$i]['leaf'] = true;
            $arbol[$i]['checked'] = false;
            $arbol[$i]['parent'] = $idconfreportescertificaciones;
            //$arbol[$i]['children'] = $this->buscarHijosVariablesReportesActuales($arrayvariables, $rvariable['idreportescertificaciones']);
        }
        return $arbol;
    }

    private function buscarHijosVariablesReportesActuales($arrayvariables, $idreportescertificaciones)
    {
        $arbol = array();
        foreach ($arrayvariables as $i => $var) {
            $arbol[$i]['id'] = $var['idvariablesconfreportescertificaciones'];
            $arbol[$i]['text'] = $var['denominacion'];
            $arbol[$i]['leaf'] = true;
            $arbol[$i]['parent'] = $idreportescertificaciones;
        }
        return $arbol;
    }

    public function actualizarReporteDesdeReportesAnterioresAction()
    {
        $idconfreportescertificaciones = $this->_request->getPost('idconfreporte');
        $idreportescertificaciones = $this->_request->getPost('idreportescertificaciones');
        $identidad = $this->_request->getPost('identidad');
        $nodosidreportesseleccionados = json_decode(stripslashes($this->_getParam('nodosidreportesseleccionados')));
        $objReporte = new DatReportesCertificaciones();
        $objconfReporte = new ConfReportesCertificaciones();
        $objConfVariable = new ConfVariablesReportesCertificaciones();
        $objDatElementos = new DatElementosReportesCertificaciones();
        $objDatVariablesReportes = new DatVariablesElementosReportesCertificaciones();
        //Array de idconfvariables a salvar
        $arrayidvariablesave = $objConfVariable->obtenerVariablesReportesCertificacionesByIdRepor($idconfreportescertificaciones);
        //Indexando el array de idreportes anteriores por el idvariable
        $arrayconfvaridrep = array();
        $cont = 0;
        foreach ($nodosidreportesseleccionados as $idrepnodosel) {
            $idconfreportenodosel = $objReporte->obtenerIdConfReportesxIdReportes($idrepnodosel);
            if (count($arrayidvariablesave) > 0) {
                foreach ($arrayidvariablesave as $ridv) {
                    $idconfvarrepbuscar = $ridv['idvariablesconfreportescertificacionesreportesanteriores'];
                    $idconfrepbusc = $objConfVariable->DevolverIdConfReportesCertificaciones($idconfvarrepbuscar);
                    if ($idconfreportenodosel == $idconfrepbusc) {
                        $arrayconfvaridrep[$ridv['idvariablesconfreportescertificaciones']][$ridv['idvariablesconfreportescertificacionesreportesanteriores']][] = $idrepnodosel;
                    }
                }
            }
        }
        //Datos Reporte
        $arrayelementos = $objDatElementos->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
        if (count($arrayelementos) > 0) {
            if (count($arrayconfvaridrep) > 0) {
                //Buscando los valores de las personas
                if (count($arrayidvariablesave) > 0) {
                    foreach ($arrayidvariablesave as $rvarsave) {
                        $idvariablesconfreportescertificaciones = $rvarsave['idvariablesconfreportescertificaciones'];
                        $idvariablesconfreportescertificacionesreportesanteriores = $rvarsave['idvariablesconfreportescertificacionesreportesanteriores'];
                        foreach ($arrayelementos as $relem) {
                            //Buscando el valor de la persona en los reportes seleccionados en el arbol
                            $arrvalor = $objDatVariablesReportes->obtenerValorVariableXIdElementoArrayReportes($relem['idelemento'], $arrayconfvaridrep[$idvariablesconfreportescertificaciones][$idvariablesconfreportescertificacionesreportesanteriores], $idvariablesconfreportescertificacionesreportesanteriores);
                            $valor = 0;
                            foreach ($arrvalor as $val) {
                                $valor = $valor + $val['valor'];
                            }
                            $arraydatvariables = DatVariablesElementosReportesCertificaciones::obtenerDatVariablesElementosReportesCertificacionesXConf($relem['idelementosreportescertificaciones'], $idvariablesconfreportescertificaciones);
                            //Borrando los datos de la variable anterior
                            $objDeleteVariable = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($arraydatvariables[0]['idvariableselementosreportescertificaciones']);
                            $objDeleteVariable->delete();
                            //Salvando el valor nuevo de la persona en el reporte
                            $objsave = new DatVariablesElementosReportesCertificaciones();
                            $objsave->idelementosreportescertificaciones = $relem['idelementosreportescertificaciones'];
                            $objsave->idvariablesconfreportescertificaciones = $idvariablesconfreportescertificaciones;
                            $objsave->valor = ($valor) ? $valor : 0;
                            $objsave->save();
                        }

                    }
                }
            }
            echo json_encode('ok');
        } else {
            echo json_encode('error');
        }

    }

    public function obtenerPeriodoPagoReporte($idreportescertificaciones, $identidad)
    {
        $objModel = new DatReportesCertificacionesModel();
        $datrepperiodo = $objModel->obtenerDatosReportePeriodoPago($idreportescertificaciones, $identidad);
        $r = array();
        if (count($datrepperiodo) > 0) {
            $r['idelaborarpagos'] = $datrepperiodo[0]['idelaborarpagos'];
            $r['identidad'] = $identidad;
            $r['idperiodopago'] = $datrepperiodo[0]['idperiodopago'];
            $r['modoseleccionpersonas'] = 3;
            $r['idtipopago'] = $datrepperiodo[0]['idtipopago'];
            $r['fechainicio'] = $datrepperiodo[0]['fechainicioperiodo'];
            $r['fechafin'] = $datrepperiodo[0]['fechafinperiodo'];
        }
        return $r;
    }

    public function duplicareportesycertificacionesAction()
    {
        $arregloDatos['fechafin'] = $this->_getParam('fechafin');
        $arregloDatos['fechainicio'] = $this->_getParam('fechainicio');
        $arregloDatos['idreportescertificaciones'] = $this->_getParam('idreportescertificaciones');
        $arregloDatos['descripcion'] = $this->_getParam('descripcion');

        $objModel = new DatReportesCertificacionesModel();
        $objModel->duplicarReportesCertificaciones($arregloDatos);
        $r = new stdClass();
        $r->codigo = 'DUP-1';
        echo json_encode($r);
    }

    public function obtenerdatosnominasreportesAction()
    {
        $idconfreportes = $this->_getParam('idconfreportescertificaciones');
        $objConfVariablesReportesCertificaciones = new ConfVariablesReportesCertificaciones();
        //Buscando las variables que buscan en historicos
        $arrconfvariables = $objConfVariablesReportesCertificaciones->obtenerVariablesExpresionMatematicaHistorico($idconfreportes);
        $objreturn = null;
        $arrayidconfreportes = array();
        $arrayidestructnomina = array();
        foreach ($arrconfvariables as $rvar) {
            $arrformulaind = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($rvar['idexpresionmatematicahistoriconominasreportes']);
            //Buscar el valor de la expresion matematica
            foreach ($arrformulaind as $rif) {
                $rexplode = explode('_', $rif);
                if ($rexplode[0] == 'EMN') {
                    $arrayidestructnomina[] = $rexplode[1];
                } else if ($rexplode[0] == 'F') {
                    $confreporte = $objConfVariablesReportesCertificaciones->obtenerConfReportexIdVariables($rexplode[1]);
                    $arrayidconfreportes[] = $confreporte;
                }
            }
        }
        $objreturn->confreportes = $arrayidconfreportes;
        $objreturn->estructurasnominas = $arrayidestructnomina;
        echo json_encode($objreturn);
    }

    public function obtenerDatosReportesxConfReportesAction()
    {
        $identidad = $this->_getParam('identidad');
        $arrconfreportes = json_decode(stripslashes($this->_getParam('arrconfreportes')));
        $objDatReportes = new DatReportesCertificaciones();
        $objConfReportes = new ConfReportesCertificaciones();
        $arrayreturn = array();
        $cont = 0;
        //Recorriendo para obtener los datos de los reportes
        foreach ($arrconfreportes as $idconfreporte) {
            $arrreportes = $objDatReportes->obtenerReportesCertificacionesActual($idconfreporte, $identidad);
            foreach ($arrreportes as $reporte) {
                $arrayreturn[$cont]['idreportescertificaciones'] = $reporte['idreportescertificaciones'];
                $arrayreturn[$cont]['idconfreportescertificaciones'] = $reporte['idconfreportescertificaciones'];
                $arrayreturn[$cont]['confreportescertificaciones'] = $objConfReportes->obtenerDenomReportesCertificacionesdadoxId($idconfreporte);
                $arrayreturn[$cont]['nivel'] = $reporte['nivel'];
                $arrayreturn[$cont]['fechainicio'] = $reporte['fechainicio'];
                $arrayreturn[$cont]['fechafin'] = $reporte['fechafin'];
                $arrayreturn[$cont]['estado'] = $reporte['estado'];
                $arrayreturn[$cont]['identidad'] = $reporte['identidad'];
                $arrayreturn[$cont]['idusuario'] = $reporte['idusuario'];
                $cont++;
            }
        }
        echo json_encode(array('datos' => $arrayreturn, 'cantidad' => count($arrayreturn)));
    }

    public function actualizarvalorespersonasnominasreportesAction()
    {
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        $idconfreporte = $this->_getParam('idconfreporte');
        $idreportescertificaciones = $this->_getParam('idreportescertificaciones');
        $arrayhisreportes = json_decode(stripslashes($this->_getParam('arrayhisreportes')));
        $arrhistoricoconfreportes = json_decode(stripslashes($this->_getParam('arrhistoricoconfreportes')));
        $objDatElementosreportes = new DatElementosReportesCertificaciones();
        $objDatVariablesEelementos = new DatVariablesElementosReportesCertificaciones();
        $objConfVariablesReportes = new ConfVariablesReportesCertificaciones();
        $objDatReportesCertificaciones = new DatReportesCertificaciones();
        $objDatGestionarNominas = new DatGestionarNominasModel();
        $objDatNominaDatos = new DatNominaDatos();
        //Obteniendo las personas del reporte
        $arrpersonasreporte = $objDatElementosreportes->obtenerArrIdElementosXIdReporte($idreportescertificaciones);
        //Obteniendo las variables con formulas que buscan en historicos;
        $arrconfvariables = $objConfVariablesReportes->obtenerVariablesExpresionMatematicaHistorico($idconfreporte);
        foreach ($arrconfvariables as $rvar) {
            $idvariableconfreporteguardar = $rvar['idvariablesconfreportescertificaciones'];
            $arrformulaind = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($rvar['idexpresionmatematicahistoriconominasreportes']);
            $expresion = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($rvar['idexpresionmatematicahistoriconominasreportes']));
            $expmostrar = $expresion[0]['expresionacalcular'];
            //Buscar el valor de la expresion
            $arrpersonasvaloresreporte = array();
            //Recorriendo los indicadores para buscar los valores de la persona en todos los reportes marcados
            foreach ($arrformulaind as $rif) {
                $rexplode = explode('_', $rif);
                //Si el valor a buscar es un campo de la nomina
                $camponomina = $rexplode[1];
                if ($rexplode[0] == 'EMN') {
                    $rdatosnominas = $objDatNominaDatos->obtenerDatosNominaPorElaborarPago($idelaborarpagos);
                    //Recorriendo las personas para buscar en las nominas
                    foreach ($arrpersonasreporte as $ridelemento) {
                        $idpersona = $ridelemento['idelemento'];
                        //Recorriendo los valores de la nomina
                        foreach ($rdatosnominas as $rd) {
                            $valores = unserialize($rd['valores']);
                            foreach ($valores as $rval) {
                                $idpersonanomina = explode('-', $rval['id'])[0];
                                //Si se encuentra la persona en le nomina
                                if ($idpersona == $idpersonanomina) {
                                    if ($rval["c$camponomina"]) {
                                        //Buscando el iddatvariablereporte de esta persona para modificar
                                        $idelementoreportecertificacionesnomina = $objDatElementosreportes->devolverElementosPersona($idreportescertificaciones, $idpersona);
                                        $iddatvariablepersonanomina = $objDatVariablesEelementos->obtenerDatVariablesElementosReportesCertificacionesXConf($idelementoreportecertificacionesnomina, $idvariableconfreporteguardar);
                                        $objDatVariableReporteSaveNomina = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($iddatvariablepersonanomina[0]['idvariableselementosreportescertificaciones']);
                                        $objDatVariableReporteSaveNomina->valor = $rval["c$camponomina"];
                                        $objDatVariableReporteSaveNomina->save();
                                    }
                                }
                            }
                            //print_r($valores);die;
                        }

                    }
                    //Si el valor a buscar esta en reportes anteriores
                } else if ($rexplode[0] == 'F') {
                    //ConfReporte de la variable de la formula
                    $idvariableconfreportebuscar = $rexplode[1];
                    $idconfreportevariableformula = $objConfVariablesReportes->obtenerConfReportexIdVariables($idvariableconfreportebuscar);
                    //Recorriendo los reportes marcados para ver cual coincide con el confreporte de la variable a evaluar
                    foreach ($arrayhisreportes as $idreportescertificacionesbuscar) {
                        $idconfreportehistorico = $objDatReportesCertificaciones->obtenerIdConfReportesxIdReportes($idreportescertificacionesbuscar);
                        if ($idconfreportevariableformula == $idconfreportehistorico) {
                            //Buscar el valor de la persona para este indicador
                            foreach ($arrpersonasreporte as $ridelemento) {
                                $idpersona = $ridelemento['idelemento'];
                                $valorpersonareportehis = $this->buscarValorPersonaReporte($idreportescertificacionesbuscar, $idpersona, $idvariableconfreportebuscar);
                                //Si el valor existe en el reporte historico
                                if ($valorpersonareportehis > 0) {
                                    //Se guarda el valor en el arreglo
                                    $arrpersonasvaloresreporte[$idpersona][$idvariableconfreportebuscar] = number_format(($arrpersonasvaloresreporte[$idpersona][$idvariableconfreportebuscar] + $valorpersonareportehis), 2, '.', '');

                                    //$objDatVariableReporteSave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find();
                                } else {
                                    $arrpersonasvaloresreporte[$idpersona][$idvariableconfreportebuscar] = 0.00;
                                }
                            }
                        }

                    }

                }
            }
            //Recorriendo el arreglo con la sumatoria de los valores de las personas sumado por reportes
            foreach ($arrpersonasvaloresreporte as $idpersona => $rpersonas) {
                $arrayind = array();
                $conteval = 0;
                foreach ($arrformulaind as $rvarind) {
                    $rexplodeaux = explode('_', $rvarind);
                    $idind = $rexplodeaux[1];
                    $arrayind[$conteval]['idindicador'] = 'F_' . $idind;
                    $arrayind[$conteval]['valor'] = $rpersonas[$idind];
                    $conteval++;
                }
                //Evaluando la formula para la persona
                $valorfind = $objDatGestionarNominas->EvaluarExpresionMatematica($arrayind, $expmostrar);
                ($valorfind->codigo == 1) ? $valorpersonareporte = number_format($valorfind->valor, 2, '.', '') : 0;
                //Buscando el iddatvariablereporte de esta persona para modificar
                $idelementoreportecertificaciones = $objDatElementosreportes->devolverElementosPersona($idreportescertificaciones, $idpersona);
                $iddatvariablepersona = $objDatVariablesEelementos->obtenerDatVariablesElementosReportesCertificacionesXConf($idelementoreportecertificaciones, $idvariableconfreporteguardar);
                $objDatVariableReporteSave = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($iddatvariablepersona[0]['idvariableselementosreportescertificaciones']);
                $objDatVariableReporteSave->valor = $valorpersonareporte;
                $objDatVariableReporteSave->save();
            }

        }
        echo json_encode('OK');

    }

    public function buscarValorPersonaReporte($idreportescertificacionesbuscar, $idpersona, $idvariableconfreporteguardar)
    {
        //Busco el valor de la variable de la de la persona
        $sqlvalorvariable = "select dve.valor
        from mod_nomina.dat_variableselementosreportescertificaciones dve
        inner join mod_nomina.dat_elementosreportescertificaciones de on (de.idelementosreportescertificaciones = dve.idelementosreportescertificaciones)
        inner join mod_nomina.dat_reportescertificaciones rep on (rep.idreportescertificaciones = de.idreportescertificaciones)
        where rep.idreportescertificaciones = ? and de.idelemento = ? and dve.idvariablesconfreportescertificaciones = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sqlvalorvariable, array($idreportescertificacionesbuscar, $idpersona, $idvariableconfreporteguardar));
    }
}
