<?php

class ParametrizacionController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    public function parametrizacionAction()
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
                    'fechafin' => $v['fechafin'], 'cerrado' => $v['cerrado'], 'naturalezas' => $arrNat, 'idnaturalezas' => $arIdNat,
                    'depositos' => json_decode(stripslashes($v['depositos'])));
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
        }

        if($tipo == 2) {
            $m['estructura'] = $texto;
            $m['idestructura'] = $this->global->Estructura->idestructura;
            $m['tipo'] = $tipo;
            $m['periodo'] = $p;
            $m['depositosparametrizacion'] = $obj->obtenerDepositosParametrizacion($m['idestructura']);

            $aE = $this->integrator->metadatos->obtenerPadreEntidad($this->global->Estructura->idestructura, true);
            $identidad = $aE[0]->idestructura;
            $aparametros = $obj->obtenerConfiguracionParametrosInventario($identidad);

            $ap = array();
            foreach ($aparametros as $param){
                $ap[$param['idtipoparametrosinventario']]['tipoparametrosinventario'] =  $param['tipoparametrosinventario'];
                $ap[$param['idtipoparametrosinventario']]['parametros'][] =  $param;
            }

            $api = array();
            foreach ($ap as $param){
               $api[] = $param;
            }

            $m['parametros'] = $api;

        }else{
            $m['codigo'] = 2;
            $m['tipo'] = $tipo;
            $m['success'] = false;
            $m['mensaje'] = "La estructura del usuario no es una UEB.";
        }

        echo json_encode($m);
    }


    public function obtenerparametrizacionAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idconf = $this->_request->getPost('idconf');
        $idlineaproducto = $this->_request->getPost('idlineaproducto');
        $iddeposito = $this->_request->getPost('iddeposito');
        $criterio = $this->_request->getPost('criterio');
        $idueb = $this->_request->getPost('idestructura');

        $idestructura = null;

        if ($this->global->Estructura->idorgano == -2) {
            $aE = $this->integrator->metadatos->obtenerPadreEntidad($this->global->Estructura->idestructura, true);
            $idestructura = $aE[0]->idestructura;
        }

        $r = array();
        if (empty($idconf)) {
            $r['datos'] = array();
            $r['cantidad'] = 0;
        } else {
            $obj = new DatparametrizacionproductosModel();
            $r = $obj->obtenerParametrizacionProducto($limit, $start, $idconf,$idestructura, $idueb,  $idlineaproducto, $criterio, $iddeposito);
        }

        echo json_encode($r);
    }

    public function calcularParametrizacionAction()
    {

        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idconfperiodosclasificacionabc = $this->_request->getPost('idconf');
        $idueb = $this->_request->getPost('idestructura');
        $iddeposito = $this->_request->getPost('iddeposito');

        $idestructura = null;

        if ($this->global->Estructura->idorgano == -2) {
            $aE = $this->integrator->metadatos->obtenerPadreEntidad($this->global->Estructura->idestructura, true);
            $idestructura = $aE[0]->idestructura;
        }

        $m = array();
        $m['codigo'] = 1;
        $objP = new Confperiodosclasificacionabc();
        $rP = $objP->obtenerPeriodosClasificacionABCById($idconfperiodosclasificacionabc);

        if(!empty($rP[0]['cerrado'])){
            $m['codigo'] = 3;
            $m['mensaje'] = 'El per&iacute;odo a analizar est&aacute; cerrado.';
        }else{
            $obj = new DatparametrizacionproductosModel();
            $m = $obj->calcularParametrizacionProducto($idconfperiodosclasificacionabc, $idestructura, $idueb, $fechainicio, $fechafin, $iddeposito);
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

    public function obtenermovimientosdepositosAction()
    {
        $idconf = $this->_request->getPost('idconf');
        $idestructura = $this->_request->getPost('idestructura');
        $iddeposito = $this->_request->getPost('iddeposito');
        $fi = $this->_request->getPost('fechainicio');
        $ff = $this->_request->getPost('fechafin');

        $r = array();
        if (empty($idconf)) {
            $r['datos'] = array();
            $r['cantidad'] = 0;
        } else {
            $obj = new DatparametrizacionproductosModel();
            $r = $obj->obtenerMovimientosProductos($idconf, $idestructura, $iddeposito, $fi, $ff);
        }

        echo json_encode(array('datos' => $r));
    }


}
