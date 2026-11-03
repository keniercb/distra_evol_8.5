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
class ConfPedidos extends BaseConfPedidos
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
        $res = Doctrine::getTable('ConfPedidos')->find($idestructuracomun);
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
            'ped.tipopedido as tipopedido,' . 'ped.vigenciapedido as vigenciapedido'
        )
            ->from('ConfPedidos ped')
            ->addWhere('ped.idestructuracomun = ?', array($identidad));
        return $dql;
    }

}
