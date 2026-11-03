<?php
class DatAccionn extends BaseDatAccionn
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomModoformacion',
            array('local' => 'idmodoformacion', 'foreign' => 'idmodoformacion')
        );
        $this->hasOne(
            'NomTipoaccion',
            array('local' => 'idtipoaccion', 'foreign' => 'idtipoaccion')
        );
        $this->hasMany(
            'DatAccioncurso',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasMany(
            'DatAccionparticipante',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasMany(
            'DatAccionnecesidad',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasMany(
            'DatAccionaseguramiento',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    public function getById($idaccion)
    {
        return Doctrine::getTable('DatAccionn')->find($idaccion);
    }

    public function getAcciones($estructuras, $denom, $desde, $hasta, $start, $limit)
    {
        try {
            $select
                = "dd.*, mf.denominacion as modoformacion";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn dd')
                ->innerJoin('dd.NomModoformacion mf')
                ->whereIn("dd.idestructura", $estructuras);
            if (!empty($denom)) {
                $query->addWhere("dd.denominacion ILIKE '%$denom%' OR mf.denominacion ILIKE '%$denom%'");
            }
            if (!empty($desde) && !empty($hasta)) {
                $query->addWhere(
                    "(dd.fdesde >= '$desde' AND dd.fhasta <= '$hasta') 
                    OR (dd.frdesde >= '$desde' AND dd.frhasta <= '$hasta')"
                );
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantAcciones($estructuras, $denom, $desde, $hasta)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn dd')
                ->innerJoin('dd.NomModoformacion mf')
                ->whereIn("dd.idestructura", $estructuras);
            if (!empty($denom)) {
                $query->addWhere("dd.denominacion ILIKE '%$denom%' OR mf.denominacion ILIKE '%$denom%'");
            }
            if (!empty($desde) && !empty($hasta)) {
                $query->addWhere(
                    "(dd.fdesde >= '$desde' AND dd.fhasta <= '$hasta') 
                    OR (dd.frdesde >= '$desde' AND dd.frhasta <= '$hasta')"
                );
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAccionesCursosByFechaEstructura($estructuras, $desde, $hasta)
    {
        try {
            $select
                = "dd.*, ac.*, nc.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn dd')
                ->leftJoin('dd.DatAccioncurso ac')
                ->leftJoin('ac.NomCurso nc')
                ->whereIn("dd.idestructura", $estructuras);
            if (!empty($desde) && !empty($hasta)) {
                $query->addWhere("(dd.fdesde >= '$desde' AND dd.fhasta <= '$hasta') OR (dd.frdesde >= '$desde' AND dd.frhasta <= '$hasta')");
            }
            $query->orderBy('dd.idestructura');
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $denominacion
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function existe($denominacion)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn dd')
                ->where("UPPER(TRIM(dd.denominacion)) = UPPER(TRIM('$denominacion'))");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}