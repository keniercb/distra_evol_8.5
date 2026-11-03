<?php

class NomFacultadestudio extends BaseNomFacultadestudio
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomCentroestudio', array('local' => 'idcentroestudio', 'foreign' => 'idcentroestudio'));
        $this->hasMany('DatEducacion', array('local' => 'idfacultadestudio', 'foreign' => 'idfacultadestudio'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idfacultadestudio
     *
     * @return Doctrine_Record
     */
    public function getById($idfacultadestudio)
    {
        return Doctrine::getTable('NomFacultadestudio')->find($idfacultadestudio);
    }

    /**
     * Funcion para obtener los FacultyOfStudy
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getFacultyOfStudyActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idfacultadestudio,idfacultadestudio as idnomenclador, denominacion, fdesde, abreviatura,
                fhasta, descripcion'
            )->from('NomFacultadestudio')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
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
     * Funcion para obtener la cantidad de FacultyOfStudy
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantFacultyOfStudyActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomFacultadestudio')->where(
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
     * Funcion para maodificar FacultyOfStudy
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modFacultyOfStudy($idfacultadestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomFacultadestudio')->where(
                'idfacultadestudio= ? ', $idfacultadestudio
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
     * Funcion para verificar si existe FacultyOfStudy
     *
     * @param $denom
     * @param $idfacultadestudio
     */
    public function findByIdOrDenom($denom, $idfacultadestudio)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomFacultadestudio')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idfacultadestudio)) {
                $query->andWhere("idfacultadestudio <> ?", $idfacultadestudio);
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

    public function findByIdOrDenomadd($denom, $idfacultadestudio = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomFacultadestudio')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idfacultadestudio <> ?", $idfacultadestudio);
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

