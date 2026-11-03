<?php
/**
 * Created by PhpStorm.
 * User: yarcos
 * Date: 18/09/2018
 * Time: 13:39
 */

class NomperiodovacacionesService extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function obtenerPeriodoVacaciones() {
        try {
            $obj = new NomPeriodoVacacionesModel();
            return $obj->obtenerPeriodoVacaciones();
        } catch (Exception $e) {
            throw $e;
        }
    }
}