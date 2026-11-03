<?php

class ExistenciaspublicasController extends BaseController
{
    /**
     * @var ExistenciaspublicasModel
     */
    private $model;

    public function init()
    {
        parent::init('log.inv.existenciaspublicas');
        $this->model = new ExistenciaspublicasModel();
    }

    public function gestExistenciaspublicasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.existenciaspublicas');
        $this->rendertemplate();
    }    

    public function cargarExistenciaAction()
    {
        try {                        
            // Llamar al modelo
            $resultado = $this->model->cargarExistencia($this->uiParams);
            
            // Sincronizar y enviar respuesta
            $this->objectHelper->synchronize($this, $resultado);
            
        } catch (Exception $e) {
            // Registrar el error
            error_log("Error en cargarExistenciaAction: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            
            // Enviar mensaje de error en formato JSON
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar datos: ' . $e->getMessage(),
                'datos' => array(), 
                'cantidad' => 0
            ));
            exit;
        }
    }
     
   
     public function obtenerExistenciaAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
           $result = ExistenciaspublicasModel::obtenerExistencia($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerExistenciaAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar existencias: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
    
     public function obtenerCodigoAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
           $result = ExistenciaspublicasModel::obtenerCodigo($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerCodigoAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar codigos: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
     public function obtenerDenominacionAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
           $result = ExistenciaspublicasModel::obtenerDenominacion($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerDenominacionAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar denominacion: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
    
     public function obtenerUmedidaAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
            $result = ExistenciaspublicasModel::obtenerUmedida($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerUmedidaAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar umedida: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
    public function obtenerNaturalezaAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
            $result = ServiciosConfiguracionGeneralHelper::__init()->obtenerDatosArbolNaturaleza($params);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerNaturalezaAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar naturalezas: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
      public function obtenerMarcaAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
           $result = ExistenciaspublicasModel::obtenerMarca($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerMarcaAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar marca: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
    public function obtenerModeloAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
           $result = ExistenciaspublicasModel::obtenerModelo($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerModeloAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar modelos: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
    
    public function obtenerAlmacenAction()
    {
        try {
            $this->autoShow = false;
            $params = $this->uiParams;
            $result = ExistenciaspublicasModel::obtenerAlmacen($this->global->Estructura->idestructura);
            echo json_encode(array('datos' => $result));
        } catch (Exception $e) {
            error_log("Error en obtenerAlmacenAction: " . $e->getMessage());
            echo json_encode(array(
                'success' => false,
                'message' => 'Error al cargar naturalezas: ' . $e->getMessage(),
                'datos' => array()
            ));
            exit;
        }
    }
}