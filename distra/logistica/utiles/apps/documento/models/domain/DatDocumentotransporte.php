<?php

class DatDocumentotransporte extends BaseDatDocumentotransporte
{

    public function setUp()
    {
        parent::setUp();
    }

    public function addDqlTransportador(Doctrine_Query $dql, $aliasExterno = 'd', $aliasLocal = 'dt')
    {
        $dql->leftJoin("{$aliasExterno}.DatDocumentotransporte {$aliasLocal}")
            ->addSelect(
                "{$aliasLocal}.iddocumentotransporte as iddocumentotransporte, "
                . "{$aliasLocal}.idorganizacion as idorganizacion, "
                . "{$aliasLocal}.nombreconductor as nombreconductor, "
                . "{$aliasLocal}.ciconductor as ciconductor, {$aliasLocal}.matricula as matricula, "
                . "{$aliasLocal}.cartaporte as cartaporte, {$aliasLocal}.casilla as casilla, "
                . "{$aliasLocal}.embarque as embarque,"
                . "{$aliasLocal}.manifiesto as manifiesto, {$aliasLocal}.partida as partida"
            );
    }

}
