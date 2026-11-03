<?php

/**
 * @package    Logística
 * @subpackage Útiles
 * @author     Jorge Luis Cuellar Mondeja
 * @version    5.0-0
 */
class NomgeneralesService
{

    /**
     * Devuelve todos los tipos de producto insertados
     *
     * @param stClass $parametros       parametros para filtrar
     * @param array   $arrIdsInsertados arreglo de ids de tipo de producto
     *                                  para que no los muestre en la busqueda
     *
     * @return array
     */
    public function getTiposProducto($parametros, $arrIdsInsertados)
    {
        return NomTipoproductoModel::CargarTipoProducto(
            $parametros,
            $arrIdsInsertados
        );
    }

    /**
     * Devuelve todos los grupos de productos insertados
     *
     * @param stClass $parametros       parametros para filtrar
     * @param array   $arrIdsInsertados arreglo de ids de tipo de producto
     *                                  para que no los muestre en la busqueda
     *
     * @return array
     */
    public function getGruposProducto($parametros, $arrIdsInsertados)
    {
        return GestNomgrupoModel::CargarGrupo($parametros, $arrIdsInsertados);
    }

    /**
     * Devuelve la cantidad de grupos de productos insertados
     *
     * @param stClass $parametros       parametros para filtrar
     * @param array   $arrIdsInsertados arreglo de ids de tipo de
     *                                  producto para que no los muestre en la
     *                                  busqueda
     *
     * @return array
     */
    public function getCantGruposProducto($parametros, $arrIdsInsertados)
    {
        return GestNomgrupoModel::CantidadGrupo($parametros, $arrIdsInsertados);
    }

    /**
     * Devuelve los tipos de control que existen por tipo de producto
     *
     * @param stClass $parametros parametros para filtrar
     * @param numeric $idtipoproducto
     *
     * @return array
     */
    public function getTipoControlProducto($parametros, $idtipoproducto)
    {
        return NomTipocontrolModel::GetTiposControl(
            $parametros, $idtipoproducto
        );
    }

}
