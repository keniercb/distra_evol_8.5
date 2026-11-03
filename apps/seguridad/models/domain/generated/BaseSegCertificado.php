<?php

/*
 * Clase base del dominio de certificado.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */

abstract class BaseSegCertificado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_certificado');
        $this->hasColumn(
            'idcertificado',
            'numeric',
            null, 
            array(
                'notnull' => true, 
                'primary' => true,
                'sequence' => 'mod_seguridad.sec_certificado'
            )
        );
        $this->hasColumn(
            'idusuario', 
            'numeric',
            null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'mac', 
            'character varying',
            255, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor',
            'text', 
            null,
            array('notnull' => true, 'primary' => false)
        );
    }
}