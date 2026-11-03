<?php

class NomProgramalaboral extends BaseNomProgramalaboral
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatSituacionlaboral', array('local' => 'idprogramalaboral', 'foreign' => 'idprogramalaboral'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtalla
     *
     * @return Doctrine_Record
     */
    public function getById($idprogramalab)
    {
        return Doctrine::getTable('NomProgramalaboral')->find($idprogramalab);
    }
    
    public function getProgramasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('NomProgramalaboral m')
            ->where('m.fdesde <= now() and (now() <= m.fhasta or m.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getProgramas($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('NomProgramalaboral m')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantProgramas($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idprogramalaboral')
            ->from('NomProgramalaboral m');
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denom)
    {
        $denom = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('NomProgramalaboral m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denom'))");
        return $queryObj->fetchArray();
    }

    public function getProgramaconstructivoxidsituacion($idsituacionlaboral)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'd.idprogramalaboral,
            d.denominacion,
            s.idsituacionlaboralp as idsituacionlaboralp'
        )
            ->from('NomProgramaconstructivo d')
             ->leftJoin('d.DatSituacionlaboral s')
            ->where("s.idsituacionlaboralp = $idsituacionlaboral");
        return $result->fetchArray();
    }
}

