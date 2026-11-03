<?php

class NomNiveleducacional extends BaseNomNiveleducacional
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('NomTitulo', array('local' => 'idniveleducacional', 'foreign' => 'idniveleducacional'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idniveleducacional
     *
     * @return Doctrine_Record
     */
    public function getById($idniveleducacional)
    {
        return Doctrine::getTable('NomNiveleducacional')->find($idniveleducacional);
    }

    /**
     * Funcion para obtener los EducationalLevel
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getEducationalLevelActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idniveleducacional,idniveleducacional as idnomenclador, denominacion, fdesde, 
                fhasta, descripcion, abreviatura'
            )->from('NomNiveleducacional')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad de EducationalLevel
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantEducationalLevelActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomNiveleducacional')->where(
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
     * Funcion para maodificar EducationalLevel
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modEducationalLevel($idniveleducacional, $denominacion, $abrev, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomNiveleducacional')->where(
                'idniveleducacional= ? ', $idniveleducacional
            );
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($abrev != '') {
                $query->set('abreviatura', '?', $abrev);
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
     * Funcion para verificar si existe EducationalLevel
     *
     * @param $denom
     * @param $idniveleducacional
     */
    public function findByIdOrDenom($denom, $idniveleducacional)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNiveleducacional')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idniveleducacional)) {
                $query->andWhere("idniveleducacional <> ?", $idniveleducacional);
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

    public function findByIdOrDenomadd($denom, $idniveleducacional = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNiveleducacional')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idniveleducacional <> ?", $idniveleducacional);
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


    public function getNivelByID($idniveleducacional){
        try {
            $query = Doctrine_Query::create()->from('NomNiveleducacional n')->where('n.idniveleducacional= ? ',
                $idniveleducacional
            );
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

}

