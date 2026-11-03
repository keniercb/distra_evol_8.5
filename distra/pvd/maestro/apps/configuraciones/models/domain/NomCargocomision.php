<?php
/**
 * @name NomCargocomision - Clase del dominio para el "Cargo para comisiones".
 * @extends BaseNomCargocomision
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 20/10/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

class NomCargocomision extends BaseNomCargocomision
{
    /**
     * @function setUp Función para establecer las relaciones a nivel de datos
     * @author Ing. Orestes Rodríguez Lorenzo
     * @date 20/10/2017
     */
    public function setUp()
    {
        parent::setUp();
        //$this->hasMany('DatComision', array('local' => 'idcargocomision', 'foreign' => 'idcargocomision'));
    }
    
    public function getById($idcargocomision)
    {
        return Doctrine::getTable('NomCargocomision')->find($idcargocomision);
    }

    public function getCargosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*, c.denominacion as cargocomision')
            ->from('NomCargocomision c')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        return $queryObj->fetchArray();
    }
    
    public function getCargos($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('cc.*, (CASE WHEN cc.fhasta < now() OR cc.fdesde > now() THEN 0 ELSE 1 END) AS activo')
            ->from('NomCargocomision cc')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("cc.denominacion ILIKE '%$filtro%' OR cc.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantCargos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('cc.idcargocomision')
            ->from('NomCargocomision cc');
        if ($filtro) {
            $queryObj->addWhere("cc.denominacion ILIKE '%$filtro%' OR cc.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('cc.denominacion')
            ->from('NomCargocomision cc')
            ->where("UPPER(TRIM(cc.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}
