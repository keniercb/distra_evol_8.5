<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
//PDF
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
//Excel
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');
//Correo
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.phpmailer.php');
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.smtp.php');
//DBF
require($dir_www . '/pvd/comun/recursos/dbf/XBaseColumn.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseRecord.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseTable.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseWritableTable.php');

class NominaController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    public function nominaAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->comprobante = $this->integrator->contabilidad->getComprobanteComponent();
        $this->render();
    }

    //FALTA VERIFICAR SI HAY NOMINAS NUEVAS, MIENTRAS LA NOMINA NO ESTE APROBADA
    public function sincronizarmodelosplantillasnominaAction()
    {
        //FALTA VERIFICAR SI HAY NOMINAS NUEVAS, MIENTRAS LA NOMINA NO ESTE APROBADA
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
                //print_r($arrN);die;
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

    public function obtenermodelosplantillasnominaAction()
    {
        /*AQUI coger idusuario y el iddominio para la nueva funcionalidad de visualizar nominas*/
        $pos = 0;
        $inc = 0;
        $cont = 0;
        $flag = 0;
        $identidad = $this->_getParam('identidad');
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
        $arrN = $objNomina->obtenerNominasporPeriodoPago($idelaborarpago, 1);  /*AQUI paso el array de plantillas de ese dominio para visualizar nominas*/
        $arrDefinitivo = array();
        $conttt = 0;
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
                //print_r($arrN);die;
                //foreach($arrN as $f=>$w){
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

        //print_r($descripcion);die;
        echo json_encode(array('datos' => $arrDefinitivo, 'cantidad' => count($arrDefinitivo)));

    }

    //ESTA FUNCIONALIDAD GENERA LAS NOMINAS UNA VEZ QUE SE LE DA CLICK A LA PLANTILLA NOMINAL
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

    public function aprobarcertificarnominaAction()
    {
        $identidad = $this->_getParam('identidad');
        $modovisualizar = $this->_getParam('modovisualizar');
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $idtipopago = $this->_getParam('idtipopago');
        $idnomina = Zend_Json::decode(stripslashes($this->_getParam('idnomina')));
        $idtiponomina = Zend_Json::decode(stripslashes($this->_getParam('idtiponomina')));
        $idplantillanominal = Zend_Json::decode(stripslashes($this->_getParam('idplantillanominal')));
        $idconfmodelonomina = Zend_Json::decode(stripslashes($this->_getParam('idconfmodelonomina')));
        $cajacajero = Zend_Json::decode(stripslashes($this->_getParam('cajacajero')));
        $modopago = $this->_getParam('modopago');
        $fechainicioperiodo = $this->_getParam('fechainicioperiodo');
        $fechafinperiodo = $this->_getParam('fechafinperiodo');
        $mesanyopago = $this->_getParam('mesanyopago');
        $aprobadocertificado = $this->_getParam('aprobadocertificado');//print_r($idelaborarpago);die;

        //Validar que no puede haber plantillas nominales sin cargos asociados****************************
        $contPlantNomSinCargo = 0;
        $cadenaPlantNomSinCargo = '';
        $objConfPlantillaNominalCargo = new ConfPlantillaNominalCargo();

        foreach ($idplantillanominal as $id) {
            $sql = "select denominacion from mod_nomina.conf_plantillanominal  where idplantillanominal = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrPN = $conn->fetchAll($sql, array($id));

            $arrPlantNom = $objConfPlantillaNominalCargo->obtenerCargosByIdPlantilla($id);
            if (count($arrPlantNom) == 0) {
                $contPlantNomSinCargo++;
                $cadenaPlantNomSinCargo .= $arrPN[0]['denominacion'] . ";";
            }
        }
        $cantidadPlantillas = count(explode(';', $cadenaPlantNomSinCargo)) - 1;
        $cadenaPlantNomSinCargo = trim($cadenaPlantNomSinCargo, ";");
        //Poner una coma(,) en ves de punto y coma(;) cuando hay mas de una plantilla nominal sin cargos
        if ($cantidadPlantillas > 1) {
            $arrCadAux = explode(';', $cadenaPlantNomSinCargo);
            $cadenaPlantNomSinCargoAux = '';
            for ($i = 0; $i < count($arrCadAux); $i++) {
                $cadenaPlantNomSinCargoAux .= $arrCadAux[$i] . ' , ';
            }
            $cadenaPlantNomSinCargo = trim($cadenaPlantNomSinCargoAux, " , ");
        }

        //Condiciones para poder generar las nominas

        if ($contPlantNomSinCargo > 0) {
            $r = array();
            $r['codigo'] = "PLANTILLAS-SIN-CARGOS-ASOCIADOS";
            $r['campos'] = $cantidadPlantillas;
            $r['valores'] = $cadenaPlantNomSinCargo;
            echo json_encode($r);
        } else {
            $m = null;
            $count = 0;
            $aprobar = 2;
            $arrayTexto = array();
            if ($modovisualizar == 2) {
                $DomainNomina = new DatNomina();
                $arrayDatNomina = $DomainNomina->getIdNomina($idelaborarpago);

                if ($aprobadocertificado == -1) {

                    $objPlantillaNominal = new ConfPlantillaNominal();
                    foreach ($arrayDatNomina as $i => $v) {
                        if ($this->global->perfil->idpersona != '') {
                            $objDCO = new DatCargosOcupados();

                            $rCargos = $objDCO->obtenerListadoCargosOcupadosActual($this->global->perfil->idpersona, $identidad, 0, 10000);
                            if (count($rCargos) > 0) {
                                $idcargo = '';
                                foreach ($rCargos as $k => $c) {
                                    if ($c['idcargo'] != '') {
                                        $idcargo = $c['idcargo'];
                                        break;
                                    }
                                }
                                if ($idcargo != '') {
                                    $objConfigModeloNomina = new ConfigModeloNomina();
                                    $idtiponomina = $objConfigModeloNomina->obtenerIdTiposNominaporTipoPago($idelaborarpago);

                                    $objSegComp = new SegCompartimentacionNomina();
                                    $rSegComp = $objSegComp->verificarCompartimentacionCargo($idcargo, $idtiponomina[0]['idtiponomina'], $v['idnomina']);
                                    if (count($rSegComp) > 0) {
                                        $objNomAC = new DatNominaAprobacionCertificacionModel();
                                        $datos = null;
                                        if ($rSegComp[0]['permiso'] == 3) {
                                            $aprobar = -1;
                                            $objNomina = new DatNomina();
                                            $objNomina->generarNomina($identidad, $idelaborarpago, $idtipopago, $v['idnomina'], $v['idplantillanominal'], $v['idconfmodelonomina'], $v['cajacajero'], $modopago, $fechainicioperiodo, $fechafinperiodo, $mesanyopago, $aprobadocertificado, 0 /*$aprobar*/);
                                            $datos['idnomina'] = $v['idnomina'];
                                            $datos['idcompartimentacionnomina'] = $rSegComp[0]['idcompartimentacionnomina'];
                                            $datos['operacionpermiso'] = 3;
                                            $objNomAC->adicionarCertificacionAprobacion($datos);
                                            $m->codigo = 'OK';
                                            if ($aprobar == -1) {
                                                $DomainNomina = Doctrine::getTable('DatNomina')->find($v['idnomina']);
                                                if ($DomainNomina->aprobada == -1) {
                                                    $DomainNomina->aprobada = -1;
                                                    $DomainNomina->save();
                                                }
                                            }
                                        } else if ($rSegComp[0]['permiso'] == 2) {
                                            $datos['idnomina'] = $v;
                                            $datos['idcompartimentacionnomina'] = $rSegComp[0]['idcompartimentacionnomina'];
                                            $datos['operacionpermiso'] = 2;
                                            $objNomAC->adicionarCertificacionAprobacion($datos);
                                            $m->codigo = 'OK';
                                        } else {
                                            $denominacion = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                                            $arrayTexto[$count] = $denominacion;
                                            $m->codigo = 'NOPERMISO';
                                            $m->texto = $arrayTexto;
                                            $count++;
                                            //break;
                                        }
                                    } else {
                                        $denominacion = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                                        $arrayTexto[$count] = $denominacion;
                                        $m->codigo = 'NOPERMISO';
                                        $m->texto = $arrayTexto;
                                        $count++;
                                        //break;
                                    }
                                } else {
                                    $denominacion = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                                    $arrayTexto[$count] = $denominacion;
                                    $m->codigo = 'NOCARGO';
                                    $m->texto = $arrayTexto;
                                    $count++;
                                    //break;
                                }
                            } else {
                                $denominacion = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                                $arrayTexto[$count] = $denominacion;
                                $m->codigo = 'NOCARGO';
                                $m->texto = $arrayTexto;
                                $count++;
                                //break;
                            }

                        } else {
                            $denominacion = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                            $arrayTexto[$count] = $denominacion;
                            $m->codigo = 'NOPERSONA';
                            $m->texto = $arrayTexto;
                            $count++;
                            //break;
                        }
                        //}

                    }
                    $arrNominasSinAprobar = $DomainNomina->getAllIdNomina($idelaborarpago);
                    foreach ($arrNominasSinAprobar as $j => $arrid) {
                        $DomainNominaAprb = Doctrine::getTable('DatNomina')->find($arrid['idnomina']);
                        $DomainNominaAprb->aprobada = -1;
                        $DomainNominaAprb->save();
                    }
                    $mail = new PHPMailer();
                    $mail->IsSMTP();


                    $mail->SMTPSecure = "tls";
                    //$mail->SMTPDebug = 0;
                    $mail->SMTPAuth = true;
                    //$mail->SMTPSecure = "ssl";
                    $mail->Host = "smtp.xetid.cu";
                    $mail->Port = 25;
                    $mail->Username = 'fberroa@xetid.cu';
                    $mail->Password = 'sochi**2014';

                    $mail->Mailer = "smtp";
                    $mail->Timeout = 50;
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    //====== DE QUIEN ES ========
                    $mail->From = "fberroa@xetid.cu";
                    $mail->FromName = "Frank Rodriguez";
                    //$mail->AddAttachment("images/foto.jpg", "foto_regalo.jpg"); //Archivo adjunto
                    //====== PARA QUIEN =========
                    $mail->Subject = "Notificaci�n sobre el estado de la n�mina";
                    $mail->AddAddress("fberroa@xetid.cu", "Frank");
                    //$mail->AddAddress($_REQUEST['para']);
                    // $mail->AddAddress("albertinn@hotmail.com","Para ti alberto");

                    //Cuerpo del mensaje
                    $body = "Buenos d�as:";
                    $body .= "  Por este medio se le informa que la n�mina a sido certificada";
                    $body .= "                                                             Saludos";
                    // $body .= "<font color='red'>Saludos</font>";
                    $mail->Body = $body;
                    $mail->IsHTML(true);

                    ob_start();
                    $mail->Send();
                    ob_get_clean();

                    echo json_encode($m);
                } else if ($aprobadocertificado == 1) {
                    $DomainNomina = new DatNomina();
                    $arrayDatNomina = $DomainNomina->getIdNomina($idelaborarpago);
                    foreach ($arrayDatNomina as $j => $arrid) {
                        $DomainNominaCert = Doctrine::getTable('DatNomina')->find($arrid['idnomina']);
                        $DomainNominaCert->aprobada = $aprobadocertificado;
                        $DomainNominaCert->save();
                    }


                    $m->codigo = 'OK';

                    $mail = new PHPMailer();
                    $mail->IsSMTP();


                    $mail->SMTPSecure = "tls";
                    //$mail->SMTPDebug = 0;
                    $mail->SMTPAuth = true;
                    //$mail->SMTPSecure = "ssl";
                    $mail->Host = "smtp.xetid.cu";
                    $mail->Port = 25;
                    $mail->Username = 'fberroa@xetid.cu';
                    $mail->Password = 'sochi**2014';

                    $mail->Mailer = "smtp";
                    $mail->Timeout = 50;
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    //====== DE QUIEN ES ========
                    $mail->From = "fberroa@xetid.cu";
                    $mail->FromName = "Frank Rodriguez";
                    //$mail->AddAttachment("images/foto.jpg", "foto_regalo.jpg"); //Archivo adjunto
                    //====== PARA QUIEN =========
                    $mail->Subject = "Notificaci�n sobre el estado de la n�mina";
                    $mail->AddAddress("fberroa@xetid.cu", "Frank");
                    //$mail->AddAddress($_REQUEST['para']);
                    // $mail->AddAddress("albertinn@hotmail.com","Para ti alberto");

                    //Cuerpo del mensaje
                    $body = "Buenos d�as:</n>";
                    $body .= "  Por este medio se le informa que la n�mina a sido aprobada</n>";
                    $body .= "                                                             Saludos</n>";
                    // $body .= "<font color='red'>Saludos</font>";
                    $mail->Body = $body;
                    $mail->IsHTML(true);

                    ob_start();
                    $mail->Send();
                    ob_get_clean();

                    $this->guardarMontosConceptos($idelaborarpago);
                    echo json_encode($m);
                }

            } else {
                if ($aprobadocertificado == -1) {
                    $objPlantillaNominal = new ConfPlantillaNominal();
                    foreach ($idnomina as $i => $v) {
                        //$DomainNomina = Doctrine::getTable('DatNomina')->find($v);
                        //Si la nomina esta aprobada no la guardo
                        /*if($DomainNomina->aprobada == 1){
                            $denominacion = $objPlantillaNominal->obtenerDenomXId($idplantillanominal[$i]);
                            $arrayTexto[$count] = $denominacion;
                            $m->codigo = 'YAAPROBADA';
                            $m->texto = $arrayTexto;
                            $count++;
                        }else{*/
                        if ($this->global->perfil->idpersona != '') {
                            $objDCO = new DatCargosOcupados();
                            //print_r($this->global->perfil);die;
                            $rCargos = $objDCO->obtenerListadoCargosOcupadosActual($this->global->perfil->idpersona, $identidad, 0, 10000);
                            if (count($rCargos) > 0) {
                                $idcargo = '';
                                foreach ($rCargos as $k => $c) {
                                    if ($c['idcargo'] != '') {
                                        $idcargo = $c['idcargo'];
                                        break;
                                    }
                                }
                                if ($idcargo != '') {
                                    $objSegComp = new SegCompartimentacionNomina();
                                    $rSegComp = $objSegComp->verificarCompartimentacionCargo($idcargo, $idtiponomina[$i], $idnomina[$i]);
                                    if (count($rSegComp) > 0) {
                                        $objNomAC = new DatNominaAprobacionCertificacionModel();
                                        $datos = null;
                                        if ($rSegComp[0]['permiso'] == 3) {
                                            $aprobar = 1;
                                            $objNomina = new DatNomina();
                                            $objNomina->generarNomina($identidad, $idelaborarpago, $idtipopago, $idnomina[$i], $idplantillanominal[$i], $idconfmodelonomina[$i], $cajacajero[$i], $modopago, $fechainicioperiodo, $fechafinperiodo, $mesanyopago, $aprobadocertificado, 0 /*$aprobar*/);
                                            $datos['idnomina'] = $v;
                                            $datos['idcompartimentacionnomina'] = $rSegComp[0]['idcompartimentacionnomina'];
                                            $datos['operacionpermiso'] = 3;
                                            $objNomAC->adicionarCertificacionAprobacion($datos);
                                            $m->codigo = 'OK';
                                            if ($aprobar == 1) {
                                                $DomainNomina = Doctrine::getTable('DatNomina')->find($v);
                                                if ($DomainNomina->aprobada == -1) {
                                                    $DomainNomina->aprobada = -1;
                                                    $DomainNomina->save();
                                                }
                                            }
                                        } else if ($rSegComp[0]['permiso'] == 2) {
                                            $datos['idnomina'] = $v;
                                            $datos['idcompartimentacionnomina'] = $rSegComp[0]['idcompartimentacionnomina'];
                                            $datos['operacionpermiso'] = 2;
                                            $objNomAC->adicionarCertificacionAprobacion($datos);
                                            $m->codigo = 'OK';
                                        } else {
                                            $denominacion = $objPlantillaNominal->obtenerDenomXId($idplantillanominal[$i]);
                                            $arrayTexto[$count] = $denominacion;
                                            $m->codigo = 'NOPERMISO';
                                            $m->texto = $arrayTexto;
                                            $count++;
                                            //break;
                                        }
                                    } else {
                                        $denominacion = $objPlantillaNominal->obtenerDenomXId($idplantillanominal[$i]);
                                        $arrayTexto[$count] = $denominacion;
                                        $m->codigo = 'NOPERMISO';
                                        $m->texto = $arrayTexto;
                                        $count++;
                                        //break;
                                    }
                                } else {
                                    $denominacion = $objPlantillaNominal->obtenerDenomXId($idplantillanominal[$i]);
                                    $arrayTexto[$count] = $denominacion;
                                    $m->codigo = 'NOCARGO';
                                    $m->texto = $arrayTexto;
                                    $count++;
                                    //break;
                                }
                            } else {
                                $denominacion = $objPlantillaNominal->obtenerDenomXId($idplantillanominal[$i]);
                                $arrayTexto[$count] = $denominacion;
                                $m->codigo = 'NOCARGO';
                                $m->texto = $arrayTexto;
                                $count++;
                                //break;
                            }

                        } else {
                            $denominacion = $objPlantillaNominal->obtenerDenomXId($idplantillanominal[$i]);
                            $arrayTexto[$count] = $denominacion;
                            $m->codigo = 'NOPERSONA';
                            $m->texto = $arrayTexto;
                            $count++;
                            //break;
                        }
                        //}

                    }
                    $objNomina = new DatNomina();
                    $arrNominasSinAprobar = $objNomina->getAllIdNomina($idelaborarpago);
                    foreach ($arrNominasSinAprobar as $j => $arrid) {
                        $DomainNominaAprb = Doctrine::getTable('DatNomina')->find($arrid['idnomina']);
                        $DomainNominaAprb->aprobada = -1;
                        $DomainNominaAprb->save();
                    }
                    //Capturando el perfil del usuario
                    $perfilseguridad = $this->global->Perfil;
                    //Codigo para enviar correos
                    $mail = new PHPMailer();
                    $mail->IsSMTP();


                    $mail->SMTPSecure = "tls";
                    //$mail->SMTPDebug = 0;
                    $mail->SMTPAuth = true;
                    //$mail->SMTPSecure = "ssl";
                    $mail->Host = "smtp.xetid.cu";
                    $mail->Port = 25;
                    $mail->Username = 'fberroa@xetid.cu';
                    $mail->Password = 'sochi**2014';

                    $mail->Mailer = "smtp";
                    $mail->Timeout = 50;
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    //====== DE QUIEN ES ========
                    $mail->From = "fberroa@xetid.cu";
                    $mail->FromName = "Frank Rodriguez";
                    //$mail->AddAttachment("images/foto.jpg", "foto_regalo.jpg"); //Archivo adjunto
                    //====== PARA QUIEN =========
                    $mail->Subject = "Notificaci�n sobre el estado de la n�mina";
                    $mail->AddAddress("fberroa@xetid.cu", "Frank");
                    //$mail->AddAddress($_REQUEST['para']);
                    // $mail->AddAddress("albertinn@hotmail.com","Para ti alberto");

                    //Cuerpo del mensaje
                    $body = "Buenos d�as:<br>";
                    $body .= "  Por este medio se le informa que la n�mina a sido certificada<br>";
                    $body .= "Usuario que certifica:<b>" . $perfilseguridad->usuario . "</b><br>";
                    $body .= "Persona que certifica:<b>" . $perfilseguridad->nombre . ' ' . $perfilseguridad->apellidos . "</b><br>";
                    $body .= "Saludos<br>";
                    // $body .= "<font color='red'>Saludos</font>";
                    $mail->Body = $body;
                    $mail->IsHTML(true);

                    ob_start();
                    $mail->Send();
                    ob_get_clean();

                    echo json_encode($m);
                } else if ($aprobadocertificado == 1) {
                    $DomainNomina = new DatNomina();
                    $arrayDatNomina = $DomainNomina->getIdNomina($idelaborarpago);
                    foreach ($arrayDatNomina as $j => $arrid) {
                        $DomainNomina = Doctrine::getTable('DatNomina')->find($arrid['idnomina']);
                        $DomainNomina->aprobada = $aprobadocertificado;
                        $DomainNomina->save();
                    }

                    //Capturando el perfil del usuario
                    $perfilseguridad = $this->global->Perfil;

                    $m->codigo = 'OK';
                    //Codigo para enviar correos
                    $mail = new PHPMailer();
                    $mail->IsSMTP();


                    $mail->SMTPSecure = "tls";
                    //$mail->SMTPDebug = 0;
                    $mail->SMTPAuth = true;
                    //$mail->SMTPSecure = "ssl";
                    $mail->Host = "smtp.xetid.cu";
                    $mail->Port = 25;
                    $mail->Username = 'fberroa@xetid.cu';
                    $mail->Password = 'sochi**2014';

                    $mail->Mailer = "smtp";
                    $mail->Timeout = 50;
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    //====== DE QUIEN ES ========
                    $mail->From = "fberroa@xetid.cu";
                    $mail->FromName = "Frank Rodriguez";
                    //$mail->AddAttachment("images/foto.jpg", "foto_regalo.jpg"); //Archivo adjunto
                    //====== PARA QUIEN =========
                    $mail->Subject = "Notificaci�n sobre el estado de la n�mina";
                    $mail->AddAddress("fberroa@xetid.cu", "Frank");
                    //$mail->AddAddress($_REQUEST['para']);
                    // $mail->AddAddress("albertinn@hotmail.com","Para ti alberto");

                    //Cuerpo del mensaje
                    $body = "Buenos d�as:<br>";
                    $body .= "  Por este medio se le informa que la n�mina a sido aprobada<br>";
                    $body .= "Usuario que aprueba:<b>" . $perfilseguridad->usuario . "</b><br>";
                    $body .= "Persona que aprueba:<b>" . $perfilseguridad->nombre . ' ' . $perfilseguridad->apellidos . "</b><br>";
                    $body .= "Saludos<br>";
                    // $body .= "<font color='red'>Saludos</font>";
                    $mail->Body = $body;
                    $mail->IsHTML(true);

                    ob_start();
                    $mail->Send();
                    ob_get_clean();
                    $this->guardarMontosConceptos($idelaborarpago);
                    echo json_encode($m);
                }
            }
        }


    }

    /**
     * Funcion para acumular en el registro de salarios y tiempo de servicios
     * @param $idnomina
     */
    public function acumularRegistroSalarioTiempoServicioAction()
    {
        $identidad = $this->_getParam('identidad');
        $idnomina = Zend_Json::decode(stripslashes($this->_getParam('idnomina')));
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $modopago = $this->_getParam('modopago');
        //$arraysncacumulado = Zend_Json::decode(stripslashes($this->_getParam('arraysncacumulado')));
        $idconfmodelonomina = Zend_Json::decode(stripslashes($this->_getParam('idconfmodelonomina')));
        $flagrespuesta = 0;
        $cadenaVariables = '';
        $tipoNomina = '';
        $cadenaIdNomina = '';
        $objConfigModeloNomina = new ConfigModeloNomina();
        $confvarregsalario = new ConfigRegistroSalarioTiempoServicio();
        foreach ($idnomina as $i => $v) {
            $objDatNomina = new DatNomina();
            //Validando si la nomina ya fue acumulada
            $datNominaModificar = Doctrine::getTable('DatNomina')->find($v);
            if ($datNominaModificar->acumuladasnc != 1) {
                //Acumulando en el registro de salario
                $tiponomina = $objConfigModeloNomina->obtenerIdTiposNominaporTipoPago($idelaborarpago);
                $camposregistrosalario = $confvarregsalario->obtenerListadoCamposRegistroSalario($tiponomina[0]['idtiponomina']);
                if (count($camposregistrosalario) > 0 /*&& $arraysncacumulado[$i] == 0*/) {
                    $acumulacion = $objDatNomina->acumularSNC225($identidad, $v, $camposregistrosalario, $idelaborarpago, $modopago, $idconfmodelonomina[$i]);
                    if ($acumulacion == 'NO-CAMPO-NOMINA-FORMULA') {
                        echo json_encode('NO-CAMPO-NOMINA-FORMULA');
                    }
                    if ($acumulacion == 'NO-CONFIG-VARIABLE-GLOBAL') {
                        echo json_encode('NO-CONFIG-VARIABLE-GLOBAL');
                    }

                    //En caso de que halla algun indicador sin formula
                    if ($acumulacion == 'ok') {

                        $datNominaModificar->acumuladasnc = 1;
                        $datNominaModificar->save();
                    } else {
                        $flagrespuesta = 1;
                        $arrVariables = explode(';', $acumulacion);
                        foreach ($arrVariables as $pos) {
                            $tipnom = "select denominacion from mod_nomina.nom_tiponomina where idtiponomina = ?;";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $arrTipnom = $conn->fetchAll($tipnom, array($camposregistrosalario[$i]['idtiponomina']));
                            $cadenaVariables .= $camposregistrosalario[$pos]['denominacion'] . ' , ';
                            $tipoNomina = $arrTipnom[0]['denominacion'];
                        }
                        break;
                    }
                }
            }

        }

        if ($flagrespuesta == 1) {
            //Cambiando el valor del campo aprobada de la BD por -1
            foreach ($idnomina as $j => $m) {
                $datNominaModificar = Doctrine::getTable('DatNomina')->find($m);
                $datNominaModificar->aprobada = -1;
                $datNominaModificar->save();
            }
            $cadenaVariables = trim($cadenaVariables, ' , ');
            echo json_encode($tipoNomina . '->' . $cadenaVariables);
        } else {
            echo json_encode('ok');
        }
    }

    public function acumularLiquidarVacacionesNominaAction()
    {
        //Id del periodo de pago a acumular
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $identidad = $this->_getParam('identidad');
        $objDatVacacionesPersona = new DatVacacionesPersona();
        $acumulada = $objDatVacacionesPersona->acumularLiquidarSubmayorVacaciones($idelaborarpago, $identidad);
        //Devolvienfo los valores
        echo json_encode($acumulada);
    }

    public function elaborarnominaAction()
    {
        $identidad = $this->_getParam('identidad');
        $accion = $this->_getParam('accion');
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $causadesaprobacion = $this->_getParam('causadesaprobacion');
        $m = new stdClass();

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        /*Si el tipo de pago para este periodo, depende de un reporte se modifica su estado*/
        DatGestionarNominasModel::fnModificarEstadoReporte($identidad, $idelaborarpago, 1);

        /* Busco los datos del elaborar el pago */
        $sql = "SELECT el.idelaborarpagos, el.idtipopago, el.fechainicioperiodo,
                    el.fechafinperiodo, el.identidad, ntp.sepagaadelantado
               FROM mod_nomina.dat_elaborarpagos el
               LEFT JOIN mod_nomina.nom_tipopago ntp ON (ntp.idtipopago = el.idtipopago)
               WHERE idelaborarpagos = ?;";
        $d = new stdClass();
        $d->pago = $conn->fetchAll($sql, array($idelaborarpago));

        /*Verifico dependencias de otros pagos hacia mi*/
        $sql = "SELECT d.idtipopago, tp.sepagaadelantado, tp.denominacion
                FROM mod_nomina.conf_tipopagodependencia d
                INNER JOIN mod_nomina.nom_tipopago tp ON (tp.idtipopago = d.idtipopago)
                WHERE d.idtipopagodepencia = ?";
        $rD = $conn->fetchAll($sql, array($d->pago[0]['idtipopago']));


        if (!empty($rD)) {/*Si hay dependencias*/
            $fi = explode('/', $d->pago[0]['fechainicioperiodo']);
            $ff = explode('/', $d->pago[0]['fechafinperiodo']);
            if ($fi[1] == 12) {
                $fi[1] = 0;
                $fi[2] = $fi[2] + 1;
            }

            $fechainicioperiodo = $d->pago[0]['fechainicioperiodo'];
            $fechafinperiodo = $d->pago[0]['fechafinperiodo'];

            $siguiente_fi = mktime(0, 0, 0, $fi[1] + 1, $fi[0], $fi[2]);
            $siguiente_ff = mktime(0, 0, 0, $ff[1] + 2, 0, $ff[2]);
            $finiciosiguiente = date("d/m/Y", $siguiente_fi);
            $ffinsiguiente = date("d/m/Y", $siguiente_ff);

            $anterior_fi = mktime(0, 0, 0, $fi[1] - 1, $fi[0], $fi[2]);
            $anterior_ff = mktime(0, 0, 0, $ff[1], 0, $ff[2]);
            $finicioanterior = date("d/m/Y", $anterior_fi);
            $ffinanterior = date("d/m/Y", $anterior_ff);

            foreach ($rD as $dp) {
                $finicio = $fechainicioperiodo;
                $ffin = $fechafinperiodo;

                if ($d->pago[0]['sepagaadelantado'] == 1 && $dp['sepagaadelantado'] != 1) {
                    $finicio = $finicioanterior;
                    $ffin = $ffinanterior;
                }

                if ($d->pago[0]['sepagaadelantado'] != 1 && $dp['sepagaadelantado'] == 1) {
                    $finicio = $finiciosiguiente;
                    $ffin = $ffinsiguiente;
                }

                /*Verifico si el pago está certificado o aprobado para este periodo*/
                $sql = "SELECT dep.idelaborarpagos
                FROM mod_nomina.dat_elaborarpagos dep
                INNER JOIN mod_nomina.dat_nomina dn ON (dn.idelaborarpago = dep.idelaborarpagos)
                WHERE dep.identidad = ? AND dep.idtipopago = ? 
                AND dep.fechainicioperiodo = '{$finicio}'::date AND dep.fechafinperiodo = '{$ffin}'::date
                AND (dn.aprobada != -1 AND dn.aprobada != 1)";
                $r = $conn->fetchAll($sql, array($d->pago[0]['identidad'],
                    $dp['idtipopago']));
                if (empty($r)) {
                    $msgnumeropagos = (count($rD) > 1) ? " de los pagos: " : " del pago: ";
                    $msgnumeroencuentra = ($conterror > 1) ? " encuentran desaprobado." : " encuentra desaprobado.";
                    $m->codigo = 'ERRORES';
                    $m->errores = "El pago que está desaprobando depende" . $msgnumeropagos . "<b>" . $dp['denominacion']
                    . "</b>" . ", que no se" . $msgnumeroencuentra;
                    echo json_encode($m);
                    return;
                }
            }
        }

        $objNomina = new DatNomina();
        $objDatDesaprobarNominaTraza = new DatDesaprobarNominaTraza();
        $arrayDatNomina = $objNomina->getIdNomina($idelaborarpago);
        $arrIdsNominas = array();
        foreach ($arrayDatNomina as $n) {
            $arrIdsNominas[] = $n['idnomina'];
        }

        /*Elimino los datos de las nominas en la tabla dat_nominadatos*/
        $sql = "DELETE FROM mod_nomina.dat_nominadatos WHERE idnomina in (" . implode(',', $arrIdsNominas) . ");";
        $conn->execute($sql);

        /*Actualizo las nominas a desaprobadas*/
        $sql = "UPDATE mod_nomina.dat_nomina SET aprobada=0, acumulada=0, actualizada = 0, acumuladasnc = 0 WHERE idelaborarpago = ?;";
        $conn->execute($sql, array($idelaborarpago));

        /*Elimino las operaciones del submayor de vacaciones*/
        $sql = "DELETE FROM mod_nomina.his_vacacionespersona WHERE idnomina in (" . implode(',', $arrIdsNominas) . ");";
        $conn->execute($sql);

        /*Elimino las operaciones del submayor de retenciones*/
        $sql = "DELETE FROM mod_nomina.his_retencionpersona WHERE idnomina in (" . implode(',', $arrIdsNominas) . ");";
        $conn->execute($sql);

        /*Elimino de datoscertificados*/
        $sql = "DELETE FROM mod_nomina.dat_datoscertificadoselaborarpago WHERE idelaborarpagos = ?;";
        $conn->execute($sql, array($idelaborarpago));

        /*Elimino de conceptos certificados*/
        $sql = "DELETE FROM mod_nomina.dat_conceptoelaborarpago WHERE idelaborarpagos = ?;";
        $conn->execute($sql, array($idelaborarpago));

        /*Elimino de las retenciones aplicadas*/
        $sql = "DELETE FROM mod_nomina.dat_retencionesaplicadasporpersona WHERE idelaborarpagos = ?;";
        $conn->execute($sql, array($idelaborarpago));

        /*Elimino de los descuentos aplicados*/
        $sql = "DELETE FROM mod_nomina.dat_descuentosaplicadosporpersona WHERE idelaborarpagos = ?;";
        $conn->execute($sql, array($idelaborarpago));

        /*Elimino del consecutivo guardado para este pago*/
        $sql = "DELETE FROM mod_nomina.dat_consecutivosnominaporpagos WHERE idelaborarpagos = ?;";
        $conn->execute($sql, array($idelaborarpago));

        /*Adiciono la traza de la desaprobacion de la nomina*/
        $perfilseguridad = $this->global->Perfil;
        $objDatDesaprobarNominaTraza->descripcion = $causadesaprobacion;
        $objDatDesaprobarNominaTraza->usuario = $perfilseguridad->usuario;
        $objDatDesaprobarNominaTraza->idelaborarpagos = $idelaborarpago;
        $objDatDesaprobarNominaTraza->accion = ($accion == -1) ? 'descertificar' : 'desaprobar';
        $objDatDesaprobarNominaTraza->nombreapellidos = $perfilseguridad->nombre . ' ' . $perfilseguridad->apellidos;
        $objDatDesaprobarNominaTraza->tipo = 1;
        $objDatDesaprobarNominaTraza->save();

        //Confirmo si la nomina acumula o liquida vacaciones
        $objConfigModeloNomina = new ConfigModeloNomina();
        $idtiponomina = $objConfigModeloNomina->obtenerIdTiposNominaporTipoPago($idelaborarpago)[0]['idtiponomina'];
        $acumulaliquida = NomTipoNomina::obtenerAcumulaLiquida($idtiponomina);
        if($acumulaliquida != 3){
            $periodopago = $d->pago[0]['fechainicioperiodo'];
            list($dia, $mes, $anno) = explode('/', $periodopago);
            $periodopago = $mes."-".$anno;
            //Cuadrando el submayor de vacaciones
            $this->cuadrarSubmayorVacaciones($identidad,$idelaborarpago,$periodopago,$acumulaliquida);
        }

        $m->codigo = 'OK';
        echo json_encode($m);
    }

    public function loadDataComprobanteAction()
    {
        $idtipopago = $this->_getParam('idtipopago');
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $tipocomprobante = $this->_getParam('tipocomprobante');
        $arraypersonasidcargosocupago = Zend_Json::decode(stripslashes($this->_getParam('arraypersonasidcargosocupago')));
        $objmodel = new DatNominaModel();
        //Comprobante de operaciones
        if($tipocomprobante == 1){
            echo json_encode($objmodel->loadDataComprobante($idelaborarpago, $idtipopago, $tipocomprobante, $arraypersonasidcargosocupago));
        //Comprobante de cancelacion
        }else{
            //Estado de las nominas
            $estado = DatNomina::obteneEstadoNominas ($idelaborarpago);
            //Si las nominas estan certificadas
            if($estado == -1){
                echo json_encode($objmodel->cancelarComprobante($idelaborarpago));
            //Si las nominas estan aprobadas
            }else if($estado == 1){
                echo json_encode('NO-CANCELAR-NOMINAS-APROBADAS');
            //Si las nominas estan desaprobadas
            }else{
                echo json_encode('NO-CANCELAR-NOMINAS-DESAPROBADAS');
            }
        }

    }

    public function cuadrarSubmayorVacaciones($identidad,$idelaborarpagos,$periodopago,$acumulaliquida){
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        //Obteniendo todas las operaciones de las personas

        $flagcuadrar = false;

        $personasvacaciones = array();
        $operacionesperiodo = $objhisvacaciones->obtenerOperacionesLiquidacionDePeriodoSubMayor($identidad,$periodopago);
        if(!empty($operacionesperiodo)){
            foreach($operacionesperiodo as $personaelab){
                $personasvacaciones[] = $personaelab['idvacacionespersona'];
            }
            $flagcuadrar = true;  
        }elseif($acumulaliquida == 2){
            $personaselaborarpagosaux = DatPersonaElaborarPagos::obtenerArrayIdPersonasElaborarPagos($idelaborarpagos);
            $personaselaborarpagos = array();
            foreach($personaselaborarpagosaux as $personaelab){
                $personaselaborarpagos[] = $personaelab['idpersona'];
        }

            $personasvacacionesaux = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, $personaselaborarpagos);
            foreach($personasvacacionesaux as $personasvac){
            $personasvacaciones[] = $personasvac['idvacacionespersona'];
        }
            $flagcuadrar = true;
        }
        if($flagcuadrar){
            $arraux = $objhisvacaciones->obtenerTodasOperacionesDeSubMayorVac($identidad,$personasvacaciones);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        //Indexando por idvacacionespersona,en dependencia del tipo de cuadre(para todas las personas o una especifica)
        $arrtodop = array();
        //Cargas iniciales
        $personasvacaux = $personasvacaciones;
        $personasvacaciones = $personasvacacionesaux; 
        //Operaciones
        foreach ($arraux as $valor) {
            $arrtodop[$valor['idvacacionespersona']][] = $valor;
        }
        //Organizando las operaciones
        foreach ($arrtodop as $idvacacionespersona => &$operaciones) {
            foreach ($operaciones as &$op) {
                list($mes, $anno) = explode("-", $op['periodo']);
                $op['orden'] = $anno . $mes . $op['idnomina'] . $op['tipooperacion'];
            }
            $operaciones = $this->orderMultiDimensionalArray($operaciones, 'orden');
            $objhisvacaciones->ordenarOperacionesPersonasPorPeriodos($conn, $operaciones);
        }
        //Obteniendo todas las operaciones de las personas bajas que han sido ordenadas
        $arraux = $objhisvacaciones->obtenerTodasOperacionesDeSubMayorVac($identidad,$personasvacaux);
        //Indexando por idvacacionespersona
        $arrtodop = array();
        foreach ($arraux as $valor) {
            $arrtodop[$valor['idvacacionespersona']][] = $valor;
        }
        
        //Cuadrando todas las operaciones por personas
        foreach ($personasvacaciones as $i => $valor) {
            //Cuadrando cada operacion de la persona
            foreach ($arrtodop[$valor['idvacacionespersona']] as $o => $operaciones) {
                $ajustedias = ($operaciones['tipoajuste'] != 1) ? (($operaciones['tipoajuste'] == 2) ? (-1 * $operaciones['ajustetiempo']) : 0) : $operaciones['ajustetiempo'];
                $ajusteimorte = ($operaciones['tipoajuste'] != 1) ? (($operaciones['tipoajuste'] == 2) ? (-1 * $operaciones['ajusteimporte']) : 0) : $operaciones['ajusteimporte'];

                if (!empty($operaciones)) {
                    if ($o == 0) {//Carga inicial en dias e importe + tiempo acumulado e importe de la 1era operacion en el submayor de la persona en cuestion
                        if ($operaciones['tipooperacion'] == 1) {//Operaciones de acumulacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = round($valor['tiempoacumuladoinicial'], 2) + $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = round($valor['importeacumuladoinicial'], 2) + $operaciones['importeacumulado'] + $ajusteimorte;
                        } else {//Operaciones de liquidacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = round($valor['tiempoacumuladoinicial'], 2) - $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = round($valor['importeacumuladoinicial'], 2) - $operaciones['importeacumulado'] + $ajusteimorte;
                        }
                    } else {//Demas operaciones en el submayor de la persona en cuestion
                        if ($operaciones['tipooperacion'] == 1) {//Operaciones de acumulacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoentiempo_real'] + $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoenimporte_real'] + $operaciones['importeacumulado'] + $ajusteimorte;
                        } else {//Operaciones de liquidacion
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoentiempo_real'] - $operaciones['tiempoacumulado'] + $ajustedias;
                            $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'] = $arrtodop[$valor['idvacacionespersona']][$o - 1]['saldoenimporte_real'] - $operaciones['importeacumulado'] + $ajusteimorte;
                        }
                    }
                    //Actualizando en la base de datos los campos saldoentiempo y saldoenimporte
                    $saldoentiempo = $arrtodop[$valor['idvacacionespersona']][$o]['saldoentiempo_real'];
                    $saldoenimporte = $arrtodop[$valor['idvacacionespersona']][$o]['saldoenimporte_real'];
                    $objhisvacaciones->actualizarSaldoTiempoImportePersona($conn, $operaciones['idhisvacacionespersona'], $saldoentiempo, $saldoenimporte);
                }
            }
        }
        $conn->commit();
        }

    }

    public function orderMultiDimensionalArray($toOrderArray, $field, $inverse = false){
        $position = array();
        $newRow = array();
        foreach ($toOrderArray as $key => $row) {
            $position[$key] = $row[$field];
            $newRow[$key] = $row;
        }
        if ($inverse) {
            arsort($position);
        } else {
            asort($position);
        }
        $returnArray = array();
        foreach ($position as $key => $pos) {
            $returnArray[$key] = $newRow[$key];
        }
        return $returnArray;
    }

    public function exportarnominaAction()
    {
        $identidad = $this->_getParam('identidad');
        $id = $this->_getParam('id');
        $formato = $this->_getParam('formato');
        $tipovisualizacion = $this->_getParam('tipovisualizacion');
        $estado = $this->_getParam('estado');
        $formatohoja = $this->_getParam('formatohoja');
        $arrayidnomina = Zend_Json::decode(stripslashes($this->_getParam('arrayidnomina')));
        $direccion = $this->_getParam('direccion');
        $cajacajero = $this->_getParam('cajacajero');
        $objNomina = new DatNominaModel();//hacer mi clase llamarla y a exportar
        //Generando la nomina si esta desaprobada

        if ($estado == 0) {
            $register = Zend_Registry::getInstance();
            $direccion = $register->config->modulo_path . 'comun/recursos/datosnominas/' . $direccion;
            //Leyendo el archivo con la configuracion y los datos para generar la nomina
            $datosserializados = file_get_contents($direccion);

            $d = unserialize($datosserializados);
            $arrnominadatos = array();
            $cont = 0;
            foreach ($arrayidnomina as $in => $rn) {
                $arrvaloresnomina = array();
                foreach ($d->valores as $iv => $rv) {
                    if ($rn == $rv['idnomina']) {
                        array_push($arrvaloresnomina, $rv);
                    }
                }
                $arrnominadatos[$in]['idnomina'] = $rn;
                $arrnominadatos[$in]['valores'] = serialize($arrvaloresnomina);
                $arrnominadatos[$in]['campos'] = serialize($d->campos);

                $objNominaD = DatNomina::obtenerObj($rn);
                $arrnominadatos[$in]['idplantillanominal'] = $objNominaD->idplantillanominal;
                $denomCodigo = ConfPlantillaNominal::obtenerDenomXId($objNominaD->idplantillanominal);
                $arrnominadatos[$in]['codigo'] = explode('-', $denomCodigo)[0];
                $arrnominadatos[$in]['denominacion'] = explode('-', $denomCodigo)[1];
                $arrnominadatos[$in]['cajacajero'] = $objNominaD->cajacajero;
            }

            $rExp = $objNomina->exportarNomina($identidad, $id, $formato, $tipovisualizacion, $estado, $cajacajero,$arrnominadatos);
        } else
            $rExp = $objNomina->exportarNomina($identidad, $id, $formato, $tipovisualizacion, $estado, $cajacajero);
        echo json_encode($rExp);
    }

    public function exportarasmAction()
    {
        $id = $this->_getParam('id');
        $objNomina = new DatNominaModel();
        $rExp = $objNomina->exportarASM($id);
        echo json_encode($rExp);
    }

    public function exportarresultadonominalAction()
    {
        $id = $this->_getParam('id');
        $idtipopago = $this->_getParam('idtipopago');
        $objNomina = new DatNominaModel();
        $rExp = $objNomina->exportarResultadoNominal($id, $idtipopago);
        //$rExp = $objNomina->Ejemplo($id,$idtipopago);
        echo json_encode($rExp);
    }

    public function contabilizarSubtotalesAction()
    {
        $id = $this->_getParam('id');
        $objNomina = new DatNominaModel();
        $rExp = $objNomina->contabilizarSubtotales($id);
        echo json_encode($rExp);
    }

    public function actualizarPeriodoPagoContabilizadoYComprobanteCentroCostoAction()
    {
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $idComprobante = $this->_getParam('idComprobante');
        $numComprobante = $this->_getParam('numComprobante');
        $tipocomprobante = $this->_getParam('tipocomprobante');
        $objNomina = new DatNominaModel();
        //Periodo de Pago
        $respuesta = $objNomina->actualizarPeriodoPagoContabilizado($idelaborarpago, $idComprobante, $numComprobante, $tipocomprobante);
        //Comprobante Centros de Costo
        $sql = "select apertura from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $apertura = $conn->fetchOne($sql);
        if($apertura != 0){
            //Eliminando y adicionando los temporales de los pases del comprobante por centros de costo
            $objDatComprobantesCC = new DatComprobanteNominaCentrosCosto();
            $arraycompccelaborarpagos = $objDatComprobantesCC->obtenerComprobanteCentrosCostoxElaborarPagos($idelaborarpago);
            if (count($arraycompccelaborarpagos) > 0) {
                foreach ($arraycompccelaborarpagos as $rcelp) {
                    //Borrando los datos temporales del comprobante
                    $objNominaDatosDelete = Doctrine::getTable('DatComprobanteNominaCentrosCosto')->find($rcelp['idcomprobantenominacentrocosto']);
                    $objNominaDatosDelete->delete();
                }
            }
            $register = Zend_Registry::getInstance();
            $nombreArchivo = $idelaborarpago . ".compcc";
            $direccion = $register->config->modulo_path . 'comun/recursos/compcentroscosto/' . $nombreArchivo;
            $arrayComprobanteCentCosto = unserialize(file_get_contents($direccion));
            if(count($arrayComprobanteCentCosto)>0){
                //Adiciionando el ultimo comprobante contabilizado
                foreach ($arrayComprobanteCentCosto as $rcompcc) {
                    $objDatComprobantesCCSave = new DatComprobanteNominaCentrosCosto();
                    $objDatComprobantesCCSave->idcuenta = $rcompcc['idcuenta'];
                    $objDatComprobantesCCSave->cuenta = $rcompcc['cuenta'];
                    $objDatComprobantesCCSave->denomcuenta = $rcompcc['denomcuenta'];
                    $objDatComprobantesCCSave->debitocredito = $rcompcc['debitocredito'];
                    $objDatComprobantesCCSave->centrocosto = $rcompcc['centrocosto'];
                    $objDatComprobantesCCSave->idelaborarpagos = $idelaborarpago;
                    $objDatComprobantesCCSave->importe = $rcompcc['importe'];
                    $objDatComprobantesCCSave->save();
                }
            }
        }
        echo json_encode($respuesta);
    }

    public function contabilizarPagosIndebidosAction()
    {
        $id = $this->_getParam('id');
        $objNomina = new DatNominaModel();
        $rExp = $objNomina->contabilizarSubtotales($id);
        echo json_encode($rExp);
    }

    public function buscardatosNominasAction()
    {
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $identidad = $this->_getParam('identidad');
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
		                            inner join mod_nomina.conf_estructuramodelosnominaentidad este on (este.idestructuramodelodomina = estr.idestructuramodelodomina)
		                            inner join mod_nomina.nom_tiponomina nomtn on (nomtn.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									where elp.idelaborarpagos = ? and este.idestructura = ? and estr.estotal = 1;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrEstructuraNomina = $conn->fetchAll($sqlEstructurar, array($idelaborarpago, $identidad));
            $camposumar = $arrEstructuraNomina[0]['idestructuramodelodomina'];

            //BUSCANDO LOS CAMPOS DE LA NOMINA
            $sqlEstructurarCamposNomina = "select distinct estr.idestructuramodelodomina, estr.idtiponomina from mod_nomina.conf_estructuramodelosnomina estr
                                    inner join mod_nomina.conf_estructuramodelosnominaentidad este on (este.idestructuramodelodomina = estr.idestructuramodelodomina)
		                            inner join mod_nomina.nom_tiponomina nomtn on (nomtn.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									where elp.idelaborarpagos = ? and este.idestructura = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrEstructuraTotalNomina = $conn->fetchAll($sqlEstructurarCamposNomina, array($idelaborarpago, $identidad));

            //ARRAY DE CONCEPTOS CONTABLES
            $arrayconceptoscontables = $objConfigConceptosContables->obtenerListadoTodosConfigConceptosContablesEntidad($arrEstructuraTotalNomina[0]['idtiponomina'], $identidad);
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
        //Datos del comprobante del periodo de pago
        $datelaborarpagos = new DatElaborarPagos();
        $rdep = $datelaborarpagos->obtenerPeriodosPagoEntidad($idelaborarpago);
        //Datos de si el modulo de nominas postea comprobantes para la contabilidad
        $sql = "select * from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $modulo = $conn->fetchAll($sql);

        $obj = new stdClass();
        $obj->montototal = number_format($salariototal, 2, '.', '');
        $obj->cantidadpersonas = $cantpersonas;
        $obj->cantidadpersonascc = $cantpersonascc;
        $obj->datoscontables = $arraydatosccont;
        $obj->estadonominas = $estadonominas;
        $obj->idcomprobanteoperaciones = $rdep[0]['idcomprobanteoperaciones'];
        $obj->numerocomprobanteoperaciones = $rdep[0]['numerocomprobanteoperaciones'];
        $obj->idcomprobantecancelacion = $rdep[0]['idcomprobantecancelacion'];
        $obj->numerocomprobantecancelacion = $rdep[0]['numerocomprobantecancelacion'];
        $obj->posteacomprobantes = $modulo[0]['apertura'];
        $obj->cobroypago = $modulo[0]['cobroypago'];
        echo json_encode($obj);
    }

    /*Funcion que carga los datos necesarios para generar la nomina

     * Ing. Yadir Martinez Vergara
     * 25/05/2016
     *      */
    public function cargardatosgenerarnominasAction()
    {
        $idelaborarpagos = $this->_getParam('idelaborarpago');
        $objDatosNomina = new DatosNominaModel();
        $respuesta = $objDatosNomina->cargarDatosNomina($idelaborarpagos);
        $r = new stdClass();
        $r->archivo = $respuesta;

        echo json_encode($r);
    }

    public function comprobantesAction()
    {
        $idelaborarpagos = $this->_getParam('idelaborarpago');
        $accion = $this->_getParam('accion');
        $objDatosNomina = new DatElaborarPagos();
        $respuesta = $objDatosNomina->dameIdComprobantesOperacionesCanc($idelaborarpagos);

        //Para el comprobante de operaciones
        $r = array();
        if ($accion == 1) {
            if (!empty($respuesta[0]['idcomprobanteoperaciones'])) {
                $r['error'] = 'EXISTE-COMP-OPERACION';
            } else
                $r['error'] = 'ok';
        } else if ($accion == 2) {//Para el comprobante de cancelacion
            if (empty($respuesta[0]['idcomprobanteoperaciones'])) {//Si no hay comp-operacion
                $r['error'] = 'NO-EXISTE-COMP-OPERACION';
            } else {//Si hay comp-operacion
                if (!empty($respuesta[0]['idcomprobantecancelacion'])) {
                    $r['error'] = 'EXISTE-COMP-CANCELACION';
                } else
                    $r['error'] = 'ok';
            }
        } /*else {//Comprobante de cuentas por cobrar
            if (empty($respuesta[0]['idcomprobanteoperaciones'])) {//Si no hay comp-operacion
                $r['error'] = 'NO-EXISTE-COMP-OPERACION';
            } else {//Si hay comp-operacion
                if (!empty($respuesta[0]['idcomprobantecuentasporcobrar'])) {
                    $r['error'] = 'EXISTE-COMP-CUENTASPORCOBRAR';
                } else
                    $r['error'] = 'ok';
            }
        }*/
        echo json_encode($r);
    }

    public function exportardescuentosnoaplicadosAction()
    {
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        $identidad = $this->_getParam('identidad');
        $accionvalidar = $this->_getParam('accionvalidar');
        $objNomina = new DatNominaModel();
        $respuesta = $objNomina->exportarDescuentosNoAplicados($idelaborarpagos, $identidad, $accionvalidar);
        echo json_encode($respuesta);
    }

    public function exportardescuentosaplicadosAction()
    {
        $identidad = $this->_getParam('identidad');
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        $objNomina = new DatNominaModel();
        $respuesta = $objNomina->exportarDescuentosAplicados($idelaborarpagos, $identidad);
        // echo json_encode($respuesta);
    }

    public function actualizarCobrosyPagosAction()
    {
        $identidad = $this->_getParam('identidad');
        $idelaborarpagos = $this->_getParam('idelaborarpago');
        $arrayidnomina = Zend_Json::decode(stripslashes($this->_getParam('arrayidnomina')));
        $objModel = new DatGestionarNominasModel();
        $idComprobante = DatElaborarPagos::obtenerComprobanteOperacionesPeriodoPago($idelaborarpagos);
        $numComprobante = DatElaborarPagos::obtenerNumeroComprobanteOperacionesPeriodoPago($idelaborarpagos);
        //Datos comprobante
        $sqlDatComprobante = "select DISTINCT * from mod_nomina.dat_comprobantenomina
		            		        where idelaborarpagos = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrdatcomprobante = $conn->fetchAll($sqlDatComprobante, array($idelaborarpagos));
        $idtasa = $arrdatcomprobante[0]['idtasa'];
        $idmoneda = $arrdatcomprobante[0]['idmoneda'];
        $idoperacion = $arrdatcomprobante[0]['operacion'];
        $return = $objModel->actualizarCobrosyPagos($identidad, $idelaborarpagos, $idComprobante, $numComprobante, $idtasa, $idmoneda, $idoperacion, $arrayidnomina);
        echo json_encode($return);
    }

    public function obtenerCamposEstModNomAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idelaborarpagos = $this->_request->getPost('idelaborarpagos');
        $arrtiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpagos);
        $idtiponomina = $arrtiponomina[0]['idtiponomina'];
        $r = ConfigEstructurarModelosNominaModel::obtenerModeloNominaxIdTipoNomina($idtiponomina, $identidad);
        $c = ConfigEstructurarModelosNominaModel::obtenerCantidadTotalModelosNomina($idtiponomina, $identidad);
        //Codigo contable
        $rfinal = array();
        foreach ($r as $c => $campo) {
            $rfinal[$c]['idcampo'] = $campo['idestructuramodelodomina'];
            $rfinal[$c]['denominacion'] = $campo['denominacion'];
            $rfinal[$c]['idtiponomina'] = $campo['idtiponomina'];
        }
        echo json_encode(array('datos' => $rfinal, 'cantidad' => $c));
    }

    public function exportarCamposEspecificosAction()
    {
        $identidad = $this->_getParam('identidad');
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        $campos = Zend_Json::decode(stripslashes($this->_getParam('campos')));
        $objNomina = new DatNominaModel();
        $r = $objNomina->exportarCamposEspecificos($identidad, $idelaborarpagos, $campos);
        echo json_encode($r);
    }

    public function exportarComprobanteCentrosCostoAction()
    {
        $identidad = $this->_getParam('identidad');
        $formato = $this->_getParam('formato');
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        //Centros de costo contabilizados
        $sqlCentrosCosto = "select DISTINCT (ccc.centrocosto), ncc.descripcioncentrogrupo, ncc.codigocentrogrupo from mod_nomina.dat_comprobantenominacentroscosto ccc
		            		        inner join mod_contabilidadcosto.nom_centrocosto ncc on (ncc.idcentrogrupo = ccc.centrocosto)
		            		        where ccc.idelaborarpagos = ? order by (ncc.codigocentrogrupo)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrdatcentroscosto = $conn->fetchAll($sqlCentrosCosto, array($idelaborarpagos));
        //Obteniendo los datos de las cuentas por centros de costo
        $arrComprbanteCC = DatComprobanteNominaCentrosCosto::obtenerComprobanteCentrosCostoxElaborarPagos($idelaborarpagos);
        $objReporteExcel = new ReporteExportarComprobantesCentroCostoModel();
        $arrCuentasCC = array();
        if (count($arrdatcentroscosto)) {
            foreach ($arrdatcentroscosto as $i => $rcc) {
                $cont = 0;
                foreach ($arrComprbanteCC as $rcompcc) {
                    if ($rcc['centrocosto'] == $rcompcc['centrocosto']) {
                        $arrdatcentroscosto[$i]['comprobante'][$cont] = $rcompcc;
                        $cont++;
                    }
                }
            }
            //Excel
            if ($formato == 1) {
                $reporte = $objReporteExcel->exportarReporte($arrdatcentroscosto);
            } else {//PDF
                $reporte = $objReporteExcel->exportarReportePdf($arrdatcentroscosto, $identidad, $idelaborarpagos);
            }
        }
        echo json_encode($reporte);
    }

    /**Reporte XML de Contabilidad*/
    public function exportarFicheroContabilizacionSistemaExternoAction()
    {
        $idelaborarpago = $this->_getParam('idelaborarpago');
        $idtipopago = $this->_getParam('idtipopago');
        $identidad = $this->_getParam('identidad');
        $tipofichero = $this->_getParam('tipofichero');
        $crc = $this->_getParam('crc');
        $objNomina = new DatNominaModel();
		//Si se va a Exportar el XML del Sabic - BICSA
		if($tipofichero == 1){
			$xml = $objNomina->exportarXMLContabilizacionSABIC($idelaborarpago, $idtipopago, $identidad, $crc);
            echo json_encode($xml);
			return;
		//Si se va a Exportar el DBF del Sabic - RAFIN
		}else{
			$dbf = $objNomina->exportarDBFContabilizacionSABIC($idelaborarpago, $idtipopago, $identidad);
            echo json_encode($dbf);
			return;
		}
        
    }

    public function validarExistenAsociacionesCuentasAction()
    {
        $identidad = $this->_getParam('identidad');
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        $objConfModeloNomina = new ConfigModeloNomina();
        $objConfAsociacionCuentas = new ConfAsociacionCuentasContables();
        $arrtiponomina = $objConfModeloNomina->obtenerIdTiposNominaporTipoPago($idelaborarpagos);
        $idtiponomina = $arrtiponomina[0]['idtiponomina'];
        $arrasociaciones = $objConfAsociacionCuentas->fnObtenerListadoAsociacionCuentas($identidad, !empty($idtiponomina) ? $idtiponomina : -1);
        $r = 'ok';
        if (empty($arrasociaciones)) {
            $r = 'NO-CONFIG';
        }
        echo json_encode($r);
    }

    public function exportarComprobanteComprobacionAction()
    {
        $identidad = $this->_getParam('identidad');
        $formato = $this->_getParam('formato');
        $idelaborarpagos = $this->_getParam('idelaborarpagos');
        $objConfModeloNomina = new ConfigModeloNomina();
        $objConfAsociacionCuentas = new ConfAsociacionCuentasContables();
        $arrtiponomina = $objConfModeloNomina->obtenerIdTiposNominaporTipoPago($idelaborarpagos);
        $idtiponomina = $arrtiponomina[0]['idtiponomina'];
        $arrasociaciones = $objConfAsociacionCuentas->fnObtenerListadoAsociacionCuentas($identidad, !empty($idtiponomina) ? $idtiponomina : -1);
        $arrdescuadresasociaciones = array();
        $cont = 0;
        foreach ($arrasociaciones as $asociacion) {
            $arrdescuadresasociaciones[$cont]['asociacion'] = $asociacion['denominacion'];
            $arrconcatdeudoras = array();
            $arrconcatacreedoras = array();
            //Obteniendo el concat por cada cuenta deudora
            $cuentasdeudoras = unserialize($asociacion['cuentasdeudoras']);
            foreach ($cuentasdeudoras as $cuentad) {
                list($idcuenta,) = explode('-', $cuentad);
                $nomcuenta = $this->integrator->contabilidad->obtenerCuentaPorId($idcuenta);
                $arrconcatdeudoras[] = $nomcuenta->concatcta;
            }

            //Obteniendo el concat por cada cuenta acreedora
            $cuentasacreedoras = unserialize($asociacion['cuentasacreedoras']);
            foreach ($cuentasacreedoras as $cuentaa) {
                list($idcuenta,) = explode('-', $cuentaa);
                $nomcuenta = $this->integrator->contabilidad->obtenerCuentaPorId($idcuenta);
                $arrconcatacreedoras[] = $nomcuenta->concatcta;
            }

            //Reindexando los arreglos de cuentas y eliminando valores repetidos
            $arrconcatdeudoras = array_values(array_unique($arrconcatdeudoras));
            $arrconcatacreedoras = array_values(array_unique($arrconcatacreedoras));

            //Obteniendo todas las cuentas deudoras y acreedoras en dat_comprobantenomina
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            //Deudoras
            $wherepart = "";
            foreach ($arrconcatdeudoras as $pos => $concat) {
                if ($pos > 0)
                    $wherepart .= " or dcn.cuenta ilike '%" . $concat . "%'";
                else
                    $wherepart .= " dcn.cuenta ilike '%" . $concat . "%'";
            }
            $sql = "select dcn.idcuenta, dcn.cuenta, dcn.denomcuenta, dcn.debitocredito, dcn.importe
                from mod_nomina.dat_comprobantenomina dcn
		        where dcn.debitocredito = 0 and dcn.idelaborarpagos = ? and (" . $wherepart . ")";
            $arrdescuadresasociaciones[$cont]['cdeudoras'] = $conn->fetchAll($sql, array($idelaborarpagos));

            //Acreedoras
            $wherepart = "";
            foreach ($arrconcatacreedoras as $pos => $concat) {
                if ($pos > 0)
                    $wherepart .= " or dcn.cuenta ilike '%" . $concat . "%'";
                else
                    $wherepart .= " dcn.cuenta ilike '%" . $concat . "%'";
            }
            $sql = "select dcn.idcuenta, dcn.cuenta, dcn.denomcuenta, dcn.debitocredito, dcn.importe
                from mod_nomina.dat_comprobantenomina dcn
		        where dcn.debitocredito = 1 and dcn.idelaborarpagos = ? and (" . $wherepart . ")";
            $arrdescuadresasociaciones[$cont]['cacreedoras'] = $conn->fetchAll($sql, array($idelaborarpagos));
            $cont++;
        }

        //Obteniendo los datos de las cuentas por centros de costo
        $objReporteExcel = new ReporteExportarComprobantesCentroCostoModel();
        if (!empty($arrdescuadresasociaciones)) {
            if ($formato == 1) {//Excel
                $reporte = $objReporteExcel->exportarReporteComprobacion($arrdescuadresasociaciones);
            } else {//PDF
                $reporte = $objReporteExcel->exportarReporteComprobacionPdf($arrdescuadresasociaciones, $identidad, $idelaborarpagos);
            }
        }
        echo json_encode($reporte);
    }
}
