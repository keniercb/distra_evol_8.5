<?php

class NomNivelorganizacion extends BaseNomNivelorganizacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatCargoorganizacion', array(
                'local' => 'idnivelorganizacion', 'foreign' => 'idnivelorganizacion')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idnivelorganizacion)
    {
        return Doctrine::getTable('NomNivelorganizacion')->find($idnivelorganizacion);
    }

    /**
     * Funcion para obtener los LevelInOrganization
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getLevelInOrganizationActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idnivelorganizacion,idnivelorganizacion as idnomenclador,' . ' denominacion, fdesde, fhasta,
                 descripcion, abreviatura'
            )->from('NomNivelorganizacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
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
     * Funcion para obtener la cantidad de LevelInOrganization
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantLevelInOrganizationActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomNivelorganizacion')->where(
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
     * Funcion para maodificar LevelInOrganization
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modLevelInOrganization($idnivelorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomNivelorganizacion')->where(
                'idnivelorganizacion= ? ', $idnivelorganizacion
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
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para verificar si existe LevelInOrganization
     *
     * @param $denom
     * @param $idnivelorganizacion
     */
    public function findByIdOrDenom($denom, $idnivelorganizacion)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNivelorganizacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idnivelorganizacion)) {
                $query->andWhere("idnivelorganizacion <> ?", $idnivelorganizacion);
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

    public function findByIdOrDenomadd($denom, $idnivelorganizacion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNivelorganizacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idnivelorganizacion <> ?", $idnivelorganizacion);
//            }
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

