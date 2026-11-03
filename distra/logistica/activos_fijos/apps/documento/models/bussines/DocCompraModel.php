<?php

/**
 *
 */
class DocCompraModel extends DocumentoActivoModel
{

    private $_domain;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
        $this->_domain = new DatDocumentoCliente();
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
        $cDatDocumentoCliente = 'DatDocumentoCliente';
        $doc = parent::addActivoDoc($parametros);

        if (count($doc->$cDatDocumentoCliente)) {
            $doc->$cDatDocumentoCliente[0]->synchronizeWithArray($parametros);
        } else {
            $docCliente = new DatDocumentoCliente();
            $docCliente->synchronizeWithArray($parametros);

            $doc->$cDatDocumentoCliente->add($docCliente);
        }

        return $doc;
    }

}
