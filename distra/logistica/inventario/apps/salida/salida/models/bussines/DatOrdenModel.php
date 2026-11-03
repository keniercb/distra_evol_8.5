<?php

class DatOrdenModel extends SalidaModel
{
    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatOrden',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idorden')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relations[] = array(
            'cardinalidad' => 'many',
            'relation' => 'DatOrden',
            'properties' => array('local' => 'idorden', 'foreign' => 'idorden')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProdorden(), $relations);
    }

    /**
     * Metodo para devolver los documentos de salida
     * @param array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @return array
     */
    public function devolverDocumentos($datosDoc = array())
    {
        $query = parent::devolverDocumentos($datosDoc);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

}
