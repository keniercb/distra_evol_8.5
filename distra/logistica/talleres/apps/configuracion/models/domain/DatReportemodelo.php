<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatReportemodelo extends BaseDatReportemodelo
{

    public function Setup()
    {
        $this->hasOne(
            'ConfReporteparalizacion',
            array(
                'local'   => 'idreporteparalizacion',
                'foreign' => 'idreporteparalizacion'
            )
        );
        parent::Setup();
    }

}
