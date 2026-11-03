<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomTipoelementoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTipoelemento $nomTipoelemento)
    {
        $nomTipoelemento->save();
    }

    public function Actualizar(NomTipoelemento $nomTipoelemento)
    {
        $nomTipoelemento->save();
    }

    public function Eliminar($nomTipoelemento)
    {
        $nomTipoelemento->delete();
    }
}

