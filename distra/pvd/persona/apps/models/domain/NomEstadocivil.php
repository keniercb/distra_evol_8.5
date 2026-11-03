<?php

class NomEstadocivil extends BaseNomEstadocivil
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatCaracteristicasocial', array('local' => 'idestadocivil', 'foreign' => 'idestadocivil'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $descripcion
     *
     * @return Doctrine_Record
     */
    public function getById($descripcion)
    {
        return Doctrine::getTable('NomEstadocivil')->find($descripcion);
    }

    /**
     * Funcion para obtener los tipos estado civil activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveMaritalStatus($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idestadocivil,idestadocivil as idnomenclador,denominacion,fdesde,fhasta,
                descripcion, abreviatura'
            )->from('NomEstadocivil')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }  else {
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
     * Funcion para obtener la cantidad estado civil activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveMaritalStatus($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomEstadocivil')->where(
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
     * Funcion para modifcar el tipo de prenda
     *
     * @param type $idestadocivil
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modMaritalStatus($idestadocivil, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomEstadocivil')->where('idestadocivil= ? ', $idestadocivil);
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
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para verificar si existe estado civil
     *
     * @param $denom
     * @param $idestadocivil
     */
    public function findByIdOrDenom($denom, $idestadocivil)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadocivil')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idestadocivil)) {
                $query->andWhere("idestadocivil <> ?", $idestadocivil);
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

    public function findByIdOrDenomadd($denom, $idestadocivil = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadocivil')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idestadocivil)) {
                $query->andWhere("idestadocivil <> ?", $idestadocivil);
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

