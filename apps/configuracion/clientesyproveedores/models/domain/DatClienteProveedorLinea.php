<?php

class DatClienteProveedorLinea extends BaseDatClienteProveedorLinea
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomClienteproveedor', array('local'   => 'idclienteproveedor',
                                         'foreign' => 'idclienteproveedores')
        );

        parent::setUp();
    }


    static function deleteFromArray($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatClienteProveedorLinea')
            ->whereIn('idclienteproveedorlinea',$array)
            ->execute();
    }
}