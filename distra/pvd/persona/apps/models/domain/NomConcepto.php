<?php

/**
 * Class NomConcepto
 */
class NomConcepto extends BaseNomConcepto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomConcepto', array('local' => 'idpadre', 'foreign' => 'idconcepto'));
        $this->hasMany('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idpadre'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $cmpempleado
     *
     * @return Doctrine_Record
     */
    public function getById($cmpempleado)
    {
        return Doctrine::getTable('NomConcepto')->find($cmpempleado);
    }

    /**
     * @param     $filtro
     * @param     $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getConceptosDenominacin($filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select('idconcepto,denominacion, descripcion, lft, rgt')->from('NomConcepto')
                ->where('idconcepto <> ? AND idpadre = ?', array(1, 1));
            if (isset($limit) && !empty($limit)) {
                $query->limit($limit)->offset($start);
            }
            else {
                $query->limit(15)->offset(0);
            }
            if (isset($filtro) && !empty($filtro)) {
                $query->andWhere("denominacion ilike '%?%' OR descripcion ilike '%?%'", $filtro);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantConceptosDenominacion($filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('NomConcepto')->where('idconcepto <> ? AND idpadre = ?', array(1, 1));
            if (isset($filtro) && !empty($filtro)) {
                $query->andWhere("denominacion ilike '%?%' OR descripcion ilike '%?%'", $filtro);
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function validateByDenominacion($denom)
    {
        try {
            $query = Doctrine_Query::create()->from('NomConcepto')->where('idconcepto <> ? AND idpadre = ?', array(1, 1))
                ->andWhere("denominacion ilike '$denom'");
            $count = $query->count();

            return $count > 0 ? true : false;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getConceptos(array $lftAndrgt)
    {
        try {
            $query = Doctrine_Query::create()->from('NomConcepto ncp')->innerJoin('ncp.NomConcepto ncp1')->orderBy('lft');
            foreach ($lftAndrgt as $v) {
                $query->orWhere('lft >= ? and rgt <= ?', array($v->lft, $v->rgt));
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}