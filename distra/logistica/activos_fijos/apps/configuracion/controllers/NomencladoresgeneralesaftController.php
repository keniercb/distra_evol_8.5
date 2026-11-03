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
class NomencladoresgeneralesaftController extends NomencladoresgeneralesController
{

    /**
     *
     */
    public function init()
    {
        parent:: init('log.aft.configuracionaf');
        /*$this->view->uiVariables = array_merge(
            array(
                'sistemacontenedores' => json_encode(LogisticaGlobal::SUBSISTEMA_CONTEN),
                'sistemaaft' => json_encode(LogisticaGlobal::SUBSISTEMA_AFT)
            ), $this->view->uiVariables
        );*/
    }

    /**
     *
     */
    public function nomencladoresgeneralesaftAction()
    {
        $this->render();
    }

}
