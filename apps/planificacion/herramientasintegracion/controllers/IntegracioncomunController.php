<?php

/**
 * Created by PhpStorm.
 * User: rygarcia
 * Date: 5/10/16
 * Time: 9:12 AM
 */
class IntegracioncomunController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    public function cargarAyudaAction()
    {
        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
    }

    public function integracioncomunAction()
    {
        $$this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->prospectivaComun = $this->integrator->prospectiva->prospectivaComun();
        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    //------------------------------------------------------------------------------------------------------------------ VARIABLES
    function savevariableAction()
    {
        $model = new DatCuestionarioModel();
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $idcuestionario = $this->_request->getPost('idcuestionario');
        $concepto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('concepto')));
        $_response = $model->saveVariable($objeto, $idcuestionario, $concepto);
        if ($_response) {
            $_result['tipo'] = 1;
            $_result['mensaje'] = "Los datos han sido actualizados correctamente.";
            $_result['idvariable'] = $_response;
        } else {
            $_result['tipo'] = 1;
            $_result['mensaje'] = "Los datos han sido actualizados correctamente.";
        }
        echo json_encode($_result);
        return;
    }

    function eliminarvariableAction()
    {
        $model = new DatCuestionarioModel();
        $idvariable = $this->_request->getPost('idvariable');
        $data = $model->eliminarVariable($idvariable);
        echo json_encode($data);
        return;
    }

    function getvariableAction()
    {
        $model = new DatCuestionarioModel();
        $idvariable = $this->_request->getPost('idvariable');
        $data = $model->getVariable($idvariable);
        echo json_encode($data);
        return;
    }

    function getvariablesAction()
    {
        $model = new DatCuestionarioModel();
        $idcuestionario = $this->_request->getPost('idcuestionario');
        $orden = $this->_request->getPost('orden');
        $concepto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('concepto')));
        if ($concepto) {
            $data = $model->getVariablesByConcepto($concepto, $orden);
        } else {
            $data = $model->getVariables($idcuestionario);
        }
        echo json_encode($data);
        return;
    }

    //------------------------------------------------------------------------------------------------------------------ PROYECTOS
    public function saveproyectoAction()
    {
        $model = new DatProyectoModel();
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $concepto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('concepto')));
        $_response = $model->saveProyecto($objeto, $concepto);
        if ($_response) {
            if (count($objeto['add']) > 0) {
                $msg = (count($objeto['add']) > 1) ? 'Los proyectos han sido adicionados satisfactoriamente.' : "El proyecto ha sido adicionado satisfactoriamente.";
            } else
                if (count($objeto['mod']) > 0) {
                    $msg = (count($objeto['mod']) > 1) ? 'Los proyectos han sido modificados satisfactoriamente.' : "El proyecto ha sido modificado satisfactoriamente.";
                }

            $_result['tipo'] = ($_response['mostrarMens']) ? 2 : 1;
            $_result['mensaje'] = ($_response['mostrarMens']) ? $_response['mensaje'] : $msg;
            $_result['cargar'] = ($_response['mostrarMens']) ? 0 : 1;
            if (!$_response['mostrarMens']) {
                $_result['idproyecto'] = $_response['idproyecto'];
                $_result[$concepto['campoid']] = $_response[$concepto['campoid']];
            }
        } else {
            $_result['tipo'] = ($_response['mostrarMens']) ? 2 : 1;
            $_result['mensaje'] = ($_response['mostrarMens']) ? $_response['mensaje'] : (count($objeto['del']) > 1) ? 'Los proyectos han sido eliminados satisfactoriamente.' : "El proyecto ha sido eliminado satisfactoriamente.";
            $_result['cargar'] = ($_response['mostrarMens']) ? 0 : 1;
        }
        echo json_encode($_result);
        return;
    }

    public function eliminarproyectoAction()
    {

    }

    public function getproyectoAction()
    {
        $model = new DatProyectoModel();
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $data = $model->getProyecto($objeto['idproyecto']);
        echo json_encode($data);
        return;
    }

    public function getproyectosAction()
    {
        $model = new DatProyectoModel();
        $concepto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('concepto')));
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $data = $model->getProyectos($concepto, $start, $limit);

        echo json_encode($data);
        return;
    }
}
