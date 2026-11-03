<?php

/**
 * Description of EntradaProxy
 *
 * @author Kenier Cumba Bueno
 */
class ExtensionesProxy extends ExtensionesModel
{

    /**
     * Instancia del modelo especifico que se inicializa en funcion del
     * controlador que lo requiere
     *
     * @var
     */
    private $_model;

    public function __construct($datos = array())
    {
        $this->_model = $this->factoryModel($datos);
        parent::ZendExt_Model();
    }

    /**
     * @param $datos
     *
     * @author Kenier Cumba Bueno
     * @return object
     */
    public function factoryModel($datos)
    {
        switch ($datos['tipo']) {
            case 'proveedores':
                return new ProveedoresModel($datos);
            case 'clientes':
                return new ProveedoresModel($datos);
            case 'centrocosto':
                return new CentroCostoModel($datos);
            case 'producto':
                return new ProductoModel($datos);
        }
    }

    public function cargarDatos($parametros)
    {
        return $this->_model->cargarDatos($parametros);
    }

}
