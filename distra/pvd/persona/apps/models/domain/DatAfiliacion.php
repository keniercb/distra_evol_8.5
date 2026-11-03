<?php

class DatAfiliacion extends BaseDatAfiliacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomOrganizacion', array('local' => 'idorganizacion', 'foreign' => 'idorganizacion'));
        $this->hasMany('DatCargoorganizacion', array('local' => 'idafiliacion', 'foreign' => 'idafiliacion'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param $idafiliacion
     *
     * @return Doctrine_Collection
     */
    public function getById($idafiliacion)
    {
        $afiliaciones = $this->reflectArray($idafiliacion);
        if (count($afiliaciones) > 0) {
            $query = Doctrine_Query::create()->from('DatAfiliacion')->whereIn('idafiliacion', $afiliaciones);

            return $query->execute();
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getAfiliacionesByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "da.*, no.denominacion as denomorganizacion,nto.denominacion as denomtipoorganizacion,
                    nto.idtipoorganizacion as idtipoorganizacion, (CASE
                    WHEN da.fdesde <= now() and (now() <= da.fhasta or da.fhasta is null)
                    THEN 1
                    ELSE 0
                    END) AS historico"
            )->from('DatAfiliacion da')->innerJoin('da.NomOrganizacion no')->innerJoin('no.NomTipoorganizacion nto');
            if (!empty($filtro)) {
                $query->addWhere("no.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('da.idpersona', $idpersona)->execute()->toArray() :
                array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantAfiliacionesByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatAfiliacion da')->innerJoin('da.NomOrganizacion no')->innerJoin(
                'no.NomTipoorganizacion nto'
            );
            if (!empty($filtro)) {
                $query->addWhere("no.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('da.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delAfiliaciones(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatAfiliacion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idafiliacion', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAfiliacionesByPersonayTipo($idpersona, $tipoorganizacion)
    {
        try {
            $query = Doctrine_Query::create()->select("da.*, no.denominacion as denomorganizacion")->from(
                'DatAfiliacion da'
            )->innerJoin('da.NomOrganizacion no')->where(
                "da.idpersona = '$idpersona' and no.idtipoorganizacion = '$tipoorganizacion' AND da.fdesde <= now() AND (da.fhasta >= now() OR da.fhasta IS NULL)"
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

