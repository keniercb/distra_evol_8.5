<?php
/**
 * @name ComisionService - Clase de servicios para las comisiones.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ComisionService extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerComisiones - Servicio que obtiene las comisiones.
     * @return Array - Arreglo de datos de las comisiones.
     * @author Yaricel Guerra Velazquez.
     */
    public function obtenerComisiones($iddominio)
    {
        $arr_res = Array();
        $arr_res = DatComision::getComisionesActivas($iddominio);
        return  $arr_res;
    }

    /**
     * @method obtenerMiembrosPorComision - Servicio que obtiene los miembros dado idcomision.
     * @return Array - Arreglo de datos de los miembros de la comisión.
     * @author Yaricel Guerra Velazquez.
     */
    public function obtenerMiembrosPorComision($idcomision, $filtro, $start, $limit)
    {
        $arr_res = Array();
        $arr_res = DatComisionmiembroModel::getMiembrosByidcomision($idcomision, $filtro, $start, $limit);
        return  $arr_res;
    }

}