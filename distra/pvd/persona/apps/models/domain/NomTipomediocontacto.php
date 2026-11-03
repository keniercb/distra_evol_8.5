<?php

/**
 * @name NomTipodocidentidad - Clase base para acceso a datos del nomenclador de tipos de documentos de identidad.
 * @package   persona.nomencladores
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   2.1
 */
class NomTipomediocontacto extends BaseNomTipomediocontacto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatContacto', array('local' => 'idtipomediocontacto', 'foreign' => 'idtipomediocontacto'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipomediocontacto
     *
     * @return Doctrine_Record
     */
    public function getById($idtipomediocontacto)
    {
        return Doctrine::getTable('NomTipomediocontacto')->find($idtipomediocontacto);
    }

    /**
     * Funcion para obtener los tipo medio contacto
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveTypeContactMedium($filtro = null, $limit = null, $start = 0)
    {
        $query = Doctrine_Query::create()->select('*,idtipomediocontacto as idnomenclador')
            ->from('NomTipomediocontacto')
            ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
    }

    /**
     * Funcion para obtener la cantidad tipo medio contacto activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveTypeContactMedium($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipomediocontacto')->where(
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
     * Funcion para modifcar el tipo tipo medio contacto
     *
     * @param type $idtipomediocontacto
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modTypeContactMedium(
        $idtipomediocontacto, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $type, $maxcaracter, $mincaracter
    )
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipomediocontacto')//->Where('denominacion= ? ', $denominacion)
            ->andWhere('idtipomediocontacto= ? ', $idtipomediocontacto);
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
            if ($type != '') {
                $query->set('type', '?', $type);
            } else {
                $query->set('type', 'null');
            }
            if (maxcaracter != '') {
                $query->set('maxcaracter', '?', $maxcaracter);
            } else {
                $query->set('maxcaracter', 'null');
            }
            if (mincaracter != '') {
                $query->set('mincaracter', '?', $mincaracter);
            } else {
                $query->set('mincaracter', 'null');
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
     * @param $idtipomediocontacto
     */
    public function findByIdOrDenom($denom, $idtipomediocontacto)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipomediocontacto')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipomediocontacto)) {
                $query->andWhere("idtipomediocontacto <> ?", $idtipomediocontacto);
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

    public function findByIdOrDenomadd($denom, $idtipomediocontacto = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipomediocontacto')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipomediocontacto)) {
                $query->andWhere("idtipomediocontacto <> ?", $idtipomediocontacto);
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

