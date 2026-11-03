<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class DatComiteTransicion extends BaseDatComiteTransicion
{
    private $_query;
    private $_result;

    public function setUp()
    {
        $this->hasOne('NomTransicion', array('local' => 'idtransicion', 'foreign' => 'idtransicion'));
        parent::setUp();
    }

    public function loadByCondition($condition)
    {
        try {
            $this->_query = Doctrine_Query::create();
            $filter = $this->getFilter($condition);
            $this->_query->select('dct.*')
                ->from('DatComiteTransicion dct')
                ->where(implode(' AND ', $filter));
            $this->getDqlRelations();
            $this->_result = $this->_query->execute();
            $this->changeResponse();
            return $this->_result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getDqlRelations()
    {
        $this->_query->addSelect('nt.idtransicion')->innerJoin('dct.NomTransicion nt');
        $this->_query->addSelect('ne.idestado as idestadoinicial,ne.nombre as nombreestadoinicial')->innerJoin(
            'nt.NomEstado ne on ne.idestado = nt.idestadoinicial'
        );
        $this->_query->addSelect('ne1.idestado as idestadofinal,ne1.nombre as nombreestadofinal')->innerJoin(
            'nt.NomEstado ne1 on ne1.idestado=nt.idestadofinal'
        );
        $this->_query->addSelect(
            'npr.idproceso as idproceso,npr.denominacion as nombreproceso,npr.identificador as aliasproceso'
        )->leftJoin('nt.NomProceso npr');
        $this->_query->addSelect('drt.idrol')->leftJoin('nt.DatRolTransicion drt');
        $this->_query->addSelect('sr.idrol,sr.denominacion,sr.abreviatura')->leftJoin('drt.SegRol sr');
    }

    public function deleteByCondition($condition)
    {
        try {
            $query = Doctrine_Query::create();
            $filter = $this->getFilter($condition);
            $rowsafected = $query->delete('DatComiteTransicion')
                ->where(implode(' AND ', $filter))
                ->execute();
            return $rowsafected > 0;
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'success' => false);
        }
    }

    public function getFilter($condition)
    {
        $filter = array();
        foreach ($condition as $key => $value) {
            $filter[] = $key . " = " . $value;
        }
        return $filter;
    }

    public function changeResponse()
    {
        $result = $this->_result->toArray();
        foreach ($result as $k => $v) {
            $roles = $v['NomTransicion']['DatRolTransicion'];
            $result[$k]['roles']=[];
            foreach ($roles as $j => $w) {
                unset($w['SegRol']['descripcion']);
                unset($w['SegRol']['grupo']);
                if($w['SegRol'])
                    $result[$k]['roles'][] = $w['SegRol'];
            }
            unset($result[$k]['NomTransicion']);
        }
        $this->_result = $result;
    }

}
