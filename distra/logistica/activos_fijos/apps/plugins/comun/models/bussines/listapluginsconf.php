<?php

/**
 * @author gerardo
 */
$obj = new ConfparametrosgeneralesModel();
$datos = $obj->getConfiguracionPG(null, 0);
return array(
    'plugins' => array(
        array(
            'clase' => 'PluginConfiguracionTipomediotransporteModel',
            'direccion' => '/logistica/activos_fijos/plugins/transporte',
            'activo' => ($datos[0]['transporte']) ? true: false
        ),
        array(
            'clase' => 'PluginConfiguracionTipomediobuqueModel',
            'direccion' => '/logistica/activos_fijos/plugins/buque',
            'activo' => ($datos[0]['buque']) ? true: false
        )
    )
);

