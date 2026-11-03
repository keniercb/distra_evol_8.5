<?php

class CalcularmaxminController extends BaseController
{

    

    public function init()
    {
        parent::init('log.inv.operaciones');
       
    }

    public function calcularmaxminAction()
    {
       $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $cFechaContable = 'FechaContable';
       // $fechaContable = $this->global->$cFechaContable->fecha;

        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->ObtenerJSArbolUM()
        );

        $this->view->uiVariables = array_merge(
            array(
                'fechaContable' => $this->global->$cFechaContable->fecha,

            ), $this->view->uiVariables
        );
        $this->initComponent('log.inv.operaciones');
        $this->renderTemplate();
    }

    public function cargarGridPrincipalAction()
    {
        $model = new CalcularmaxminModel();
        if ($this->uiParams['combo'] == 'true') {
            $this->uiParams['grid'] = 1;
            $datos = $model->cargarGridPrincipal($this->uiParams);
            $this->datos = $datos[1];
            //$this->cantidad = $datos[0];
        } else {
            $this->datos = array();
            $this->cantidad = 0;
        }
    }
   /* public function cargarProdCodficadorAction()
    {
        $model = new CalcularmaxminModel();
        $datos = $model->cargarProdCodficador($this->uiParams);
        $this->datos = $datos[1];

    }*/

    public function getCargarLineaProdAction()
    {

        $params = $this->_request->getParams();
        $params['modelo'] = 'NomLineaProductoFarm';
        $params['idnom'] = 'idlineaprod';

        $params['incluirvencidas'] = 2;
        $nomencladoresModel = ($this->params['bussines']) ? new $this->params['bussines']() :
            new NomencladoresModel();
        if ($params['treesearch']) {

            $result = $nomencladoresModel->cargarArbol($params);
        } else {
            $result = $nomencladoresModel->buscar($params);
        }
        if ($params['onlyData']) {
            $this->autoShow = false;
            echo(json_encode($result));
        } else {
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        }
    }

    public function cargarDatosInicialesAction()
    {
        $model = new CalcularmaxminModel();
        $datos = $model->cargarDatosIniciales($this->uiParams);
        $this->datos = $datos[0];

    }

    public function getCalcularDatosAction()
    {
        $model = new CalcularmaxminModel();
        $this->uiParams['calcular'] = json_decode(stripcslashes($this->uiParams['calcular']));
        $this->uiParams['form'] = json_decode(stripcslashes($this->uiParams['form']));
        $model->getCalcularDatos($this->uiParams);
    }

    public function aprobarMaxMinAction()
    {
        $model = new CalcularmaxminModel();
        $this->uiParams['calcular'] = json_decode(stripcslashes($this->uiParams['calcular']));
        $this->uiParams['form'] = json_decode(stripcslashes($this->uiParams['form']));
        $model->aprobarMaxMin($this->uiParams);
    }

    public function getEliminarDatosAction()
    {
        $model = new CalcularmaxminModel();
        $this->uiParams['eliminar'] = json_decode(stripcslashes($this->uiParams['eliminar']));
        $model->getEliminarDatos($this->uiParams);
    }

    public function cargarAnalisisAction()
    {
        $model = new CalcularmaxminModel();
        $datos = $model->cargarAnalisis($this->uiParams);
        $this->datos = $datos;
        $this->total = count($datos);
    }
    
}
