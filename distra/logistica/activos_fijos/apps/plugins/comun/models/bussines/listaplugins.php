<?php

/**
 * @author gerardo
 */
$obj = new ConfparametrosgeneralesModel();
$datos = $obj->getConfiguracionPG(null, 0);
return array(
    'plugins' => array(
        array(
            'clase' => 'PluginActivotransporteModel',
            'direccion' => '/logistica/activos_fijos/plugins/transporte',
            'activo' => ($datos[0]['transporte']) ? true: false
        ),
        array(
            'clase' => 'PluginActivobuqueModel',
            'direccion' => '/logistica/activos_fijos/plugins/buque',
            'activo' => ($datos[0]['buque']) ? true: false
        )
    )
);

