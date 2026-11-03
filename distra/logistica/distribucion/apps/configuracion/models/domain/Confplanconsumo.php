<?php

/**
 * @class      ConfInventario
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfPlanconsumo extends BaseConfPlanconsumo
{

    public function setUp()
    {
        parent:: setUp();
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si la configuracion si existe
     *
     */
    public function existeConfiguracion($idestructuracomun)
    {
        $res = Doctrine::getTable('ConfPlanconsumo')->find($idestructuracomun);
        if ($res->idestructuracomun) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna la configuracion de inventario si existe
     *
     */
    public function devolverConfiguracion(/*$dql,*/ $identidad)
    {
        $dql = Doctrine_Query::create();
        $dql->addselect(
            'con.insertar as insertar,'
            . 'con.modificar as modificar,'
            . 'con.importar as importar,'
            . 'con.duracionplan as duracionplan'
        )
            ->from('ConfPlanconsumo con')
            ->addWhere('con.idestructuracomun = ?', array($identidad));
        return $dql;
    }

}
