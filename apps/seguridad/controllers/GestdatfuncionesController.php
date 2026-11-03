<?php

/**
 * @name GestdatfuncionesController - Clase controladora.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestdatfuncionesController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function gestdatfuncionesAction()
    {
        $this->render();
    }

    function insertarfuncionAction()
    {
        $funcion = new DatFunciones();
        $funcion->idservicio = $this->_request->getPost('idservicio');
        $funcion->denominacion = $this->_request->getPost('denominacion');
        $funcion->descripcion = $this->_request->getPost('descripcion');
        $model = new DatFuncionesModel();
        $model->insertarfuncion($funcion);
        $this->showMessage(
            'La funci&oacute;n fue insertada satisfactoriamente.'
        );
    }

    function modificarfuncionAction()
    {
        $funcion = new DatFunciones();
        $funcion = Doctrine::getTable('DatFunciones')
            ->find($this->_request->getPost('idfunciones'));
        $funcion->idservicio = $this->_request->getPost('idservicio');
        $funcion->denominacion = $this->_request->getPost('denominacion');
        $funcion->descripcion = $this->_request->getPost('descripcion');
        $model = new DatFuncionesModel();
        $model->insertarfuncion($funcion);
        $this->showMessage(
            'La funci&oacute;n fue modificada satisfactoriamente.'
        );
    }

    function eliminarfuncionAction()
    {
        $funcion = new DatFunciones();
        $funcion = Doctrine::getTable('DatFunciones')
            ->find($this->_request->getPost('idfunciones'));
        $model = new DatFuncionesModel();
        $model->eliminarfuncion($funcion);
        $this->showMessage(
            'La funci&oacute;n fue eliminada satisfactoriamente.'
        );
    }

    function cargarserviciosAction()
    {
        $servicios = DatServicio::cargarser(0, 0);
        if (count($servicios)) {
            foreach ($servicios as $valores => $valor) {
                $servicioArr[$valores]['id'] = $valor->idservicio;
                $servicioArr[$valores]['text'] = $valor->denominacion;
                $servicioArr[$valores]['leaf'] = true;
            }
            echo json_encode($servicioArr);

            return;
        }
    }

    function cargarfuncionesAction()
    {
        $idservicio = $this->_request->getPost('idservicio');
        $limit = $this->_request->getPost("limit");
        $start = $this->_request->getPost("start");
        $datosfunc = DatFunciones::cargarfunciones($idservicio, $limit, $start);
        $cantf = DatFunciones::obtenercantfunc($idservicio);
        if ($datosfunc) {
            $datos = $datosfunc->toArray();
            $result = array('cantidad_filas' => $cantf, 'datos' => $datos);
            echo json_encode($result);

            return;
        }
    }

}