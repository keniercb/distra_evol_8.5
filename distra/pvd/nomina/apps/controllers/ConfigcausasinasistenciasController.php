<?php

/**
 * Controlador para configurar las causas de inasistencias.
 *
 * @author Ing. Dainier Velazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfigCausasInasistenciasModel
 * @copyright UCID
 * @version 1.0
 */
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/models/bussines/ConfiguracionCH.php');

class ConfigcausasinasistenciasController extends ZendExt_Controller_Secure


{
    public function init()
    {
        parent::init();

    }

    public function configcausasinasistenciasAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function obtenerConfigCausasInasistenciasAction()
    {
        $start = $this->_request->getPost('start',0);
        $limit = $this->_request->getPost('limit',20);
        $obj = new ConfigCausaInasistenciaModel();
        $arrayfinal = $obj->obtenerListadoCausasInasistencias($start, $limit);
        $ioc = ZendExt_IoC_Inter::getInstance();
        $arrayAsistencia = $ioc->regimentrabajo->getCausas();
        $arrayEvaluaciones = $ioc->evaluaciones->getPlanillasByPeriodo();
 
        foreach ($arrayfinal as &$campo) {
            //Capturando la denominacion del campo en dependencia del comportamineto(modulo asistenica o evaluaciones)
            switch ($campo['tiporeporte']) {
                //Ausencias
                case 4:
                    $comun = new ConfiguracionCH();
                    $causasmultiples = explode(';', $campo['idcausa']);
                    $valcampo = '';   
                    if (!empty($causasmultiples)) {
                        foreach ($causasmultiples as $idcausa) {
                            //Capturando la denominacion de una causa de inasistencia dado el idcausa
                            if (is_numeric($idcausa)) {
                                foreach ($arrayAsistencia as $causa) {
                                    if ($causa['idcausa'] == $idcausa/*$campo['idcausa']*/) {
                                        $valcampo .= $causa['denominacion'] . ';';
                                        //$campo['campo'] = $causa['denominacion'];
                                    }
                                }
                            } else {
                                //Nocturnidad
                                list($noct, $horai, $horaf) = explode('_',$idcausa);
                                if($noct=='noct') {
                                  $horai = date("g:i a",strtotime($horai));
                                  $horaf = date("g:i a",strtotime($horaf));
                                  $valcampo .= $horai.' a '.$horaf . ';';
                                }else{
                                  foreach ($comun->indicadores_tiempo_rtd as $irr => $arr) {
                                      if ($arr['id'] == $idcausa/*$campo['idcausa']*/) {
                                          $valcampo .= $arr['denominacion'] . ';';
                                          //$campo['campo'] = $arr['denominacion'];
                                      }
                                   }
                                } 
                            }    
                        }
                    }
                    $campo['campo'] = trim($valcampo, ';');
                    break;

                case 5:
                    list($idindicador, $idplanilla) = explode('_', $campo['idcausa']);
                    if ($idindicador == -1) {
                        $campo['campo'] = 'Evaluación-!-Evaluación Final';
                    } else {
                        foreach ($arrayEvaluaciones as $planilla) {
                            if ($planilla['idplanilla'] == $idplanilla) {
                                foreach ($planilla['indicadores'] as $indicador) {
                                    if ($indicador['idindicador'] == $idindicador) {
                                        $campo['campo'] = $indicador['indicador'] . '-!-' . $planilla['planilla'];
                                    }
                                }
                            }
                        }
                    }
                    break;
                
                case 10:
                list($idindicador, $idplanilla) = explode('_', $campo['idcausa']);
                $arraytalleres = $this->integrator->logistica->getTrabajoOperariosIndicadores();
                foreach ($arraytalleres as $ind){
                    if($ind['idindicador'] == $idindicador)
                    $campo['campo'] = strtoupper($ind['denominacion']);
                }
                break;       

                default:
                    $campo['campo'] = 'NO-COMPORTAMIENTO-REPORTE';
                    break;

            }
        }
        $cantidad = $obj->obtenerCantidadTotalCausasInasistencias();

        echo json_encode(array('datos' => $arrayfinal, 'cantidad' => $cantidad));
    }

    public function obtenerReportesAusenciasAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $obj = new ConfigCausaInasistenciaModel();
        $datos = $obj->obtenerListadoReportesCertificaciones($start,$limit);
        $cantidad = $obj->obtenerCantidadReportesCertificaciones();

        $cont = 0;
        $arrayfinal = array();
        foreach ($datos as $i => $value) {
            $arrayfinal[$cont]['idconfreportescertificaciones'] = $value['idconfreportescertificaciones'];
            $arrayfinal[$cont]['tiporeporte'] = $value['tiporeporte'];
            $arrayfinal[$cont]['variabletiporeporte'] = $value['variabletiporeporte'];
            $arrayfinal[$cont]['idvariablesconfreportescertificaciones'] = $value['idvariablesconfreportescertificaciones'];
            $cont++;
        }
        echo json_encode(array('datos' => $arrayfinal, 'cantidad' => $cantidad));
    }

    public function obtenerCausasAusenciasAction()
    {
        $comun = new ConfiguracionCH();
        //Servicio de Regimen de Trabajo que me devuelve las causas de inasitencias
        $ioc = ZendExt_IoC_Inter::getInstance();
        $resultado = $ioc->regimentrabajo->getCausas();
        $cont = 0;
        $arrayfinal = array();
        foreach ($resultado as $i => $value) {
            $arrayfinal[$cont]['idcausaausencia'] = $value['idcausa'];
            $arrayfinal[$cont]['denominacion'] = $value['denominacion'];
            $cont++;
        }
        foreach ($comun->indicadores_tiempo_rtd as $irr => $arr) {
            $arreglo['idcausaausencia'] = $arr['id'];
            $arreglo['denominacion'] = $arr['denominacion'];
            array_push($arrayfinal, $arreglo);
        }
        echo json_encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
    }

    public function obtenerIndicadoresEvaluacionesAction()
    {
        //Servicio de Evaluaciones que me da todas las evaluaciones por personas
        $ioc = ZendExt_IoC_Inter::getInstance();
        $planillas = $ioc->evaluaciones->getPlanillasByPeriodo();//print_r($planillas);die;
        $cont = 0;
        $arrayfinal = array();
        foreach ($planillas as $value) {
            foreach ($value['indicadores'] as $i => $indicador) {
                $arrayfinal[$cont]['idplanilla'] = $value['idplanilla'];
                $arrayfinal[$cont]['nombreplantilla'] = '1-' . $value['planilla'];
                $arrayfinal[$cont]['idindicador'] = $indicador['idindicador'];
                $arrayfinal[$cont]['indicador'] = $indicador['indicador'];
                $arrayfinal[$cont]['denompadre'] = $indicador['denompadre'];
                $arrayfinal[$cont]['orden'] = $cont;
                $cont++;
            }
        }
        $arrayfinal[$cont]['idplanilla'] = 0;
        $arrayfinal[$cont]['nombreplantilla'] = '0-Evaluación Final';
        $arrayfinal[$cont]['idindicador'] = -1;
        $arrayfinal[$cont]['indicador'] = 'Evaluación';
        $arrayfinal[$cont]['denompadre'] = '';
        $arrayfinal[$cont]['orden'] = $cont;
        echo json_encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
    }

    public function adicionarCausasInasistenciasAction()
    {
        //Get all params
        $idvariabletiporeportecertif = $this->_getParam('idvariabletiporeportecertif');
        $idtiporeporte = $this->_getParam('idtiporeporte');
        $idvariabletiporeportecertifviejo = $this->_getParam('idvariabletiporeportecertifviejo');
        $arrayidcampos = Zend_Json::decode(stripslashes($this->_getParam('arrayidcampos')));
        $idscampos = implode(';', $arrayidcampos);
        $accion = $this->_getParam('accion');
        $modulo = $this->_getParam('modulo');
        $horasdias = $this->_getParam('horasdias');

        //Capturando los idvariablesconfreportescertificaciones de la tabla configcausareporte
        $sqlVarRCert = "SELECT idvariablesconfreportescertificaciones as idvar FROM mod_nomina.conf_causasreporteausencia";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrIdsReportesCertif = $conn->fetchAll($sqlVarRCert);
        $contIdVar = 0;

        if ($accion == "ADD") {
            foreach ($arrIdsReportesCertif as $idVarRepCert) {
                if ($idVarRepCert['idvar'] == $idvariabletiporeportecertif) {
                    $contIdVar++;
                }
            }
            //Validando que no puede existir mas de una variable rep certif del mismo tipo(id)
            if ($contIdVar == 0) {
                //foreach ($arrayidcampos as $value) {
                //Save data
                $objCausaInasistencia = new ConfigCausaInasistencia();
                $objCausaInasistencia->idvariablesconfreportescertificaciones = $idvariabletiporeportecertif;
                $objCausaInasistencia->idcausa = $idscampos;//$value;
                $objCausaInasistencia->idconfreportescertificaciones = $idtiporeporte;
                $objCausaInasistencia->horasdias = $horasdias;
                $objCausaInasistencia->save();
                //}
                echo json_encode('ADD');
            } else {
                echo json_encode('REPETIDO');
            }
        } elseif ($accion == "MOD") {
            //Capturando los ids de configcausareporte y eliminandolos
            $sqlCausas = "SELECT idcausasreporteausencia FROM mod_nomina.conf_causasreporteausencia
              WHERE idvariablesconfreportescertificaciones = ?";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrIdsCausas = $conn->fetchAll($sqlCausas, array($idvariabletiporeportecertifviejo));
            foreach ($arrIdsCausas as $idCausa) {
                $objCausa = ConfigCausaInasistencia::obtenerObjConfigCausasInasistencias($idCausa['idcausasreporteausencia']);
                $objCausa->delete();
            }

            //Save data
            //foreach ($arrayidcampos as $value) {
            $objCausaInasistencia = new ConfigCausaInasistencia();
            $objCausaInasistencia->idvariablesconfreportescertificaciones = $idvariabletiporeportecertif;
            $objCausaInasistencia->idcausa = $idscampos;//$value;
            $objCausaInasistencia->idconfreportescertificaciones = $idtiporeporte;
            $objCausaInasistencia->horasdias = $horasdias;
            $objCausaInasistencia->save();
            //}
            echo json_encode('MOD');
        } else {
            echo json_encode('error');
        }
    }

    public function checksSeleccionadosWidowsModificarAction()
    {
        $idvariabletiporeportecertifviejo = $this->_getParam('idvariabletiporeportecertifviejo');
        $sqlCausasSeleccionadas = "SELECT idcausa FROM mod_nomina.conf_causasreporteausencia WHERE idvariablesconfreportescertificaciones = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrIdsCausasSeleccionadas = $conn->fetchAll($sqlCausasSeleccionadas, array($idvariabletiporeportecertifviejo));
        $arraySeleccionados = array();
        foreach ($arrIdsCausasSeleccionadas as $k => $seleccionados) {
            $arraySeleccionados = explode(';', $seleccionados['idcausa']);
        }
        echo json_encode($arraySeleccionados);
    }

    public function eliminarCausasInasistenciasAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('datos')));
        foreach ($arrayids as $i => $valor) {
            $sqlIdsCausasDel = ConfigCausaInasistencia::obtenerIdCausasInasistenciasXIdVariable($valor->idvariablesconf);
            foreach ($sqlIdsCausasDel as $ids) {
                //GET DATA
                $objConfigCausaInasist = ConfigCausaInasistencia::obtenerObjConfigCausasInasistencias($ids['idcausasreporteausencia']);
                //DELETE
                $objConfigCausaInasist->delete();
            }

        }
        echo json_encode('DEL');
    }

    public function obtenerIndicadoresTalleresAction(){
        //Obreniendo los indicadores de Talleres
        $datos = $this->integrator->logistica->getTrabajoOperariosIndicadores();
        echo json_encode(array('datos'=>$datos, 'cantidad'=>count($datos)));
    }
}