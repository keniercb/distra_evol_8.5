<?php

/**
 * * Clase del dominio del nomenclador de color de piel
 * Class NomColorpiel
 */
class NomColorpiel extends BaseNomColorpiel
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatFenotipo', array('local' => 'idcolorpiel', 'foreign' => 'idcolorpiel'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcolorpiel
     *
     * @return Doctrine_Record
     */
    public function getById($idcolorpiel)
    {
        return Doctrine::getTable('NomColorpiel')->find($idcolorpiel);
    }

    /**
     * Funcion para obtener los colores de piel activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getColorActiveSkin($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idcolorpiel,idcolorpiel as idnomenclador,denominacion,fdesde,fhasta,abreviatura,
                descripcion, gestion'
            )->from('NomColorpiel')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad de colores de piel activos activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantColorActiveSkin($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomColorpiel')->where(
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
     * Funcion para maodificar color de piel
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSkincolor($idcolorpiel, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomColorpiel')->where('idcolorpiel= ? ', $idcolorpiel);
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
     * @param $idcolorpiel
     */
    public function findByIdOrDenom($denom, $idcolorpiel)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorpiel')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorpiel)) {
                $query->andWhere("idcolorpiel <> ?", $idcolorpiel);
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

    public function findByIdOrDenomadd($denom, $idcolorpiel = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorpiel')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorpiel)) {
                $query->andWhere("idcolorpiel <> ?", $idcolorpiel);
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
