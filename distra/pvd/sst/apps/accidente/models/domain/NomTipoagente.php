<?php 
class NomTipoagente extends BaseNomTipoagente
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomAgente', array('local' => 'idtipoagente', 'foreign' => 'idtipoagente'));
    }

    public function getById($idtipoagente)
    {
        return Doctrine::getTable('NomTipoagente')->find($idtipoagente);
    }

    public function getTiposAgenteActive()
    {
        $queryObj = Doctrine_Query::create()
            ->select('p.*')
            ->from('NomTipoagente p')
            ->where('(p.fhasta >= now() OR p.fhasta IS NULL) AND p.fdesde<=now()');
        return $queryObj->fetchArray();
    }

    public function getTiposAgente($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion, m.idtipoagente, m.fdesde, m.fhasta, m.descripcion, m.gestion')
            ->from('NomTipoagente m')
            //->where('(m.fhasta >= now() OR m.fhasta IS NULL) AND m.fdesde<=now()')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantTiposAgente($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idtipoagente')
            ->from('NomTipoagente m');
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomTipoagente m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}