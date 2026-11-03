<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 13:39
 */
class ConfEntidad extends BaseConfEntidad
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($idestructura)
    {
        $queryObj = Doctrine_Query::create()
            ->from('ConfEntidad m')
            ->where("m.idestructura = '$idestructura'");
        return $queryObj->fetchOne();
    }

    public function getConfig()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura, m.identidad')
            ->from('ConfEntidad m');
        return $queryObj->fetchArray();
    }

    public function existeEntidad($idestructura, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfEntidad m');
        if (!empty($idestructura)) {
            $queryObj->addWhere("m.idestructura = $idestructura");
        }
        if (!empty($identidad)) {
            $queryObj->addWhere("m.identidad = $identidad");
        }
        return $queryObj->fetchArray();
    }

    public function existeEntidadByPadre($identidad, $idest)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura')
            ->from('ConfEntidad m')
            ->where("m.idestructura = $idest AND m.identidad = $identidad");
        return $queryObj->fetchArray();
    }

    public function idEntidadByPadre($identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idestructura')
            ->from('ConfEntidad m')
            ->where("m.identidad = $identidad");
        return $queryObj->fetchArray();
    }

    public function deleteByIdPadre($identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('ConfEntidad m')
            ->where("m.identidad = $identidad");
        $queryObj->execute();
    }
}