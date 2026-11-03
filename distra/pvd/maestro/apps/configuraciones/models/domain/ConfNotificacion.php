<?php
/**
 * @name ConfNotificacion - Clase del dominio para el componente de configuración "Notificación".
 * @extends BaseConfNotificacion
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 02/11/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

class ConfNotificacion extends BaseConfNotificacion
{
    /**
     * @function setUp Función para establecer las relaciones a nivel de datos
     * @author Ing. Orestes Rodríguez Lorenzo
     * @date 02/11/2017
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerPorId($idnotificacion)
    {
        return Doctrine::getTable('ConfNotificacion')->find($idnotificacion);
    }

    /**
     * @function obtenerConfig Obtiene todas las configuraciones de notificación que están registradas en la tabla.
     * @return mixed Devuelve en un arreglo todos los elementos existentes
     * @author Ing. Orestes Rodríguez Lorenzo
     * @date 02/11/2017
     */
    public function obtenerConfig()
    {
        $objQuery = Doctrine_Query::create()
            ->select('cn.*')
            ->from('ConfNotificacion cn');
        return $objQuery->fetchArray();
    }

    public function obtenerDominio($id) {
        $sql = "SELECT nd.iddominio, nd.denominacion FROM mod_rrhhmaestro.nom_dominio AS nd";
        if(isset($id)){
            $sql .= " WHERE nd.iddominio IN (". implode(',', $id) . ")";
        }
        $dm = Doctrine_Manager::getInstance();
        return $dm->getCurrentConnection()->fetchAll($sql);
    }

    public function obtenerConfigByEntidadDominio($identidad, $iddominio = null)
    {
        $objQuery = Doctrine_Query::create()
            ->select('cn.*')
            ->from('ConfNotificacion cn')
            ->where('cn.identidad = ?', $identidad);
            if($iddominio)
                $objQuery->andWhere('cn.iddominio = ?', $iddominio);
        return $objQuery->fetchArray();
    }
}