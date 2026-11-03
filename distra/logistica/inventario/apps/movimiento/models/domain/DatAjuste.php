<?php

class DatAjuste extends BaseDatAjuste
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('foreign' => 'iddocumento', 'local' => 'idajuste'));
        parent::setUp();
    }

    /**
     * 
     * @param Doctrine_Query $query
     * @param array $filtro
     * @param string $aliasExterno
     * @param string $aliasLocal
     */
    public function getJoinDatAjuste(Doctrine_Query $query, $filtro, $aliasExterno, $aliasLocal = 'a')
    {
        if ($filtro['tipoajuste']) {
            $query->addWhere('a.idoperacion = ?', $filtro['tipoajuste']);
        }
        $query->addSelect(
                "{$aliasLocal}.idoperacion AS tipoajuste, {$aliasLocal}.idajuste AS idajuste, "
                . "{$aliasLocal}.contabilizadopor AS contabilizadopor, {$aliasLocal}.idinventario AS idinventario, "
                . "inv.nrodoc AS docinventario"
            )
            ->innerJoin("{$aliasExterno}.DatAjuste {$aliasLocal}")
            ->leftJoin("{$aliasLocal}.DatDocumento inv ON (inv.iddocumento = {$aliasLocal}.idinventario)");
    }

    public function getDatosOperacion($iddocumento)
    {
        $ajuste = Doctrine::getTable('DatAjuste')->find($iddocumento);
        if ($ajuste) {
            return $ajuste->toArray();
        }
        return null;
    }

}
