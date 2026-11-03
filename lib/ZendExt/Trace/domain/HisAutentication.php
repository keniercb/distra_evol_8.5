<?php

class HisAutentication extends BaseHisAutentication
{

    public function setUp()
    {
        $this->hasOne('HisTraza',array('local'=>'idtraza', 'foreign'=>'idtraza'));
    }

    public function cantidad($idestructura, $idtipotraza, $idcategoria, $fechaDesde, $fechaHasta, $campos)
    {
        $valores = array();
        $where = 't.idtipotraza = ?';
        $valores[] = $idtipotraza;
        if (isset($campos->idusuario) && $campos->idusuario) {
            $where .= ' AND t.usuario LIKE ?';
            $valores[] = '%' . $campos->idusuario . '%';
        }
        if (isset($campos->idippc) && $campos->idippc) {
            $where .= ' AND t.ippc LIKE ?';
            $valores[] = '%' . $campos->idippc . '%';
        }
        if ($idcategoria != 0) {
            $where .= ' AND t.idcategoriatraza = ?';
            $valores[] = $idcategoria;
        }
        if ($fechaDesde != 0) {
            $where .= ' AND t.fecha >= ?';
            $valores[] = $fechaDesde;
        }
        if ($fechaHasta != 0) {
            $where .= ' AND t.fecha <= ?';
            $valores[] = $fechaHasta;
        }
        $query = Doctrine_Query::create($this->getConn());
        $result = $query->select('COUNT(t.idtraza) cantidad')
            ->from('HisAutentication t')
            ->where($where, $valores)
            ->execute()
            ->toArray();
        $query->free();
        return $result;
    }

    public function select(
        $idestructura, $idtipotraza, $idcategoria, $fechaDesde, $fechaHasta, $offset, $limit, $campos
    )
    {
        $valores = array();
        $where = 't.idtipotraza = ?';
        $valores[] = $idtipotraza;
        if (isset($campos->idusuario) && $campos->idusuario) {
            $where .= ' AND t.usuario LIKE ?';
            $valores[] = '%' . $campos->idusuario . '%';
        }
        if (isset($campos->idippc) && $campos->idippc) {
            $where .= ' AND t.idippc LIKE ?';
            $valores[] = '%' . $campos->idippc . '%';
        }
        if ($idcategoria != 0) {
            $where .= ' AND t.idcategoriatraza = ?';
            $valores[] = $idcategoria;
        }
        if ($fechaDesde != 0) {
            $where .= ' AND t.fecha >= ?';
            $valores[] = $fechaDesde;
        }
        if ($fechaHasta != 0) {
            $where .= ' AND t.fecha <= ?';
            $valores[] = $fechaHasta;
        }
        $query = Doctrine_Query::create($this->getConn());
        $result = $query->select('t.idtraza, t.fecha, t.hora, t.usuario, t.idestructuracomun, t.ippc')
            ->from('HisAutentication t')
            ->where($where, $valores)
            ->orderBy('t.fecha DESC, t.hora DESC')
            ->offset($offset)
            ->limit($limit)
            ->execute()
            ->toArray();
        $query->free();
        return $result;
    }

}
