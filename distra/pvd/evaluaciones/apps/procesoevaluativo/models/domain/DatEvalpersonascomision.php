<?php

class DatEvalpersonascomision extends BaseDatEvalpersonascomision
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEvalcomisionevaluacion', array('local' => 'idcomisionevaluacion', 'foreign' => 'idcomisionevaluacion'));
    }

    public function Buscar($idlpersonascomision)
    {
        $temp = $this->conn->getTable('DatEvalpersonascomision')->find($idlpersonascomision);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalpersonascomision')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($idcomisionevaluacion, $limit, $start)
    {
        $queryObj = Doctrine_Query::create()
            ->select('pc.idlpersonascomision')
            ->from('DatEvalpersonascomision pc')
            ->where('pc.idcomisionevaluacion = ?', $idcomisionevaluacion)
            ->orderBy('pc.idlpersonascomision DESC')
            ->limit($limit)
            ->offset($start);
        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pc', 'p', true);
        return $queryObj->fetchArray();
    }

    public function CantTotal($idcomisionevaluacion)
    {
        $queryObj = Doctrine_Query::create()
            ->select('count(pc.idlpersonascomision)')
            ->from('DatEvalpersonascomision pc')
            ->where('pc.idcomisionevaluacion = ?', $idcomisionevaluacion);
        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pc', 'p', false);
        return $queryObj->fetchArray();
    }

    public function getPersonasXComision($idcomisionevaluacion)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalpersonascomision d')
            ->where('d.idcomisionevaluacion = ?', $idcomisionevaluacion)
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimitePersonaComision($idcomisionevaluacion, $limit, $start, $filtro)
    {
       /* $queryObj = Doctrine_Query::create()
            ->select('pc.idlpersonascomision')
            ->from('DatEvalpersonascomision pc')
            ->where('pc.idcomisionevaluacion = ?', $idcomisionevaluacion)
            ->orderBy('pc.idlpersonascomision DESC')
            ->limit($limit)
            ->offset($start);
        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'pc', 'p', true, array());
        if ($filtro) {
            $queryObj->addWhere("p.nombre ilike '%$filtro%'
                              or p.papel ilike '%$filtro%'
                              or p.numid ilike '%$filtro%'
                              or p.sapel ilike '%$filtro%'");
        }
        return $queryObj->fetchArray();*/

        $sql = "SELECT pc.idlpersonascomision,p.nombre,p.snombre,p.papel,p.sapel
                from mod_evaluaciones.dat_evalpersonascomision pc
                LEFT JOIN mod_persona.dat_persona p
                     ON (pc.idpersona = p.idpersona)
                WHERE pc.idcomisionevaluacion = {$idcomisionevaluacion} AND (p.nombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%')
                ORDER BY pc.idlpersonascomision DESC
                LIMIT {$limit}
                OFFSET {$start}
                ";


        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        return $result;
    }

    public function CantTotalporPersonaComision($idcomisionevaluacion, $filtro)
    {
        $sql = "SELECT COUNT(pc.idlpersonascomision)
                from mod_evaluaciones.dat_evalpersonascomision pc
                LEFT JOIN mod_persona.dat_persona p
                     ON (pc.idpersona = p.idpersona)
                WHERE pc.idcomisionevaluacion = {$idcomisionevaluacion} AND (p.nombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%')
                ";

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        return $result;

    }

}

//fin clase 
?>


