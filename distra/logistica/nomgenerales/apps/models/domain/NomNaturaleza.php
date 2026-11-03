<?php

class NomNaturaleza extends BaseNomNaturaleza
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne('NomIndicador', array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
        $this->hasOne('NomNaturaleza', array('local' => 'idnaturaleza', 'foreign' => 'idpadre'));
        //$this->hasMany ('NomTipoareatipoproducto', array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
    }

    public function getNaturalezaPorIdPadre($post)
    {
        $query = new Doctrine_Query();


        $query->select("idnaturaleza as id, denominacion as text, (COALESCE(codigo,'') ||' '|| COALESCE(denominacion,'')) as codigo, idpadre, (Case When ((ordender - ordenizq) = 1)"
                ." Then true Else false End) as leaf")
            ->from('NomNaturaleza');
        if($post['idnaturaleza']){
            $query->addWhere('idnaturaleza = ?', array($post['idnaturaleza']));
        }
        if($post['dql']) {
            return $query;
        } 
        $query->where('estado = 1');

        if ($post['incluirvencidas'] != 2) {//1 es false, 2 true
            $fechacontable = date('d/m/Y');
            $query->addWhere("fechainicio <= '{$fechacontable}' ");
            $query->addWhere("fechafin >= '{$fechacontable}' or fechafin is null");
        }

        if ($post['node'] == 0) {
            $query->addWhere('idnaturaleza = idpadre');
        } else {
            $query->addWhere('idpadre = ? and idnaturaleza <> idpadre', array($post['node']));
        }
        return $query->fetchArray();
    }

    public function getNaturalezas($query)
    {
        if(!$query)
            $query = new Doctrine_Query();

        $query->select('idnaturaleza, denominacion')->from('NomNaturaleza');
        return $query->fetchArray();
    }

    /**
     * Funcion para obtener la consulta de NomNaturaleza como tabla root
     * @author Kenier Cumba Bueno
     * @date 09/08/2013
     */
    public function getQueryAsRootTable($query, $alias)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        return $query->from("NomNaturaleza {$alias}")->select("{$alias}.idnaturaleza, {$alias}.denominacion");
    }

    public function getNaturalezasAsociadasIndicadores($start = false, $limit = false, $filtro = false,
        $parametros = false)
    {
        $query = new Doctrine_Query();
        $query->distinct()->select('n.idnaturaleza, n.denominacion as denominacion')
            ->from('NomNaturaleza n')
            ->innerJoin('n.NomIndicador i')
            ->innerJoin('i.NomIndicadorhoja ih');
        if ($filtro) {
            $query->addWhere($filtro);
        }

        if ($parametros->denominacion) {
            $query->addWhere("n.denominacion iLIKE  '%$parametros->denominacion%'");
        }
        $dnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        
        if ($parametros->tipo == 1) {
            $query->andWhereIn("n.idnaturaleza", array($dnatObjObra, $idnatINMUEBLE, $idnatActivos));
        } else {
            $query->andWhereNotIn("n.idnaturaleza", array($dnatObjObra, $idnatINMUEBLE, $idnatActivos));
        }
        $result['cantidad'] = $query->count();
        if (!$start && !$limit) {
            $limit = 30;
            $start = 0;
        }
        $query->limit($limit);
        $query->offset($start);
        $result['data'] = $query->fetchArray();
        return $result;
    }

}
