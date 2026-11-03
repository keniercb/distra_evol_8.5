<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class VisualizarnominadominioController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    public function visualizarnominadominioAction()
    {
        $this->render();
    }

    public function sincronizarmodelosplantillasnominaAction()
    {
        $m = new stdClass();
        $identidad = $this->_getParam('identidad');
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $idtipopago = $this->_getParam('idtipopago');
        $fechapago = $this->_getParam('fechapago');
        $actualizar = $this->_getParam('actualizar');

        $cantPersonasPeriodoPago = DatPersonaElaborarPagos::obtenerCantidadPersonaElaborarPagos($idelaborarpago, '');
        if ($cantPersonasPeriodoPago > 0) {//Si hay personas en el periodo de pago seleccionado
            $arridtiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpago);
            $cantcamposnominas = ConfigEstructurarModelosNomina::obtenerCantidadTotalModelosNomina($arridtiponomina[0]['idtiponomina'], $identidad);
            if ($cantcamposnominas > 0) {
                $objNomina = new DatNomina();
                $arrN = $objNomina->obtenerNominasporPeriodoPago($idelaborarpago);
                if (count($arrN) == 0) {
                    /*Si las nominas estan certificadas o aprobadas entonces no sincronizo*/
                    $objPlantillas = new ConfPlantillaNominal();
                    $arrPN = $objPlantillas->obtenerListadoPlantillasNominalesfechanull($identidad);
                    if (count($arrPN) > 0) {
                        $objConfModelos = new ConfigModeloNomina();
                        $arrConfMN = $objConfModelos->obtenerConfigModelosNominaporTipoPago($idtipopago);
                        if (count($arrConfMN) > 0) {
                            $arr = array();
                            foreach ($arrPN as $i => $pn) {
                                foreach ($arrConfMN as $j => $mn) {
                                    $a = array();
                                    $a['idelaborarpago'] = $idelaborarpago;
                                    $a['idplantillanominal'] = $pn['idplantillanominal'];
                                    $a['plantillanominal'] = $pn['denominacion'];
                                    $a['idconfmodelonomina'] = $mn['idconfmodelonomina'];
                                    $a['tiponomina'] = $mn['tiponomina'];
                                    $a['cajacajero'] = 1;
                                    $a['numeronomina'] = 0;
                                    $a['aprobada'] = 0;

                                    $arr[] = $a;

                                    $a = array();
                                    $a['idelaborarpago'] = $idelaborarpago;
                                    $a['idplantillanominal'] = $pn['idplantillanominal'];
                                    $a['idconfmodelonomina'] = $mn['idconfmodelonomina'];
                                    $a['plantillanominal'] = $pn['denominacion'];
                                    $a['tiponomina'] = $mn['tiponomina'];
                                    $a['cajacajero'] = 2;
                                    $a['numeronomina'] = 0;
                                    $a['aprobada'] = 0;

                                    $arr[] = $a;
                                }
                            }
                            $objModel = new DatNominaModel();
                            $objModel->adicionarNominas($arr);
                            $m->codigo = 'OK';

                        } else {
                            $m->codigo = 'NOCONFMODELOS';
                        }
                    } else {
                        $m->codigo = 'NOPLANTILLAS';
                    }
                } else {
                    $m->codigo = 'OK';
                }
                if ($arrN[0]['aprobada'] == 1) {
                    $m->codigo = 'OK';
                    $m->direccion = "";
                } else if ($arrN[0]['aprobada'] == -1 && $actualizar == 0) {
                    $m->codigo = 'OK';
                    $m->direccion = "";
                } else {
                    $objDatosNomina = new DatosNominaModel();
                    $nombrearchivo = $objDatosNomina->cargarDatosNomina($idelaborarpago, $identidad);
                    $m->direccion = $nombrearchivo;
                }
            } else {//Si la nómina no tiene campos configurados
                $m->codigo = 'NO-CAMPOS';
            }
        } else {//Si no hay personas en las nóminas
            $m->codigo = 'NO-PERSONAS';
        }
        $elaborarpagos = new DatElaborarPagos();
        $descripcion = $elaborarpagos->obtenerPeriodosPagoEntidad($idelaborarpago)[0]['descripcion'];
        $m->descripcion = $descripcion;
        echo json_encode($m);
    }

    public function generarnominaAction()
    {
        $identidad = $this->_getParam('identidad');
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $modovisualizar = $this->_getParam('modovisualizar');
        $idnomina = Zend_Json::decode(stripslashes($this->_getParam('idnomina')));
        $idplantillanominal = Zend_Json::decode(stripslashes($this->_getParam('idplantillanominal')));
        $direccion = $this->_getParam('direccion');
        $referencia = $this->_getParam('referencia');
        $accion = $this->_getParam('accion');
        $estado = $this->_getParam('estado');

        $obj = new DatElaborarPagosModel();
        $obj->actualizarDescripcionPeriodoPago($idelaborarpago, $referencia);

        $objGestNomina = new DatGestionarNominasModel();

        $objDatos = $objGestNomina->generarNomina($idelaborarpago, $direccion, $idnomina, $idplantillanominal, $accion, $modovisualizar, $estado, $identidad);
        echo json_encode($objDatos);
        return;
    }

    public function obtenermodelosplantillasnominaAction()
    {
        $pos = 0;
        $inc = 0;
        $cont = 0;
        $identidad = $this->_getParam('identidad');
        $arrcargos = $this->integrator->metadatos->obtenerCargosEstructura($identidad, $this->global->Perfil->iddominio);
        $arrcargosdominio = array();
        foreach ($arrcargos as $cargo) {
            $arrcargosdominio[] = $cargo['idcargo'];
        }

        $modovisualizar = $this->_getParam('modovisualizar');
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $idtipopago = $this->_getParam('idtipopago');
        $arrFinal = array();
        $arrFinalAux = array();
        $arrIdNomina = array();
        $arrAuxIdNomina = array();
        $objNomina = new DatNomina();
        $datnominadatos = new DatNominaDatos();
        $datgestionarnominas = new DatGestionarNominasModel();
        $arrN = $objNomina->obtenerNominasporPeriodoPagoVisualizar($idelaborarpago, 1, $arrcargosdominio);

        /*AQUI paso el array de plantillas de ese dominio para visualizar nominas*/
        $arrDefinitivo = array();
        foreach ($arrN as $i => $v) {
            $idnomina = $v['idnomina'];
            $idplantillanominal = $v['idplantillanominal'];
            $idconfmodelonomina = $v['idconfmodelonomina'];
            $cajacajero = $v['cajacajero'];
            if ($v['aprobada'] == 1 || $v['aprobada'] == -1) {
                $tienedatos = $datnominadatos->obtenerDatosNominaIdNomina($v['idnomina']);
                if ($tienedatos > 0) {
                    $arrAuxIdNomina[$cont] = $v['idnomina'];
                    $cont++;
                }

            } else {
                $arrIdNomina = $objNomina->verificarPersonasNomina($identidad, $idelaborarpago, $idtipopago, $idnomina, $idplantillanominal, $idconfmodelonomina, $cajacajero);
                if (count($arrIdNomina) > 0) {
                    $arrAuxIdNomina[$cont] = $arrIdNomina[0];
                    $cont++;
                }
            }

        }

        foreach ($arrN as $n => $s) {
            $flag = 0;
            foreach ($arrAuxIdNomina as $k => $h) {
                $flag = 0;
                if ($s['idnomina'] == $h) {
                    $flag = 1;
                    break;
                }
            }
            if ($flag == 1) {
                $arrFinalAux[$pos] = $s;
                $pos++;
            }
        }

        foreach ($arrFinalAux as $caux => $valor) {
            $existe = $datnominadatos->existePorIdNomina($valor['idnomina']);
            if (($valor['aprobada'] == 1 || $valor['aprobada'] == -1) && $existe == 'Existe') {
                $arrFinal[$inc] = $valor;
                $inc++;
            } else if ($valor['aprobada'] == 0) {
                $arrFinal[$inc] = $valor;
                $inc++;
            }
        }

        //MUESTRA UNA SOLA PLANTILLA NOMINAL
        if ($modovisualizar == 2) {
            //print_r($arrFinal[0]['idnomina']);die;
            $arrDefinitivo[0]['idnomina'] = $arrFinal[0]['idnomina'];
            $arrDefinitivo[0]['idelaborarpago'] = $arrFinal[0]['idelaborarpago'];
            $arrDefinitivo[0]['idplantillanominal'] = $arrFinal[0]['idplantillanominal'];
            $arrDefinitivo[0]['idconfmodelonomina'] = $arrFinal[0]['idconfmodelonomina'];
            $arrDefinitivo[0]['cajacajero'] = $arrFinal[0]['cajacajero'];
            $arrDefinitivo[0]['numeronomina'] = $arrFinal[0]['numeronomina'];
            $arrDefinitivo[0]['aprobada'] = $arrFinal[0]['aprobada'];
            $arrDefinitivo[0]['acumulada'] = $arrFinal[0]['acumulada'];
            $arrDefinitivo[0]['acumuladasnc'] = $arrFinal[0]['acumuladasnc'];
            $datoselaborarpago = DatElaborarPagos::obtenerPeriodosPagoEntidad($arrFinal[0]['idelaborarpago']);
            $arrDefinitivo[0]['plantillanominal'] = NomTipoPago::obtenerDenominacion($datoselaborarpago[0]['idtipopago']);
            $arrDefinitivo[0]['codigo'] = $arrFinal[0]['codigo'];
            $arrDefinitivo[0]['idtiponomina'] = $arrFinal[0]['idtiponomina'];
            $arrDefinitivo[0]['tiponomina'] = $arrFinal[0]['tiponomina'];
            $arrDefinitivo[0]['denomcajacajero'] = "Caja y Cajero";
            //MUESTRA UNA LAS PLANTILLAS NOMINALES QUE TIENEN PERSONAS
        } else {
            foreach ($arrFinal as $f => $w) {
                if ($w['cajacajero'] == 1) {
                    $arrDefinitivo[$f]['idnomina'] = $w['idnomina'];
                    $arrDefinitivo[$f]['idelaborarpago'] = $w['idelaborarpago'];
                    $arrDefinitivo[$f]['idplantillanominal'] = $w['idplantillanominal'];
                    $arrDefinitivo[$f]['idconfmodelonomina'] = $w['idconfmodelonomina'];
                    $arrDefinitivo[$f]['cajacajero'] = $w['cajacajero'];
                    $arrDefinitivo[$f]['numeronomina'] = $w['numeronomina'];
                    $arrDefinitivo[$f]['aprobada'] = $w['aprobada'];
                    $arrDefinitivo[$f]['acumulada'] = $w['acumulada'];
                    $arrDefinitivo[$f]['acumuladasnc'] = $w['acumuladasnc'];

                    $divisor = 1;
                    $codigoorden = $datgestionarnominas->fnOrganizarPlantillas($w['orden'], $divisor);
                    $arrDefinitivo[$f]['plantillanominal'] = $codigoorden . "-" . $w['plantillanominal'];

                    $arrDefinitivo[$f]['codigo'] = $w['codigo'];
                    $arrDefinitivo[$f]['idtiponomina'] = $w['idtiponomina'];
                    $arrDefinitivo[$f]['tiponomina'] = $w['tiponomina'];
                    $arrDefinitivo[$f]['denomcajacajero'] = "Caja";
                } else {
                    $arrDefinitivo[$f]['idnomina'] = $w['idnomina'];
                    $arrDefinitivo[$f]['idelaborarpago'] = $w['idelaborarpago'];
                    $arrDefinitivo[$f]['idplantillanominal'] = $w['idplantillanominal'];
                    $arrDefinitivo[$f]['idconfmodelonomina'] = $w['idconfmodelonomina'];
                    $arrDefinitivo[$f]['cajacajero'] = $w['cajacajero'];
                    $arrDefinitivo[$f]['numeronomina'] = $w['numeronomina'];
                    $arrDefinitivo[$f]['aprobada'] = $w['aprobada'];
                    $arrDefinitivo[$f]['acumulada'] = $w['acumulada'];
                    $arrDefinitivo[$f]['acumuladasnc'] = $w['acumuladasnc'];

                    $divisor = 1;
                    $codigoorden = $datgestionarnominas->fnOrganizarPlantillas($w['orden'], $divisor);
                    $arrDefinitivo[$f]['plantillanominal'] = $codigoorden . "-" . $w['plantillanominal'];

                    $arrDefinitivo[$f]['codigo'] = $w['codigo'];
                    $arrDefinitivo[$f]['idtiponomina'] = $w['idtiponomina'];
                    $arrDefinitivo[$f]['tiponomina'] = $w['tiponomina'];
                    $arrDefinitivo[$f]['denomcajacajero'] = "Cajero";
                }
            }
        }
        echo json_encode(array('datos' => $arrDefinitivo, 'cantidad' => count($arrDefinitivo)));

    }

    public function buscardatosNominasAction()
    {
        $idelaborarpago = $this->_getParam('idelaborarpago');
        #salario y cantpersonas
        $salariototal = 0.00;
        $cantpersonascc = 0;
        $cantpersonas = 0;
        $arrayconceptoscontables = array();
        $arraydatosccont = array();
        $arraydatosccont[0]['denominacion'] = "Por favor apruebe las nominas";
        $arraydatosccont[0]['idestructuramodelodomina'] = 0;
        $arraydatosccont[0]['importeconceptocontable'] = 0.00;
        //Dame los datos de las nominas aprobadas y las certificadas
        $objNomina = new DatNomina();
        $objNominaDatos = new DatNominaDatos();
        $objConfigConceptosContables = new ConfigConceptosContables();
        $objCargosOcupados = new DatCargosOcupados();
        $arrayDatNomina = $objNomina->getNominasAprobadasCertificadas($idelaborarpago);

        if (count($arrayDatNomina) > 0) {
            //BUSCANDO EL CAMPO QUE SUMA EL TOTAL
            $sqlEstructurar = "select distinct estr.idestructuramodelodomina, estr.idtiponomina from mod_nomina.conf_estructuramodelosnomina estr
		                            inner join mod_nomina.nom_tiponomina nomtn on (nomtn.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									where elp.idelaborarpagos = ? and estr.estotal = 1;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrEstructuraNomina = $conn->fetchAll($sqlEstructurar, array($idelaborarpago));
            $camposumar = $arrEstructuraNomina[0]['idestructuramodelodomina'];

            //BUSCANDO LOS CAMPOS DE LA NOMINA
            $sqlEstructurarCamposNomina = "select distinct estr.idestructuramodelodomina, estr.idtiponomina from mod_nomina.conf_estructuramodelosnomina estr
		                            inner join mod_nomina.nom_tiponomina nomtn on (nomtn.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									where elp.idelaborarpagos = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrEstructuraTotalNomina = $conn->fetchAll($sqlEstructurarCamposNomina, array($idelaborarpago));

            //ARRAY DE CONCEPTOS CONTABLES
            $arrayconceptoscontables = $objConfigConceptosContables->obtenerListadoTodosConfigConceptosContables($arrEstructuraTotalNomina[0]['idtiponomina']);
            $contccont = 0;

            if (count($arrayconceptoscontables) > 0) {
                foreach ($arrayconceptoscontables as $iccont => $rccont) {
                    $arraydatosccont[$contccont]['denominacion'] = $rccont['denominacion'];
                    $arraydatosccont[$contccont]['idconceptoscontables'] = $rccont['idconceptoscontables'];
                    $arraydatosccont[$contccont]['idestructuramodelodomina'] = $rccont['idestructuramodelodomina'];
                    $arraydatosccont[$contccont]['importeconceptocontable'] = number_format(0, 2, '.', '');
                    $contccont++;
                }

                foreach ($arrayDatNomina as $i => $v) {

                    $datosnomina = $objNominaDatos->obtenerDatosNomina($v['idnomina']);
                    //RECORRIENDO LOS DATOS DE LAS NOMINAS
                    foreach ($datosnomina as $cd => $rdat) {
                        $valores = unserialize($rdat['valores']);
                        //RECORRIENDO LAS PERSONAS
                        foreach ($valores as $ip => $rp) {
                            $ids = $rp['id'];
                            $idscargoper = explode('-', $ids);
                            $idcargoocupado = $idscargoper[1];
                            //OBTENIENDO EL CENTRO DE COSTO DE LA PERSONA
                            $centrocosto = $objCargosOcupados->obtenerCentroCostoxCargoOcupado($idcargoocupado);
                            if ($centrocosto[0]['idcentrocosto'] != null) {
                                $cantpersonascc++;
                            }
                            $salario = $rp["c$camposumar"];
                            $salariototal += $salario;
                            $cantpersonas++;
                            //OBTENIENDO EL TOTAL DE LOS CONCEPTOS CONTABLES
                            foreach ($arraydatosccont as $iccf => $rccf) {
                                $idestructurarmodelo = $rccf['idestructuramodelodomina'];
                                $importeconccontable = $rp["c$idestructurarmodelo"];
                                $importefinal = number_format($rccf['importeconceptocontable'], 2, '.', '') + number_format($importeconccontable, 2, '.', '');
                                $arraydatosccont[$iccf]['importeconceptocontable'] = number_format($importefinal, 2, '.', '');

                            }
                        }
                    }
                }
            } else {
                $arraydatosccont[0]['denominacion'] = "Por favor configure los conceptos contables";
                $arraydatosccont[0]['idestructuramodelodomina'] = 0;
                $arraydatosccont[0]['importeconceptocontable'] = 0.00;
            }
        }

        //Verificando q el concepto contable este guardado en bd con sus montos
        if (count($arrayconceptoscontables) > 0) {
            foreach ($arraydatosccont as $dcont) {
                //$estaguardado = DatConceptosMontoElaborarPago::existeMontoXElaborarPagoEstNomina($idelaborarpago, $dcont['idestructuramodelodomina']);
                $estaguardado = DatConceptosMontoElaborarPago::obtenerArrDatConceptosMontoXElaborarPagoEstNomina($idelaborarpago, $dcont['idestructuramodelodomina']);
//                if($estaguardado == 0){
                if (count($estaguardado) == 0) {
                    $objsave = new DatConceptosMontoElaborarPago();
                    $objsave->idelaborarpagos = $idelaborarpago;
                    $objsave->idestructuramodelodomina = $dcont['idestructuramodelodomina'];
                    $objsave->monto = $dcont['importeconceptocontable'];
                    $objsave->save();
                }
            }
        }

        //Obteniendo el estado de todas las nominas del periodo de pago seleccionado, dado el idelaborarpago
        $arrayestadosnominas = $objNomina->getIdNomina($idelaborarpago);
        $contestadosdistint = 0;
        $estadonominas = 0;
        foreach ($arrayestadosnominas as $i => $nomina) {
            if ($i < count($arrayestadosnominas) - 1) {
                $contestadosdistint += ($nomina['aprobada'] != $arrayestadosnominas[$i + 1]['aprobada']) ? 1 : 0;
            }
        }
        $estadonominas = ($contestadosdistint == 0) ? $arrayestadosnominas[0]['aprobada'] : 'null';
        $obj = new stdClass();
        $obj->montototal = number_format($salariototal, 2, '.', '');
        $obj->cantidadpersonas = $cantpersonas;
        $obj->cantidadpersonascc = $cantpersonascc;
        $obj->datoscontables = $arraydatosccont;
        $obj->estadonominas = $estadonominas;
        echo json_encode($obj);
    }
}
