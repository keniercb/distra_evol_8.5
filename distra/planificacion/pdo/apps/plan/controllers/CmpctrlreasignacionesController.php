<?php

/**
 * Controlador para gestionar relaciones
 * Autor: Tte. Nestor Bernal Vidal
 * UCID-ERP
 * V1.0
 */
class CmpctrlreasignacionesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init()
    {
        parent::init();
    }



    function cmpctrlreasignacionesAction()
    {
        $this->render();
    }


    /**
     *
     *
     */
    function cargargridreasignacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $idelemento = $this->_request->getPost('idelemento');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objreasignacionesmodel = new CmpreasignacionesModel();
        $arrayreasignaciones = $objreasignacionesmodel->CargarReasignaciones(
            $tipoelemento, $idelemento, $idusuariosession, $limit, $start
        );
        if (isset($arrayreasignaciones['contador'])) {
            echo json_encode(
                array('total'  => $arrayreasignaciones['contador'],
                      'campos' => $arrayreasignaciones['array'])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function eliminarreasignacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idelementopadre = $this->_request->getPost(
            'idelementopadre'
        );
        $parametros->arrayidelementos = json_decode(
            stripslashes($this->_request->getPost('arrayidelementos'))
        );
        $objreasignacionesmodel = new CmpreasignacionesModel();
        $respuesta = $objreasignacionesmodel->EliminarReasignaciones(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));

    }

}


