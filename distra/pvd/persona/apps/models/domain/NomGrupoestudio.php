<?php

class NomGrupoestudio extends BaseNomGrupoestudio
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
        return Doctrine::getTable('NomGrupoestudio')->find($fhasta);
    }

    /**
     * Funcion para obtener los GroupStudy
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getGroupStudyActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idgrupoestudio,idgrupoestudio as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomGrupoestudio')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
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
     * Funcion para obtener la cantidad de GroupStudy
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantGroupStudyActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomGrupoestudio')->where(
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
     * Funcion para maodificar GroupStudy
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modGroupStudy($idgrupoestudio, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomGrupoestudio')->where('idgrupoestudio= ? ', $idgrupoestudio);
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
     * Funcion para verificar si existe GroupStudy
     *
     * @param $denom
     * @param $idgrupoestudio
     */
    public function findByIdOrDenom($denom, $idgrupoestudio = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomGrupoestudio')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idgrupoestudio <> ?", $idgrupoestudio);
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

