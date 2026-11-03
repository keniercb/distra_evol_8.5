<?php

class ConfigabcController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function configabcAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function salvarConfiguracionAction()
    {
        $tipo = $this->_request->getPost('tipo');
        $datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $obj = new ConfigAbcModel();
        $m = $obj->salvarConfiguracion($tipo, $datos);
        echo json_encode($m);
    }

    public function obtenerConfiguracionAction()
    {

    }

    public function eliminarConfiguracionAction()
    {
        $tipo = $this->_request->getPost('tipo');
        $id = $this->_request->getPost('id');
        $obj = new ConfigAbcModel();
        $m = $obj->eliminarConfiguracion($tipo, $id);
        echo json_encode($m);
    }

    public function obtenerClasificacionABCAction()
    {
        $confABC = new Nomclasificacionabc();
        $rc = $confABC->obtenerClasificacionABC();
        $r = array('datos' => $rc);
        echo json_encode($r);

    }

    public function obtenerDefinicionPesoAction()
    {
        $confDP = new Confdefinicionpeso();
        $rdp = $confDP->obtenerDefinicionPeso($this->global->Estructura->idestructura);
        $r = array('datos' => $rdp);
        echo json_encode($r);
    }

    public function obtenerPeriodosClasificacionABCAction()
    {
        $confPC = new Confperiodosclasificacionabc();
        $rpc = $confPC->obtenerPeriodosClasificacionABC($this->global->Estructura->idestructura);

        $nom = new AbcModel();
        $rN = $nom->obtenerLineasProductoBusqueda(null);
        $arrNat = array();
        foreach ($rN as $v){
            $arrNat[$v['idnaturaleza']] = $v['denominacion'];
        }

        foreach ($rpc as &$pc){
            $aN = json_decode($pc['naturalezas']);
            $arr = array();
            foreach ($aN as $n){
                $arr[] = $arrNat[$n];
            }
            $pc['denominacionnaturalezas'] = implode(',', $arr);
        }

        $r = array('datos' => $rpc);
        echo json_encode($r);
    }

    public function obtenerCriteriosValoracionAction()
    {
        $nomCV = new Nomcriteriovaloracion();
        $rcv = $nomCV->obtenerCriteriosValoracion();
        $r = array('datos' => $rcv);
        echo json_encode($r);
    }

    public function obtenerNaturalezasAction()
    {
        $nom = new AbcModel();
        $r = $nom->obtenerLineasProductoBusqueda();
        echo json_encode(array('datos' => $r));
    }

    public function cargardepositosAction()
    {
        $model = new AbcModel();
        $datas = $model->obtenerDepositos($this->global->Estructura->idestructura);
        echo json_encode($datas);
    }

    public function obtenerValorSistemaParametrosAction()
    {
        $obj = new ConfparametrosinventarioModel();
        $r = $obj->valoresSistema();
        echo json_encode($r);
    }
    public function obtenerConfiguracionParametrosAction()
    {
        $obj = new ConfparametrosinventarioModel();
        $r = $obj->obtenerConfiguracionParametrosInventario($this->global->Estructura->idestructura);
        echo json_encode(array('datos' => $r));
    }

    public function cargardepositosparametrizarAction()
    {
        $model = new AbcModel();
        $datas = $model->obtenerDepositos($this->global->Estructura->idestructura);
        $depositos = $model->obtenerConfDepositosParametrizar($this->global->Estructura->idestructura);
        foreach ($datas['datos'] as &$da){
            if(empty(array_key_exists($da['iddeposito'], $depositos[$da['idueb']]))){
                $da['marcado'] = 0;
            }else {
                $da['marcado'] = 1;
            }

        }
        //print_r($datas);die;
        echo json_encode($datas);
    }

}