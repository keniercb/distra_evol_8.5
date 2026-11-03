<?php

class DatEvalprocesoevaluadores extends BaseDatEvalprocesoevaluadores {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatEvalprocesocomisionevaluacion', array('local' => 'idprocesocomisionevaluacion', 'foreign' => 'idprocesocomisionevaluacion'));
        $this->hasOne('DatEvalpreprocesoevaluativo', array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo'));
        $this->hasMany('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasMany('DatPermisoevaluacion', array('local' => 'idprocesoevaluadores', 'foreign' => 'idevaluador'));
    }

    public function Buscar($idprocesoevaluadores) {
        $temp = $this->conn->getTable('DatEvalprocesoevaluadores')->find($idprocesoevaluadores);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluadores')->execute();
        return $result->toArray();
    }

    public function getTodosDadaComisionProceso($idcomision) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluadores edores')->where('edores.idprocesocomisionevaluacion = ?', $idcomision)->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0, $idcomision) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluadores edores')->where('edores.idprocesocomisionevaluacion = ?', $idcomision)->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function CantTotal($idcomision) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluadores edores')->where('edores.idprocesocomisionevaluacion = ?', $idcomision)->execute();
        return count($result->toArray());
    }

    public function cantTotalProcesoComision($idpreprocesoevaluativo, $idprocesocomisionevaluacion) {
        $query = new Doctrine_Query ();
        $result = null;
        if ($idprocesocomisionevaluacion != -1) {
            $result = $query->select('pe.idprocesoevaluadores')
                    ->from('DatEvalprocesoevaluadores pe')
                    ->where("pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and pe.idprocesocomisionevaluacion = {$idprocesocomisionevaluacion}")
                    ->count();
        } else {
            $result = $query->select('pe.idprocesoevaluadores')
                    ->from('DatEvalprocesoevaluadores pe')
                    ->where("pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and pe.idprocesocomisionevaluacion is null")
                    ->count();
        }
        return $result;
    }

    public function getIdEvaluadorProceso($idpersona, $idpreprocesoevaluativo) {
        $query = new Doctrine_Query ();
        $result = $query->select('pe.idprocesoevaluadores')
                ->from('DatEvalprocesoevaluadores pe')
                ->where("pe.idpersona = {$idpersona} and pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
                ->execute();
        return $result->toArray();
    }

    public function getEvaluadoresPorComision($idcomisionevaluacion) {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT pe.idpersona 
			FROM mod_evaluaciones.dat_evalprocesoevaluadores pe
			INNER JOIN mod_evaluaciones.dat_evalprocesocomisionevaluacion pce ON(pe.idprocesocomisionevaluacion = pce.idprocesocomisionevaluacion)
			WHERE pce.idcomisionevaluacion = {$idcomisionevaluacion}";
        return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEvaluadores($idpreprocesoevaluativo, $idprocesocomisionevaluacion = null, $limit = null, $start = null, $filtro = null) {
        $queryObj = Doctrine_Query::create()
                ->select("e.idprocesoevaluadores, (p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname")
                ->from('DatEvalprocesoevaluadores e')
                ->where("e.idpreprocesoevaluativo ={$idpreprocesoevaluativo}");

        if (empty($idprocesocomisionevaluacion)) {
            $queryObj->addWhere('e.idprocesocomisionevaluacion is null');
        } else {
            $queryObj->addWhere("e.idprocesocomisionevaluacion = {$idprocesocomisionevaluacion}");
        }

        if (!empty($filtro)) {
            $queryObj->addWhere("p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'");
        }

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'e', 'p', true);
        if ($limit) {
            $queryObj->limit($limit)->offset($start);
        }
        return $queryObj->fetchArray();
    }
    public function getCantEvaluadores($idpreprocesoevaluativo, $idprocesocomisionevaluacion = null, $filtro = null) {
        $queryObj = Doctrine_Query::create()
                ->select('COUNT(e.idprocesoevaluadores) AS cantidad')
                ->from('DatEvalprocesoevaluadores e')
                ->where("e.idpreprocesoevaluativo ={$idpreprocesoevaluativo}");

        if (empty($idprocesocomisionevaluacion)) {
            $queryObj->addWhere('e.idprocesocomisionevaluacion is null');
        } else {
            $queryObj->addWhere("e.idprocesocomisionevaluacion = {$idprocesocomisionevaluacion}");
        }

        if (!empty($filtro)) {
            $queryObj->addWhere("p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'");
        }

        //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'e', 'p', false);

        return $queryObj->fetchOne()->cantidad;
    }

}