<?php

class DatFacturacontrato extends BaseDatFacturacontrato
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
    }

    public function getJoinFacturaContrato(Doctrine_Query $query, $alias = 'df', $aliasf = 'fc')
    {
        $query->leftJoin("{$alias}.DatFacturacontrato {$aliasf}");
        
        $query->addSelect(
            "{$aliasf}.fecha as fecha,
            {$aliasf}.numero as numero"
        );//{$aliasf}.idcontrato as idcontrato,
        if(class_exists('DatContrato')){             
            $query->leftJoin("{$aliasf}.DatContrato dco");        
            $query->addSelect(
                "dco.idcontrato as idcontrato,
                dco.fechafirma as fechafirma,
                dco.numerocontrato as numerocontrato"
            );
        }
        return $query;
    }
}
