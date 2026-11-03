<?php

/**
 *
 */
class DatDocumentoActivo extends BaseDatDocumentoActivo
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();

        $this->hasOne('DatDocumento', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocumento'));
        $this->hasOne(
            'DatDocTransferenciaEntidades', array('local' => 'iddocumentoactivo', 'foreign' => 'iddoctranfentidades')
        );
        $this->hasOne(
            'DatDocTransferenciaEntidadesEntrada', array('local' => 'iddocumentoactivo', 'foreign' => 'iddoctranfentidadesentrada')
        );
        $this->hasOne(
            'DatDocEnviadoReparar', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocenviadoreparar')
        );
        $this->hasOne('DatDocumentoOrigen', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocorigen'));
        $this->hasOne('DatDocBajaDesarme', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocbajadesarme'));
        $this->hasOne('DatDocBajaVenta', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocbajaventa'));
        $this->hasOne('DatDocAlquiler', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocalquiler'));
        $this->hasOne('DatDocUsufructo', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocusufructo'));
        $this->hasOne('DatDocArrendamiento', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocarrendamiento'));
        $this->hasOne('DatDocAltaCompra', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocaltacompra'));
        $this->hasOne('DatDocPrestamo', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocprestamo'));

        $this->hasOne(
            'DatDocInventarioParcial', array('local' => 'iddocumentoactivo', 'foreign' => 'iddocinventarioparcial')
        );
        $this->hasOne(
            'DatResponsable', array('local' => 'idresponsabledestino', 'foreign' => 'idresponsable')
        );

        $array[] = array('cardinalidad' => 'one',
            'relation' => 'DatDocumentoActivo',
            'properties' => array('local' => 'iddocumento',
                'foreign' => 'iddocumentoactivo'));
        $obj = new DatDocumento();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($obj, $array);
    }

}
