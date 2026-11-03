<?php

/**
 * @name GestdatparametrosController - Clase controladora.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestdatparametrosController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function gestdatparametrosAction()
    {
        $this->render();
    }

    function insertarparametroAction()
    {
        $parametro = new DatParametros();
        $parametro->idfunciones = $this->_request->getPost('idfunciones');
        $parametro->denominacion = $this->_request->getPost('denominacion');
        $parametro->descripcion = $this->_request->getPost('descripcion');
        if ($this->_request->getPost('puedesernull') == "on") {
            $parametro->puedesernull = true;
        } else {
            $parametro->puedesernull = false;
        }
        $parametro->tipoparametro = $this->_request->getPost('tipoparametro');
        $parametro->valordefecto = $this->_request->getPost('valordefecto');
        $model = new DatParametrosModel();
        $model->insertarparametro($parametro);
        $this->showMessage(
            'El par&aacute;metro fue insertado satisfactoriamente.'
        );
    }

    function modificarparametroAction()
    {
        $parametro = new DatParametros();
        $parametro = Doctrine::getTable('DatParametros')
            ->find($this->_request->getPost('idparametros'));
        $parametro->idfunciones = $this->_request->getPost('idfunciones');
        $parametro->denominacion = $this->_request->getPost('denominacion');
        $parametro->descripcion = $this->_request->getPost('descripcion');
        if ($this->_request->getPost('puedesernull') == "on") {
            $parametro->puedesernull = true;
        } else {
            $parametro->puedesernull = false;
        }
        $parametro->tipoparametro = $this->_request->getPost('tipoparametro');
        $parametro->valordefecto = $this->_request->getPost('valordefecto');
        $model = new DatParametrosModel();
        $model->modificarparametro($parametro);
        $this->showMessage(
            'El par&aacute;metro fue modificado satisfactoriamente.'
        );
    }

    function eliminarparametroAction()
    {
        $parametro = new DatParametros();
        $parametro = Doctrine::getTable('DatParametros')
            ->find($this->_request->getPost('idparametros'));
        $model = new DatParametrosModel();
        $model->eliminarparametro($parametro);
        $this->showMessage(
            'El par&aacute;metro fue eliminado satisfactoriamente.'
        );
    }

    function cargarserviciosAction()
    {
        $idnodo = $this->_request->getPost('node');
        if ($idnodo == 0) {
            $servicios = DatServicio::cargarser(0, 0);
            if ($servicios->count()) {
                foreach ($servicios as $valores => $valor) {
                    $servicioArr[$valores]['id'] = $valor->idservicio;
                    $servicioArr[$valores]['text'] = $valor->denominacion;
                }
                echo json_encode($servicioArr);

                return;
            } else {
                echo(json_encode($servicios->toArray()));
            }

            return;
        } else {
            $funcion = DatFunciones::cargarfunciones($idnodo, 0, 0);
            if ($funcion->count()) {
                foreach ($funcion as $valores => $valor) {
                    $funcionArr[$valores]['id'] = $valor->idfunciones;
                    $funcionArr[$valores]['text'] = $valor->denominacion;
                    $funcionArr[$valores]['leaf'] = true;
                }
                echo(json_encode($funcionArr));

                return;
            } else {
                echo(json_encode($funcion->toArray()));
            }

            return;
        }
    }

    function cargarparametrosAction()
    {
        $idfunciones = $this->_request->getPost('idfunciones');
        $limit = $this->_request->getPost("limit");
        $start = $this->_request->getPost("start");
        $datospara = DatParametros::cargarparametros(
            $idfunciones, $limit, $start
        );
        $cantf = DatParametros::obtenercantpar($idfunciones);
        if ($datospara) {
            $datos = $datospara->toArray();
            $result = array('cantidad_filas' => $cantf, 'datos' => $datos);
            echo json_encode($result);

            return;
        }
    }

}