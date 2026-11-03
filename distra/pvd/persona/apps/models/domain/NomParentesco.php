<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 3/06/16
 * Time: 14:13
 */
class NomParentesco extends BaseNomParentesco
{
    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatFamiliar', array('local' => 'idparentesco', 'foreign' => 'idparentesco'));
    }

    /**
     * Devuelve el parentesco dado un identificador
     * @param $idparentesco Identificador del parentesco
     * @return mixed
     */
    public function getById($idparentesco)
    {
        return Doctrine::getTable('NomParentesco')->find($idparentesco);
    }

    /**
     * Devuelve los parentescos activos.
     * @param $filtro Filtro para la busqueda de parentescos
     * @param $limit Limite de elementos a devolver en la consulta
     * @param $start Elemento a partir del cual se iniciara.
     * @return mixed
     */
    public static function getParentescoActivo($filtro = null, $limit = null, $start = 0)
    {
        $query = Doctrine_Query::create()
            ->select('*,idparentesco as idnomenclador')
            ->from('NomParentesco')
            ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
            ->orderBy('denominacion');
        if ($limit) {
            $query->limit($limit)->offset($start);
        }
        if ($filtro != null) {
            $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
        }
        $query->orderBy('denominacion', 'ASC');
        return $query->execute()->toArray();
    }

    /**
     * Devuelve la cantidad total de parentescos a retornar
     * @param $filtro Filtro para la busqueda
     * @return mixed
     */
    public function getCantParentescoActivo($filtro = null)
    {
        $query = Doctrine_Query::create()
            ->from('NomParentesco')
            ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
        if ($filtro != null) {
            $query->andWhere("denominacion ilike '%$filtro%'");
        }
        return $query->count();
    }

    /**
     * Modifica un parentesco
     * @param $idparentesco Identificador del parentesco
     * @param $denominacion Denominacion del parentesco
     * @param $descripcion Descripcion del parentesco
     * @param $fdesde Fecha en que inicia la vigencia del parentesco
     * @param $fhasta Fecha en que concluye la vigencia del parentesco.
     * @return bool
     */
    public function modParentesco($idparentesco, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()
            ->update('NomParentesco')->where('idparentesco = ? ', $idparentesco);
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

    /**
     * Busca los parentescos por identificador o denominacion
     * @param $denom Denominacion del parentesco
     * @param $idparentesco Identificador del parentesco
     * @return bool
     */
    public function findByIdOrDenom($denom, $idparentesco = null)
    {
        $query = Doctrine_Query::create();
        $query->from('NomParentesco')
            ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
            ->andWhere("denominacion ilike '$denom'");
        if (!empty($idparentesco)) {
            $query->andWhere("idparentesco <> ?", $idparentesco);
        }
        $result = $query->count();
        if ($result > 0) {
            return true;
        } else {
            return false;
        }
    }
}