<?php

/**
 * LogisticaComunicationInterface
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema logistica.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa martínez
 * @copyright (c) 2015, XETID
 * @version       1.0
 */
class LogisticaComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getProductService($params){
        try{
            return $this->integrator->logistica->getIndicadoresByParams($params,0,1);
        }catch (Exception $e){
            return array();
        }
    }

    public function getTipoPrecio($params){
        try{
            return $this->integrator->facturacion->getTipoPrecio($params);
        }catch (Exception $e){
            return array();
        }
    }
}