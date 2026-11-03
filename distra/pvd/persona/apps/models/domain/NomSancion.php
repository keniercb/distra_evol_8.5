<?php

class NomSancion extends BaseNomSancion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomTiposancion', array('local' => 'idtiposancion', 'foreign' => 'idtiposancion'));
        $this->hasMany('DatSancion', array('local' => 'idsancion', 'foreign' => 'idsancion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomSancion')->find($fhasta);
    }

    /**
     * Funcion para obtener los Sancion
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getSanctionActive($filtro = null, $limit = null, $start = 0, $idtiposancion,$value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idsancion,idsancion as idnomenclador, denominacion, fdesde, fhasta, descripcion, abreviatura,
                idtiposancion'
            )->from('NomSancion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
            if (!empty($idtiposancion)) {
                $query->addWhere('idtiposancion = ?', $idtiposancion);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de Sancion
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantSanctionActive($filtro = null, $idtiposancion)
    {
        try {
            $query = Doctrine_Query::create()->from('NomSancion')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if (!empty($idtiposancion)) {
                $query->addWhere('idtiposancion = ?', $idtiposancion);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para maodificar Sancion
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSanction(
        $idsancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtiposancion, $tiemporehabilitacion,
        $unidadtiempo
    )
    {
        try {
            $query = Doctrine_Query::create()->update('NomSancion')->where('idsancion= ? ', $idsancion);
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
            if ($tiemporehabilitacion != '') {
                $query->set('tiemporehabilitacion', '?', $tiemporehabilitacion);
            } else {
                $query->set('tiemporehabilitacion', 'null');
            }
            if ($unidadtiempo != '') {
                $query->set('unidadtiempo', '?', $unidadtiempo);
            } else {
                $query->set('unidadtiempo', 'null');
            }
            if ($idtiposancion != '') {
                $query->set('idtiposancion', '?', $idtiposancion);
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
     * Funcion para verificar si existe Sancion
     *
     * @param $denom
     * @param $idsancion
     */
    public function findByIdOrDenom($denom, $idsancion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomSancion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idsancion)) {
                $query->andWhere("idsancion <> ?", $idsancion);
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

    public function getSanctionByCodigo($codigo)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idsancion,idsancion as idnomenclador, denominacion, fdesde, fhasta, descripcion, idtiposancion'
            )->from('NomSancion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');

            if (!empty($codigo)) {
                $query->addWhere('codigo = ?', $codigo);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

