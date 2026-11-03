<?php

class NomEstratificacionsocial extends BaseNomEstratificacionsocial
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatCaracteristicasocial', array(
                'local' => 'idestratificacionsocial', 'foreign' => 'idestratificacionsocial')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $descripcion
     *
     * @return Doctrine_Record
     */
    public function getById($descripcion)
    {
        return Doctrine::getTable('NomExtraccionsocial')->find($descripcion);
    }

    /**
     * Funcion para obtener los estratificacion social
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getSocialStratificationActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idestratificacionsocial,idestratificacionsocial as idnomenclador, '
                . 'denominacion, fdesde, fhasta, descripcion, abreviatura'
            )->from('NomEstratificacionsocial')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad de estratificacion social
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantSocialStratificationActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomEstratificacionsocial')->where(
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
     * Funcion para maodificar Social stratification
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSocialStratification($idestratificacionsocial, $denominacion, $abreviatura, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomEstratificacionsocial')->where(
                'idestratificacionsocial= ? ', $idestratificacionsocial
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
     * Funcion para verificar si existe Social stratification
     *
     * @param $denom
     * @param $idestratificacionsocial
     */
    public function findByIdOrDenom($denom, $idestratificacionsocial)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstratificacionsocial')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idestratificacionsocial)) {
                $query->andWhere("idestratificacionsocial <> ?", $idestratificacionsocial);
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

    public function findByIdOrDenomadd($denom, $idestratificacionsocial = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstratificacionsocial')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idestratificacionsocial <> ?", $idestratificacionsocial);
//            }
            $idestratificacionsocial = null;
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

