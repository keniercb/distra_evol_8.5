<?php

class DatElementosDocumentoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function EliminarDocumentoByIdElemento($arrayidelementos)
    {
        foreach (
            $arrayidelementos as /*$key =>*/
            $value
        ) {
            $eliminar = Doctrine::getTable('DatElementosDocumento')->findByDql(
                "idelemento = $value"
            );
            if ($eliminar[0]->iddocumento != null) {
                $eliminar[0]->delete();
            }
        }

    }

}
