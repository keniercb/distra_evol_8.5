<?php

class NomTipocuentabancaria extends BaseNomTipocuentabancaria
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
     * @params $idtipocuentabancaria
     *
     * @return Doctrine_Record
     */
    public function getById($idtipocuentabancaria)
    {
        return Doctrine::getTable('NomTipocuentabancaria')->find($idtipocuentabancaria);
    }

    /**
     * Funcion para obtener los tipo de cuenta bancaria
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveTypeAcountBank($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipocuentabancaria,idtipocuentabancaria as idnomenclador,'
                . ' denominacion, fdesde, fhasta, descripcion, abreviatura'
            )->from('NomTipocuentabancaria')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad tipo de cuenta bancaria activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveTypeAcountBank($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipocuentabancaria')->where(
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
     * Funcion para modifcar el tipo  contacto
     *
     * @param type $idtipocuentabancaria
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modTypeAcountBank($idtipocuentabancaria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipocuentabancaria')->where(
                'idtipocuentabancaria= ? ', $idtipocuentabancaria
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
     * Funcion para verificar
     *
     * @param $denom
     * @param $idtipocuentabancaria
     */
    public function findByIdOrDenom($denom, $idtipocuentabancaria)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocuentabancaria')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idtipocuentabancaria)) {
                $query->andWhere("idtipocuentabancaria <> ?", $idtipocuentabancaria);
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

    public function findByIdOrDenomadd($denom, $idtipocuentabancaria = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocuentabancaria')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idtipocuentabancaria)) {
                $query->andWhere("idtipocuentabancaria <> ?", $idtipocuentabancaria);
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

