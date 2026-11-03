<?php

/**
 * Clase del dominio del nomenclador de color de pelo
 * Class NomColorpelo
 */
class NomColorpelo extends BaseNomColorpelo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatFenotipo', array('local' => 'idcolorpelo', 'foreign' => 'idcolorpelo'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcolorpelo
     *
     * @return Doctrine_Record
     */
    public function getById($idcolorpelo)
    {
        return Doctrine::getTable('NomColorpelo')->find($idcolorpelo);
    }

    /**
     * Funcion para obtener los colores de pelo activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getColorActiveHair($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idcolorpelo,idcolorpelo as idnomenclador,denominacion,fdesde,fhasta,abreviatura,
                descripcion, gestion'
            )->from('NomColorpelo')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad de colores de pelo activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantColorActiveHair($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomColorpelo')->where(
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
    public function modHaircolor($idcolorpelo, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomColorpelo')->where('idcolorpelo= ? ', $idcolorpelo);
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
     * @param $idcolorpelo
     */
    public function findByIdOrDenom($denom, $idcolorpelo)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorpelo')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorpelo)) {
                $query->andWhere("idcolorpelo <> ?", $idcolorpelo);
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

    public function findByIdOrDenomadd($denom, $idcolorpelo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorpelo')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idcolorojos)) {
                $query->andWhere("idcolorpelo <> ?", $idcolorpelo);
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
