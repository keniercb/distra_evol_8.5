<?php

class NomCargoorganizacion extends BaseNomCargoorganizacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatCargoorganizacion', array('local' => 'idcargoorganizacion', 'foreign' => 'idcargoorganizacion')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idcargoorganizacion)
    {
        return Doctrine::getTable('NomCargoorganizacion')->find($idcargoorganizacion);
    }

    /**
     * Funcion para obtener los PositionInOrganization
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPositionInOrganizationActive($filtro = null, $limit = null, $start = 0)
    {
        try {

            $query = Doctrine_Query::create()->select(
                'idcargoorganizacion,idcargoorganizacion as idnomenclador, denominacion, fdesde, fhasta,
                 descripcion, abreviatura'
            )->from('NomCargoorganizacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($limit) {
                $query->limit($limit)->offset($start);
            } else {
                $query->limit(15)->offset(0);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de PositionInOrganization
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantPositionInOrganizationActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCargoorganizacion')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para maodificar PositionInOrganization
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modPositionInOrganization($idcargoorganizacion, $denominacion, $abreviatura, $descripcion,
        $fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()->update('NomCargoorganizacion')->where(
            'idcargoorganizacion= ? ', $idcargoorganizacion
        );
        if ($denominacion != '') {
            $query->set('denominacion', '?', $denominacion);
        }
        if ($abreviatura != '') {
            $query->set('abreviatura', '?', $abreviatura);
        } else {
            $query->set('abreviatura', 'null');
        }
        if ($descripcion != '') {
            $query->set('descripcion', '?', $descripcion);
        } else {
            $query->set('descripcion', 'null');
        }
        if ($fdesde != '') {
            $query->set('fdesde', '?', $fdesde);
        }
        if ($fhasta != '') {
            $query->set('fhasta', '?', $fhasta);
        } else {
            $query->set('fhasta', 'null');
        }
        $result = $query->execute();
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Funcion para verificar si existe PositionInOrganization
     *
     * @param $denom
     * @param $idcargoorganizacion
     */
    public function findByIdOrDenom($denom, $idcargoorganizacion)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCargoorganizacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcargoorganizacion)) {
                $query->andWhere("idcargoorganizacion <> ?", $idcargoorganizacion);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function findByIdOrDenomadd($denom, $idcargoorganizacion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCargoorganizacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idcargoorganizacion <> ?", $idcargoorganizacion);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

