<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 31/05/16
 * Time: 13:39
 */
class ConfIdoneidad extends BaseConfIdoneidad
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($idconfidoneidad)
    {
        $queryObj = Doctrine_Query::create()
            ->from('ConfIdoneidad m')
            ->where("m.idestructura = '$idconfidoneidad'");
        return $queryObj->fetchOne();
    }

    public function getConfig()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura, m.tipo')
            ->from('ConfIdoneidad m');
        return $queryObj->fetchArray();
    }

    public function existeEstructura($idestructura)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfIdoneidad m');
        if (!empty($idestructura)) {
            $queryObj->addWhere("m.idestructura = $idestructura");
        }
        return $queryObj->fetchArray();
    }

    public function deleteByTipo($tipo)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('ConfIdoneidad m')
            ->where("m.tipo = $tipo");
        $queryObj->execute();
    }
}