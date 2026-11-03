<?php

/**
 * @class      ConfInventario
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfInventario extends BaseConfInventario
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('ConfInventarioExt', array('local' => 'idestructuracomun', 'foreign' => 'idestructuracomun'));
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si la configuracion si existe
     */
    public function existeConfiguracion($idestructuracomun)
    {
        $res = Doctrine::getTable('ConfInventario')
            ->find($idestructuracomun);
        if ($res->idestructuracomun) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se utiliza ubicacion
     */
    public function utilizarUbicacion($idestructuracomun)
    {
        $res = Doctrine::getTable('ConfInventario')
            ->find($idestructuracomun);
        $res = (is_object($res)) ? $res->toArray() : array();
        return $res['usarubicacion'];
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna la configuracion de inventario si existe
     **/
    public function devolverConfiguracion($identidad = null)
    {
        $identidad = (is_null($identidad) || $identidad == 0) ? $this->global->Estructura->idestructura : $identidad;

        $selectAlmacen = "cfg.usarcategoria as categoriaproducto, cfg.comprobante as comprobante"
        . ",1 as formatoproducto,1 as sobrante, 1 as faltante";

        $datosCfg = Doctrine_Query::create()
            ->select(
                "cfg.idestructuracomun,
                 cfg.usarcategoria,
                 cfg.usarubicacion,
                 cfg.comprobante,
                 cfg.firmadigital,
                 cfg.contintegrada,
                 cfg.farmaciaintegrada,
                 cfg.almacen,
                 cfg.idtipotasa as idtipotasa,
                 cfg.idpadre as idpadre,
                 cfg.registrarcantidad,
                 cfg.coddenominacion,
                 cfg.tarjeta,
                 cfg.cuadrediario,
                 cfg.ordenproducto,
                 ext.minimo as minimo,
                 ext.fondofijo as fondofijo,
                 ext.reserva as reserva,
                 ext.normabast as normabast,
                 ext.minarea as minarea,
                 ext.ptoreposicion as ptoreposicion,
                 ext.diaconsignado as diaconsignado,
                 ext.diaminvencido as diaminvencido,
                 ext.diamintarjeta as diamintarjeta,
                 ext.diaproxvencer as diaproxvencer,
                 ext.lotevencido as lotevencido"
            )
            ->addSelect($selectAlmacen)
            ->from('ConfInventario cfg')
            ->innerJoin('cfg.ConfInventarioExt ext')
            ->where('cfg.idestructuracomun = ?', array($identidad))
            ->fetchArray();
        $datosCfg[0]['idestructuracomun'] = $identidad;
        return $datosCfg[0] ? $datosCfg[0] : array();
    }

}
