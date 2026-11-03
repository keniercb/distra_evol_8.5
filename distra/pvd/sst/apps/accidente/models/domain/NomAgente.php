<?php
class NomAgente extends BaseNomAgente
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTipoagente', array('local' => 'idtipoagente', 'foreign' => 'idtipoagente'));
    }

    public function getById($idagente)
    {
        return Doctrine::getTable('NomAgente')->find($idagente);
    }

    public function getAgentesbyTipo($idtipoagente, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion, m.idagente, m.idtipoagente, m.fdesde, m.fhasta, m.gestion')
            ->from('NomAgente m')
            ->where('m.fdesde <= now() AND (m.fhasta >= now() OR m.fhasta IS NULL)')
            ->orderBy('m.fdesde ASC');
        if ($idtipoagente) {
            $queryObj->addWhere("m.idtipoagente = '$idtipoagente'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio);
            $queryObj->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantAgentesbyTipo($idtipoagente)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idagente, ta.idtipoagente')
            ->from('NomAgente m')
            ->innerJoin('m.NomTipoagente ta')
            ->where('(ta.fhasta >= now() OR ta.fhasta IS NULL)');
        if ($idtipoagente) {
            $queryObj->addWhere(
                "m.idtipoagente = '$idtipoagente' and (m.fhasta >= now() OR m.fhasta IS NULL) AND m.fdesde >= now()"
            );
        }
        return count($queryObj->fetchArray());
    }

    public function getAgentes($filtro, $idtipoagente, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'm.denominacion,
                m.idagente,
                m.fdesde,
                m.fhasta,
                m.descripcion,
                m.idtipoagente,
                m.gestion,
                ta.denominacion as tipoagente'
            )
            ->from('NomAgente m')
            ->innerJoin('m.NomTipoagente ta')
            //->where('m.fhasta >= now()')
            ->orderBy('m.fdesde DESC')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere(
                "m.denominacion ILIKE '%$filtro%'
                OR m.descripcion ILIKE '%$filtro%'
                OR ta.denominacion ILIKE '%$filtro%'"
            );
        }
        if ($idtipoagente) {
            $queryObj->addWhere("m.idtipoagente = '$idtipoagente'");
        }
        //print_r($queryObj->getSqlQuery());die;
        return $queryObj->fetchArray();
    }

    public function cantAgentes($filtro, $idtipoagente)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idagente')
            ->from('NomAgente m')
            ->innerJoin('m.NomTipoagente ta');
            //->where('m.fhasta >= now()');
        if ($filtro) {
            $queryObj->addWhere(
                "m.denominacion ILIKE '%$filtro%'
                OR m.descripcion ILIKE '%$filtro%'
                OR ta.denominacion ILIKE '%$filtro%'"
            );
        }
        if ($idtipoagente) {
            $queryObj->addWhere("m.idtipoagente = '$idtipoagente'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion, $idtipoagente)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomAgente m')
            ->where("m.idtipoagente='$idtipoagente' AND UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}