<?php

/**
 * Created by PhpStorm.
 * User: drago
 * Date: 1/12/16
 * Time: 14:07
 */

class JasperClientService
{
    private $model;
    public function __construct()
    {
        $this->model = new JasperClientModel();

    }
    public function exportReport($params){
        return $this->model->exportReport($params);
    }
}