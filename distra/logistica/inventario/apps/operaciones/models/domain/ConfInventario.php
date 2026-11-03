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
        $con = DoctrineManager::connection();

        try {
            $con->beingTransaction();
                $datosCfg = Doctrine_Query::create()
                    ->select(
                        "cfg.idestructuracomun,
                     cfg.usarcategoria,
                     cfg.usarubicacion,
                     cfg.comprobante,
                     cfg.firmadigital,
                     cfg.contintegrada,
                     cfg.almacen,
                     cfg.idtipotasa as idtipotasa,
                     cfg.idpadre as idpadre,
                     cfg.registrarcantidad,
                     cfg.coddenominacion"
                    )
                    ->addSelect($selectAlmacen)
                    ->from('ConfInventario cfg')
                    ->where('cfg.idestructuracomun = ?', array($identidad))
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
                $datosCfg[0]['idestructuracomun'] = $identidad;
                return $datosCfg[0] ? $datosCfg[0] : array();
            $con->commit();
        } catch (Exception $e){
            $con->rollback();
        }
    }

}
