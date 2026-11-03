<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 15/03/19
 * Time: 13:20
 */
class DatInterrupcion extends BaseDatInterrupcion
{
    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('NomMotivointerrupcion', array('local' => 'idmotivointerrupcion', 'foreign' => 'idmotivointerrupcion'));
    }

    public function getById($idinterrupcion)
    {
        return Doctrine::getTable('DatInterrupcion')->find($idinterrupcion);
    }

    public function getInterrupciones($filtro, $estructuras, $fdesde, $fhasta, $inicio, $limite)
    {
        $sql = "SELECT i.*, nmi.denominacion as motivo
        FROM mod_fuerzatrabajo.dat_interrupcion AS i
        INNER JOIN mod_ftinterrupto.nom_motivointerrupcion AS nmi
          ON (nmi.idmotivointerrupcion = i.idmotivointerrupcion)";

        if (count($estructuras)>0) {
            $sql .= "WHERE i.idestructura in (".implode(',', $estructuras).")";
        }
        if ($filtro != null) {
            $sql .= " AND nmi.denominacion ilike '%$filtro%'";
        }
        if (!empty($fdesde)) {
            $sql .= " AND i.fdesde >= '$fdesde'";
        }
        if (!empty($fhasta)) {
            $sql .= " AND i.fhasta <= '$fhasta'";
        }
        $sql = $sql." ORDER BY i.fdesde DESC OFFSET $inicio LIMIT $limite";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantInterrupciones($filtro, $estructuras, $fdesde, $fhasta)
    {
        $sql = "SELECT i.*, nmi.denominacion as motivo
        FROM mod_fuerzatrabajo.dat_interrupcion AS i
        INNER JOIN mod_ftinterrupto.nom_motivointerrupcion AS nmi
          ON (nmi.idmotivointerrupcion = i.idmotivointerrupcion)";

        if (count($estructuras) > 0) {
            $sql .= "WHERE i.idestructura in (" . implode(',', $estructuras) . ")";
        }
        if ($filtro != null) {
            $sql .= " AND nmi.denominacion ilike '%$filtro%'";
        }
        if (!empty($fdesde)) {
            $sql .= " AND i.fdesde >= '$fdesde'";
        }
        if (!empty($fhasta)) {
            $sql .= " AND i.fhasta <= '$fhasta'";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function existeInterrupcion($idmotivointerrupcion, $fdesde)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idinterrupcion')
            ->from('DatInterrupcion m')
            ->where("m.idmotivointerrupcion = $idmotivointerrupcion AND m.fdesde = '$fdesde'");
        return $queryObj->fetchArray();
    }

    public function getMotivosInte()
    {
        $sql = "SELECT m.*
        FROM mod_ftinterrupto.nom_motivointerrupcion AS m
        WHERE m.fdesde <= now() and (now() <= m.fhasta or m.fhasta is null)";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getSituaciones()
    {
        $sql = "SELECT m.*
        FROM mod_ftinterrupto.nom_situacionint AS m
        WHERE m.fdesde <= now() and (now() <= m.fhasta or m.fhasta is null)";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCausasnoreubicar()
    {
        $sql = "SELECT m.*
        FROM mod_ftinterrupto.nom_causanoreubicado AS m
        WHERE m.fdesde <= now() and (now() <= m.fhasta or m.fhasta is null)";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}