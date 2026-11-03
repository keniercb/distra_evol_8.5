<?php

class DatCargoorganizacion extends BaseDatCargoorganizacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatAfiliacion', array('local' => 'idafiliacion', 'foreign' => 'idafiliacion'));
        $this->hasOne(
            'NomCargoorganizacion', array('local' => 'idcargoorganizacion', 'foreign' => 'idcargoorganizacion')
        );
        $this->hasOne(
            'NomNivelorganizacion', array('local' => 'idnivelorganizacion', 'foreign' => 'idnivelorganizacion')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcargoorganizacionp
     *
     * @return Doctrine_Record
     */
    public function getById($idcargoorganizacionp)
    {
        $cargosorganiz = $this->reflectArray($idcargoorganizacionp);
        if (count($cargosorganiz) > 0) {
            $query = Doctrine_Query::create()->from('DatCargoorganizacion')->whereIn(
                'idcargoorganizacionp', $cargosorganiz
            );

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
    public function getCargosByOrganizacion(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dco.*, nco.denominacion as denomcargoorganizacion, nno.denominacion as denomnivelorganizacion,
                no.denominacion as denomorganizacion, (CASE
                WHEN dco.fdesde <= now() and (now() <= dco.fhasta or dco.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico"
            )->from('DatCargoorganizacion dco')->innerJoin('dco.DatAfiliacion da')->innerJoin('da.NomOrganizacion no')
                ->innerJoin('dco.NomCargoorganizacion nco')->leftJoin('dco.NomNivelorganizacion nno');
            if (!empty($filtro)) {
                $query->addWhere("nco.denominacion ilike = '%$filtro%'");
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
    public function getCantCargosByOrganizacion(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCargoorganizacion dco')->innerJoin('dco.DatAfiliacion da')
                ->innerJoin('da.NomOrganizacion no')->innerJoin('dco.NomCargoorganizacion nco')
                ->leftJoin('dco.NomNivelorganizacion nno');
            if (!empty($filtro)) {
                $query->addWhere("nco.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('da.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delCargosByOrganizacion(array $id, array $idpersona, array $idafiliacion)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCargoorganizacion dco')->innerJoin('dco.DatAfiliacion da');
            if (count($idpersona) > 0 && count($idafiliacion) > 0) {
                $query->andWhereIn('da.idpersona', $idpersona);
                $query->andWhereIn('dco.idafiliacion', $idafiliacion);
            }

            return (count($id) > 0) ? $query->andWhereIn('dco.idcargoorganizacionp', $id)->execute()->delete() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

