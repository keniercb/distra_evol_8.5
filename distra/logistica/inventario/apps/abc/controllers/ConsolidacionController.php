<?php

class ConsolidacionController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    public function consolidacionAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function obtenerperiodosAction()
    {

        $obj = new Confperiodosclasificacionabc();
        $idestructura = $this->global->Estructura->idestructura;

        if ($this->global->Estructura->idorgano == -2) {
            $e = $this->integrator->metadatos->obtenerPadreEntidad($idestructura);
            if (count($e) > 0) {
                $idestructura = $e[0]->idestructura;
            } else {
                echo json_encode(array('datos' => array()));
                return false;
            }
        }
        $m = $obj->obtenerPeriodosClasificacionABC($idestructura);
        $objABC = new AbcModel();

        $r = array();
        foreach ($m as &$v) {
            if($v['analizar'] == 1) {
                $arrN = $objABC->obtenerLineasProductoBusqueda($v['idconfperiodosclasificacionabc']);
                $arrNat = array();
                $arIdNat = array();
                foreach ($arrN as $n){
                    $arrNat[] = $n['denominacion'];
                    $arIdNat[] = $n['idnaturaleza'];
                }
                $r = array('idconfperiodosclasificacionabc' => $v['idconfperiodosclasificacionabc'], 'periodo' => $v['fechainicio'] . ' - ' . $v['fechafin'], 'fechainicio' => $v['fechainicio'],
                    'fechafin' => $v['fechafin'], 'naturalezas' => $arrNat, 'idnaturalezas' => $arIdNat, 'depositos' => json_decode(stripslashes($v['depositos'])), 'presupuesto' => $v['presupuesto']);
                break;
            }
        }
       return $r;
    }

     public function obtenerPeriodoAnalizaryParametrosAction()
    {
        $m = array();
        $m['codigo'] = 1;
        $m['success'] = true;
        $obj = new ConfparametrosinventarioModel();
        $texto = '';
        $tipo = 2;

        /*Busco el periodo de clasificacion a analizar*/
        $p = $this->obtenerperiodosAction();

        $arrEstruct = array();
        if ($this->global->Estructura->idorgano == -2) {
            $arrEstruct[] = array('idestructura' => $this->global->Estructura->idestructura, 'denominacion' => $this->global->Estructura->denominacion);
            $texto = 'UEB: ' . $this->global->Estructura->denominacion;
        } else {
            $tipo = 1;
            $texto = 'Entidad: ' . $this->global->Estructura->denominacion;
        }

        if($tipo == 1) {
            $m['estructura'] = $texto;
            $m['idestructura'] = $this->global->Estructura->idestructura;
            $m['tipo'] = $tipo;
            $m['periodo'] = $p;


            $aparametros = $obj->obtenerConfiguracionParametrosInventario($this->global->Estructura->idestructura);

            $ap = array();
            foreach ($aparametros as $param){
                if($param['consolida'] == 1){
                    $ap[] = $param;
                }
            }

            $m['parametros'] = $ap;

        }else{
            $m['codigo'] = 2;
            $m['tipo'] = $tipo;
            $m['success'] = false;
            $m['mensaje'] = "La estructura del usuario no es una Entidad.";
        }

        echo json_encode($m);
    }


    public function obtenerconsolidacionAction()
    {
        $idconf = $this->_request->getPost('idconf');
        $idlineaproducto = $this->_request->getPost('idlineaproducto');
        $idcentrologistico = $this->_request->getPost('idcentrologistico');
        $criterio = $this->_request->getPost('criterio');

         $r = array();
        if (empty($idconf)) {
            $r['datos'] = array();
            $r['cantidad'] = 0;
        } else {
            $obj = new DatconsolidacionparametrizacionproductosModel();
            $r = $obj->obtenerConsolidacionParametrizacionProducto($idconf, $this->global->Estructura->idestructura, $idlineaproducto, $idcentrologistico, $criterio);
        }

        echo json_encode($r);
    }

    public function consolidarParametrizacionAction()
    {
        $idconfperiodosclasificacionabc = $this->_request->getPost('idconf');

        $m = array();
        $m['codigo'] = 1;
        $objP = new Confperiodosclasificacionabc();
        $p = $objP->obtenerPeriodosClasificacionABCById($idconfperiodosclasificacionabc);
        if($p[0]['cerrado'] != 1) {
            $obj = new DatconsolidacionparametrizacionproductosModel();
            $m = $obj->consolidarParametrizacionProducto($this->global->Estructura->idestructura, $idconfperiodosclasificacionabc);
        }else{
            $m = array('codigo' => 3, 'mensaje' => 'El período a analizar está cerrado.');
        }
        echo json_encode($m);
    }



    public function obtenerlineasproductoAction()
    {
        $id = $this->_request->getPost('idconf');
        $objABC = new AbcModel();
        $r = $objABC->obtenerLineasProductoBusqueda($id);
        echo json_encode(array('datos' => $r));
    }

    public function obtenercentroslogisticosAction()
    {
        $obj = new ConfparametrosinventarioModel();
        $r = $obj->obtenerCentrosLogisticos($this->global->Estructura->idestructura);
        echo json_encode(array('datos' => $r));
    }

    public function obtenerNaturalezasReparametrizarAction()
    {
        $obj = new DatconsolidacionparametrizacionproductosModel();
        $r = $obj->obtenerNaturalezasConsolidacion($this->_request->getPost('idconf'));
        echo json_encode(array('datos' => $r));
    }

    public function recalcularPresupuestoAction(){
        $idconf = $this->_request->getPost('idconf');
        $recalculo = $this->_request->getPost('recalculo');
        $p = json_decode(stripslashes($this->_request->getPost('presupuestos')));
        $objP = new Confperiodosclasificacionabc();
        $periodo = $objP->obtenerPeriodosClasificacionABCById($idconf);
        if($periodo[0]['cerrado'] != 1){
            $obj = new DatconsolidacionparametrizacionproductosModel();
            $r = $obj->recalcularPresupuesto($idconf, $this->global->Estructura->idestructura, $p, $recalculo);
            echo json_encode($r);
        }else{
            echo json_encode(array('codigo' => 3, 'mensaje' => 'El período a analizar está cerrado.'));
        }
    }

    public function reparametrizarycerrarAction(){
        $idconf = $this->_request->getPost('idconf');
        $idestructura = $this->_request->getPost('idestructura');
        $objP = new Confperiodosclasificacionabc();
        $r = array();
        $periodo = $objP->obtenerPeriodosClasificacionABCById($idconf);
        if($periodo[0]['cerrado'] != 1) {
            $obj = new DatconsolidacionparametrizacionproductosModel();
            $r = $obj->reparametrizacionProductosConsolidados($periodo, $idestructura);

        }else{
            $r = array('codigo' => 3, 'mensaje' => 'El período a analizar está cerrado.');
        }
        echo json_encode($r);
    }


}
