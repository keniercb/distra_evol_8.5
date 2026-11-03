<?php

class DatAccidentecausa extends BaseDatAccidentecausa
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatAccidente', array('local' => 'idaccidente', 'foreign' => 'idaccidente'));
        $this->hasOne('NomCausaaccidente', array('local' => 'idcausaaccidente', 'foreign' => 'idcausaaccidente'));
    }

    public function getById($idaccidentecausa)
    {
        return Doctrine::getTable('DatAccidentecausa')->find($idaccidentecausa);
    }

    public function getCausas($idaccidente, $filtro, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*, ca.denominacion as denominacion')
            ->from('DatAccidentecausa m')
            ->innerJoin('m.NomCausaaccidente ca')
            ->where("m.idaccidente = '$idaccidente'");
        if ($filtro) {
            $queryObj->addWhere("ca.denominacion ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantCausas($idaccidente, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidentecausa m')
            ->innerJoin('m.NomCausaaccidente ca')
            ->where("m.idaccidente = '$idaccidente'");
        if ($filtro) {
            $queryObj->addWhere("ca.denominacion ilike '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeCausa($idaccidente, $idcausaaccidente)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidentecausa m')
            ->where("m.idaccidente = '$idaccidente' and m.idcausaaccidente = '$idcausaaccidente'");
        return $queryObj->fetchArray();
    }

    public function getCantAccidentes($idestructura)
    {
        $idestructura = -1;
        if ($idestructura == '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }
        $sql = "select cantidad, denominacion,padre, (select denominacion as padre from mod_sstaccidente.nom_causaaccidente where idpadre = padre limit 1)  from (
         select 
         count(ac.idcausaaccidente) as cantidad,
         nc.denominacion,
         nc.idpadre as padre
         FROM mod_sstaccidente.dat_accidente acci
        inner join  mod_sstaccidente.dat_accidentecausa ac on(acci.idaccidente=ac.idaccidente)
        inner JOIN mod_sstaccidente.nom_causaaccidente nc on (ac.idcausaaccidente = nc.idcausaaccidente)
        where acci.identidad=$idestructura
         GROUP BY ac.idcausaaccidente, nc.denominacion, padre
        ) as tabla";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }




}