<?php

class ConfNiveles extends BaseConfNiveles
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfNiveles')->find($id);
    }

    public function getConfig($idpreparacion)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfNiveles m')
            ->where("m.idpreparacion = '$idpreparacion'");
        return $queryObj->fetchArray();
    }

    public function deleteByIdPrep($idpreparacion)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('ConfNiveles m')
            ->where("m.idpreparacion = $idpreparacion");
        $queryObj->execute();
    }

    public function getNivelesEducacionales()
    {
        $sql = "SELECT nne.*
        FROM mod_personaext.nom_niveleducacional AS nne
        WHERE nne.fhasta IS NULL OR nne.fhasta > now()";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getNivelesPrep()
    {
        $sql = "SELECT nne.*
        FROM mod_estructuracomp.nom_preparacion AS nne
        WHERE nne.actual = 1 AND nne.visible = 1";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
