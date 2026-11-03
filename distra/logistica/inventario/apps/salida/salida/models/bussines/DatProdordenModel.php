<?php

class DatProdordenModel extends BaseModel
{
    /**
     * Constructor de la clase.
     */
    public function __construct()
    {
        parent::__construct();
        $this->tryInyector();
    }

    /**
     * Modifica el registro de la cantidad a distribuir asociada a un producto de un documento.
     * @param array $valores
     * @return boolean
     */
    public function modificarCantidadADistribuir($valores)
    {
       $record = new DatProdorden();
       if ($valores['idprodorden']) {
           $record->assignIdentifier($valores['idprodorden']);
           $recordcmpto = Doctrine::getTable('DatProdordencmpto')->find($valores['idprodorden']);
           $recordcmpto->pendiente = $recordcmpto->pendiente - $valores['cancelar'];
           $recordcmpto->cantidadoriginal = $recordcmpto->cantidadoriginal - $valores['cancelar'];
       }
       $valores['cantidad'] = $valores['cantidad'] - $valores['cancelar'];
       $valores['cancelar'] = 0;
       $record->synchronizeWithArray($valores);
       $record->save();
       if ($recordcmpto) {
           $recordcmpto->save();
       }
       return true;
    }

    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProdorden',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idorden')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatDocumento(), $relations);
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProdorden',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
    }
}
