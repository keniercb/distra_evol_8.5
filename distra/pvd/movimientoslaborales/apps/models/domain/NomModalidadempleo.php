<?php

class NomModalidadempleo extends BaseNomModalidadempleo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @return Doctrine_Record
     */
    public function getById($idmodalidadempleo)
    {
        return Doctrine::getTable('NomModalidadempleo')->find($idmodalidadempleo);
    }
    
    public function getModalidadesActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('NomModalidadempleo m')
            ->where('m.fdesde <= now() and (now() <= m.fhasta or m.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getModalidades($filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('NomModalidadempleo m')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ILIKE '%$filtro%' OR m.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantModalidadempleos($filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idmodalidadempleo')
            ->from('NomModalidadempleo m');
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
            ->from('NomModalidadempleo m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denom'))");
        return $queryObj->fetchArray();
    }

}

