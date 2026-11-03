<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 17/06/16
 * Time: 15:23
 */
class NomTipoingreso extends BaseNomTipoingreso
{
    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatIngreso', array('local' => 'idtipoingreso', 'foreign' => 'idtipoingreso'));
    }

    public function getById($idtipoingreso)
    {
        return Doctrine::getTable('NomTipoingreso')->find($idtipoingreso);
    }

    public static function getTipoIngresoActivo($filtro = null, $limit = null, $start = 0)
    {
        $query = Doctrine_Query::create()
            ->select('*,idtipoingreso as idnomenclador')
            ->from('NomTipoingreso')
            ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
            ->orderBy('denominacion');
        if ($limit) {
            $query->limit($limit)->offset($start);
        }
        else {
            $query->limit(15)->offset(0);
        }
        if ($filtro != null) {
            $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
        }
        $query->orderBy('denominacion', 'ASC');
        return $query->execute()->toArray();
    }

    public function getCantTipoIngresoActivo($filtro = null)
    {
        $query = Doctrine_Query::create()
            ->from('NomTipoingreso')
            ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
        if ($filtro != null) {
            $query->andWhere("denominacion ilike '%$filtro%'");
        }
        return $query->count();
    }

    public function modTipoIngreso($idtipoingreso, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()
            ->update('NomTipoingreso')->where('idtipoingreso = ? ', $idtipoingreso);
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
    }

    public function findByIdOrDenom($denom, $idtipoingreso = null)
    {
        $query = Doctrine_Query::create();
        $query->from('NomTipoingreso')
            ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
            ->andWhere("denominacion ilike '$denom'");
        if (!empty($idtipoingreso)) {
            $query->andWhere("idtipoingreso <> ?", $idtipoingreso);
        }
        $result = $query->count();
        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }
}