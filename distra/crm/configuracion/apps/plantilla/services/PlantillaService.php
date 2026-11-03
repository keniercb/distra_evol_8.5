<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Services
 * @copyright  XETID
 * @version    1.0
 */
class PlantillaService extends ZendExt_Model
{
    private $_model;
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $this->_model = new PlantillaModel();
        parent::ZendExt_Model();
    }

    public function insertarPlantilla($params)
    {
        return $this->_model->save($params);
    }

    public function listarPlantillas($params)
    {
        return $this->_model->load($params);
    }
}
