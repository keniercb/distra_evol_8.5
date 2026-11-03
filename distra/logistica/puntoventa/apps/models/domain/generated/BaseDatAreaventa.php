<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatAreaventa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_areaventa');
        $sequence = 'mod_logpuntoventa.sec_datareaventa';
        $this->hasColumn(
            'idareaventa', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idestructuraop', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'activo', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'diashabiles', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idcliente', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtipoprecio', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idmodopago', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idnomoperaciones', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idinfoconexion', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idinfoconexioncr', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'nombre', 'character varying', 100,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'telefono', 'character varying', 100,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'correo', 'character varying', 100,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'direccion', 'character varying', 255,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'noobligatorio', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'opcionimprimir', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'nocierrediario', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'nodatosposventa', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'usuarioez', 'character varying', 20,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtipoprecioagencia', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'comisionbanco', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'tipoventa', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idcondicionpago', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacionpago', 'character varying', 255,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idnomoperaciondev', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
