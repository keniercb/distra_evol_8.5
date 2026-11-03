<?php

/**
 * @class      ConfiguracionFarmaciaService
 *
 * @package    Farmacia
 * @subpackage Configuracion
 * @author     Daniel Arias Espinosa
 * @copyright  XETID
 * @version    1.0
 */
class ConfiguracionFarmaciaService extends ZendExt_Model
{
    private $model;
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new ConfiguracionFarmaciaModel();
       //$this->confInventario = new ConfInventario();
    }


}
