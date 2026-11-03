<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatReportenaturaleza extends BaseDatReportenaturaleza
{

    public function Setup()
    {
        $this->hasOne(
            'ConfReporteventa',
            array(
                'local'   => 'idreporteventa',
                'foreign' => 'idreporteventa'
            )
        );
        parent::Setup();
    }

}
