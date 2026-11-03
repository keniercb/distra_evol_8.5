<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class ConfReporteventa extends BaseConfReporteventa
{

    public function Setup()
    {
        $this->hasOne(
            'ConfConfiguracionfactura',
            array(
                'local'   => 'idestructuracomun',
                'foreign' => 'idestructuracomun'
            )
        );
        parent::Setup();
    }

}
