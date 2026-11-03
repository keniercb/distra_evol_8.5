<?php

/**
 *
 */
$dirIndex = $_SERVER['SCRIPT_FILENAME'];
$configFile = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
    . 'apps/configuracion/nomgenerales/controllers/NomencladoresgeneralesController.php';

include_once($configFile);

/**
 *
 */
class NomactividadController extends NomencladoresgeneralesController
{

    /**
     *
     */
    public function init()
    {
        parent:: init();
    }

    /**
     *
     */
    public function nomactividadAction()
    {
        $this->render();
    }

    /**
     *
     */
    public function cargardepreciacionAction()
    {
        $nomService = new NomencladoresActivosService();
        $datos = $nomService->getMetodosDepreciacion();
        $total = count($datos);
        echo json_encode(array('total' => $total, 'datos' => $datos));
      // echo json_encode($nomService->getMetodosDepreciacion());
        /*$nomService = new NomencladoresGeneralesService();
        $depreciacion = $nomService->ObtenerDepreciacion();
        echo json_encode($depreciacion);*/
    }

}
