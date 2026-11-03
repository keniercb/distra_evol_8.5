<?php
class DatOrden extends BaseDatOrden
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'idorden', 'foreign' => 'iddocumento'));
        $this->hasMany('DatProdorden', array('local' => 'idorden', 'foreign' => 'idorden'));
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param type $aliasExterno
     * @param type $aliasLocal
     * @return Doctrine_Query
     */
    public function getJoinDatOrden(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'do')
    {
        return $query->innerJoin("{$aliasExterno}.DatOrden {$aliasLocal}");
    }

    /**
     * @param Doctrine_Query $query
     * @param type $alias
     * @return Doctrine_Query
     */
    public function getSelectSinAlias(Doctrine_Query $query, $alias = 'do')
    {
        return $query->addSelect(
            "{$alias}.idorden as idorden, {$alias}.idconcepto as idconcepto, "
        	."{$alias}.fechav as fechav, {$alias}.planextraplan as planextraplan, "
        	."{$alias}.estadosum as estadosum, {$alias}.idoferta as idoferta, "
        	."{$alias}.idusuariojesp as idusuariojesp, "
            ."(SELECT COUNT(dpo.idprodorden) FROM DatProdorden dpo) as cantproductos"
        );
    }
}
