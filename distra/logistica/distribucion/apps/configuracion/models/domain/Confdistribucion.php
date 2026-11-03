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
class ConfDistribucion extends BaseConfDistribucion
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
        $res = Doctrine::getTable('ConfDistribucion')->find($idestructuracomun);
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
    public function devolverConfiguracion($dql, $identidad)
    {
        $dql->select(
            'dist.tipodistribucion as tipodistribucion,'
            . 'dist.completarmaximo as completarmaximo,'
            . 'dist.politicacovertura as politicacovertura,'
            . 'dist.diascriticos as diascriticos,'
            . 'dist.formadistribucion as formadistribucion'
        )
            ->from('ConfDistribucion dist')
            ->where('dist.idestructuracomun = ?', array($identidad));
        return $dql;
    }

}