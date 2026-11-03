<?php

class NomProcedenciasocial extends BaseNomProcedenciasocial
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatPersonaentidad', array('local' => 'idprocedenciasocial', 'foreign' => 'idprocedenciasocial')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomProcedenciasocial')->find($fhasta);
    }

    /**
     * Funcion para obtener lasprocedencia activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveSocialOrigin($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idprocedenciasocial,idprocedenciasocial as idnomenclador, ' . 'denominacion, fdesde, fhasta, descripcion'
            )->from('NomProcedenciasocial')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
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
     * Funcion para obtener la cantidad de SocialOrigina activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveSocialOrigin($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomProcedenciasocial')->where(
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
     * Funcion para modifcar el tipo de procedencia social
     *
     * @param type $idprocedenciasocial
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modSocialOrigin($idprocedenciasocial, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomProcedenciasocial')->where(
                'idprocedenciasocial= ? ', $idprocedenciasocial
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
     * Funcion para verificar si existe la procedencia
     *
     * @param $denom
     * @param $idprocedenciasocial
     */
    public function findByIdOrDenom($denom, $idprocedenciasocial)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomProcedenciasocial')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idprocedenciasocial)) {
                $query->andWhere("idprocedenciasocial <> ?", $idprocedenciasocial);
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

    public function findByIdOrDenomadd($denom, $idprocedenciasocial = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomProcedenciasocial')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idprocedenciasocial)) {
                $query->andWhere("idprocedenciasocial <> ?", $idprocedenciasocial);
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

