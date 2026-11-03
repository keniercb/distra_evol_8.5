<?php

class DatDocFacturaTransportacion extends BaseDatDocFacturaTransportacion
{

    /**
     * @author  Jose Joel Perez Quevedo
     * @created 06/03/2014
     * @class   DatDocFacturaTransportacion
     * * */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
    }

    public function getJoinFacturaTransportacion(Doctrine_Query $query, $alias = 'df', $aliasf = 'ft')
    {
        $query->leftJoin("{$alias}.DatDocFacturaTransportacion {$aliasf}");
        $query->addSelect(
            "{$aliasf}.identidadchofer as identidadchofer,{$aliasf}.nombrechofer as nombrechofer,
            {$aliasf}.matriculavehiculo as matriculavehiculo, {$aliasf}.viatransporte as viatransporte,
            {$aliasf}.bultos as bultos, {$aliasf}.sellos as sellos,
            {$aliasf}.contenedor as contenedor, {$aliasf}.licencia as licencia,
            {$aliasf}.cartaporte as cartaporte,{$aliasf}.bl as bl, {$aliasf}.puertodestino as puertodestino,
            {$aliasf}.destinocomercial as destinocomercial, {$aliasf}.prodgenerico as prodgenerico"
        );
        return $query;
    }
}
