<?php

class PriorizarplanesController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar el componente
     * */
    public function init()
    {


        parent::init();
    }

    public function priorizarplanesAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
       $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
       $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargarEntidadesPPAction()
    {

        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idEstructura = ($this->_request->getPost('node'))
            ? $this->_request->getPost('node') : 0;
        $valor = ($this->_request->getPost('valor')) ? $this->_request->getPost(
            'valor'
        ) : null;
        $dominios = $security->getDomain($idEstructura);

        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');

        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
        }

        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }


            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }


        echo json_encode($result);
    }

    public function planesPrioridadAction()
    {
        $parametros = Array();
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($this->_request->getPost('chek') == 'true') {
            $parametros['chek'] = 1;
        } else {
            $parametros['chek'] = 2;
        }

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion']
                        = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'prioridad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['prioridad_condicion1']
                            = array('prioridad' => $datos ['data'] ['value'],
                                    'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['prioridad_condicion2']
                            = array('prioridad' => $datos ['data'] ['value'],
                                    'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['prioridad_condicion3']
                            = array('prioridad' => $datos ['data'] ['value'],
                                    'condicion' => "=");
                    }
                }
            }
        }

        $cbmodel = new DatPlanModel();
        $data = $cbmodel->obtenerPlanesPriaridad($parametros);
        $total = $cbmodel->obtenerTotalPlanesPriaridad($parametros);

        echo json_encode(array('data' => $data, 'total' => $total));
    }

    public function actualizarPrioridadAction()
    {
        $arrayprioridad = json_decode(
            stripslashes($this->_request->getPost('planes_prioridad'))
        );
        $cbmodel = new DatPlanModel();
        $data = $cbmodel->actualizarPrioridadEntidadModelo($arrayprioridad);

        if ($data == 1) {
            $dat->codMsg = 21;
        } elseif ($data == 2) {
            $dat->codMsg = 22;
        } else {
            $dat->codMsg = 3;
        }
        echo json_encode($dat);
    }

}

