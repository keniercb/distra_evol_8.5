<?php

class NomGradoescolaridad extends BaseNomGradoescolaridad
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
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomGradoescolaridad')->find($fhasta);
    }

    /**
     * Funcion para obtener los GradeScholarship
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getGradeScholarshipActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idgradoescolaridad,idgradoescolaridad as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomGradoescolaridad')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            else {
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
     * Funcion para obtener la cantidad de GradeScholarship
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantGradeScholarshipActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomGradoescolaridad')->where(
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
     * Funcion para maodificar GradeScholarship
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modGradeScholarship($idgradoescolaridad, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomGradoescolaridad')->where(
                'idgradoescolaridad= ? ', $idgradoescolaridad
            );
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
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
     * Funcion para verificar si existe GradeScholarship
     *
     * @param $denom
     * @param $idgradoescolaridad
     */
    public function findByIdOrDenom($denom, $idgradoescolaridad = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomGradoescolaridad')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere(
                    "denominacion ilike '$denom'"
                );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idgradoescolaridad <> ?", $idgradoescolaridad);
//            }
            $idgradoescolaridad = null;
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

