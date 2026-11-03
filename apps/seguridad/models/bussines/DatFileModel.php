<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatFileModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public static function actualizarBD()
    {
        exec('sudo aide -c /etc/aide/aide.conf --update', $output, $return);
        if (1 === $return)
            throw new ZendExt_Exception('SEGINTEGRIDAD05');
        exec('sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db',$output ,$return);
        if (0 !== $return)
            throw new ZendExt_Exception('SEGINTEGRIDAD06');
        return true;
    }

}