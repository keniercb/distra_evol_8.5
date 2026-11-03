<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosDatElementosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatElementosDatElementos $datElementosDatElementos)
    {
        $datElementosDatElementos->save();
    }

    public function Actualizar(
        DatElementosDatElementos $datElementosDatElementos
    ) {
        $datElementosDatElementos->save();
    }

    public function Eliminar($datElementosDatElementos)
    {
        $datElementosDatElementos->delete();
    }

}

