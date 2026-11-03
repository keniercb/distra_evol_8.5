<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDocfactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_docfactura');
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddeposito', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcliente', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'alquiler', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrofactura', 'character varying', 11, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrocontrol', 'character varying', 11, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicionpago', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproveedor', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'oferta', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'esnota', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idsubsistema', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'manual', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnumerocontrol', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idseriedocentidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importetotal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tiporgtransp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tasacambio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'factorconvercion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'reserva', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dias', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechavencimiento', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importecontable', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importealt', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcontacto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idvendedor', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false)
        );  
        $this->hasColumn(
            'iddoc', 'numeric', null, array('notnull' => false, 'primary' => false)
        );      
		$this->hasColumn(
            'nrorden', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'pagoexterior', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciocero', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idfacturadigital', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estadocliente', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'numerofacturadigital', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idfilexml', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nroreal', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tipopedido', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomformapago', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idclienteauxiliar', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipotasa', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmonedaprod', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmonedaserv', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nombrecontacto', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cicontacto', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'telfcontacto', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tipoconceptoventa', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'valorconcepto', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'calculoconcepto', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'conceptoventa', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
