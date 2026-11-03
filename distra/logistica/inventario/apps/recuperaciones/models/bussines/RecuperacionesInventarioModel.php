<?php

/**
 *  Esta clase gestiona el acceso a datos de los productos mínimos y máximos
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class RecuperacionesInventarioModel extends BaseModel
{
    private $serviciosSeguridad;
    private $serviciosDepositos;

    public function __construct()
    {
        parent::__construct();
        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
        $this->serviciosSeguridad = ServiciosSeguridadHelper::__init();
    }
    public function loadDepositos()
    {
        $depositosEntidad = $this->serviciosDepositos->cargardepositos(null, null, null, null, 0, -1);
        $arrayDepositosUsuario = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
        $depositosUsuario = $this->estructuraHelper->obtenerEstructurasNoFormales(
            null, null, null, null, null, $arrayDepositosUsuario
        );
        $datos = array();
        foreach ($depositosUsuario as $index => $r) {
            $datos[$index]['iddeposito'] = $r['idfila'];
            $datos[$index]['id'] = $r['idfila'];
            $datos[$index]['deposito'] = $r['DatEstructuraop'][0]['codigo'] .' '. $r['text'];
            $datos[$index]['text'] = $r['DatEstructuraop'][0]['codigo'] .' '. $r['text'];
            $datos[$index]['leaf'] = true;
        }
        $datos = array_merge($datos,$depositosEntidad['depositos']);
        return array('datos' => $datos);
    }

}
