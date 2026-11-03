<?php

/**
 * @name NomTipodocidentidad - Clase base para acceso a datos del nomenclador de tipos de documentos de identidad.
 * @package   persona.nomencladores
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   2.1
 */
class NomTipodocidentidad extends BaseNomTipodocidentidad
{
    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatDocidentidad', array('local' => 'idtipodocidentidad', 'foreign' => 'idtipodocidentidad'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipodocidentidad
     *
     * @return Doctrine_Record
     */
    public function getById($idtipodocidentidad)
    {
        return Doctrine::getTable('NomTipodocidentidad')->find($idtipodocidentidad);
    }

    /**
     * Funcion para obtener los tipos de documentos de identidad activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getTipoDocIdentidadActivos($filtro = null, $limit = null, $start = 0,$value)
    {
        $query = Doctrine_Query::create()->select('*,idtipodocidentidad as idnomenclador, 
        denominacion as denomTipoDocIdentidad')
            ->from('NomTipodocidentidad')
            ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
            ->orderBy('denominacion');
        if($value){
            $query->limit(200)->offset(0);

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

        return $query->execute()->toArray();
    }

    /**
     * Funcion para obtener la cantidad tipos de documentos de identidad activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTipoDocIdentidadActivos($filtro = null)
    {
        $query = Doctrine_Query::create()->from('NomTipodocidentidad')->where(
            'fdesde <= now() and (now() <= fhasta or fhasta is null)'
        );
        if ($filtro != null) {
            $query->andWhere("denominacion ilike '%$filtro%'");
        }

        return $query->count();
    }

    /**
     * Funcion para modificar un tipo de documento de indentidad
     *
     * @param numeric $idtipodocidentidad
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modDoctypeidentity(
        $idtipodocidentidad, $denominacion, $abr, $descripcion, $fdesde, $fhasta, $type, $maxcaracter, $mincaracter
    )
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipodocidentidad')//->Where('denominacion= ? ', $denominacion)
            ->andWhere('idtipodocidentidad= ? ', $idtipodocidentidad);
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
     * Funcion para verificar si existe
     *
     * @param $denom
     * @param $idtipodocidentidad
     */
    public function findByIdOrDenom($denom, $idtipodocidentidad = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipodocidentidad')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipodocidentidad)) {
                $query->andWhere("idtipodocidentidad <> ?", $idtipodocidentidad);
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

    public function getDatosNomTipoDocById($idtipodocidentidad)
    {
        try {
            $query = Doctrine_Query::create()->select('idtipodocidentidad,denominacion, fdesde, fhasta, descripcion')->from(
                'NomTipodocidentidad'
            )->where('idtipodocidentidad = ?', $idtipodocidentidad)->addWhere(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}