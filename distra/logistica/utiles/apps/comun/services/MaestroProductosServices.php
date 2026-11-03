<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MaestroProductosServices
 *
 * @author kenier
 */
class MaestroProductosServices extends LogisticaComponentService
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getJsNomencladorProductos($controller = null)
    {
        return $this->getComponent('log.lb.nomproductos');
    }

}
