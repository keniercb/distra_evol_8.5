<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:47
 */
class NomMedio extends BaseNomMedio
{

    /**
     * Constructor
     */

    public function setUp()
    {
        parent :: setUp();
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $idmedio
     * @return Doctrine_Record
     */
    public function getById($idmedio)
    {
        return Doctrine::getTable('NomMedio')->find($idmedio);
    }

    /**
     * Funcion para obtener los tipos de medios activos
     * @param null $filtro
     * @param null $limit
     * @param int $start
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getMedioActive($filtro = null, $limit = null, $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('idmediopersona as idmedio,idmediopersona as idnomenclador,denominacion,fdesde,
                fhasta,descripcion,abreviatura')
                ->from('NomMedio')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if($value){
                $query->limit(500)->offset($start);
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
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de tipos de medios activos
     * @param null $filtro
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantMedioActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('NomMedio')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para modifcar el tipo de medios
     * @param type $idmedio
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     * @return boolean
     */
    public function modMedio($idmedio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomMedio')
                ->where('idmediopersona= ? ', $idmedio);
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
            }else{
                $query->set('descripcion', 'null');
            }
            if ($fdesde != '') {
                $query->set('fdesde', '?', $fdesde);
            }
            if ($fhasta != '') {
                $query->set('fhasta', '?', $fhasta);
            }else{
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
     * Funcion para verificar si existe el tipo de medios
     * @param $denom
     * @param $idtipoingreso
     */
    public function findByIdOrDenom($denom, $idmedio = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMedio')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idmedio)) {
                $query->andWhere("idmediopersona <> ?", $idmedio);
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

    public function getDenomById($idmedio)
    {
        try {
            $query = Doctrine_Query::create();
            $query->select('denominacion')
                ->from('NomMedio')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("idmediopersona =?", $idmedio);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}