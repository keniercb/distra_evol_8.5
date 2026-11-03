<?php

/**
 * Class NomCurso
 */
class NomCurso extends BaseNomCurso
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
     * @params $idcurso
     *
     * @return Doctrine_Record
     */
    public function getById($idcurso)
    {
        return Doctrine::getTable('NomCurso')->find($idcurso);
    }

    /**
     * Funcion para obtener los tipos de cursos activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCursoActive($filtro = null, $limit = null, $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('*,denominacion as curso,idcurso as idnomenclador')
                ->from('NomCurso')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if($value){
                $query->limit(500)->offset(0);

            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
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
     * Funcion para obtener la cantidad de tipos de cursos activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantCursoActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCurso')->where(
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
     * Funcion para modifcar el tipo de cursos
     *
     * @param type $idasignacion
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modCurso($idcurso, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomCurso')->where('idcurso= ? ', $idcurso);
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
     * Funcion para verificar si existe el tipo de curso
     *
     * @param $denom
     * @param $idcurso
     */
    public function findByIdOrDenom($denom, $idcolorojos)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCurso')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idcurso <> ?", $idcolorojos);
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

    public function findByIdOrDenomadd($denom, $idcolorojos = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCurso')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idcurso <> ?", $idcolorojos);
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