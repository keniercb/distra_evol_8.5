<?php

/**
 * Controlador para el control de elementos en el calendario
 *
 * @author    Luis Angel Del Rosario Guevara
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpparetoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista calendario.phtml
     */
    function cmpparetoAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * Accion para cargar los porcientos en la tabla
     */
    public function cargarTablasPorcientoAction()
    {
        print_r("-");
        die;
    }

    public function cargarElementosDiagramaAction()
    {
        print_r("-");
        die;
    }

    public function cargarComboPlanesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $planes = Array();
        $objplanmodel = new DatPlanPdo();
        $arrayplanes = $objplanmodel->CargarPlaness($idusuario);
        if (isset($arrayplanes[0]['DatElementos']['idelemento'])) {
            foreach ($arrayplanes as $key => $value) {
                $planes[$key]['idplan'] = $value['DatElementos']['idelemento'];
                $planes[$key]['denominacion']
                    = $value['DatElementos']['denelemento'];
            }
            echo json_encode(array('data' => $planes));
        }
        if (!isset($arrayplanes[0]['DatElementos']['idelemento'])) {
            echo json_encode(array('data' => array()));
        }
    }

    public function generarDiagramaParetoAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->integrator = $this->integrator;
        $parametros->tipoR = $this->_request->getPost('tipoR');
        //print_r($parametros);die;
        $model = new CmpgestionaractividadesModel();
        $result = $model->ActividadesParaPareto($parametros);
        echo json_encode(
            array('porciento_re' => $result['porciento_re'],
                  'CAR'          => $result['CAR'],
                  'acumulado'    => $result['acumulado'],
                  'peso'         => $result['peso'],
                  'text'         => $result['text']
            )
        );
    }

}
