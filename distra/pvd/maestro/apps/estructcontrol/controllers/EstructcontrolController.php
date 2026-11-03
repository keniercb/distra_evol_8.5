<?php
class EstructcontrolController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function estructcontrolAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    function addEstructuraAction()
    {
        $dominios = explode(',', $this->_request->getPost('dominios'));
        $denominacion = $this->_getParam('denominacion');
        $idestructura = $this->_getParam('idestructura');
        $plantilla = $this->_getParam('idestructuracontrolplantilla');
        if (!DatEstructuracontrol::existeDenom($denominacion, $idestructura)) {
            $resp = DatEstructuracontrolModel::addEstructuracontrol(
                $denominacion,
                $idestructura,
                $dominios,
                $plantilla
            );
            echo Zend_Json::encode($resp);
        } else
            echo Zend_Json::encode(false);
    }

    function updateEstructuraAction()
    {
        $idestructuracontrol = $this->_getParam('idestructuracontrol');
        $dominios = explode(',', $this->_request->getPost('dominios'));
        $denominacion = $this->_getParam('denominacion');
        $idestructura = $this->_getParam('idestructura');
        $plantilla = $this->_getParam('idestructuracontrolplantilla');
        $resp = DatEstructuracontrolModel::updateEstructuracontrol(
            $idestructuracontrol,
            $denominacion,
            $idestructura,
            $dominios,
            $plantilla
        );
        echo Zend_Json::encode($resp);
    }

    function deleteEstructuraControlAction()
    {
        $ids = json_decode(stripslashes($this->_request->getPost('ids')));
        $resp = DatEstructuracontrolModel::deleteEstructuracontrol($ids);
        echo Zend_Json::encode($resp);
    }

    function deleteNodeEstructuraAction()
    {
        try {
            $ids = json_decode(stripslashes($this->_request->getPost('idnodos')));
            foreach ($ids as $n) {
                $idobj = explode('-', $n);
                if ($idobj[0] == 's') {
                    DatControladorModel::delete($idobj[1]);
                } else if ($idobj[0] == 'i') {
                    DatControladoModel::delete($idobj[1]);
                }
            }
            echo Zend_Json::encode(true);
        } catch (Exception $e) {
            echo Zend_Json::encode(false);
        }
    }

    function delPersonasAction()
    {
        try {
            $ids = json_decode(stripslashes($this->_request->getPost('array')));
            $idcontrolador = explode('-', $this->_getParam('idcontrolador'));
            foreach ($ids as $n) {
                if ($n->add == 1) {
                    DatMovimientos::deleteByEstControlypersona($idcontrolador[1], $n->idpersona,$n->idcargo);
                } else {
                    DatMovimientosModel::add($idcontrolador[1], $n->idpersona, 0,$n->idcargo);
                }
            }
            echo Zend_Json::encode(true);
        } catch (Exception $e) {
            echo Zend_Json::encode(false);
        }
    }

    function getEstructuraAction()
    {
        try {
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($this->_getParam('node'));
            $datos = Array();
            $pos = 0;
            foreach ($r as $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    $pos++;
                }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    function getEstructurasControlAction()
    {
        $arr->data = DatEstructuracontrolModel::getEstructurascontrol();
        echo Zend_Json::encode($arr);
    }

    function getDominiosAction()
    {
        $arr = NomDominioModel::getDominiosSinEstructurasdecontrol(
            $this->_getParam('idestructura'),
            $this->_getParam('idestructuracontrol')
        );
        echo Zend_Json::encode($arr);
    }

    function getPersonasencargoAction()
    {
        $cargo[0]=$this->_getParam('idcargo');
        $personas = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            null,
            null,
            $this->_getParam('idcargo'),
            null,
            null,
            1
        );
        echo(json_encode($personas));
    }

    function guardarConfiguracionAction()
    {
        $idpadre = explode('-', $this->_getParam('idpadre'));
        $cargos = json_decode(stripslashes($this->_request->getPost('idcargo')));
        $idarea = $this->_getParam('idarea');
        $idpersona = $this->_getParam('idpersona');
        $idestructuracontrol = $this->_getParam('idestructuracontrol');
        try {
            $r = true;
            if ($idpersona == -1) {
                if (empty($idarea)) {
                    foreach ($cargos as $c) {
                        $ree = DatControladoModel::add($idpadre[1], $c, null);
                        $r = ($ree == false)?false: $ree;
                    }
                } else {
                    $ree = DatControladoModel::add($idpadre[1], null, $idarea);
                    $r = ($ree == false)?false: $ree;
                }
            } else {
                $r = DatControladorModel::add($idestructuracontrol, $cargos[0], $idpersona);
            }
            echo(json_encode($r));
        } catch(Exception $e) {
            echo(json_encode(false));
        }
    }

    function getPersonasporcargoAction()
    {
        $idn = explode('-',$this->_getParam('idnode'));
        $idnode = ($this->_getParam('idnode') == 'rootCargos')?null:$idn[1];
        $DECM = new DatEstructuracontrolModel();
        $result = $DECM->getPersonasporcargo($idnode,$idn[0]);

        echo Zend_Json::encode($result);
    }

    public function cambiarOrdenAction()
    {
        $idcontrolado = explode('-', $this->_getParam('idcontrolado'));
        $idnuevop = explode('-', $this->_getParam('idpadre'));
        $idpadre = ($this->_getParam('idpadre') == 'rootCargos')?$idcontrolado[1]:$idnuevop[1];
        $r = DatControladoModel::cambiar($idpadre, $idcontrolado[1]);
        echo(json_encode($r));
    }

    function cambiarControladorAction()
    {
        $idcontrolador = explode('-', $this->_getParam('idcontrolador'));
        $idcargonew = $this->_getParam('idcargonew');
        $idpersona = $this->_getParam('idpersona');
        $r = DatControladorModel::cambiar($idcontrolador[1], $idcargonew, $idpersona);
        echo(json_encode($r));
    }

    function addMovimientoPersonaAction()
    {
        $ids = json_decode(stripslashes($this->_request->getPost('idspersonas')));
        $idcontrolador = explode('-', $this->_getParam('idcontrolador'));
        $r = true;
        foreach ($ids as $n) {
            $datosper = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($n));

            if(empty($datosper->data[0]['idcargo'])) {
                DatMovimientosModel::addmodFueraPlantilla($idcontrolador[1],$n,1);
            } else {
                $exist = DatControlado::getControladoByIdcontroladorCargo(
                    $idcontrolador[1], $datosper->data[0]['idcargo']
                );
                if (count($exist) > 0) {
                    $objmov = DatMovimientos::getMovByIdcontroladorpersonaaccion($idcontrolador[1], $n, 0);
                    DatMovimientosModel::delete($objmov[0]['idmovimiento']);
                } else {
                    $d = DatMovimientosModel::add($idcontrolador[1], $n, 1,$datosper->data[0]['idcargo']);
                    $r = ($d == false) ? false : $r;
                }
            }
        }
        echo(json_encode($r));
    }

    function obtenerCargosAction()
    {
        $idestructuracontrol = $this->_getParam('idestructuracontrol');
        $solocont = $this->_getParam('ctroldor');
        if ($this->_getParam('node') == 'rootCargos') {
            $result = DatControladorModel::getControladorByIdestructuracontrolsimple($idestructuracontrol);
            if ($solocont == 1) {
               foreach ($result as $h=>$value) {
                   $result[$h]['leaf'] = true;
               }
            }
        } else {
            $idpadre = explode('-', $this->_getParam('node'));
            $result = DatControladoModel::getControladoByIdcontrolador($idpadre[1]);
        }
        echo(json_encode($result));
    }

    function getPersonasAllAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp))?null:$temp;
        $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            null, $filtro, $limit, $start, $this->_getParam('idestructura'), null, null
        );
        foreach ($personas->data as $a => $pers) {
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($pers['idarea']);
            if(!empty($area)){
                $personas->data[$a]['denomarea'] = $area[0]->denominacion;
            }else{
                $personas->data[$a]['denomarea'] = 'Fuera de plantilla';
            }
            if(empty($pers['idcargo'])){
                $personas->data[$a]['denomcargo'] = 'Sin Cargo';
            }
        }
        echo(json_encode($personas));
    }

    function moverPersonaAction()
    {
        $idpercontrolados = json_decode(stripslashes($this->_request->getPost('idpercontrolados')));
        $idpermovimientos = json_decode(stripslashes($this->_request->getPost('idpermovimientos')));
        $idcargosmovimientos = json_decode(stripslashes($this->_request->getPost('idcargosmovimientos')));
        $idcontrolador = explode('-', $this->_getParam('idcontrolador'));
        $idcontroladorold = explode('-', $this->_getParam('idcontroladorold'));
        $r = true;
        foreach ($idpermovimientos as $k => $n) {
            $d = DatMovimientosModel::cambiarControlador($idcontrolador[1], $idcontroladorold[1], $n, $idcargosmovimientos[$k]);
            $r = ($d == false)?false:$r;
        }

        foreach ($idpercontrolados as $l => $n) {
            $d = DatMovimientosModel::add($idcontroladorold[1], $n, 0,$idcargosmovimientos[$l]);
            $s = DatMovimientosModel::add($idcontrolador[1], $n, 1,$idcargosmovimientos[$l]);
            $r = ($d == false || $s == false)?false:$r;
        }
        echo(json_encode($r));
    }
}