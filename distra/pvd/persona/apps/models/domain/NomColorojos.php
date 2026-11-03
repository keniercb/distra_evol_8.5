<?php

/**
 * Clase del dominio del nomenclador color de ojos
 * Class NomColorojos
 */
class NomColorojos extends BaseNomColorojos
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatFenotipo', array('local' => 'idcolorojos', 'foreign' => 'idcolorojos'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcolorojos
     *
     * @return Doctrine_Record
     */
    public function getById($idcolorojos)
    {
        return Doctrine::getTable('NomColorojos')->find($idcolorojos);
    }

    /**
     * Funcion para obtener los colores de ojos activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getColorActiveEyes($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idcolorojos,idcolorojos as idnomenclador,denominacion,fdesde,fhasta,
                descripcion, gestion, abreviatura'
            )->from('NomColorojos')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad de colores de ojos activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantColorActiveEyes($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomColorojos')->where(
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
     * Funcion para modifcar el tipo de color de ojo
     *
     * @param type $idcolorojos
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modEyecolor($idcolorojos, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomColorojos')->where('idcolorojos= ? ', $idcolorojos);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($abr != '') {
                $query->set('abreviatura', '?', $abr);
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
     * Funcion para verificar si existe el color
     *
     * @param $denom
     * @param $idcolorojos
     */
    public function findByIdOrDenom($denom, $idcolorojos)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorojos')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idcolorojos <> ?", $idcolorojos);
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
            $query->from('NomColorojos')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idcolorojos <> ?", $idcolorojos);
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
