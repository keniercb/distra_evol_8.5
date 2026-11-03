<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
class DatProceso extends BaseDatProceso
{
    public function setUp()
    {
        parent::setUp();

    }

    public function getById($idproceso)
    {
        return Doctrine::getTable('DatProceso')->find($idproceso);
    }

    public function getProcesos($estructuras, $query, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('cp.*')
            ->from('DatProceso cp')
            ->whereIn("cp.idestructura", $estructuras)
            ->orderBy('cp.fhasta DESC')
            ->offset($start)
            ->limit($limit);
        if (!empty($query)) {
            $queryObj->addWhere("cp.denominacion ilike '%$query%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantProcesos($estructuras, $query)
    {
        $queryObj = Doctrine_Query::create()
            ->select('cp.*')
            ->from('DatProceso cp')
            ->whereIn("cp.idestructura", $estructuras);
        if (!empty($query)) {
            $queryObj->addWhere("cp.denominacion ilike '%$query%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existe($denominacion)
    {
        try {
            $select = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatProceso dd')
                ->where("UPPER(TRIM(dd.denominacion)) = UPPER(TRIM('$denominacion'))");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getComisiones()
    {
        $sql = "SELECT
				c.*
				FROM mod_rrhhmaestro.dat_comision AS c";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    
    public function getDenomComisiones($idcomision)
    {
        $sql = "SELECT
				c.*
				FROM mod_rrhhmaestro.dat_comision AS c
				WHERE c.idcomision = '$idcomision'";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql)[0]['denominacion'];
    }
}