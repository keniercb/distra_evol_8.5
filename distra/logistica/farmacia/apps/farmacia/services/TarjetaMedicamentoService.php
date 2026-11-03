<?php

/**
 * @class      TarjetaMedicamentoService
 *
 * @package    Farmacia
 * @subpackage farmacia
 * @author     Daniel Arias Espinosa
 * @copyright  XETID
 * @version    1.0
 */
class TarjetaMedicamentoService extends ZendExt_Model
{
    private $model;
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new TarjetaMedicamentoModel();
    }
}