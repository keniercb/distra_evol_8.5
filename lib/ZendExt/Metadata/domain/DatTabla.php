<?php

class DatTabla extends BaseDatTabla
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCampo', array('local' => 'idtabla', 'foreign' => 'idtabla'));
        $this->hasOne('NomPrefijo', array('local' => 'idprefijo', 'foreign' => 'idprefijo'));
    }

    public static function existeTabla($esquema, $tabla)
    {
        $q = Doctrine_Query :: create();
        return $q->select('t.idtabla, t.importada')
                ->from('DatTabla t')
                ->where('t.esquema = ? AND t.tabla = ?', array($esquema, $tabla))
                ->execute()
                ->getFirst();
    }

    function obtenerTablasDestinoDe($idtable)
    {
        $q = Doctrine_Query :: create();
        return $q->select('d.idcampo, r.campodestino, t.idtabla')
                ->from('DatRelacion r')
                ->innerJoin('r.Destino d')
                ->innerJoin('r.Origen o')
                ->innerJoin('d.DatTabla t')
                ->innerJoin('o.DatTabla to')
                ->where('to.idtabla = ?', array($idtable))
                ->execute()
                ->toArray(true);
    }

    function cargarTablas($limit, $start)
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatTabla t')->offset($start)->limit($limit)->execute()->toArray();
    }

    function cargarcmbTablas()
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatTabla t')->execute()->toArray();
    }

    function obtenerTablasDadoEsquema($esquema)
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatTabla t')->where('t.esquema = ?', $esquema)->execute()->toArray();
    }

    function cargarNomencladores($limit = '', $start = '', $denomTabla = '')
    {
        $q = Doctrine_Query :: create();
        if ($limit && $start) {
            $q->offset($start)->limit($limit);
        }
        $where = 't.importada != 1 AND t.idprefijo = 2';
        if ($denomTabla != '')
            $where .= " AND t.alias ilike '%".$denomTabla."%'";

        return $q->select(
                't.idtabla as id, t.idtabla, t.tabla, t.alias as text, t.alias, t.arbol as tree, true as leaf'
            )->from('DatTabla t')->where($where)->setHydrationMode(
                Doctrine :: HYDRATE_ARRAY
            )->execute();
    }

    function contarTablas($condition = '')
    {
        $q = Doctrine_Query :: create();
        if ($condition) {
            $q->addWhere($condition);
        }
        return $q->select('COUNT(idtabla) as total')->from('DatTabla t')->execute()->getFirst()->total;
    }

    function buscarEnTablas($query, $limit, $start)
    {
        $q = Doctrine_Query :: create();
        $comun = $q->from('DatTabla t')
            ->where('t.esquema LIKE ? OR t.tabla LIKE ? OR t.alias LIKE ?', array($query, $query, $query));
        $data = new stdClass();
        $data->total = count($comun->execute()->toArray());
        $data->data = $comun->limit($limit)
                ->offset($start)
                ->execute()->toArray();
        return $data;
    }

    function cargarPrefijos()
    {
        $q = Doctrine_Query :: create();
        return $q->from('NomPrefijo t')->execute()->toArray();
    }

    public function obtenerPrefijoDadoUri($uri)
    {
        $q = Doctrine_Query :: create();
        return $q->from('NomPrefijo t')->where('uriprefijo = ?', $uri)->execute()->getFirst();
    }

    public function obtenerTablasNomencladas()
    {
        $q = Doctrine_Query :: create();
        return $q->from('DatTabla t')->where("t.idprefijo = 3 OR (t.importada = 1 AND t.tabla LIKE 'nom_%')")
                ->execute()
                ->toArray();
    }

}
