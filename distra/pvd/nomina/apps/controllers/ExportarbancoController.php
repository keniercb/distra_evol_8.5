<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
require($dir_www . '/pvd/comun/recursos/dbf/api_conversion.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseColumn.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseRecord.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseTable.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseWritableTable.php');

class ExportarbancoController extends ZendExt_Controller_Secure
{
    var $idestructura;

    public function init()
    {
        parent::init();
    }

    //Actions
    public function exportarbancoAction()
    {
        $this->render();
    }

    public function obtenerperiododepagoexportadoAction()
    {
        $estado = $this->_request->getPost('estado');
        $identidad = $this->_request->getPost('identidad');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        if ($estado == 0) {
            $datospersonas = array();
            foreach ($idelaborarpagos as $k => $value) {
                $r = $this->buscarParaExportarBanco($value, 2, 1, $identidad, null);
                $datospersonas = array_merge($datospersonas, $r['datos']);
                $codigo = $r['codigo'];
            }

            //Creando un arreglo indexado por idpersona
            $arrpersonas = array();
            $objPlantillaNominal = new ConfPlantillaNominal();
            foreach ($datospersonas as $i => $persona) {
                $orden = $objPlantillaNominal->obtenerOrdenPlantillaXId($persona['idplantillanominal']);
                $datospersonas[$i]['denominacion'] = $orden . '--' . $persona['denominacion'];
                $arrpersonas[$persona['idpersona']][] = $datospersonas[$i];
            }

            //Creando el arreglo final
            $r = array();
            $cont = 0;
            foreach ($arrpersonas as $i => $persona) {
                $r[$cont] = $persona[0];
                $netomn = 0;
                $netocuc = 0;
                foreach ($persona as $valpersona) {
                    $netomn += $valpersona['importe_n'];
                    $netocuc += $valpersona['importe_d'];
                }
                $sqldatoscuenta = "select *, tc.abreviatura from mod_personaext.dat_cuentabancaria datcban
                                   inner join mod_personaext.nom_tipoacreditacionsalario tc on (tc.idtipoacreditacionsalario = datcban.idtipoacreditacionsalario)
                                   inner join mod_datosmaestros.nom_moneda mn on(mn.idmoneda = datcban.idmoneda)
			                       where datcban.idpersona=?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datoscuentas = $conn->fetchAll($sqldatoscuenta, array($i));

                foreach ($datoscuentas as $kcuenta => $vcuenta) {
                    //$r[$cont]['cta_mnac'] = $vcuenta['numerocuenta'];
                    $r[$cont]['cod_tipid'] = $vcuenta['abreviatura'];
                }
                $r[$cont]['importe_n'] = number_format($netomn, 2, '.', '');
                $r[$cont]['importe_d'] = number_format($netocuc, 2, '.', '');

                //Codigo contable
                $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($i, $identidad);
                $r[$cont]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];

                //Eliminando las personas
                if ($netomn == 0 && $netocuc == 0) {
                    unset($r[$cont]);
                }
                $cont++;
            }
            $r = array_values($r);
            $montocup = 0;
            $montocuc = 0;
            foreach ($r as $p) {
                $montocup += ($p['importe_n'] > 0) ? $p['importe_n'] : 0;
                $montocuc += ($p['importe_d'] > 0) ? $p['importe_d'] : 0;
            }

            //orden de las personas por plantillas nominales
            foreach ($r as $p => $persona) {
                $nombreplantilla = (!empty($persona['denominacion'])) ? $persona['denominacion'] : 'Sin plantilla nominal';
                if ($nombreplantilla != 'Sin plantilla nominal') {
                    list($ordenplantilla,) = explode('--', $persona['denominacion']);
                    $longorden = strlen($ordenplantilla . '');
                    $r[$p]['denominacion'] = chr(96 + $longorden) . $persona['denominacion'];//chr(96) caracter antes de letra "a"
                } else {
                    $r[$p]['denominacion'] = 'z--' . $nombreplantilla;
                }
            }

            echo json_encode(array('datos' => $r, 'cantidad' => count($r), 'codigo' => $codigo));
        } else {
            $arrpersonas = array();
            foreach ($idfechascierre as $idfcierre) {
                $rperscaja = DatFechasCierrePeriodo::obtenerListadoPersonasCajero($idfcierre);
                if ($rperscaja) {
                    $rpersonscaja = unserialize($rperscaja);
                    if (count($rperscaja) > 0) {
                        $arrpersonas = array_merge($arrpersonas, $rpersonscaja);
                    }
                }
            }
            $objPlantillaNominal = new ConfPlantillaNominal();
            foreach ($arrpersonas as $pc => $arrpc) {
                $importe_n = intval($arrpc['importe_n']);
                $importe_d = intval($arrpc['importe_d']);
                $identidad = $objPlantillaNominal->obtenerIdentidadxPlantilla($arrpc['idplantillanominal']);
                $denomentidad = $this->integrator->metadatos->DameEstructura($identidad)[0]->denominacion;
                $orden = $objPlantillaNominal->obtenerOrdenPlantillaXId($arrpc['idplantillanominal']);
                $arrpersonas[$pc]['denominacion'] = $orden . '--' . $arrpersonas[$pc]['denominacion'] . ' - ' . $denomentidad;

                //Eliminando las personas
                if ($importe_n == 0 && $importe_d == 0) {
                    unset($arrpersonas[$pc]);
                }
            }
            $arrpersonas = array_values($arrpersonas);
            $montocup = 0;
            $montocuc = 0;
            foreach ($arrpersonas as $p) {
                $montocup += ($p['importe_n'] > 0) ? $p['importe_n'] : 0;
                $montocuc += ($p['importe_d'] > 0) ? $p['importe_d'] : 0;
            }


            //orden de las personas por plantillas nominales
            foreach ($arrpersonas as $p => $persona) {
                $nombreplantilla = (!empty($persona['denominacion'])) ? $persona['denominacion'] : 'Sin plantilla nominal';
                if ($nombreplantilla != 'Sin plantilla nominal') {
                    list($ordenplantilla,) = explode('--', $persona['denominacion']);
                    $longorden = strlen($ordenplantilla . '');
                    $arrpersonas[$p]['denominacion'] = chr(96 + $longorden) . $persona['denominacion'];//chr(96) caracter antes de letra "a"
                } else {
                    $arrpersonas[$p]['denominacion'] = 'z--' . $nombreplantilla;
                }
            }

            echo json_encode(array('datos' => $arrpersonas, 'cantidad' => count($arrpersonas)));
        }
    }

    public function obtenerpersonascajaAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $estado = $this->_request->getPost('estado');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        if ($estado == 0) {
            $acumulado = 0;
            $arrpersonas = array();
            $arrtirilla = array();
            $arrpersonasFinal = array();
            $arrpersonasmerge = array();

            foreach ($idelaborarpagos as $k => $value) {
                $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
                $arrpersonas = array_merge($arrpersonas, $r['datos']);
            }

            $objPlantillaNominal = new ConfPlantillaNominal();
            $arrayidpersonas = array();
            foreach ($arrpersonas as $i => $persona) {
                $orden = $objPlantillaNominal->obtenerOrdenPlantillaXId($persona['idplantillanominal']);
                $arrpersonas[$i]['denominacion'] = $orden . '--' . $persona['denominacion'];
                $arrayidpersonas[] = $arrpersonas[$i]['idpersona'];
            }
            $arrayidpersonas = array_unique($arrayidpersonas);
            $arrayidpersonas = array_values($arrayidpersonas);

            $arrayfinal = array();
            foreach ($arrayidpersonas as $k=>$idpersona){
                foreach ($arrpersonas as $rpers){
                    if($rpers['idpersona'] == $idpersona){
                        $arrayfinal[$k]['idpersona'] = $rpers['idpersona'];
                        $arrayfinal[$k]['cod_tipid'] = $rpers['cod_tipid'];
                        $arrayfinal[$k]['cod_paexid'] = $rpers['cod_paexid'];
                        $arrayfinal[$k]['nombreyapellidos'] = $rpers['nombreyapellidos'];
                        $arrayfinal[$k]['cta_mnac'] = $rpers['cta_mnac'];
                        $arrayfinal[$k]['num_ideper'] = $rpers['num_ideper'];
                        $arrayfinal[$k]['idplantillanominal'] = $rpers['idplantillanominal'];
                        $arrayfinal[$k]['denominacion'] = $rpers['denominacion'];
                        $arrayfinal[$k]['cta_mlc'] = $rpers['cta_mlc'];
                        $arrayfinal[$k]['importe_d'] = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                        $arrayfinal[$k]['importe_n'] = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                        $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($idpersona, $identidad);
                        $arrayfinal[$k]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];
                    }
                }
            }
            foreach ($arrayfinal as $if=> $rf){
                if(($rf['importe_n'] == 0) && ($rf['importe_d'] == 0)){
                    unset($arrayfinal[$if]);
                }
            }
            $arrayfinal = array_values($arrayfinal);
            //orden de las personas por plantillas nominales
            foreach ($arrayfinal as $p => $persona) {
                $nombreplantilla = (!empty($persona['denominacion'])) ? $persona['denominacion'] : 'Sin plantilla nominal';
                if ($nombreplantilla != 'Sin plantilla nominal') {
                    list($ordenplantilla,) = explode('--', $persona['denominacion']);
                    $longorden = strlen($ordenplantilla . '');
                    $arrayfinal[$p]['denominacion'] = chr(96 + $longorden) . $persona['denominacion'];//chr(96) caracter antes de letra "a"
                } else {
                    $arrayfinal[$p]['denominacion'] = 'z--' . $nombreplantilla;
                }
            }

            echo json_encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
        } else {
            $arrpersonascaja = array();
            foreach ($idfechascierre as $idfcierre) {
                $rperscaja = DatFechasCierrePeriodo::obtenerListadoPersonasCaja($idfcierre);
                if ($rperscaja) {
                    $rpersonscaja = unserialize($rperscaja);
                    if (count($rperscaja) > 0) {
                        $arrpersonascaja = array_merge($arrpersonascaja, $rpersonscaja);
                    }
                }
            }
            $objPlantillaNominal = new ConfPlantillaNominal();
            foreach ($arrpersonascaja as $pc => $arrpc) {
                $identidad = $objPlantillaNominal->obtenerIdentidadxPlantilla($arrpc['idplantillanominal']);
                $denomentidad = $this->integrator->metadatos->DameEstructura($identidad)[0]->denominacion;
                $orden = $objPlantillaNominal->obtenerOrdenPlantillaXId($arrpc['idplantillanominal']);
                $arrpersonascaja[$pc]['denominacion'] = $orden . '--' . $arrpersonascaja[$pc]['denominacion'] . ' - ' . $denomentidad;
            }

            //orden de las personas por plantillas nominales
            foreach ($arrpersonascaja as $p => $persona) {
                $nombreplantilla = (!empty($persona['denominacion'])) ? $persona['denominacion'] : 'Sin plantilla nominal';
                if ($nombreplantilla != 'Sin plantilla nominal') {
                    list($ordenplantilla,) = explode('--', $persona['denominacion']);
                    $longorden = strlen($ordenplantilla . '');
                    $arrpersonascaja[$p]['denominacion'] = chr(96 + $longorden) . $persona['denominacion'];//chr(96) caracter antes de letra "a"
                } else {
                    $arrpersonascaja[$p]['denominacion'] = 'z--' . $nombreplantilla;
                }
            }

            echo json_encode(array('datos' => $arrpersonascaja, 'cantidad' => count($arrpersonascaja)));
        }

    }

    public function exportarbancopdfAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));

        $acumulado = 0;
        $arrpersonas = array();
        $arrpersonasFinal = array();
        $arrpersonasmerge = array();

        $arrayidpersonas = array();
        foreach ($idelaborarpagos as $k => $value) {
            $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
            $arrpersonas = array_merge($arrpersonas, $r['datos']);
        }

        foreach ($arrpersonas as $rp){
            $arrayidpersonas[] = $rp['idpersona'];
        }

        $arrayidpersonas = array_unique($arrayidpersonas);
        $arrayidpersonas = array_values($arrayidpersonas);

        $arrayfinal = array();
        foreach ($arrayidpersonas as $k=>$idpersona){
            foreach ($arrpersonas as $rpers){
                if($rpers['idpersona'] == $idpersona){
                    $arrayfinal[$k]['idpersona'] = $rpers['idpersona'];
                    $arrayfinal[$k]['cod_tipid'] = $rpers['cod_tipid'];
                    $arrayfinal[$k]['cod_paexid'] = $rpers['cod_paexid'];
                    $arrayfinal[$k]['nombreyapellidos'] = $rpers['nombreyapellidos'];
                    $arrayfinal[$k]['cta_mnac'] = $rpers['cta_mnac'];
                    $arrayfinal[$k]['num_ideper'] = $rpers['num_ideper'];
                    $arrayfinal[$k]['idplantillanominal'] = $rpers['idplantillanominal'];
                    $arrayfinal[$k]['denominacion'] = $rpers['denominacion'];
                    $arrayfinal[$k]['cta_mlc'] = $rpers['cta_mlc'];
                    $arrayfinal[$k]['importe_d'] = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                    $arrayfinal[$k]['importe_n'] = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                    //Codigo contable
                    $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($idpersona, $identidad);
                    $arrayfinal[$k]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];
                }
            }
        }

        $objExportarbanco = new ReporteExportarbancopdfModel();
        $objExportarbanco->construirReporte($arrayfinal);

        echo Zend_Json::encode('ok');


    }

    public function exportardescuentosaplicadosAction()
    {

        $identidad = $this->_getParam('identidad');

        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $arrpersonas = Zend_Json::decode(stripslashes($this->_getParam('personascaja')));


        $objNomina = new DatNominaModel();
        $respuesta = $objNomina->exportarDescuentosAplicados($idelaborarpagos, $identidad);

        echo Zend_Json::encode('ok');

    }

    public function exportartirillasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $estado = $this->_request->getPost('estado');
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        $arrtirilla = array();
        $arrpersonas = array();

        if ($estado == 0) {
            foreach ($idelaborarpagos as $k => $value) {
                $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
                $arrtirilla = array_merge($arrtirilla, $r['tirilla']);
                $arrpersonas = array_merge($arrpersonas, $r['datos']);
            }
        } else {
            $arrpersonas = array();
            foreach ($idfechascierre as $idfcierre) {
                $rperscaja = DatFechasCierrePeriodo::obtenerListadoPersonasCajero($idfcierre);
                if ($rperscaja) {
                    $rpersonscaja = unserialize($rperscaja);
                    if (count($rperscaja) > 0) {
                        $arrpersonas = array_merge($arrpersonas, $rpersonscaja);
                    }
                }
            }
            $objPlantillaNominal = new ConfPlantillaNominal();
            foreach ($arrpersonas as $pc => $arrpc) {
                $importe_n = intval($arrpc['importe_n']);
                $importe_d = intval($arrpc['importe_d']);
                $identidad = $objPlantillaNominal->obtenerIdentidadxPlantilla($arrpc['idplantillanominal']);
                $denomentidad = $this->integrator->metadatos->DameEstructura($identidad)[0]->denominacion;
                $arrpersonas[$pc]['denominacion'] = $arrpersonas[$pc]['denominacion'] . ' - ' . $denomentidad;

                //Eliminando las personas
                if ((empty($importe_n) && !empty($arrpc['cta_mnac'])) && (empty($importe_d) && !empty($arrpc['cta_mlc'])))
                    unset($arrpersonas[$pc]);
            }
            $arrpersonas = array_values($arrpersonas);
        }

        $objCaja = new ReporteTirillapagopdfModel();
        $objCaja->construirReporte($arrpersonas);
        echo Zend_Json::encode('ok');
    }

    public function exportarperiododepagoalbancoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $moneda = $this->_request->getPost('moneda');
        $estado = $this->_request->getPost('estado');
        $tipodecuenta = $this->_getParam('tipodecuenta');
        $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        $idbanco = $this->_request->getPost('idbanco'); 

        $ruta = ' a exportar';
        mkdir("comprobantes/{$ruta}", 0777, true);
        $titulo = ($moneda == 1) ? "cup" : "cuc";
        $arrayidpersonas = array();

        //Tipos de datos varchar(1);float(2);numeric(3);logical(4)
        $arrtiposdatos = array(DBFFIELD_TYPE_CHAR, DBFFIELD_TYPE_FLOATING, DBFFIELD_TYPE_NUMERIC, DBFFIELD_TYPE_LOGICAL);

        $objConfExportacionBanco = new ConfExportacionBanco();
        $ficheroexportacion = $objConfExportacionBanco->obtenerFicheroConfExpBanco($identidad);
        $arrcamposexpbanco = $objConfExportacionBanco->obtenerConfExpBanco($identidad, $idbanco);
        $definiciones = array();
        $arrayDatos = array();
        foreach ($arrcamposexpbanco as $campo) {
            if (!empty($campo['lugaresdecimales']))
                array_push($definiciones, array($campo['denomcampo'], $arrtiposdatos[$campo['tipodato']], $campo['longitudvalor'], $campo['lugaresdecimales']));
            else
                array_push($definiciones, array($campo['denomcampo'], $arrtiposdatos[$campo['tipodato']], $campo['longitudvalor']));

        }
        $s = new stdClass();
        //Si en la configuracion existe un nombre de fichero para leer y sobreescribirlo
        if ($ficheroexportacion) {
            $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']) . '/pvd/nomina/comun/recursos/dbf/' . $ficheroexportacion . '.dbf';
            $tableParent = new XBaseTable($dir_www);
            $tableParent->open();
            $db = XBaseWritableTable::cloneFrom($tableParent);
            $db->openWrite("nomina.dbf", true);
            //Si no hay un fichero donde escribir y se va a generar uno nuevo
        } else {
            $db = XBaseWritableTable::create("nomina.dbf", $definiciones);
        }
        if (!$db) {
            $s->codigo = 'NOCREADBF';
        } else {
            if ($estado == 0) {
                foreach ($arrayidelaborarpagos as $i => $value) {
                    $r = $this->buscarParaExportarBanco($value, 1, 1, $identidad, $idbanco);
                    $arrayDatos = array_merge($arrayDatos, $r['datos']);
                }
            } else {
                $arrpersonas = array();
                foreach ($idfechascierre as $idfcierre) {
                    $rperscaja = DatFechasCierrePeriodo::obtenerListadoPersonasCajero($idfcierre);
                    if ($rperscaja) {
                        $rpersonscaja = unserialize($rperscaja);
                        if (count($rperscaja) > 0) {
                            $arrpersonas = array_merge($arrpersonas, $rpersonscaja);
                        }
                    }
                }
                $objPlantillaNominal = new ConfPlantillaNominal();
                foreach ($arrpersonas as $pc => $arrpc) {
                    $importe_n = intval($arrpc['importe_n']);
                    $importe_d = intval($arrpc['importe_d']);
                    $identidad = $objPlantillaNominal->obtenerIdentidadxPlantilla($arrpc['idplantillanominal']);
                    $denomentidad = $this->integrator->metadatos->DameEstructura($identidad)[0]->denominacion;
                    $arrpersonas[$pc]['denominacion'] = $arrpersonas[$pc]['denominacion'] . ' - ' . $denomentidad;
                    //Eliminando las personas
                    if ((empty($importe_n)  && !empty($arrpc['cta_mnac'])) && (empty($importe_d) && !empty($arrpc['cta_mlc'])))
                        unset($arrpersonas[$pc]);
                }

                if ($estado == 0) {            
                    $arrayDatosPersona = array_values($arrpersonas);

                    $arrIdPersona = array();
                    $arridcoplantillanominal = array();
                    foreach ($arrayDatosPersona as $i => $idpersona) {
                        $arrIdPersona[] = $arrayDatosPersona[$i]['idpersona'];
                        $arridcoplantillanominal[] = $arrayDatosPersona[$i]['idplantillanominal'];
                    }

                    $r = $this->buscarDatosPersonas($arrIdPersona, $exportar = 2, $tipomoneda = 1, $arridcoplantillanominal, $identidad, $idbanco);
                    
                    foreach ($r->datosper as $i => $datper) {
                        $arrayDatos[] = $datper;
                    }
                } elseif ($estado == 1) {
                    $arrayDatos = array_values($arrpersonas);
                    $arrIdPersona = array();
                    $arridcoplantillanominal = array();
                    foreach ($arrayDatosPersona as $i => $idpersona) {
                        $arrIdPersona[] = $arrayDatosPersona[$i]['idpersona'];
                        $arridcoplantillanominal[] = $arrayDatosPersona[$i]['idplantillanominal'];
                    }

                }
                
            }
            $arrayidpersonas = array();
            foreach ($arrayDatos as $i => $persona) {
                $arrayidpersonas[] = $arrayDatos[$i]['num_ideper'];
            }
            
            $arrayidpersonas = array_unique($arrayidpersonas);
            $arrayidpersonas = array_values($arrayidpersonas);

            $arrayfinalDatos = array();
            $contarrayfinalDatos = 0;
            $arrayfinal = array();    
            

            foreach ($arrayidpersonas as $k=>$idpersona){
                
                $netomn = 0;
                $netocuc = 0;
                $i = 0;
                foreach ($arrayDatos  as $rpers){
                    if($rpers['num_ideper'] == $idpersona){
                        
                        $arrayfinal[$k]['cod_tipid'] =  $rpers['cod_tipid'];
                        $arrayfinal[$k]['cod_paexid'] = $rpers['cod_paexid'];
                        $arrayfinal[$k]['nombreyapellidos'] = $rpers['nombreyapellidos'];
                        $arrayfinal[$k]['cta_mnac'] = $rpers['cta_mnac'];
                        $arrayfinal[$k]['num_ideper'] = $rpers['num_ideper'];
                        $arrayfinal[$k]['idplantillanominal'] = $rpers['idplantillanominal'];
                        $arrayfinal[$k]['denominacion'] = $rpers['denominacion'];
                        $arrayfinal[$k]['cta_mlc'] = $rpers['cta_mlc'];
                        $arrayfinal[$k]['importe_d'] = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                        $arrayfinal[$k]['importe_n'] = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                        $netomn = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                        $netocuc = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');                     
                    }
                }
                
                $numcuentamoneda = ($moneda == 1) ? $arrayfinal[$k]['cta_mnac'] : $arrayfinal[$k]['cta_mlc'];
                $datoscuenta = array();
                if ($numcuentamoneda) {
                    $datoscuenta = $this->obtenerCuentasPorTipoMoneda($identidad, $numcuentamoneda);
                }
                
                if (($netomn > 0 && $moneda == 1) || ($netocuc > 0 && $moneda == 2)) {
                    $arrayfinalDatos[$contarrayfinalDatos] = $arrayfinal[$k];
                    $contarrayfinalDatos++;
                   
                }
            }
            //Indexando
            $aux = array();
            foreach ($arrcamposexpbanco as $campo) {
                $aux[$campo['tipocampo']] = $campo;
            }
            
            $i = 0;
            foreach ($arrayfinalDatos as $arrcampos) {
                
                $i++;
                $rec = $db->appendRecord();
                        foreach ($arrcampos as $tipocampo => $valorcampo) {
                            //Si existe el campo en la configuracion
                            if ($aux[$tipocampo]) {
                                switch ($tipocampo) {
                                    case  'cta_mnac':
                                        $rec->setObjectByName($aux[$tipocampo]['denomcampo'], (($moneda == 1) ? $valorcampo : ''));
                                        break;
                                    case  'cta_mlc':
                                        $rec->setObjectByName($aux[$tipocampo]['denomcampo'], (($moneda == 1) ? '' : $valorcampo));
                                        break;
                                    case  'importe_n':
                                        $rec->setObjectByName($aux[$tipocampo]['denomcampo'], (($moneda == 1) ? $valorcampo : 0.00));
                                        break;
                                    case  'importe_d':
                                        $rec->setObjectByName($aux[$tipocampo]['denomcampo'], (($moneda == 1) ? 0.00 : $valorcampo));
                                        break;
                                    default:
                                        $rec->setObjectByName($aux[$tipocampo]['denomcampo'], $valorcampo);
                                        break;
                                }
                            }
                        }
                        $db->writeRecord();
            }
            $db->close();
            $s->codigo = 'OK';
            $s->url = "/pvd/nomina/nomina.dbf";
        }
        echo json_encode($s);
    }

    public function obtenerIdBancoPorCuentaBancaria($cuentabancaria){
        $sql = "SELECT idbanco FROM mod_personaext.dat_cuentabancaria where numerocuenta = '$cuentabancaria';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datos = $conn->fetchOne($sql);
        return $datos;
    }

    public function notificarCorreoAction()
    {
        $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arrayidelaborarpagos')));
        $identidad = $this->_request->getPost('identidad');
        $personas = array_unique(Zend_Json::decode(stripslashes($this->_getParam('personas'))));
        $usuario = $perfilseguridad = $this->global->Perfil->usuario;
        $pass = $this->_request->getPost('pass');
        $totalpersonasnotificar = $this->_getParam('totalpersonasnotificar');
        $dat = new DatExportarbancoModel();
        $result = $dat->notificarCorreo($arrayidelaborarpagos, $identidad, $usuario, $pass, $personas, $totalpersonasnotificar);
        echo json_encode($result);
    }

    public function exportarResumenGeneralAction()
    {
        $identidad = $this->_getParam('identidad');
        $cierre = $this->_getParam('cierre');
        $idfechacierre = Zend_Json::decode(stripslashes($this->_getParam('idfechacierre')));
        $arridelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $arrpersonas = array();
        $arrpersonascajero = array();
        $objExportarDesglose = new ReporteResumenGeneralModel();
        if ($cierre == 0) {
            foreach ($arridelaborarpagos as $k => $value) {
                //Personas por caja
                $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
                $arrpersonas[$value] = array_merge($arrpersonas, $r['datos']);

                //Personas por cajero
                $rc = $this->buscarParaExportarBanco($value, 2, 1, $identidad, null);
                $arrpersonascajero[$value] = array_merge($arrpersonascajero, $rc['datos']);
            }
        } else {
            if (!empty($idfechacierre)) {
                $periodos = DatCierrePeriodosNomina::obtenerListadoPeriodosPagoDatCierrePeriodos($idfechacierre);
                foreach ($periodos as $periodo) {
                    //Personas por caja
                    $arrpersonas[$periodo['idelaborarpagos']] = unserialize($periodo['personascaja']);

                    //Personas por cajero
                    $arrpersonascajero[$periodo['idelaborarpagos']] = unserialize($periodo['personascajero']);
                }
            }
        }
        $objExportarDesglose->exportarResumenGeneral($identidad, $arridelaborarpagos, $arrpersonas, $arrpersonascajero, 2);
        echo Zend_Json::encode('ok');
    }

    public function exportarDesgloseNominasAction()
    {
        $identidad = $this->_getParam('identidad');
        $validar = $this->_getParam('validar');
        $tiporeporte = $this->_getParam('tiporeporte');
        $arridelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $cierre = $this->_getParam('cierre');
        $idfechacierre = Zend_Json::decode(stripslashes($this->_getParam('idfechacierre')));

        $arrpersonas = array();
        $datospersonas = array();
        $arrpersonasaux = array();

        if ($cierre == 0) {
            foreach ($arridelaborarpagos as $k => $value) {
                $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
                $arrpersonasaux = array_merge($arrpersonasaux, $r['datos']); //Arreglo para el desglose por personas
                $arrpersonas[$value]['idelaborarpago'] = $value; //Arreglo para el desglose por tipos de nominas
                $arrpersonas[$value]['personas'] = $r['datos'];
                if ($validar == 0) {
                    //Para el desglose de billetes por tipo de nominas
                    if ($tiporeporte == 1) {
                        $datospersonas = $arrpersonas;
                    }
                }
            }
        } else {
            if (!empty($idfechacierre)) {
                $periodos = DatCierrePeriodosNomina::obtenerListadoPeriodosPagoDatCierrePeriodos($idfechacierre);
                foreach ($periodos as $periodo) {
                    //Personas por caja
                    $arrpersonasaux = array_merge($arrpersonasaux, unserialize($periodo['personascaja']));
                    $arrpersonas[$periodo['idelaborarpagos']]['idelaborarpago'] = $periodo['idelaborarpagos'];
                    $arrpersonas[$periodo['idelaborarpagos']]['personas'] = unserialize($periodo['personascaja']);
                }
                if ($validar == 0) {
                    //Para el desglose de billetes por tipo de nominas
                    if ($tiporeporte == 1) {
                        $datospersonas = $arrpersonas;
                    }
                }
            }
        }

        //Para el desglose de billetes por persona
        if ($tiporeporte == 2) {
            $arrayidpersonas = array();
            foreach ($arrpersonasaux as $i => $persona) {
                $arrayidpersonas[] = $persona['idpersona'];
            }
            $arrayidpersonas = array_unique($arrayidpersonas);
            $arrayidpersonas = array_values($arrayidpersonas);
            $arrayfinal = array();
            foreach ($arrayidpersonas as $k=>$idpersona){
                foreach ($arrpersonasaux as $rpers){
                    if($rpers['idpersona'] == $idpersona && !$this->existePersona($arrayfinal, $idpersona, $rpers['importe_d'], $rpers['importe_n'])){
                        if($rpers['importe_n'] > 0 || $rpers['importe_d'] > 0){
                            $arrayfinal[$k]['idpersona'] = $rpers['idpersona'];
                            $arrayfinal[$k]['cod_tipid'] = $rpers['cod_tipid'];
                            $arrayfinal[$k]['cod_paexid'] = $rpers['cod_paexid'];
                            $arrayfinal[$k]['nombreyapellidos'] = $rpers['nombreyapellidos'];
                            $arrayfinal[$k]['cta_mnac'] = $rpers['cta_mnac'];
                            $arrayfinal[$k]['num_ideper'] = $rpers['num_ideper'];
                            $arrayfinal[$k]['idplantillanominal'] = $rpers['idplantillanominal'];
                            $arrayfinal[$k]['denominacion'] = $rpers['denominacion'];
                            $arrayfinal[$k]['cta_mlc'] = $rpers['cta_mlc'];
                            $arrayfinal[$k]['importe_d'] = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                            $arrayfinal[$k]['importe_n'] = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                            //Codigo contable
                            $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($idpersona, $identidad);
                            $arrayfinal[$k]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];
                        }
                    }
                }
            }
            $datospersonas = $this->indexarArreglo($arrayfinal);
        }

        $objExportarDesglose = new ReporteDesgloseBilletesModel();
        $codigo = ($validar == 1) ? $objExportarDesglose->fnValidarReporte($identidad, $arrpersonas) :
            $objExportarDesglose->fnExportarDesgloseBilletes($identidad, $datospersonas, $tiporeporte);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        $respuesta = ($validar == 1) ? "{'codigo':'" . $codigo . "'}" : "ok";
        echo $respuesta;
    }

    private function existePersona($arraypersonas, $idpersona, $importe_d, $importe_n) {
        foreach ($arraypersonas as $persona) {
            if($persona['idpersona'] == $idpersona && $persona['importe_d'] == $importe_d && $persona['importe_n'] == $importe_n) {
                return true;
            }
        }
        return false;
    }

    public function obtenerBilletesCUPAction()
    {
        $identidad = $this->_getParam('identidad');
        $arridelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $estado = $this->_request->getPost('estado');
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        $arrcantidades = $this->cantidadBilletes($identidad, $arridelaborarpagos, 'CUP', $estado, $idfechascierre);
        $contcantidades = count($arrcantidades);
        $importerealdesglose = $arrcantidades[$contcantidades - 1]['montoreal'];
        //Asignando el monto total cup
        $arrcantidades[$contcantidades - 1]['billete'] = 'Total';
        $arrcantidades[$contcantidades - 1]['cantidadbillete'] = '-';
        $arrcantidades[$contcantidades - 1]['producto'] = ' ' . number_format($importerealdesglose, 2, '.', '');

        echo json_encode(array('datos' => $arrcantidades, 'cantidad' => count($arrcantidades)));
    }

    public function obtenerBilletesCUCAction()
    {
        $identidad = $this->_getParam('identidad');
        $arridelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $estado = $this->_request->getPost('estado');
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        $arrcantidades = $this->cantidadBilletes($identidad, $arridelaborarpagos, 'CUC', $estado, $idfechascierre);
        $contcantidades = count($arrcantidades);
        $importerealdesglose = $arrcantidades[$contcantidades - 1]['montoreal'];
        //Asignando el monto total cuc
        $arrcantidades[$contcantidades - 1]['billete'] = 'Total';
        $arrcantidades[$contcantidades - 1]['cantidadbillete'] = '-';
        $arrcantidades[$contcantidades - 1]['producto'] = ' ' . number_format($importerealdesglose, 2, '.', '');

        echo json_encode(array('datos' => $arrcantidades, 'cantidad' => count($arrcantidades)));
    }

    public function validarCuadreDesgloseAction()
    {
        $identidad = $this->_getParam('identidad');
        $arridelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $estado = $this->_request->getPost('estado');
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        //CUP
        $arrcantidadescup = $this->cantidadBilletes($identidad, $arridelaborarpagos, 'CUP', $estado, $idfechascierre);

        $codigocup = $arrcantidadescup[count($arrcantidadescup) - 1]['codigo'];
        //CUC
        $arrcantidadescuc = $this->cantidadBilletes($identidad, $arridelaborarpagos, 'CUC', $estado, $idfechascierre);
        $codigocuc = $arrcantidadescuc[count($arrcantidadescuc) - 1]['codigo'];

        if ($codigocup == 3) {
            echo json_encode('BILLETES-CUP-INSUFICIENTES-DESGLOSE');
            return;
        }

        if ($codigocuc == 3) {
            echo json_encode('BILLETES-CUC-INSUFICIENTES-DESGLOSE');
            return;
        }
        echo json_encode('OK');
    }

    public function obtenerResumenesPeriodosPagoAction()
    {
        $identidad = $this->_getParam('identidad');
        $tipoentidad = $this->_getParam('tipoentidad');
        $arrayentidades = array();
        $arraydatos = array();
        $obj = new DatFechasCierrePeriodo();
        //Si es para la misma entidad que se envio por parametros
        if ($tipoentidad == 1) {
            $arraydatos = $obj->obtenerListadoDatFechasCierrePeriodo($identidad);
            //Si es para todas las entidades subordinadas
        } else {
            //Buscando el nomsubordinacion de la entidad padre
            $sqlSubordinacionEstructura = "SELECT idnomsubordinacion
                                               FROM mod_estructuracomp.dat_subordinacion WHERE idpadre = ? and idhijo = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $rsubordinacion = $conn->fetchOne($sqlSubordinacionEstructura, array($identidad, $identidad));
            //Buscando las subordinaciones
            $datossubordinacion = ($rsubordinacion) ? $this->integrator->metadatos->getHijosSubordinacion($identidad, $rsubordinacion) : array();
            //Si tiene subordinaciones se devuelve las fechas de cierre de las entidades subordinadas mas las de esta entidad
            if (count($datossubordinacion) > 0) {
                foreach ($datossubordinacion as $restruct) {
                    $arrayentidades[] = $restruct->idestructura;
                }
                array_push($arrayentidades, $identidad);
                $arraydatos = $obj->obtenerListadoDatFechasCierrePeriodoEntidadesSubordinadas($arrayentidades);
                //Si no tiene subordinaciones se devuelve las fechas de cierres de ella misma
            } else {
                $arraydatos = $obj->obtenerListadoDatFechasCierrePeriodo($identidad);
            }
        }

        foreach ($arraydatos as $i => $v) {
            list($dia, $mes, $anno) = explode('/', $v['fechacierre']);
            $denomentidad = $this->integrator->metadatos->DameEstructura($v['identidad'])[0]->denominacion;
            $arraydatos[$i]['anno'] = $anno . ' - ' . $denomentidad;
            $arraydatos[$i]['annoall'] = $anno;
            $periodos = DatCierrePeriodosNomina::obtenerListadoPeriodosPagoDatCierrePeriodos($v['idfechascierre']);
            $arridelaborarpagos = array();
            foreach ($periodos as $periodo) {
                $arridelaborarpagos[] = $periodo['idelaborarpagos'];
                $idtipopago = DatElaborarPagos::obtenerTipoPagoPeriodo($periodo['idelaborarpagos']);
                $arraydatos[$i]['listadotipospagos'] .= NomTipoPago::obtenerDenominacion($idtipopago) . ', ';
            }
            $arraydatos[$i]['listadotipospagos'] = trim($arraydatos[$i]['listadotipospagos'], ', ');

            //Obteniendo los montos
            $arraydatos[$i]['cajeromontocup'] = number_format($v['montocajerocup'], 2, '.', '');
            $arraydatos[$i]['cajeromontocuc'] = number_format($v['montocajerocuc'], 2, '.', '');
            $arraydatos[$i]['cajamontocup'] = number_format($v['montocajacup'], 2, '.', '');
            $arraydatos[$i]['cajamontocuc'] = number_format($v['montocajacuc'], 2, '.', '');
        }

        echo json_encode(array('datos' => $arraydatos, 'cantidad' => count($arraydatos)));
    }

    public function obtenerPeriodosPagoFechaCierreAction()
    {
        $arrayidfcierre = Zend_Json::decode(stripslashes($this->_getParam('arrayidfcierre')));
        $arrayidentidad = Zend_Json::decode(stripslashes($this->_getParam('arrayidentidad')));
        $obj = new DatCierrePeriodosNomina();
        $objNomTipoPago = new NomTipoPago();
        $arrayfinal = array();
        $cont = 0;
        foreach ($arrayidfcierre as $idfcierre) {
            $arrdatos = $obj->obtenerListadoPeriodosPagoDatCierrePeriodos($idfcierre, $arrayidentidad);
            foreach ($arrdatos as $i => $rdatos) {
                $sql = "select * from mod_nomina.dat_elaborarpagos	where idelaborarpagos = ? order by fechapago DESC;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $r = $conn->fetchAll($sql, array($rdatos['idelaborarpagos']));
                $arrayfinal[$cont]['idelaborarpagos'] = $r[0]['idelaborarpagos'];
                $arrayfinal[$cont]['idtipopago'] = $r[0]['idtipopago'];
                $arrayfinal[$cont]['idperiodopago'] = $r[0]['idperiodopago'];
                $arrayfinal[$cont]['periodopago'] = $r[0]['fechainicioperiodo'] . 'al' . $r[0]['fechafinperiodo'];
                $arrayfinal[$cont]['fechapago'] = $r[0]['fechapago'];
                $arrayfinal[$cont]['fechainicioperiodo'] = $r[0]['fechainicioperiodo'];
                $arrayfinal[$cont]['fechafinperiodo'] = $r[0]['fechafinperiodo'];
                $denomentidad = $this->integrator->metadatos->DameEstructura($r[0]['identidad'])[0]->denominacion;
                $arrayfinal[$cont]['identidad'] = $r[0]['identidad'];
                $arrayfinal[$cont]['estado'] = $r[0]['estado'];
                $rexplode = explode('/', $r[0]['fechafinperiodo']);
                $arrayfinal[$cont]['anyo'] = $rexplode[2] . ' - ' . $denomentidad;
                $arrayfinal[$cont]['denomtipopago'] = $objNomTipoPago->obtenerDenominacion($r[0]['idtipopago']);
                $cont++;
            }
        }
        echo json_encode(array('datos' => $arrayfinal, 'cantidad' => count($arrayfinal)));
    }

    public function concluirCierrePeriodosAction()
    {
        $identidad = $this->_getParam('identidad');
        $totalcupcajero = $this->_getParam('totalcupcajero');
        $totalcuccajero = $this->_getParam('totalcuccajero');
        $totalcupcaja = $this->_getParam('totalcupcaja');
        $totalcuccaja = $this->_getParam('totalcuccaja');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $personascajero = $this->obtenerpersonascajeroguardar($identidad, $idelaborarpagos);
        $personascaja = $this->obtenerpersonascajaguardar($identidad, $idelaborarpagos);

        $cup = 0;
        $mn = 0;
        foreach ($personascaja->arrfinal as $pc) {
            $cup = $cup + $pc['importe_n'];
            $mn = $mn + $pc['cta_mlc'];
        }
        if (count($idelaborarpagos) > 0) {
            //Update los estados
            $sql = "UPDATE mod_nomina.dat_fechascierreperiodos SET estado=2 where identidad = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql, array($identidad));
            //Save
            $objDatFechasCierrePeriodo = new DatFechasCierrePeriodo();
            $objDatFechasCierrePeriodo->estado = 1;
            $objDatFechasCierrePeriodo->identidad = $identidad;
            $objDatFechasCierrePeriodo->fechacierre = Date('Y-m-d');
            $objDatFechasCierrePeriodo->personascaja = serialize($personascaja->arrfinal);
            $objDatFechasCierrePeriodo->personascajero = serialize($personascajero->arrfinal);
            $objDatFechasCierrePeriodo->montocajacup = $totalcupcaja;
            $objDatFechasCierrePeriodo->montocajacuc = $totalcuccaja;
            $objDatFechasCierrePeriodo->montocajerocup = $totalcupcajero;
            $objDatFechasCierrePeriodo->montocajerocuc = $totalcuccajero;
            $objDatFechasCierrePeriodo->save();
            $idfechascierre = $objDatFechasCierrePeriodo->idfechascierre;
            foreach ($idelaborarpagos as $rid) {
                $objDatCierrePeriodo = new DatCierrePeriodosNomina();
                $objDatCierrePeriodo->idfechascierre = $idfechascierre;
                $objDatCierrePeriodo->idelaborarpagos = $rid;
                $objDatCierrePeriodo->personascaja = serialize($personascaja->idelaborarpagos[$rid]);
                $objDatCierrePeriodo->personascajero = serialize($personascajero->idelaborarpagos[$rid]);
                $objDatCierrePeriodo->save();
                //Cerrando los periodos de pago
                $objPeriodosPago = DatElaborarPagos::obtenerElaborarPagos($rid);
                $objPeriodosPago->estado = 2;
                $objPeriodosPago->save();
            }
        }
        echo json_encode('ok');
    }

    public function exportartalonpagoAction()
    {
        $objTipoPago = new NomTipoPago();
        $objEstructModelo = new ConfigEstructurarModelosNomina();
        $objDatosNominas = new DatNominaDatos();
        $objReporteTalon = new ReporteTalonPagoModel();
        $objElaborarPagos = new DatElaborarPagos();
        $objDatNominaModel = new DatNominaModel();
        $validacion = $this->_getParam('accionvalidacion');
        $identidad = $this->_getParam('identidad');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $tiposeleccion = $this->_getParam('tiposeleccion');
        $personas = Zend_Json::decode(stripslashes($this->_getParam('personas')));
        $mostrardesglose = $this->_getParam('desglose');

        $cont = 0;
        $pos = 0;
        if (count($idelaborarpagos) > 1) {
            foreach ($idelaborarpagos as $i => $idep) {
                $idtipopago = $objElaborarPagos->obtenerTipoPagoPeriodo($idep);
                $sepagaadelantado = $objTipoPago->obtenerPagoAdelantado($idtipopago);
                $cont += ($sepagaadelantado == 0) ? 1 : 0;
                if ($sepagaadelantado == 0) {
                    $pos = $i;
                    break;
                }
            }
            $fechainicioperiodo = $objElaborarPagos->obtenerFechaInicioPeriodoPago($idelaborarpagos[$pos]);
        } else {
            $fechainicioperiodo = $objElaborarPagos->obtenerFechaInicioPeriodoPago($idelaborarpagos[0]);
        }
        list($dia, $mes, $anno) = explode('/', $fechainicioperiodo);

        //Obteniendo los campos a mostrar en la talonario para este tipo de nomina y periodo de pago
        $campostipospago = $objEstructModelo->obtenerCampoTalonario($idelaborarpagos);

        if ($validacion == 1) {
            $r = new stdClass();
            //Validaciones
            if (empty($campostipospago)) {
                $r->validacion = '1';//No existen campos configurados para el talonario de este tipo de pago
                echo json_encode($r);
                return;
            } else {
                if ($tiposeleccion == 2) {//Personas sin correo
                    $arrpersonassincorreo = DatNominaModel::fnObtenerPersonasSinCorreo($idelaborarpagos);
                    if (empty($arrpersonassincorreo)) {
                        $r->validacion = '2';//No hay personas sin correo para este tipo de pago
                        echo json_encode($r);
                        return;
                    }
                }

                $r->validacion = '0';
                echo json_encode($r);
                return;
            }
        } else {//Generando el reporte
            $arrCamposTalonario = array(
                'nombreapellidos' => ['denominacion' => 'Nombre y apellidos', 'idtiponomina' => 1, 'idtipocampo' => 1, 'escampopersona' => 'nombreapellidos'],
                'plantillanominal' => ['denominacion' => 'Área', 'idtiponomina' => 1, 'idtipocampo' => 1, 'escampopersona' => 'area'],
                'periodo' => ['denominacion' => 'Período', 'idtiponomina' => 1, 'idtipocampo' => 1, 'escampopersona' => 'periodo'],
                'salario' => ['denominacion' => 'Salario', 'idtiponomina' => 1, 'idtipocampo' => 1, 'escampopersona' => 'salario']
            );
            $campostipospago = $objDatNominaModel->ordenarArrayPorClave($campostipospago, 'idtiponomina');
            foreach ($campostipospago as $tipopago) {
                if(  $tipopago['idtipocampo'] != 1){
                    $arrCamposTalonario['c' . $tipopago['idestructuramodelodomina']] = $tipopago;
                }
            }
            $arrCamposTalonario['acumuladodias'] = ['denominacion' => 'Días acum.', 'idtiponomina' => 99, 'idtipocampo' => 2, 'escampopersona' => 'vacaciones'];
            $arrCamposTalonario['acumuladoimporte'] = ['denominacion' => 'Importe acum.', 'idtiponomina' => 99, 'idtipocampo' => 2, 'escampopersona' => 'vacaciones'];


            //Obteniendo los datos de las personas
            $arrPersonasTalonario = array();
            $arrDatosPeriodo = $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPagoArray($idelaborarpagos);
            switch ($tiposeleccion) {
                case 1://Todas las personas
                    $arrPersonasTalonario = $this->fnObtenerPersonasTalonario($arrDatosPeriodo, $arrCamposTalonario, $tiposeleccion, $identidad, $mes);
                    break;

                case 2://Personas sin correo
                    $arrpersonas = DatNominaModel::fnObtenerPersonasSinCorreo($idelaborarpagos);
                    $arrpersonassincorreo = array();
                    foreach ($arrpersonas as $p)
                        $arrpersonassincorreo[] = $p['idpersona'];

                    $arrPersonasTalonario = $this->fnObtenerPersonasTalonario($arrDatosPeriodo, $arrCamposTalonario, $tiposeleccion, $identidad, $mes, $arrpersonassincorreo);
                    break;

                case 3://Personas especificas
                    $arrPersonasTalonario = $this->fnObtenerPersonasTalonario($arrDatosPeriodo, $arrCamposTalonario, $tiposeleccion, $identidad, $mes, $personas);
                    break;

                default:
                    break;

            }
            $objReporteTalon->fnExportarReporte($identidad, $arrPersonasTalonario, $arrCamposTalonario, $idelaborarpagos, $mostrardesglose);
        }
    }

    //Otros Metodos
    private function fnObtenerPersonasTalonario($arrDatosPeriodo, $arrCamposTalonario, $tiposeleccion, $identidad, $mes, $arrPersonas = null)
    {
        //Restructurando el arreglo de personas
        $arrDatosPeriodoFinal = array();
        foreach ($arrDatosPeriodo as $nomina) {
            $arrValores = unserialize($nomina['valores']);
            foreach ($arrValores as $i => $p) {
                $idpersona = $p['idpersona'];
                $arrDatosPeriodoFinal[$idpersona][$p['idnomina']] = $p;
            }
        }
        $arrDatosPersonas = array();
        foreach ($arrDatosPeriodoFinal as $idpersona => $arrValores) {
            $arr = array();
            foreach ($arrValores as $idnomina => $p) {
                $arr = array_merge($arr, $p);
            }
            $arrDatosPersonas[$idpersona] = $arr;
        }

        //Llenando el arreglo de personas solo con los campos a mostrar en el talonario
        $objHisVacaciones = new HisVacacionesPersona();
        $arrPersonasTalonario = array();
        if ($tiposeleccion == 1) {
            foreach ($arrDatosPersonas as $idpersona => $p) {
                $datospersona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($idpersona), null, null, null, null, null);
                foreach ($arrCamposTalonario as $c => $campo) {
                    list(, , $plantillanominal) = explode('-', $p['plantillanominal']);
                    $arrPersonasTalonario[$idpersona]['nombreapellidos'] = $datospersona->data[0]['nombre'] . ' ' . ((!empty($datospersona->data[0]['snombre'])) ? $datospersona->data[0]['snombre'] . ' ' : '') . $datospersona->data[0]['papel'] . ' ' . $datospersona->data[0]['sapel'];
                    $arrPersonasTalonario[$idpersona]['plantillanominal'] = $plantillanominal;
                    $arrPersonasTalonario[$idpersona]['periodo'] = $mes;
                    $arrPersonasTalonario[$idpersona][$c] = (!empty($p[$c])) ? $p[$c] : 0;
                }
                $ultopsubmayor = $objHisVacaciones->obtenerSaldoTiempoUltimaOperacion($idpersona, $identidad);
                if (!empty($ultopsubmayor)) {
                    $arrPersonasTalonario[$idpersona]['acumuladodias'] = $ultopsubmayor[0]['saldoentiempo'];
                    $arrPersonasTalonario[$idpersona]['acumuladoimporte'] = $ultopsubmayor[0]['saldoenimporte'];
                }
            }
        } else {
            foreach ($arrPersonas as $i => $pes) {
                foreach ($arrDatosPersonas as $idpersona => $p) {
                    if ($pes == $idpersona) {
                        $datospersona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($idpersona), null, null, null, null, null);
                        foreach ($arrCamposTalonario as $c => $campo) {
                            list(, , $plantillanominal) = explode('-', $p['plantillanominal']);
                            $arrPersonasTalonario[$idpersona]['nombreapellidos'] = $datospersona->data[0]['nombre'] . ' ' . ((!empty($datospersona->data[0]['snombre'])) ? $datospersona->data[0]['snombre'] . ' ' : '') . $datospersona->data[0]['papel'] . ' ' . $datospersona->data[0]['sapel'];;
                            $arrPersonasTalonario[$idpersona]['plantillanominal'] = $plantillanominal;
                            $arrPersonasTalonario[$idpersona]['periodo'] = $mes;
                            $arrPersonasTalonario[$idpersona][$c] = (!empty($p[$c])) ? $p[$c] : 0;
                        }
                        $ultopsubmayor = $objHisVacaciones->obtenerSaldoTiempoUltimaOperacion($idpersona, $identidad);
                        if (!empty($ultopsubmayor)) {
                            $arrPersonasTalonario[$idpersona]['acumuladodias'] = $ultopsubmayor[0]['saldoentiempo'];
                            $arrPersonasTalonario[$idpersona]['acumuladoimporte'] = $ultopsubmayor[0]['saldoenimporte'];
                        }
                    }
                }
            }
        }
        return $arrPersonasTalonario;
    }

    public function cantidadBilletes($identidad, $arridelaborarpagos, $tipomoneda, $estado, $idfechascierre)
    {
        //Personas a efectuarle el desglose de billetes
        $datospersonas = array();
        $rpersonas = array();

        if ($estado == 1) {
            foreach ($idfechascierre as $idfcierre) {
                $rp = DatFechasCierrePeriodo::obtenerListadoPersonasCaja($idfcierre);
                if ($rp) {
                    $r = unserialize($rp);
                    if (count($r) > 0) {
                        foreach ($r as $rr) {
                            array_push($rpersonas, $rr);
                        }
                    }
                }
            }
            $datospersonas[0]['personas'] = $rpersonas;
            $datospersonas[0]['idelaborarpago'] = -1;

        } else {
            foreach ($arridelaborarpagos as $k => $value) {
                $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
                $datospersonas[$value]['personas'] = $r['datos'];
                $datospersonas[$value]['idelaborarpago'] = $value;
            }
        }
        //Arrays con valores de los billetes y menudos
        $arrnombilletes = NomBilleteModel::obtenerListadoBilletes();
        $arrmoneda = array();
        foreach ($arrnombilletes as $billete) {
            if ($billete['activo'] != 0) {
                if ($billete['denommoneda'] == $tipomoneda)
                    $arrmoneda[] = $billete;
            }
        }

        //Realizando el desglose de billetes por persona para ambas monedas
        $objRepDesgBill = new ReporteDesgloseBilletesModel();
        $arrcantbilletes = array();
        $importetotal = 0;

        $importe = ($tipomoneda == 'CUP') ? 'importe_n' : 'importe_d';

        foreach ($datospersonas as $i => $arrpersonas) {
            if (!empty($arrpersonas['personas'])) {
                //Recorriendo el arreglo de personas
                foreach ($arrpersonas['personas'] as $p => $persona) {
                    $arrcantbilletes [] = $objRepDesgBill->fnDesglozarBilletes($persona[$importe . ''], $arrmoneda);
                    $importetotal += $persona[$importe];
                }
            }
        }

        //Creando el arreglo de cantidades por cada billete
        $arrbilletes = array();
        $arrmenudo = array();
        foreach ($arrcantbilletes as $d => $desglose) {
            foreach ($desglose[0] as $b => $cantbill) {
                $arrbilletes[$b] += $cantbill;
            }
            foreach ($desglose[1] as $m => $cantmen) {
                $pos = (double)$m / 100;
                $arrmenudo['' . $pos] += $cantmen;
            }
        }
        $arrcantidades = array();
        $contcantidades = 0;
        foreach ($arrbilletes as $b => $bi) {
            foreach ($arrnombilletes as $billete) {
                if ($billete['denommoneda'] == $tipomoneda && $billete['denominacion'] == (double)$b) {
                    $arrcantidades[$contcantidades]['idbillete'] = $billete['idbillete'];
                }
            }
            $arrcantidades[$contcantidades]['billete'] = utf8_decode('$ ') . number_format($b, 2, '.', '');
            $arrcantidades[$contcantidades]['cantidadbillete'] = $bi;
            $arrcantidades[$contcantidades]['producto'] = number_format((double)((double)$b * $bi), 2, '.', '');
            $contcantidades++;
        }

        $contcantidades = count($arrcantidades);
        foreach ($arrmenudo as $m => $me) {
            foreach ($arrnombilletes as $billete) {
                if ($billete['denommoneda'] == $tipomoneda && $billete['denominacion'] == (double)$m) {
                    $arrcantidades[$contcantidades]['idbillete'] = $billete['idbillete'];
                }
            }

            $arrcantidades[$contcantidades]['billete'] = number_format($m, 2, '.', '') . ' c';
            $arrcantidades[$contcantidades]['cantidadbillete'] = $me;
            $arrcantidades[$contcantidades]['producto'] = number_format((double)((double)$m * $me), 2, '.', '');
            $contcantidades++;
        }

        //Comprobando que exista un cuadre de montos, que los billetes sean suficiente para realizar el desglose
        $importereal = 0;
        foreach ($arrcantidades as $montos) {
            $importereal += $montos['producto'];
        }

        //Comparacion de dos valores float(valores de punto flotante) con el epsilon
        $epsilon = 0.00001;
        $arrcantidades[$contcantidades]['codigo'] = (abs($importetotal - $importereal) < $epsilon) ? 1 : 3;
        $arrcantidades[$contcantidades]['montototal'] = number_format($importetotal, 2, '.', '');
        $arrcantidades[$contcantidades]['montoreal'] = number_format($importereal, 2, '.', '');

        return $arrcantidades;
    }

    public function indexarArreglo($array)
    {
        $arrayfinal = array();
        foreach ($array as $valor) {
            $arrayfinal[$valor['idplantillanominal']]['centro'] = $valor['denominacion'];
            $arrayfinal[$valor['idplantillanominal']]['personas'][$valor['idpersona']] = $valor;
        }
        return $arrayfinal;
    }

    public function obtenerpersonascajeroguardar($identidad, $idelaborarpagos)
    {

        $acumulado = 0;
        $arrpersonas = array();
        $arrpersonasFinal = array();
        $arrpersonasmerge = array();
        $objFinal = new StdClass();

        foreach ($idelaborarpagos as $k => $value) {
            $r = $this->buscarParaExportarBanco($value, 2, 1, $identidad, null);
            $objFinal->idelaborarpagos[$value] = $r['datos'];
            $arrpersonas = array_merge($arrpersonas, $r['datos']);

        }

        for ($i = 0; $i < count($arrpersonas); $i++) {
            $netomn = $arrpersonas[$i]['importe_n'];
            $netocuc = $arrpersonas[$i]['importe_d'];
            for ($j = $i + 1; $j < count($arrpersonas); $j++) {
                if ($arrpersonas[$i]['idpersona'] == $arrpersonas[$j]['idpersona']) {
                    $netomn += $arrpersonas[$j]['importe_n'];
                    $netocuc += $arrpersonas[$j]['importe_d'];
                    if ($arrpersonas[$j]['cta_mlc'] != '') {
                        $arrpersonas[$i]['cta_mlc'] = $arrpersonas[$j]['cta_mlc'];
                    }
                    if ($arrpersonas[$j]['cta_mnac'] != '') {
                        $arrpersonas[$i]['cta_mnac'] = $arrpersonas[$j]['cta_mnac'];
                    }
                    unset($arrpersonas[$j]);
                    $arrpersonas = array_values($arrpersonas);
                }
            }
            $sqldatoscuenta = "select * from mod_personaext.dat_cuentabancaria datcban inner join mod_datosmaestros.nom_moneda mn on(mn.idmoneda = datcban.idmoneda)
			                       where datcban.idpersona=?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $datoscuentacuc = $conn->fetchAll($sqldatoscuenta, array($arrpersonas[$i]['idpersona']));

            foreach ($datoscuentacuc as $kcuenta => $vcuenta) {
                if ($vcuenta['codtipoid'] == 1) {
                    $codtipoid = 'CI';
                } else if ($vcuenta['codtipoid'] == 2) {
                    $codtipoid = 'CM';
                } else {
                    $codtipoid = 'CP';
                }
                if ($vcuenta['codigo'] == '01') {
                    $arrpersonas[$i]['cta_mnac'] = $vcuenta['numerocuenta'];
                    $arrpersonas[$i]['cod_tipid'] = $codtipoid;
                } else if ($vcuenta['codigo'] == '02') {
                    $arrpersonas[$i]['cta_mlc'] = $vcuenta['numerocuenta'];
                    $arrpersonas[$i]['cod_tipid'] = $codtipoid;
                }
            }
            $arrpersonas[$i]['importe_n'] = number_format($netomn, 2, '.', '');
            $arrpersonas[$i]['importe_d'] = number_format($netocuc, 2, '.', '');

            //Codigo contable
            $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($arrpersonas[$i]['idpersona'], $identidad);
            $arrpersonas[$i]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];
        }
        $objFinal->arrfinal = $arrpersonas;
        return $objFinal;

    }

    public function obtenerpersonascajaguardar($identidad, $idelaborarpagos)
    {
        $acumulado = 0;
        $arrpersonas = array();
        $arrtirilla = array();
        $arrpersonasFinal = array();
        $arrpersonasmerge = array();
        $objFinal = new StdClass();
        $contfinal = 0;

        $arrayidpersonas = array();
        foreach ($idelaborarpagos as $k => $value) {
            $r = $this->buscarParaExportarBanco($value, 2, 2, $identidad, null);
            $objFinal->idelaborarpagos[$value] = $r['datos'];
            $arrpersonas = array_merge($arrpersonas, $r['datos']);

        }
        foreach ($arrpersonas as $rp){
            $arrayidpersonas[] = $rp['idpersona'];
        }
        $arrayidpersonas = array_unique($arrayidpersonas);
        $arrayidpersonas = array_values($arrayidpersonas);

        $arrayfinal = array();
        foreach ($arrayidpersonas as $k=>$idpersona){
            foreach ($arrpersonas as $rpers){
                if($rpers['idpersona'] == $idpersona){
                    $arrayfinal[$k]['idpersona'] = $rpers['idpersona'];
                    $arrayfinal[$k]['cod_tipid'] = $rpers['cod_tipid'];
                    $arrayfinal[$k]['cod_paexid'] = $rpers['cod_paexid'];
                    $arrayfinal[$k]['nombreyapellidos'] = $rpers['nombreyapellidos'];
                    $arrayfinal[$k]['cta_mnac'] = $rpers['cta_mnac'];
                    $arrayfinal[$k]['num_ideper'] = $rpers['num_ideper'];
                    $arrayfinal[$k]['idplantillanominal'] = $rpers['idplantillanominal'];
                    $arrayfinal[$k]['denominacion'] = $rpers['denominacion'];
                    $arrayfinal[$k]['cta_mlc'] = $rpers['cta_mlc'];
                    $arrayfinal[$k]['importe_d'] = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                    $arrayfinal[$k]['importe_n'] = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                    //Codigo contable
                    $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($idpersona, $identidad);
                    $arrayfinal[$k]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];
                }
            }
        }
        foreach ($arrayfinal as $if=> $rf){
            if(($rf['importe_n'] == 0) && ($rf['importe_d'] == 0)){
                unset($arrayfinal[$if]);
            }
        }
        $arrayfinal = array_values($arrayfinal);
        $objFinal->arrfinal = $arrayfinal;
        return $objFinal;
    }

    private function buscarParaExportarBanco($idelaborarpagos, $exportar = 2, $cajerocaja = 1, $identidad, $idbanco)
    {
        $s = array();

        $objCRM = new NomConceptoRM();
        $idcrmPagoSalario = $objCRM->obtenerConceptoPagoSalario();
        if ($idcrmPagoSalario == -1) {
            $s['codigo'] = 'NOCRMPAGOSALARIO';
            $s['datos'] = array();
            $s['tirilla'] = array();
            return $s;
        }

        //Saber si la nomina es de cuc o mn
        $sqlmncuc = "select ntnom.tipomoneda, ntnom.idtiponomina
					from mod_nomina.dat_elaborarpagos el
					inner join mod_nomina.conf_modelonomina cmod on (cmod.idtipopago = el.idtipopago)
					inner join mod_nomina.nom_tiponomina ntnom on (ntnom.idtiponomina = cmod.idtiponomina)
					where el.idelaborarpagos = ?; ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rDatosMNCUC = $conn->fetchAll($sqlmncuc, array($idelaborarpagos));
        $tipomoneda = $rDatosMNCUC[0]['tipomoneda'];
        $idtiponomina = $rDatosMNCUC[0]['idtiponomina'];

        if ($cajerocaja == 1) {
            //Datos de las nominas
            $sql = "SELECT idnomina FROM mod_nomina.dat_nomina where idelaborarpago = ?  and cajacajero = 2;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $ids_nomina = $conn->fetchAll($sql, array($idelaborarpagos));
                foreach ($ids_nomina as $item) {
                    $arrayidnomina[] = $item['idnomina'];
                }
                $rDatosNominas = DatNominaDatos::obtenerDatosNominaArray($arrayidnomina);
                        
        } elseif ($cajerocaja == 2) {
            $sql = "select dnd.*
					from mod_nomina.dat_nomina dn
					inner join mod_nomina.dat_nominadatos dnd on (dnd.idnomina = dn.idnomina)
					where dn.aprobada <> 0 and dn.idelaborarpago = ?  and dn.cajacajero = 1; ";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $rDatosNominas = $conn->fetchAll($sql, array($idelaborarpagos));
        }

        if (count($rDatosNominas) > 0) {

            $objEstructura = unserialize($rDatosNominas[0]['estructura']);

            $idcolumnaPagar = $this->buscarColumnaApagar($objEstructura, $idcrmPagoSalario, $idelaborarpagos);
            if ($idcolumnaPagar == -1 || $idcolumnaPagar == null) {
                $s['codigo'] = 'NOCOLUMNAPAGOSALARIO';
                $s['datos'] = array();
                return $s;
            }

            $arridpersonas = array();
            $rExportar = array();
            $arrIdsCO = array();
            $arrIdsPer = array();
            $arrTirilla = array();
            $arrplantillanominal = array();
            $conTirilla = 0;
            foreach ($rDatosNominas as $k => $dn) {
                $arrValores = unserialize($dn['valores']);
                $arrcampos = unserialize($dn['campos']);

                foreach ($arrValores as $j => $v) {
                    //Asociando campos con sus valores
                    foreach ($arrcampos as $c => $d) {
                        $arrTirilla[$conTirilla][$d['denominacion']] = $v[$d['indice']];
                        $arrTirilla[$idcolumnaPagar] = $v[$d['indice']];
                    }
                    $id = $v['id'];
                    $arridpersonas[] = $v['idpersona'];
                    $rExportar[$v['id']]['id'] = $id;
                    if ($tipomoneda == 1) {
                        $rExportar[$v['id']]['importe_n'] = $v['c' . $idcolumnaPagar];
                        $rExportar[$v['id']]['cuenta'] = $v['numerocuenta'];
                    } else {
                        $rExportar[$v['id']]['importe_d'] = $v['c' . $idcolumnaPagar];
                    }
                    $arridcoplantillanominal[$idpersona]['id'] = $v['id'];
                    $rexploplan = explode('-', $v['plantillanominal']);
                    $arridcoplantillanominal[$idpersona]['plantillanominal'] = $rexploplan[2];

                    //}

                }
                $conTirilla++;
            }

            $objExportar = new stdClass();
            if ($cajerocaja == 1) {
                $objExportar = $this->buscarDatosPersonas($arridpersonas, $exportar, $tipomoneda, $arridcoplantillanominal, $identidad, $idbanco);
            } else {
                $objExportar = $this->buscarDatosPersonasCaja($arridpersonas, $tipomoneda, $arridcoplantillanominal, $identidad);
            }
            foreach ($objExportar->datosper as $i => &$p) {
                if ($tipomoneda == 1) {
                    $p['importe_n'] = $rExportar[$i]['importe_n'];
                    $p['cuenta'] = $rExportar[$i]['cuenta'];
                    $p['cta_mlc'] = '';
                    $p['importe_d'] = '';
                } else {
                    $p['importe_d'] = $rExportar[$i]['importe_d'];
                }

                unset($p['id']);
            }

            $arrPersonasSinCuentaBancaria = array_diff($arrIdsPer, $objExportar->idsper);

            $arrExportarDefinitivo = array();
            foreach ($objExportar->datosper as $i => $datper) {
                $datper['cta_mnac'] = $datper['cuenta'] != null ? $datper['cuenta'] : $datper['cta_mnac'];
                $arrExportarDefinitivo[] = $datper;
            }

            $s['codigo'] = 1;
            $s['datos'] = $arrExportarDefinitivo;
            $s['tirilla'] = $arrTirilla;
            return $s;


        } else {
            $s['codigo'] = 1;
            $s['datos'] = array();
            $s['tirilla'] = array();
            return $s;
        }

    }

    private function buscarDatosCuentabancariaPersona($idpersona){
        
        $sql = "SELECT dcb.numerocuenta
            FROM mod_personaext.dat_cuentabancaria dcb 
            left join mod_datosmaestros.nom_moneda nm ON (nm.idmoneda = dcb.idmoneda)
            where dcb.idpersona = $idpersona and nm.codigoiso = 'CUP';";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchOne($sql);
        return $r;
    }

    private function buscarDatosPersonasCaja($arrIdsPersonas, $tipomoneda, $arridcoplantillanominal, $identidad)
    {
        if (!is_array($arrIdsPersonas) || empty($arrIdsPersonas)) {
            $obj = new stdClass();
            $obj->idsper = array();
            $obj->datosper = array();
            return $obj;
        }
        if ($tipomoneda == 1) {
            $select = "select dp.idpersona, (dco.idpersona ||'-'||dco.idcargosocupados)  as id,
					(CASE 	WHEN dpi.idtipodocidentidad = 1 THEN 'CI'
								WHEN dpi.idtipodocidentidad = 2 THEN	'CM'
						ELSE
						 '-1'
						 END
					) as cod_tipid,
					247 as cod_paexid,
					(CASE WHEN dp.snombre is null or dp.snombre = '' THEN
						dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						ELSE
						dp.nombre||' '||dp.snombre|| ' ' || dp.papel || ' ' || dp.sapel
						END
					) as nombreyapellidos,
					dpcb.numerocuenta as cta_mnac,
					dpi.numero as num_ideper,
					cpn.idplantillanominal,
					cpn.denominacion";
            $sql = "{$select}
					FROM mod_persona.dat_persona dp 
					left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
					left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
					left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = {$identidad})
					left join mod_personaext.dat_cuentabancaria dpcb on (dpcb.idcuentabancaria = dco.idpersonacuentabancariamn)					
					left join mod_persona.dat_docidentidad dpi on (dpi.idpersona = dp.idpersona and dpi.principal = 1)
					where  (dp.idpersona in (" . implode(',', $arrIdsPersonas) . "));";
					// where  (dco.idpersonacuentabancariamn is null) and (dp.idpersona in (" . implode(',', $arrIdsPersonas) . "));";

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            $rr = array();
            $arrIPer = array();
            foreach ($r as $k => $p) {
                //Si es una persona que esta de alta en nomina
                if($p['id']){
                    $rr[$p['id']] = $p;
                    $arrIPer[] = $p['id'];
                //Si es una persona que ya se le dio baja
                }else{
                    $idpersona = $p['idpersona'];
                    $id = $arridcoplantillanominal[$idpersona]['id'];
                    $plantillanominal = $arridcoplantillanominal[$idpersona]['plantillanominal'];
                    $p['id'] = $id;
                    $p['denominacion'] = $plantillanominal;
                    $rr[$id] = $p;
                    $arrIPer[] = $id;
                }
            }
            $obj = new stdClass();
            $obj->idsper = $arrIPer;
            $obj->datosper = $rr;
            return $obj;
        } else {
            $select = "select dp.idpersona, (dco.idpersona ||'-'||dco.idcargosocupados)  as id,
					(CASE 	WHEN dpi.idtipodocidentidad = 1 THEN 'CI'
								WHEN dpi.idtipodocidentidad = 2 THEN	'CM'
						ELSE
						 '-1'
						 END
					) as cod_tipid,
					247 as cod_paexid,
					(CASE WHEN dp.snombre is null or dp.snombre = '' THEN
						dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						ELSE
						dp.nombre||' '||dp.snombre|| ' ' || dp.papel || ' ' || dp.sapel
						END
					) as nombreyapellidos,
					dpcb.numerocuenta as cta_mnac,
					dpi.numero as num_ideper,
					cpn.idplantillanominal,
					cpn.denominacion";
            $sql = "{$select}
					FROM mod_persona.dat_persona dp 
					left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
					left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
					left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = {$identidad})
					left join mod_personaext.dat_cuentabancaria dpcb on (dpcb.idcuentabancaria = dco.idpersonacuentabancariacuc)
					left join mod_persona.dat_docidentidad dpi on (dpi.idpersona = dp.idpersona and dpi.principal = 1)
					where  dco.idpersonacuentabancariacuc is null and dp.idpersona in (" . implode(',', $arrIdsPersonas) . ");";

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            $rr = array();
            $arrIPer = array();
            foreach ($r as $k => $p) {
                //Si es una persona que esta de alta en nomina
                if($p['id']){
                    $rr[$p['id']] = $p;
                    $arrIPer[] = $p['id'];
                    //Si es una persona que ya se le dio baja
                }else{
                    $idpersona = $p['idpersona'];
                    $id = $arridcoplantillanominal[$idpersona]['id'];
                    $plantillanominal = $arridcoplantillanominal[$idpersona]['plantillanominal'];
                    $p['id'] = $id;
                    $p['denominacion'] = $plantillanominal;
                    $rr[$id] = $p;
                    $arrIPer[] = $id;
                }
            }
            $obj = new stdClass();
            $obj->idsper = $arrIPer;
            $obj->datosper = $rr;
            return $obj;
        }
    }

    private function buscarColumnaApagar($objEstructura, $idcrmPagoSalario, $idelaborarpagos)
    {

        $flagconceptopagosalario = 0;
        //Buscando almenos un campo de en los datos serializados de la Estructura de la Nomina conceptopagosalario = 1
        foreach ($objEstructura as $k => $e) {
            if ($e['esconceptopagosalario'] == 1) {
                $flagconceptopagosalario = 1;
                break;
            }
        }
        //Si hay un campo concepto pago salario en los datos serializados de la Estructura de la Nomina se devuelve el idestructurarmodelosnomina
        if ($flagconceptopagosalario == 1) {
            foreach ($objEstructura as $k => $e) {
                if ($e['esconceptopagosalario'] == 1) {
                    return $e['id'];
                }
            }
            //Sino se devuelve el idestructuramodelosnomina de la Configuracion de la Estructura de la Nomina que tenga conceptopagosalario = 1.
        } else {
            //Get $idestructuramodelodomina dado el $idelaborarpagos
            $sql = "select cemn.idestructuramodelodomina
					from mod_nomina.dat_elaborarpagos de
					inner join mod_nomina.conf_modelonomina cmn on (cmn.idtipopago = de.idtipopago)
					inner join mod_nomina.conf_estructuramodelosnomina cemn on (cemn.idtiponomina = cmn.idtiponomina and cemn.esconceptopagosalario = 1)
					inner join mod_nomina.conf_estructuramodelosnominaentidad cemne on (cemne.idestructuramodelodomina = cemn.idestructuramodelodomina and cemne.idestructura =  de.identidad)
					where de.idelaborarpagos = ?; ";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $idestructuramodelodomina = $conn->fetchOne($sql, array($idelaborarpagos));
            return $idestructuramodelodomina;
        }

        return -1;
    }

    private function buscarDatosPersonas($arrIdPersona, $exportar = 2, $tipomoneda, $arridcoplantillanominal, $identidad, $idbanco)
    {
        if ($tipomoneda == 1) {
            if ($exportar == 2) {
                $select = "select dp.idpersona, (dco.idpersona ||'-'||dco.idcargosocupados)  as id,
					(CASE 	WHEN dpi.idtipodocidentidad = 1 THEN 'CI'
								WHEN dpi.idtipodocidentidad = 2 THEN	'CM'
						ELSE
						 '-1'
						 END
					) as cod_tipid,
					247 as cod_paexid,
					(CASE WHEN dp.snombre is null or dp.snombre = '' THEN
						dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						ELSE
						dp.nombre||' '||dp.snombre|| ' ' || dp.papel || ' ' || dp.sapel
						END
					) as nombreyapellidos,
					dpcb.numerocuenta as cta_mnac,
					dpi.numero as num_ideper,
					cpn.idplantillanominal,
					cpn.denominacion, nfe.ordenunico";
            } else {
                $select = "select (dco.idpersona ||'-'||dco.idcargosocupados)  as id,
					(CASE 	WHEN dpi.idtipodocidentidad = 1 THEN 'CI'
								WHEN dpi.idtipodocidentidad = 2 THEN	'CM'
						ELSE
						 '-1'
						 END
					) as cod_tipid,
					247 as cod_paexid,
					dpi.numero as num_ideper,
					dpcb.numerocuenta as cta_mnac, nfe.ordenunico";
            }

            if ($idbanco != null) {
                $sql = "{$select}
					FROM mod_persona.dat_persona dp 
					left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
					left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
					left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = {$identidad})
					left join mod_personaext.dat_cuentabancaria dpcb on (dpcb.idcuentabancaria = dco.idpersonacuentabancariamn)
                    left join mod_datosmaestros.nom_moneda nm ON(nm.idmoneda = dpcb.idmoneda)
					left join mod_persona.dat_docidentidad dpi on (dpi.idpersona = dp.idpersona and dpi.principal = 1)
                    LEFT JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dco.idcargo)
					where  dp.idpersona in (" . implode(',', $arrIdPersona) . ") 
                    and dco.identidad = {$identidad} and nm.codigoiso = 'CUP' ORDER BY nfe.ordenunico;";
            }else {
                $sql = "{$select}
					FROM mod_persona.dat_persona dp 
					left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
					left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
					left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = {$identidad})
					left join mod_personaext.dat_cuentabancaria dpcb on (dpcb.idcuentabancaria = dco.idpersonacuentabancariamn)
                    left join mod_datosmaestros.nom_moneda nm ON(nm.idmoneda = dpcb.idmoneda)
					left join mod_persona.dat_docidentidad dpi on (dpi.idpersona = dp.idpersona and dpi.principal = 1)
                    LEFT JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dco.idcargo)
					where  dp.idpersona in (" . implode(',', $arrIdPersona) . ") and dco.identidad = {$identidad} and nm.codigoiso = 'CUP'  ORDER BY nfe.ordenunico;";
            }

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            $rr = array();
            $arrIPer = array();
            foreach ($r as $k => $p) {
                //Si es una persona que esta de alta en nomina
                if($p['id']){
                    $rr[$p['id']] = $p;
                    $arrIPer[] = $p['id'];
                    //Si es una persona que ya se le dio baja
                }else{
                    $idpersona = $p['idpersona'];
                    $id = $arridcoplantillanominal[$idpersona]['id'];
                    $plantillanominal = $arridcoplantillanominal[$idpersona]['plantillanominal'];
                    $p['id'] = $id;
                    $p['denominacion'] = $plantillanominal;
                    $rr[$id] = $p;
                    $arrIPer[] = $id;
                }
            }
            $obj = new stdClass();
            $obj->idsper = $arrIPer;
            $obj->datosper = $rr;
            return $obj;
        } else {
            if ($exportar == 2) {
                $select = "select dp.idpersona, (dco.idpersona ||'-'||dco.idcargosocupados)  as id,
					(CASE 	WHEN dpi.idtipodocidentidad = 1 THEN 'CI'
								WHEN dpi.idtipodocidentidad = 2 THEN	'CM'
						ELSE
						 '-1'
						 END
					) as cod_tipid,
					247 as cod_paexid,
					(CASE WHEN dp.snombre is null or dp.snombre = '' THEN
						dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						ELSE
						dp.nombre||' '||dp.snombre|| ' ' || dp.papel || ' ' || dp.sapel
						END
					) as nombreyapellidos,
					'' as cta_mnac,
					'' as importe_n,
					dpcb.numerocuenta as cta_mlc,
					dpi.numero as num_ideper,
					cpn.idplantillanominal,
					cpn.denominacion";
            } else {
                $select = "select (dco.idpersona ||'-'||dco.idcargosocupados)  as id,
					(CASE 	WHEN dpi.idtipodocidentidad = 1 THEN 'CI'
								WHEN dpi.idtipodocidentidad = 2 THEN	'CM'
						ELSE
						 '-1'
						 END
					) as cod_tipid,
					247 as cod_paexid,
					dpi.numero as num_ideper,
					'' as cta_mnac,
					'' as importe_n,
					dpcb.numerocuenta as cta_mlc";
            }

            $sql = "{$select}
					FROM mod_persona.dat_persona dp
					left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
					left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
					left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = {$identidad})
					inner join mod_personaext.dat_cuentabancaria dpcb on (dpcb.idcuentabancaria = dco.idpersonacuentabancariacuc)
					left join mod_persona.dat_docidentidad dpi on (dpi.idpersona = dp.idpersona and dpi.principal = 1)
					where  dp.idpersona in (" . implode(',', $arrIdPersona) . ");";

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            $rr = array();
            $arrIPer = array();
            foreach ($r as $k => $p) {
                //Si es una persona que esta de alta en nomina
                if($p['id']){
                    $rr[$p['id']] = $p;
                    $arrIPer[] = $p['id'];
                    //Si es una persona que ya se le dio baja
                }else{
                    $idpersona = $p['idpersona'];
                    $id = $arridcoplantillanominal[$idpersona]['id'];
                    $plantillanominal = $arridcoplantillanominal[$idpersona]['plantillanominal'];
                    $p['id'] = $id;
                    $p['denominacion'] = $plantillanominal;
                    $rr[$id] = $p;
                    $arrIPer[] = $id;
                }
            }
            $obj = new stdClass();
            $obj->idsper = $arrIPer;
            $obj->datosper = $rr;
            return $obj;
        }
    }

    public function obtenerCuentasPorTipoMoneda($identidad, $numcuentamoneda)
    {
        $sqldatoscuenta = "select datcban.*, ntas.abreviatura as acreditacionsalario 
                           from mod_personaext.dat_cuentabancaria datcban
                           left join mod_personaext.nom_tipoacreditacionsalario ntas on(ntas.idtipoacreditacionsalario = datcban.idtipoacreditacionsalario)
                           inner join mod_datosmaestros.nom_moneda mn on(mn.idmoneda = datcban.idmoneda)
			               where datcban.numerocuenta=?;";
        return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqldatoscuenta, array($numcuentamoneda));
    }

    //Funcion para sincronizar automaticamente las cuentas bancarias de las personas que cobraron por nominas de cajero
    public function actualizarCuentasBancariasPersonasAction(){
        $identidad = $this->_request->getPost('identidad');
        $this->idestructura = $identidad;
        $arridelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $arraypersonascajero = $this->devolverPersonasCajeroArrayPeriodos($arridelaborarpagos);
        $arraycargosocupados = DatCargosOcupados::obtenerListadoTodosCargosOcupadosEntidad($identidad);
        foreach ($arraycargosocupados as $ic => $rco) {
            $idpersona = $rco['idpersona'];
            //Si esta persona esta cobrando por nominas de cajero se sincroniza su cuenta bancaria
            if($arraypersonascajero[$idpersona]['idpersona']){
                //Datos del cargo ocupado
                $objDomainCargosOcupados = new DatCargosOcupados();
                $objCargos = $objDomainCargosOcupados->obtenerObj($rco['idcargosocupados']);
                //Cuenta en MN
                $sqldatoscuentamn = "select datcban.idcuentabancaria from mod_personaext.dat_cuentabancaria datcban
                                              inner join mod_datosmaestros.nom_moneda nmon on (nmon.idmoneda = datcban.idmoneda)
                                              inner join mod_persona.dat_persona dp on (dp.idpersona = datcban.idpersona)
                                              where dp.idpersona = ? and nmon.codigo = '01';";
                // 01 es el codigo de mn
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datoscuentamn = $conn->fetchAll($sqldatoscuentamn, array($idpersona));
                $idpersonacuentabancariamn = $datoscuentamn[0]['idcuentabancaria'];
                //Cuenta en CUC
                $sqldatoscuentacuc = "select datcban.idcuentabancaria from mod_personaext.dat_cuentabancaria datcban
                                              inner join mod_datosmaestros.nom_moneda nmon on (nmon.idmoneda = datcban.idmoneda)
                                              inner join mod_persona.dat_persona dp on (dp.idpersona = datcban.idpersona)
                                              where dp.idpersona = ? and nmon.codigo = '02';";
                // 02 es el codigo de cuc
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datoscuentacuc = $conn->fetchAll($sqldatoscuentacuc, array($idpersona));
                $idpersonacuentabancariacuc = $datoscuentacuc[0]['idcuentabancaria'];
                //Salvando las actualizaciones en los numeros de cuenta
                $objCargos->idpersonacuentabancariamn = $idpersonacuentabancariamn;
                $objCargos->idpersonacuentabancariacuc = $idpersonacuentabancariacuc;
                $objCargos->save();
            }
        }
        echo json_encode('ok');
    }

    public function exportarperiododepagoexcelAction (){
        $estado = $this->_getParam('estado');
        $tipexpor = $this->_getParam('tipexpor');
        $identidad = $this->_getParam('identidad');
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        if ($estado != 0) {
            $arrayidfcierre = Zend_Json::decode(stripslashes($this->_getParam('arrayidfcierre')));
        }

        if($estado == 0){
            $datospersonas = array();
                foreach ($idelaborarpagos as $k => $value) {
                    $r = $this->buscarParaExportarBanco($value, 2, 1, $identidad, null);
                    $datospersonas = array_merge($datospersonas, $r['datos']);
                }
                //Creando un arreglo indexado por idpersona
                $arrpersonas = array();
                $objPlantillaNominal = new ConfPlantillaNominal();
                foreach ($datospersonas as $i => $persona) {
                    $orden = $objPlantillaNominal->obtenerOrdenPlantillaXId($persona['idplantillanominal']);
                    $datospersonas[$i]['denominacion'] = $orden . '--' . $persona['denominacion'];
                    $arrpersonas[$persona['idpersona']][] = $datospersonas[$i];
                }
    
                //Creando el arreglo final
                $r = array();
                $cont = 0;
                foreach ($arrpersonas as $i => $persona) {
                    $r[$cont] = $persona[0];
                    $netomn = 0;
                    $netocuc = 0;
                    foreach ($persona as $valpersona) {
                        $netomn += $valpersona['importe_n'];
                        $netocuc += $valpersona['importe_d'];
                    }
                    $sqldatoscuenta = "select *, tc.abreviatura from mod_personaext.dat_cuentabancaria datcban
                                       inner join mod_personaext.nom_tipoacreditacionsalario tc on (tc.idtipoacreditacionsalario = datcban.idtipoacreditacionsalario)
                                       inner join mod_datosmaestros.nom_moneda mn on(mn.idmoneda = datcban.idmoneda)
                                       where datcban.idpersona=?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $datoscuentas = $conn->fetchAll($sqldatoscuenta, array($i));
    
                    foreach ($datoscuentas as $kcuenta => $vcuenta) {
                        //$r[$cont]['cta_mnac'] = $vcuenta['numerocuenta'];
                        $r[$cont]['cod_tipid'] = $vcuenta['abreviatura'];
                    }
                    $r[$cont]['importe_n'] = number_format($netomn, 2, '.', '');
                    $r[$cont]['importe_d'] = number_format($netocuc, 2, '.', '');
    
                    
                    //Codigo contable
                    $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($i, $identidad);
                    $r[$cont]['cdgocontable'] = $cdgocontable[0]['cdgocontable'];
                    
                    //Eliminando las personas
                    if ($netomn == 0 && $netocuc == 0) {
                        unset($r[$cont]);
                    }
                    $cont++;
                }
    
                $r = array_values($r);
                $montocup = 0;
                $montocuc = 0;
                foreach ($r as $p) {
                    $montocup += ($p['importe_n'] > 0) ? $p['importe_n'] : 0;
                    $montocuc += ($p['importe_d'] > 0) ? $p['importe_d'] : 0;
                }
    
                //orden de las personas por plantillas nominales
                foreach ($r as $p => $persona) {
                    $nombreplantilla = (!empty($persona['denominacion'])) ? $persona['denominacion'] : 'Sin plantilla nominal';
                    if ($nombreplantilla != 'Sin plantilla nominal') {
                        list($ordenplantilla,) = explode('--', $persona['denominacion']);
                        $longorden = strlen($ordenplantilla . '');
                        $r[$p]['denominacion'] = chr(96 + $longorden) . $persona['denominacion'];//chr(96) caracter antes de letra "a"
                    } else {
                        $r[$p]['denominacion'] = 'z--' . $nombreplantilla;
                    }
                }
    
                $arraypersona = $r;
        }else{ 
            $arraypersona = array();
            $cont = 0;

            $objPlantillaNominal = new ConfPlantillaNominal();

            foreach ($arrayidfcierre as $i => $rdatos) {
                $r = unserialize(DatFechasCierrePeriodo::obtenerListadoPersonasCajero($rdatos));
                foreach ($r as $key => $value) {
                    $ordenPlantilla = $objPlantillaNominal->obtenerOrdenPlantillaXId($value['idplantillanominal']);

                    $nombreplantilla = (!empty($value['denominacion'])) ? $value['denominacion'] : 'Sin plantilla nominal';
                    if ($nombreplantilla != 'Sin plantilla nominal') {
                        $longorden = strlen($ordenPlantilla . '');
                        $orden = chr(96 + $longorden) . $ordenPlantilla . '--' . $value['denominacion'];//chr(96) caracter antes de letra "a"
                    } else {
                        $orden = 'z--' . $nombreplantilla;
                    }

                    if (!($value['importe_n'] == 0 && $value['importe_d']  == 0)) {
                        $arraypersona[$cont]['idpersona'] = $value['idpersona'];
                        $arraypersona[$cont]['cod_tipid'] = $value['cod_tipid'];
                        $arraypersona[$cont]['cod_paexid'] = $value['cod_paexid'];
                        $arraypersona[$cont]['nombreyapellidos'] = $value['nombreyapellidos'];
                        $arraypersona[$cont]['cta_mnac'] = $value['cta_mnac'];
                        $arraypersona[$cont]['num_ideper'] = $value['num_ideper'];
                        $arraypersona[$cont]['idplantillanominal'] = $value['idplantillanominal'];
                        $arraypersona[$cont]['denominacion'] = $value['denominacion'];
                        $arraypersona[$cont]['importe_n'] = $value['importe_n'];
                        $arraypersona[$cont]['cta_mlc'] = $value['cta_mlc'];
                        $arraypersona[$cont]['importe_d'] = $value['importe_d'];
                        $arraypersona[$cont]['cdgocontable'] = $value['cdgocontable'];
                        $arraypersona[$cont]['ordenunico'] = $value['ordenunico'];
                        $arraypersona[$cont]['orden'] = $orden;
                        $cont++;
                    }

                }
            }

            $arrOrden = array_column($arraypersona, 'orden');
            $arrNombre = array_column($arraypersona, 'nombreyapellidos');

            array_multisort($arrOrden, SORT_ASC, $arrNombre, SORT_ASC, $arraypersona);

        }
            
        //Arreglo para las plantillas nominales 
        $cont =0;         
        $plantillasNAux = array();
        $plantillasN = array();
        foreach($arraypersona as $i=>$ap){
            if((in_array($ap['denominacion'],$plantillasNAux))==false){ 
            $plantillasNAux[] =$ap['denominacion'];
            }
        }

        // Exportar pdf
        if($tipexpor == 0){
            $objPDF = new ReporteExportarbancopdfModel();
            $objPDF->construirReportePeriododePago($identidad, $plantillasNAux, $arraypersona);
        }
    }

    public  function devolverPersonasCajeroArrayPeriodos($arridelaborarpagos){
        $arraypersonascajero = array();
        $objDatNominaDatos = new DatNominaDatos();
        $datosnomina = $objDatNominaDatos->obtenerDatosNominaCajeroPorArrayElaborarPago($arridelaborarpagos);
        foreach ($datosnomina as $dn){
            $valores = unserialize($dn['valores']);
            foreach ($valores as $rv){
                $idpersona = $rv['idpersona'];
                $arraypersonascajero[$idpersona]['idpersona'] = $idpersona;
            }
        }
        return $arraypersonascajero;
    }

    public function validarEstadoElaborarPagoAction(){
        $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arrayidelaborarpagos')));
        $identidad = $this->_getParam('identidad');

        $sql = "SELECT estado FROM mod_nomina.dat_elaborarpagos where idelaborarpagos IN (" . implode(',', $arrayidelaborarpagos) . ") 
            AND identidad = $identidad;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        $cont = 0;
        foreach ($r as $value) {
            if ($value['estado'] > 1) {
                $cont ++;
            }
        }

        echo json_encode($cont);
    }

    public function actualizarListadoDatosNominaAction()
    {
        $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arrayidelaborarpagos')));
        $this->idestructura = $identidad;
        
        // Datos de las nominas
        $sql = "SELECT idnomina FROM mod_nomina.dat_nomina where idelaborarpago in (" . implode(',', $arrayidelaborarpagos) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $ids_nomina = $conn->fetchAll($sql);

        foreach ($ids_nomina as $item) {
            $arrayidnomina[] = $item['idnomina'];
        }
        
        $rDatosNominas = DatNominaDatos::obtenerDatosNominaArray($arrayidnomina);        
        // Arreglo para almacenar los CIs de personas con $nuevaCuenta
        $cisConNuevaCuenta = array();

        foreach ($rDatosNominas as $nomina) {
            $valores = unserialize($nomina['valores']);
            $idnominadatos = $nomina['idnominadatos'];
            $idnomina = $nomina['idnomina'];
            $idplantillanominal = $nomina['idplantillanominal'];            
            // Buscar el idnomina que tenga el mismo idplantillanominal que el idnomina actual
            $idNominaDestino = $this->obtenerIdNominaPorIdPlantillaNominal($idnomina, $rDatosNominas);

            $arraydatos = array();

            foreach ($valores as $datos){
                
                $idpersona = $datos['idpersona']; 
                $cuentaActual = isset($datos['numerocuenta']) ? $datos['numerocuenta'] : null;
                $nuevaCuenta = $this->buscarDatosCuentabancariaPersona($idpersona);
                
                // Verificar si la cuenta cambió o no existía
                if ($cuentaActual !== $nuevaCuenta && $nuevaCuenta != null) {
                    $datos['numerocuenta'] = $nuevaCuenta;
                    // Capturar el CI de la persona que tiene $nuevaCuenta
                    $sqlCI = "SELECT numero FROM mod_persona.dat_docidentidad WHERE idpersona = ? LIMIT 1;";
                    $resultCI = $conn->fetchOne($sqlCI, array($idpersona));
                    if ($resultCI && !in_array($resultCI, $cisConNuevaCuenta)) {
                        $cisConNuevaCuenta[] = $resultCI;
                    }
                }
                
                $arraydatos[] = $datos;
            }
            // Solo actualizar si hubo cambios en las cuentas bancarias
            $valoresser = serialize($arraydatos);

            $sqlupdate = "UPDATE mod_nomina.dat_nominadatos 
                    SET valores = ?
                    WHERE idnominadatos = ?;";
            $conn->execute($sqlupdate, array($valoresser, $idnominadatos));

        }
        $response = array();
        if ($cisConNuevaCuenta !== null && count($cisConNuevaCuenta) > 0) {
            $response['result'] = 1;
            $response['idnomina'] = isset($idnomina) ? $idnomina : null;
            $response['idNominaDestino'] = isset($idNominaDestino) ? $idNominaDestino : null;
            $response['cisConNuevaCuenta'] = $cisConNuevaCuenta;
        } else {
            $response['result'] = 2;
        }
        echo json_encode($response);
    }

    public function obtenerIdNominaPorIdPlantillaNominal($idnomina, $rDatosNominas) 
    {
        // 1. Buscar el elemento con el idnomina proporcionado para obtener su idplantillanominal
        $plantillaBuscada = null;
        
        foreach ($rDatosNominas as $item) {
            if ($item['idnomina'] == $idnomina) {
                $plantillaBuscada = $item['idplantillanominal'];
                break;
            }
        }
        
        // Si no se encontró el elemento, retornar null
        if ($plantillaBuscada === null) {
            return null;
        }
        
        // 2. Buscar otro elemento con la misma idplantillanominal pero diferente idnomina
        foreach ($rDatosNominas as $item) {
            if ($item['idplantillanominal'] == $plantillaBuscada && $item['idnomina'] != $idnomina) {
                return $item['idnomina'];
            }
        }
        
        return null;
    }

    public function actualizarlistadonominaAction($idNominaOrigen, $idNominaDestino, $cis)
    {
        //nota: se intercamvia las nominas xq la esta reciviendo mal el idnomina origen con el idnomina destino y viceversa, por eso se hace este intercambio para que funcione correctamente, revisar esto despues
        $idNominaOrigen = $this->_getParam('idNominaDestino');
        $idNominaDestino = $this->_getParam('idNominaOrigen');
        $cis = Zend_Json::decode($this->_getParam('cis'));

        if (empty($idNominaOrigen) || empty($idNominaDestino)) {
            echo json_encode(false);
        }

        if (!is_array($cis) || empty($cis)) {
            echo json_encode(false);
        }

        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
        } catch (Exception $e) {
            echo json_encode(false);
        }

        try {
            $sql = "SELECT idnominadatos, idnomina, valores
                    FROM mod_nomina.dat_nominadatos
                    WHERE idnomina::text IN (?, ?);";
            $rows = $conn->fetchAll($sql, array($idNominaOrigen, $idNominaDestino));

            if (count($rows) !== 2) {
                echo json_encode(false);
            }

            $map = array();
            foreach ($rows as $row) {
                $map[$row['idnomina']] = $row;
            }

            $origen = isset($map[$idNominaOrigen]) ? $map[$idNominaOrigen] : null;
            $destino = isset($map[$idNominaDestino]) ? $map[$idNominaDestino] : null;

            if (!$origen || !$destino) {
                echo json_encode(false);
            }

            $valoresOrigen = @unserialize($origen['valores']);
            $valoresDestino = @unserialize($destino['valores']);

            if (!is_array($valoresOrigen)) $valoresOrigen = array();
            if (!is_array($valoresDestino)) $valoresDestino = array();

            $claveCIO = null;
            foreach ($valoresOrigen as $fila) {
                if (!is_array($fila)) continue;
                foreach ($fila as $k => $v) {
                    if (in_array((string)$v, $cis, true)) {
                        $claveCIO = $k;
                        break 2;
                    }
                }
            }

            if ($claveCIO === null) {
                echo json_encode(false);
            }

            $claveCID = null;
            foreach ($valoresDestino as $fila) {
                if (!is_array($fila)) continue;
                foreach ($fila as $k => $v) {
                    if (in_array((string)$v, $cis, true)) {
                        $claveCID = $k;
                        break 2;
                    }
                }
            }

            if ($claveCID === null && !empty($valoresDestino)) {
                foreach (array_keys($valoresDestino[0]) as $k) {
                    if ($k !== '' && $k[0] === 'c' && is_numeric(substr($k, 1))) {
                        $claveCID = $k;
                        break;
                    }
                }
            }

            if ($claveCID === null) $claveCID = $claveCIO;

            $personasMover = array();
            $nuevoOrigen = array();

            foreach ($valoresOrigen as $fila) {
                $ci = isset($fila[$claveCIO]) ? $fila[$claveCIO] : null;
                if ($ci && in_array((string)$ci, $cis, true)) {
                    $personasMover[] = $fila;
                } else {
                    $nuevoOrigen[] = $fila;
                }
            }

            if (empty($personasMover)) {
                echo json_encode(false);
            }

            $nuevoDestino = array();
            $cisEnDestino = array();

            foreach ($valoresDestino as $fila) {
                $ci = isset($fila[$claveCID]) ? $fila[$claveCID] : null;
                if ($ci) $cisEnDestino[(string)$ci] = true;
            }

            foreach ($valoresDestino as $fila) {
                $ci = isset($fila[$claveCID]) ? $fila[$claveCID] : null;
                if (!$ci || !in_array((string)$ci, $cis, true)) {
                    $nuevoDestino[] = $fila;
                }
            }

            foreach ($personasMover as $fila) {
                $ci = (string)$fila[$claveCIO];
                if (!isset($cisEnDestino[$ci])) {
                    if ($claveCIO !== $claveCID) {
                        $fila[$claveCID] = $ci;
                        unset($fila[$claveCIO]);
                    }
                    $nuevoDestino[] = $fila;
                }
            }

                $nuevoOrigen = array_values($nuevoOrigen);
                $nuevoDestino = array_values($nuevoDestino);
                $idnominadatosOrigen = $origen['idnominadatos'];
                $idnominadatosDestino = $destino['idnominadatos'];
                $valornominaOrigen = serialize($nuevoOrigen);
                $valornominaDestino = serialize($nuevoDestino);

                $sqlupdate = "UPDATE mod_nomina.dat_nominadatos
                    SET valores = ?
                    WHERE idnominadatos = ?;";
                $conn->execute($sqlupdate, array($valornominaOrigen, $idnominadatosOrigen));
                $conn->execute($sqlupdate, array($valornominaDestino, $idnominadatosDestino));

            echo json_encode(true);
    
        } catch (Exception $e) {
            echo json_encode(false);
        }
    }

    public function validarEstadoNominasAction(){
        $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('arrayidelaborarpagos')));
        $objDatNomina = new DatNomina();
        $objConfigModeloNomina = new ConfigModeloNomina();
        $flag = 0;
        $denomnomina = '';
        //Datos de si el modulo de nominas postea comprobantes
        $sqlapertura = "select apertura from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $apertura = $conn->fetchOne($sqlapertura);
		//Datos de si el modulo de nominas fija obligaciones en cobros y pagos
        $sql = "select cobroypago from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $cobroypago = $conn->fetchOne($sql);
        //Si el modulo de nominas postea comprobantes o fija obligaciones en cobros y pagos hay que validar que las nominas esten aprobadas para que las nominas 
		//no se paguen sin haberse fijado las obligaciones o haberse posteado los comprobantes y esten aprobadas
        if($apertura == 1 || $cobroypago == 1){
            //Recorriendo los periodos de pago para ver si alguno tiene nominas desaprobadas
            foreach ($arrayidelaborarpagos as $idelbpago){
                $estadonominas = $objDatNomina->obteneEstadoNominas ($idelbpago);
                if($estadonominas != 1){
                    $datosnomina = $objConfigModeloNomina->obtenerIdTiposNominaporTipoPago($idelbpago);
                    if($denomnomina == ''){
                        $denomnomina = $datosnomina[0]['denominacion'];
                    }else{
                        $denomnomina = $denomnomina .', '. $datosnomina[0]['denominacion'];
                    }
                    $flag = 1;
                }
            }
        }
        if($flag == 0){
            echo json_encode('ok');
        }else{
            echo json_encode($denomnomina);
        }

    }

    public function exportarperiododepagoalbancoTxtAction(){

        $identidad = $this->_getParam('identidad');
        $moneda = $this->_getParam('moneda');
        $estado = $this->_getParam('estado');
        $idbanco = $this->_getParam('idbanco');
        $tipodecuenta = $this->_getParam('tipodecuenta');
        $arrayidelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $idfechascierre = Zend_Json::decode(stripslashes($this->_getParam('idfechascierre')));
        $s = new stdClass();
        //Actual
        $arrayDatos = array();

        if ($estado == 0) {
            foreach ($arrayidelaborarpagos as $i => $value) {
                $r = $this->buscarParaExportarBanco($value, 1, 1, $identidad, $idbanco);
                $arrayDatos = array_merge($arrayDatos, $r['datos']);
            }
        } else {
            $arrpersonas = array();
            foreach ($idfechascierre as $idfcierre) {
                $rperscaja = DatFechasCierrePeriodo::obtenerListadoPersonasCajero($idfcierre);
                if ($rperscaja) {
                    $rpersonscaja = unserialize($rperscaja);
                    if (count($rperscaja) > 0) {
                        $arrpersonas = array_merge($arrpersonas, $rpersonscaja);
                    }
                }
            }
            $objPlantillaNominal = new ConfPlantillaNominal();
            foreach ($arrpersonas as $pc => $arrpc) {
                $importe_n = intval($arrpc['importe_n']);
                $importe_d = intval($arrpc['importe_d']);
                $identidad = $objPlantillaNominal->obtenerIdentidadxPlantilla($arrpc['idplantillanominal']);
                $denomentidad = $this->integrator->metadatos->DameEstructura($identidad)[0]->denominacion;
                $arrpersonas[$pc]['denominacion'] = $arrpersonas[$pc]['denominacion'] . ' - ' . $denomentidad;
                //Eliminando las personas
                if ((empty($importe_n)  && !empty($arrpc['cta_mnac'])) && (empty($importe_d) && !empty($arrpc['cta_mlc'])))
                    unset($arrpersonas[$pc]);
            }

            if ($estado == 0) {            
                $arrayDatosPersona = array_values($arrpersonas);

                $arrIdPersona = array();
                $arridcoplantillanominal = array();
                foreach ($arrayDatosPersona as $i => $idpersona) {
                    $arrIdPersona[] = $arrayDatosPersona[$i]['idpersona'];
                    $arridcoplantillanominal[] = $arrayDatosPersona[$i]['idplantillanominal'];
                }

                $r = $this->buscarDatosPersonas($arrIdPersona, $exportar = 2, $tipomoneda = 1, $arridcoplantillanominal, $identidad, $idbanco);
                
                foreach ($r->datosper as $i => $datper) {
                    $arrayDatos[] = $datper;
                }
            } elseif ($estado == 1) {
                $arrayDatos = array_values($arrpersonas);
                $arrIdPersona = array();
                $arridcoplantillanominal = array();
                foreach ($arrayDatosPersona as $i => $idpersona) {
                    $arrIdPersona[] = $arrayDatosPersona[$i]['idpersona'];
                    $arridcoplantillanominal[] = $arrayDatosPersona[$i]['idplantillanominal'];
                }

            }
            
        }

        $arrayidpersonas = array();
        foreach ($arrayDatos as $i => $persona) {
            $arrayidpersonas[] = $arrayDatos[$i]['num_ideper'];
        }
        $arrayidpersonas = array_values(array_unique($arrayidpersonas));


        $arrayfinalDatos = array();
        $contarrayfinalDatos = 0;

        $arrayfinal = array();
        foreach ($arrayidpersonas as $k=>$idpersona){
            $netomn = 0;
            $netocuc = 0;
            foreach ($arrayDatos as $rpers){
                if($rpers['num_ideper'] == $idpersona){
                    $arrayfinal[$k]['cod_tipid'] = $rpers['cod_tipid'];
                    $arrayfinal[$k]['cod_paexid'] = $rpers['cod_paexid'];
                    $arrayfinal[$k]['nombreyapellidos'] = $rpers['nombreyapellidos'];
                    $arrayfinal[$k]['cta_mnac'] = $rpers['cta_mnac'];
                    $arrayfinal[$k]['num_ideper'] = $rpers['num_ideper'];
                    $arrayfinal[$k]['idplantillanominal'] = $rpers['idplantillanominal'];
                    $arrayfinal[$k]['denominacion'] = $rpers['denominacion'];
                    $arrayfinal[$k]['cta_mlc'] = $rpers['cta_mlc'];
                    $arrayfinal[$k]['importe_d'] = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                    $arrayfinal[$k]['importe_n'] = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                    
                    $netomn = number_format($arrayfinal[$k]['importe_n'] + $rpers['importe_n'], 2, '.', '');
                    $netocuc = number_format($arrayfinal[$k]['importe_d'] + $rpers['importe_d'], 2, '.', '');
                }
            }

            $numcuentamoneda = ($moneda == 1) ? $arrayfinal[$k]['cta_mnac'] : $arrayfinal[$k]['cta_mlc'];
            $datoscuenta = array();
            if ($numcuentamoneda) {
                $datoscuenta = $this->obtenerCuentasPorTipoMoneda($identidad, $numcuentamoneda);
            }

            if (($netomn > 0 && $moneda == 1) || ($netocuc > 0 && $moneda == 2)) {
                $arrayfinalDatos[$contarrayfinalDatos] = $arrayfinal[$k];
                $contarrayfinalDatos++;
            }
        }
        //Neto total
        $netototal = 0;

        //Indexando
        $aux = array();
        foreach ($arrcamposexpbanco as $campo) {
            $aux[$campo['tipocampo']] = $campo;
        }
        //TXT BPA
        //Cambiando la zona horaria
        date_default_timezone_set('America/Havana');
        //Capturando la fecha y hora
        $fecha = date('dmY');
        $cantidadtrabajadores = count($arrayfinalDatos);
        $objConfExportacionBanco = new ConfExportacionBanco();
        $centropago = $objConfExportacionBanco->obtenerCentroPagoBPA($identidad);
        $sucursal = $objConfExportacionBanco->obtenerCodSucursalBPA($identidad);
        $banco = $objConfExportacionBanco->obtenerCodBancoBPA($identidad);
        
        $filaspersonas = "";
        foreach($arrayfinalDatos as $datosf){
            $netototal += number_format($datosf['importe_n'], 2, '.', '');
            $ci = $datosf['num_ideper'];
            $cuenta = $datosf['cta_mnac'];
            $importe = $datosf['importe_n'];
            $tipoci = $datosf['cod_tipid'];
            $filaspersonas = $filaspersonas . '"' . "$ci" . '"' . "," . '"' . "$cuenta" . '"' . "," . "$importe" . "," . '"' . "$sucursal" . '"' . "," . '"' . "$banco" . '"' . "," . '"' . "$tipoci" . '"' .  "\r\n";
        }
        $primerafila = '"' . "$fecha" .'"' . "," . '"' . "$centropago" . '"' . "," . "$netototal" . "," . /*'"' .*/ "$cantidadtrabajadores" . '"' .  "\r\n";
        $filecontent = $primerafila. $filaspersonas;
        $downloadfile="ficherobanco.txt";
        header("Content-disposition: attachment; filename=$downloadfile");
        header("Content-Type: application/force-download");
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: ".strlen($filecontent));
        header("Pragma: no-cache");
        header("Expires: 0");
        echo $filecontent;
    }

    public function buscarFormatoExportacionBancoAction(){
        $identidad = $this->_request->getPost('identidad');
        $idbanco = $this->_request->getPost('idbanco');
        //Tipo de formato
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT ceb.tipoformato FROM mod_nomina.conf_exportacionbanco ceb 
            WHERE ceb.identidad = $identidad AND ceb.idbanco = $idbanco limit 1";
        $tipoformato = $conn->fetchOne($sql);
        $respuesta = new stdClass();
        if($tipoformato){
            $respuesta->codigo = 'OK';
            $respuesta->tipoformato = $tipoformato;
        }else{
            $respuesta->codigo = 'NOCONFIG';
        }
        echo json_encode($respuesta);
    }

}
